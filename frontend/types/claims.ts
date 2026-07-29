export type ClaimStatus =
  | "pending"
  | "approved"
  | "rejected";

export interface ClaimUser {
  id: string;
  name: string | null;
  email: string;
}

export interface Claim {
  id: string;
  vendor: string;
  amount: number;
  date: string;
  status: ClaimStatus;
  receiptUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
  user?: ClaimUser;
}

