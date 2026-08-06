import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getPendingClaims(
  _req: Request,
  res: Response
) {
  try {
    const claims = await prisma.claim.findMany({
      where: {
        status: "pending",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(claims);
  } catch (error) {
    console.error("Failed to fetch pending claims:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch pending claims",
    });
  }
}

export async function getAllClaims(
  _req: Request,
  res: Response
) {
  try {
    const claims = await prisma.claim.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(claims);
  } catch (error) {
    console.error("Failed to fetch claims:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch claims",
    });
  }
}

export async function createClaim(
  req: Request,
  res: Response
) {
  try {
    const {
      vendor,
      amount,
      date,
      receiptUrl,
    } = req.body;

    // Validate required fields
    if (!vendor || amount === undefined || !date) {
      return res.status(400).json({
        success: false,
        message: "Vendor, amount, and date are required",
      });
    }

    // Validate amount
    const numericAmount = Number(amount);

    if (
      Number.isNaN(numericAmount) ||
      numericAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a valid number greater than zero",
      });
    }

    // Create claim
    const claim = await prisma.claim.create({
      data: {
        vendor: String(vendor),
        amount: numericAmount,
        date: new Date(date),
        status: "pending",
        receiptUrl: receiptUrl || null,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Expense claim created successfully",
      data: claim,
    });
  } catch (error) {
    console.error("Failed to create claim:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create expense claim",
    });
  }
}