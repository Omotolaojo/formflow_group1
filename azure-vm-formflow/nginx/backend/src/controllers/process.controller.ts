import { Request, Response } from "express";
import axios from "axios";
import { prisma } from "../config/prisma";
import {
  uploadToBlob,
  generateSasUrl,
} from "../services/blob.service";

export const processClaim = async (
  req: Request,
  res: Response
) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        error: "No file uploaded",
      });
    }

    // 1. Upload receipt
    const blobName = await uploadToBlob(file);

    // 2. Generate SAS URL
    const blobUrl = generateSasUrl(blobName);

    // 3. Azure Document Intelligence
    const endpoint =
      process.env.AZURE_ENDPOINT!.replace(/\/$/, "");

    const key = process.env.AZURE_API_KEY!;

    const analyzeUrl =
      `${endpoint}/formrecognizer/documentModels/prebuilt-receipt:analyze?api-version=2023-07-31`;

    const start = await axios.post(
      analyzeUrl,
      {
        urlSource: blobUrl,
      },
      {
        headers: {
          "Ocp-Apim-Subscription-Key": key,
          "Content-Type": "application/json",
        },
      }
    );

    const operationLocation =
      start.headers["operation-location"];

    let result;

    while (true) {
      const response = await axios.get(
        operationLocation,
        {
          headers: {
            "Ocp-Apim-Subscription-Key": key,
          },
        }
      );

      if (response.data.status === "succeeded") {
        result = response.data;
        break;
      }

      if (response.data.status === "failed") {
        throw new Error(
          "Azure document analysis failed"
        );
      }

      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );
    }

    // 4. Extract data
    const doc =
      result.analyzeResult?.documents?.[0]?.fields;

    const merchant =
      doc?.MerchantName?.valueString ||
      "Unknown";

    const total =
      doc?.Total?.valueNumber ||
      doc?.Total?.valueCurrency?.amount ||
      0;

    const date =
      doc?.TransactionDate?.valueDate ||
      new Date();

    // 5. Save claim
    const claim = await prisma.claim.create({
      data: {
        vendor: merchant,
        amount: total,
        date: new Date(date),
        status: "pending",
        extracted: {
          merchant,
          total,
          date,
        },
        receiptUrl: blobUrl,
      },
    });

    return res.status(200).json({
      claim,
      extracted: {
        merchant,
        total,
        date,
      },
    });
  } catch (error) {
    console.error(
      "PROCESS ERROR:",
      error
    );

    return res.status(500).json({
      error: "Failed to process claim",
    });
  }
};