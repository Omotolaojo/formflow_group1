import { AzureReceiptResult } from "@/types/azure";

export function extractReceiptData(result: AzureReceiptResult) {
  const doc = result.analyzeResult?.documents?.[0]?.fields;

  return {
    merchant:
      doc?.MerchantName?.valueString ||
      doc?.MerchantName?.content ||
      "Unknown",

    total:
      doc?.Total?.valueNumber ||
      doc?.Total?.valueCurrency?.amount ||
      0,

    date:
      doc?.TransactionDate?.valueDate ||
      doc?.TransactionDate?.content ||
      new Date().toISOString(),
  };
}