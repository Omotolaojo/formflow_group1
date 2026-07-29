"use client";

import {
  Wallet,
  Clock3,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import {
  getToken,
} from "@/lib/auth";

import { useQuery } from "@tanstack/react-query";
import { Claim } from "@/types/claims";

type Stats = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  spent: number;
  approvedAmount: number;
};

async function fetchDashboardData(): Promise<Claim[]> {
  const apiUrl =
    `${process.env.NEXT_PUBLIC_API_URL}/claims/all`;

  const token = getToken();

  console.log(
    "Fetching dashboard claims from:",
    apiUrl
  );

  const res = await fetch(apiUrl, {
    method: "GET",

    headers: {
      "Content-Type": "application/json",

      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    },

    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch claims. Status: ${res.status}`
    );
  }

  const data = await res.json();

  console.log(
    "Dashboard API response:",
    data
  );

  const claims = Array.isArray(data)
    ? data
    : data.claims;

  if (!Array.isArray(claims)) {
    throw new Error(
      "Invalid claims response from API"
    );
  }

  return claims;
}

export default function Home() {
  const {
    data: claims = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<Claim[]>({
    queryKey: ["dashboard-claims"],

    queryFn: fetchDashboardData,

    // Always fetch fresh data when dashboard opens
    staleTime: 0,

    // Refetch whenever dashboard mounts
    refetchOnMount: "always",

    // Refetch when browser tab gets focus
    refetchOnWindowFocus: true,

    // Automatically check for changes every 10 seconds
    refetchInterval: 10000,
  });

  /**
   * Debug the claims returned from backend.
   *
   * Check browser console after approving a claim.
   */
  console.log(
    "Claims currently loaded on dashboard:",
    claims
  );

  /**
   * Calculate dashboard statistics.
   *
   * We use toLowerCase() to avoid issues if
   * backend returns "Approved" instead of "approved".
   */
  const stats: Stats = {
    total: claims.length,

    pending: claims.filter(
      (claim) =>
        String(claim.status).toLowerCase() ===
        "pending"
    ).length,

    approved: claims.filter(
      (claim) =>
        String(claim.status).toLowerCase() ===
        "approved"
    ).length,

    rejected: claims.filter(
      (claim) =>
        String(claim.status).toLowerCase() ===
        "rejected"
    ).length,

    spent: claims.reduce(
      (sum, claim) =>
        sum + Number(claim.amount || 0),
      0
    ),

    approvedAmount: claims
      .filter(
        (claim) =>
          String(claim.status).toLowerCase() ===
          "approved"
      )
      .reduce(
        (sum, claim) =>
          sum + Number(claim.amount || 0),
        0
      ),
  };

  const approvalRate =
    stats.total > 0
      ? Math.round(
          (stats.approved /
            stats.total) *
            100
        )
      : 0;

  const pendingRate =
    stats.total > 0
      ? Math.round(
          (stats.pending /
            stats.total) *
            100
        )
      : 0;

  const averageClaim =
    stats.total > 0
      ? Math.round(
          stats.spent /
            stats.total
        )
      : 0;

  /**
   * LOADING STATE
   */
  if (isLoading) {
    return (
      <div className="space-y-8">

        <div>
          <div className="skeleton mb-2 h-8 w-48" />
          <div className="skeleton h-4 w-80" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-36 rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm"
              >
                <div className="skeleton mb-4 h-10 w-10 rounded-xl" />

                <div className="skeleton mb-2 h-4 w-24" />

                <div className="skeleton h-7 w-20" />
              </div>
            )
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {Array.from({ length: 3 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-44 rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm"
              >
                <div className="skeleton mb-6 h-5 w-40" />

                <div className="skeleton mb-4 h-4 w-full" />

                <div className="skeleton h-8 w-24" />
              </div>
            )
          )}
        </div>

      </div>
    );
  }

  /**
   * ERROR STATE
   */
  if (isError) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">

        <div className="w-full max-w-md rounded-2xl border border-error/20 bg-base-100 p-8 text-center shadow-sm">

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error/10 text-error">
            <AlertCircle size={28} />
          </div>

          <h2 className="text-xl font-bold">
            Unable to load dashboard
          </h2>

          <p className="mt-2 text-sm text-base-content/60">
            We couldnt retrieve your expense
            claim data. Please try again.
          </p>

          {error instanceof Error && (
            <p className="mt-3 text-xs text-error">
              {error.message}
            </p>
          )}

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
    <div className="space-y-8">

      {/* PAGE HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-sm font-medium text-primary">
            Expense Management
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-base-content/60">
            Monitor your organizations expense
            claims and approval activity.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="btn btn-outline btn-sm"
        >
          <RefreshCw
            size={16}
            className={
              isFetching
                ? "animate-spin"
                : ""
            }
          />

          {isFetching
            ? "Refreshing..."
            : "Refresh"}
        </button>

      </div>

      {/* STAT CARDS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* TOTAL CLAIMS */}

        <div className="group rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">

          <div className="flex items-start justify-between">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText size={22} />
            </div>

            <div className="flex items-center gap-1 text-xs font-medium text-success">
              <ArrowUpRight size={14} />
              Overall
            </div>

          </div>

          <div className="mt-5">

            <p className="text-sm font-medium text-base-content/60">
              Total Claims
            </p>

            <h2 className="mt-1 text-3xl font-bold">
              {stats.total}
            </h2>

            <p className="mt-2 text-xs text-base-content/50">
              All submitted expense claims
            </p>

          </div>

        </div>

        {/* PENDING */}

        <div className="group rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">

          <div className="flex items-start justify-between">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning/10 text-warning">
              <Clock3 size={22} />
            </div>

            <span className="badge badge-warning badge-sm">
              {pendingRate}%
            </span>

          </div>

          <div className="mt-5">

            <p className="text-sm font-medium text-base-content/60">
              Pending Review
            </p>

            <h2 className="mt-1 text-3xl font-bold">
              {stats.pending}
            </h2>

            <p className="mt-2 text-xs text-base-content/50">
              Claims awaiting approval
            </p>

          </div>

        </div>

        {/* APPROVED */}

        <div className="group rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">

          <div className="flex items-start justify-between">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/10 text-success">
              <CheckCircle2 size={22} />
            </div>

            <div className="flex items-center gap-1 text-xs font-medium text-success">
              <ArrowUpRight size={14} />
              {approvalRate}%
            </div>

          </div>

          <div className="mt-5">

            <p className="text-sm font-medium text-base-content/60">
              Approved Claims
            </p>

            <h2 className="mt-1 text-3xl font-bold">
              {stats.approved}
            </h2>

            <p className="mt-2 text-xs text-base-content/50">
              Successfully approved expenses
            </p>

          </div>

        </div>

        {/* TOTAL SPENDING */}

        <div className="group rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">

          <div className="flex items-start justify-between">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-info/10 text-info">
              <Wallet size={22} />
            </div>

            <div className="flex items-center gap-1 text-xs font-medium text-info">
              <TrendingUp size={14} />
              Spending
            </div>

          </div>

          <div className="mt-5">

            <p className="text-sm font-medium text-base-content/60">
              Total Expenses
            </p>

            <h2 className="mt-1 text-3xl font-bold">
              ₦
              {stats.spent.toLocaleString()}
            </h2>

            <p className="mt-2 text-xs text-base-content/50">
              Total value of submitted claims
            </p>

          </div>

        </div>

      </div>

      {/* ANALYTICS */}

      <div>

        <div className="mb-4">

          <h2 className="text-xl font-bold">
            Expense Analytics
          </h2>

          <p className="mt-1 text-sm text-base-content/60">
            A quick overview of your organizations
            claim performance.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* APPROVAL RATE */}

          <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <h3 className="font-semibold">
                  Approval Rate
                </h3>

                <p className="mt-1 text-xs text-base-content/50">
                  Percentage of approved claims
                </p>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
                <CheckCircle2 size={20} />
              </div>

            </div>

            <div className="mt-6">

              <div className="flex items-end justify-between">

                <span className="text-3xl font-bold">
                  {approvalRate}%
                </span>

                <span className="text-xs text-base-content/50">
                  {stats.approved} of{" "}
                  {stats.total}
                </span>

              </div>

              <progress
                className="progress progress-success mt-4 w-full"
                value={approvalRate}
                max="100"
              />

            </div>

          </div>

          {/* PENDING WORKLOAD */}

          <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <h3 className="font-semibold">
                  Pending Workload
                </h3>

                <p className="mt-1 text-xs text-base-content/50">
                  Claims requiring administrator
                  review
                </p>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10 text-warning">
                <Clock3 size={20} />
              </div>

            </div>

            <div className="mt-6">

              <div className="flex items-end justify-between">

                <span className="text-3xl font-bold">
                  {pendingRate}%
                </span>

                <span className="text-xs text-base-content/50">
                  {stats.pending} pending
                </span>

              </div>

              <progress
                className="progress progress-warning mt-4 w-full"
                value={pendingRate}
                max="100"
              />

            </div>

          </div>

          {/* AVERAGE CLAIM */}

          <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <h3 className="font-semibold">
                  Average Claim Value
                </h3>

                <p className="mt-1 text-xs text-base-content/50">
                  Average expense per submitted
                  claim
                </p>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info/10 text-info">
                <TrendingUp size={20} />
              </div>

            </div>

            <div className="mt-6">

              <span className="text-3xl font-bold">
                ₦
                {averageClaim.toLocaleString()}
              </span>

              <div className="mt-4 flex items-center gap-2 text-xs text-base-content/50">
                <span className="badge badge-info badge-xs" />

                Based on {stats.total} claims
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* SUMMARY */}

      <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-lg font-bold">
              Claim Summary
            </h2>

            <p className="mt-1 text-sm text-base-content/60">
              Current status of your expense
              management workflow.
            </p>

          </div>

          <div className="flex flex-wrap gap-3">

            <div className="badge badge-success gap-2 p-4">
              <CheckCircle2 size={14} />
              {stats.approved} Approved
            </div>

            <div className="badge badge-warning gap-2 p-4">
              <Clock3 size={14} />
              {stats.pending} Pending
            </div>

            <div className="badge badge-error gap-2 p-4">
              <ArrowDownRight size={14} />
              {stats.rejected} Rejected
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}