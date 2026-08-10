import axios from "axios";

const endpoint =
  process.env.AZURE_ENDPOINT;

const apiKey =
  process.env.AZURE_API_KEY;

const isDocumentIntelligenceConfigured =
  Boolean(endpoint && apiKey);

if (isDocumentIntelligenceConfigured) {
  console.log(
    "Azure Document Intelligence configured successfully"
  );
} else {
  console.warn(
    "Azure Document Intelligence is not configured."
  );

  console.warn(
    "Automatic receipt processing is currently unavailable."
  );
}

/**
 * Analyze a receipt using Azure Document Intelligence REST API.
 *
 * Azure is optional.
 * If Azure credentials are missing, the caller
 * should allow the user to submit the claim manually.
 */
export async function analyzeReceipt(
  buffer: Buffer,
  contentType: string
) {
  if (!endpoint || !apiKey) {
    throw new Error(
      "Azure Document Intelligence is not configured. " +
        "Please enter your claim details manually."
    );
  }

  /**
   * Remove trailing slash from endpoint.
   */
  const baseUrl =
    endpoint.replace(/\/$/, "");

  /**
   * Azure Document Intelligence API URL.
   */
  const analyzeUrl =
    `${baseUrl}/documentModels/prebuilt-receipt:analyze` +
    `?api-version=2024-11-30`;

  /**
   * Start analysis.
   */
  const response =
    await axios.post(
      analyzeUrl,
      buffer,
      {
        headers: {
          "Ocp-Apim-Subscription-Key":
            apiKey,

          "Content-Type":
            contentType,

          "Content-Length":
            buffer.length,
        },

        validateStatus:
          (status) =>
            status === 202,
      }
    );

  /**
   * Azure returns the URL for polling
   * the analysis result.
   */
  const operationLocation =
    response.headers[
      "operation-location"
    ];

  if (!operationLocation) {
    throw new Error(
      "Azure did not return an operation location."
    );
  }

  /**
   * Poll until analysis completes.
   */
  let result: any;

  for (
    let attempt = 0;
    attempt < 30;
    attempt++
  ) {
    await new Promise(
      (resolve) =>
        setTimeout(resolve, 2000)
    );

    const pollResponse =
      await axios.get(
        operationLocation,
        {
          headers: {
            "Ocp-Apim-Subscription-Key":
              apiKey,
          },
        }
      );

    result =
      pollResponse.data;

    if (
      result.status ===
      "succeeded"
    ) {
      break;
    }

    if (
      result.status ===
      "failed"
    ) {
      throw new Error(
        "Azure Document Intelligence failed to analyze the receipt."
      );
    }
  }

  if (
    !result ||
    result.status !==
      "succeeded"
  ) {
    throw new Error(
      "Azure Document Intelligence analysis timed out."
    );
  }

  /**
   * Get first analyzed receipt.
   */
  const document =
    result.analyzeResult
      ?.documents?.[0];

  if (!document) {
    throw new Error(
      "No receipt information could be extracted."
    );
  }

  const fields =
    document.fields || {};

  /**
   * Extract merchant.
   */
  const merchant =
    fields.MerchantName?.valueString ??
    fields.MerchantName?.content ??
    "Unknown Vendor";

  /**
   * Extract total.
   */
  const currencyAmount =
  fields.Total?.valueCurrency?.amount;

const contentAmount =
  Number(
    fields.Total?.content?.replace(
      /[^0-9.-]+/g,
      ""
    )
  ) || 0;

const total =
  currencyAmount ?? contentAmount;
  /**
   * Extract transaction date.
   */
  const date =
    fields.TransactionDate
      ?.valueDate ??
    fields.TransactionDate
      ?.content ??
    null;

  return {
    merchant,
    total,
    date,
  };
}