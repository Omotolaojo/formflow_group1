export type AzureReceiptResult = {
  analyzeResult: {
    documents?: {
      fields?: {
        MerchantName?: {
          valueString?: string;
          content?: string;
        };

        Total?: {
          valueNumber?: number;
          valueCurrency?: {
            amount?: number;
          };
        };

        TransactionDate?: {
          valueDate?: string;
          content?: string;
        };
      };
    }[];
  };
};