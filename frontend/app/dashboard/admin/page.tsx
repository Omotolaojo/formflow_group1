"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Claim } from "@/types/claims";

export default function AdminPage() {
  const [claims, setClaims] = useState<Claim[]>([]);

  const [loadingAction, setLoadingAction] = useState<{
    id: string;
    status: Claim["status"];
  } | null>(null);

  /**
   * ============================================================
   * RECEIPT PREVIEW STATE
   * ============================================================
   */


  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  /**
   * ============================================================
   * FETCH PENDING CLAIMS
   * ============================================================
   */

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await fetch("/api/admin/claims/pending", {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          const errorText = await res.text();

          console.error("Admin claims failed:", errorText);

          throw new Error(
            `Failed to fetch claims. Status: ${res.status}`,
          );
        }

        const data = await res.json();

        console.log("Admin claims API response:", data);

        const fetchedClaims: Claim[] = Array.isArray(data)
          ? data
          : Array.isArray(data.claims)
            ? data.claims
            : Array.isArray(data.data)
              ? data.data
              : [];

        setClaims(fetchedClaims);
      } catch (err) {
        console.error("Failed to fetch claims:", err);

        toast.error("Failed to load claims");
      }
    };

    fetchClaims();
  }, []);



  /**
   * ============================================================
   * CLOSE RECEIPT MODAL
   * ============================================================
   */


  /**
   * ============================================================
   * APPROVE / REJECT CLAIM
   * ============================================================
   */

  const updateStatus = async (
    id: string,
    status: Claim["status"],
  ) => {
    setLoadingAction({
      id,
      status,
    });

    try {
      const res = await fetch(
        `/admin/claims/${id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            status:
              status.toLowerCase(),
          }),
        },
      );

      const data =
        await res.json();

      console.log(
        "Claim status update response:",
        data,
      );

      if (!res.ok) {
        throw new Error(
          data.message ||
            `Failed to update claim. Status: ${res.status}`,
        );
      }

      /**
       * Remove the claim from
       * the pending admin list.
       */

      setClaims(
        (prev) =>
          prev.filter(
            (claim) =>
              claim.id !== id,
          ),
      );

      /**
       * Close receipt preview
       * if the admin approved/rejected
       * the currently viewed claim.
       */

      if (
        selectedClaim?.id === id
      ) {

      }

      toast.success(
        `Claim ${status} successfully`,
      );
    } catch (error) {
      console.error(
        "Failed to update claim:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Action failed. Try again.",
      );
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="p-6">
      {/* PAGE HEADER */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Admin Panel
        </h1>

        <p className="mt-1 text-sm text-base-content/60">
          Review and manage submitted expense claims.
        </p>
      </div>

      {/* CLAIMS */}

      <div className="grid gap-4">
        {claims.length === 0 ? (
          <div className="rounded-xl border border-base-300 bg-base-100 p-8 text-center">
            <p className="text-base-content/60">
              No pending claims 🎉
            </p>
          </div>
        ) : (
          claims.map((c) => (
            <div
              key={c.id}
              className="card border border-base-300 bg-base-100 p-5 shadow-sm"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                {/* CLAIM INFORMATION */}

                <div className="space-y-3">
                  <div>
                    <h2 className="text-lg font-bold">
                      {c.vendor}
                    </h2>

                    <p className="text-lg font-semibold text-primary">
                      ₦
                      {Number(
                        c.amount,
                      ).toLocaleString()}
                    </p>
                  </div>

                  {/* CLAIM SUBMITTER */}

                  <div className="rounded-lg bg-base-200 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                      Submitted By
                    </p>

                    <p className="mt-1 font-semibold">
                      {c.user?.name ||
                        "Unknown User"}
                    </p>

                    <p className="text-sm text-base-content/60">
                      {c.user?.email ||
                        "No email available"}
                    </p>
                  </div>

                  {/* CLAIM DATE */}

                  {c.date && (
                    <p className="text-sm text-base-content/50">
                      Submitted on:{" "}
                      {new Date(
                        c.date,
                      ).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* ACTION BUTTONS */}

                <div className="flex flex-wrap gap-2">
                  {/* APPROVE */}

                  <button
                    disabled={
                      loadingAction?.id ===
                      c.id
                    }
                    onClick={() =>
                      updateStatus(
                        c.id,
                        "approved",
                      )
                    }
                    className="rounded-md border border-green-500 px-3 py-2 text-sm font-semibold text-green-600 transition-all duration-200 hover:bg-green-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loadingAction?.id ===
                      c.id &&
                    loadingAction.status ===
                      "approved" ? (
                      <>
                        <span className="loading loading-spinner loading-xs" />
                        Approving...
                      </>
                    ) : (
                      "✓ Approve"
                    )}
                  </button>

                  {/* REJECT */}

                  <button
                    disabled={
                      loadingAction?.id ===
                      c.id
                    }
                    onClick={() =>
                      updateStatus(
                        c.id,
                        "rejected",
                      )
                    }
                    className="rounded-md border border-red-500 px-3 py-2 text-sm font-semibold text-red-600 transition-all duration-200 hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loadingAction?.id ===
                      c.id &&
                    loadingAction.status ===
                      "rejected" ? (
                      <>
                        <span className="loading loading-spinner loading-xs" />
                        Rejecting...
                      </>
                    ) : (
                      "✕ Reject"
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>


    </div>
  );
}

