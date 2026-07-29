"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Clock3,
  FileText,
  Plus,
  RefreshCw,
} from "lucide-react";
import { Claim } from "@/types/claims";

async function fetchClaims(): Promise<Claim[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  const res = await fetch(`${apiUrl}/claims`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch claims: ${res.status}`);
  }

  const data = await res.json();

  // Handles both:
  // 1. Direct array response: [...]
  // 2. API response: { success: true, data: [...] }
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.data)) {
    return data.data;
  }

  return [];
}

export default function ClaimsPage() {
  const {
    data: claims = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Claim[]>({
    queryKey: ["claims"],
    queryFn: fetchClaims,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="skeleton h-8 w-32" />
          <div className="skeleton mt-2 h-4 w-64" />
        </div>

        <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-4"
              >
                <div className="skeleton h-10 w-10 rounded-lg" />
                <div className="flex-1">
                  <div className="skeleton h-4 w-40" />
                  <div className="skeleton mt-2 h-3 w-24" />
                </div>
                <div className="skeleton h-6 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-error/20 bg-base-100 p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-error/10 text-error">
            <AlertCircle size={28} />
          </div>

          <h2 className="mt-4 text-xl font-bold">
            Unable to load claims
          </h2>

          <p className="mt-2 text-sm text-base-content/60">
            We could not retrieve your expense claims.
            Please check that the backend API is running.
          </p>

          <p className="mt-3 text-xs text-error/70">
            {error instanceof Error
              ? error.message
              : "Unknown error"}
          </p>

          <button
            onClick={() => refetch()}
            className="btn btn-primary mt-6"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText size={22} />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Expense Claims
              </h1>

              <p className="mt-1 text-sm text-base-content/60">
                Review and monitor submitted expense claims.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => refetch()}
            className="btn btn-outline btn-sm"
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          <Link
            href="/dashboard/upload"
            className="btn btn-primary btn-sm"
          >
            <Plus size={16} />
            New Claim
          </Link>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <p className="text-sm text-base-content/60">
            Total Claims
          </p>

          <p className="mt-2 text-3xl font-bold">
            {claims.length}
          </p>
        </div>

        <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <p className="text-sm text-base-content/60">
            Pending Review
          </p>

          <p className="mt-2 text-3xl font-bold text-warning">
            {
              claims.filter(
                (claim) => claim.status === "pending"
              ).length
            }
          </p>
        </div>

        <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <p className="text-sm text-base-content/60">
            Approved
          </p>

          <p className="mt-2 text-3xl font-bold text-success">
            {
              claims.filter(
                (claim) => claim.status === "approved"
              ).length
            }
          </p>
        </div>
      </div>

      {/* CLAIMS TABLE */}
      <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
        <div className="border-b border-base-300 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">
                All Claims
              </h2>

              <p className="mt-1 text-sm text-base-content/60">
                A complete list of submitted expense claims.
              </p>
            </div>

            <div className="badge badge-ghost">
              {claims.length} records
            </div>
          </div>
        </div>

        {claims.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-base-200">
              <FileText
                size={26}
                className="text-base-content/50"
              />
            </div>

            <h3 className="mt-4 text-lg font-semibold">
              No claims found
            </h3>

            <p className="mt-1 max-w-sm text-sm text-base-content/60">
              There are currently no expense claims in the
              system. Create your first claim to get started.
            </p>

            <Link
              href="/upload"
              className="btn btn-primary btn-sm mt-5"
            >
              <Plus size={16} />
              Create Claim
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Receipt</th>
                </tr>
              </thead>

              <tbody>
                {claims.map((claim) => (
                  <tr
                    key={claim.id}
                    className="hover:bg-base-200/50"
                  >
                    <td>
                      <div className="font-semibold">
                        {claim.vendor}
                      </div>
                    </td>

                    <td>
                      <span className="font-semibold">
                        ₦
                        {Number(claim.amount).toLocaleString()}
                      </span>
                    </td>

                    <td>
                      <div className="flex items-center gap-2 text-sm text-base-content/70">
                        <Clock3 size={15} />
                        {new Date(
                          claim.date
                        ).toLocaleDateString()}
                      </div>
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          claim.status === "approved"
                            ? "badge-success"
                            : claim.status === "rejected"
                            ? "badge-error"
                            : "badge-warning"
                        }`}
                      >
                        {claim.status}
                      </span>
                    </td>

                    <td>
                      {claim.receiptUrl ? (
                        <a
                          href={claim.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link link-primary text-sm"
                        >
                          View Receipt
                        </a>
                      ) : (
                        <span className="text-sm text-base-content/40">
                          No receipt
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

