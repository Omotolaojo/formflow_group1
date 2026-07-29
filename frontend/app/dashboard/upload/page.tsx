"use client";

import { useState } from "react";

import {
  FileText,
  Sparkles,
  PenLine,
  Receipt,
  Info,
} from "lucide-react";

import UploadForm from "@/components/forms/UploadForm";
import ManualClaimForm from "@/components/forms/ManualClaimForms";


type Mode = "upload" | "manual";

export default function UploadPage() {
  const [mode, setMode] = useState<Mode>("upload");

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      {/* PAGE HEADER */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Receipt size={24} />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Create Expense Claim
            </h1>

            <p className="mt-1 text-sm text-base-content/60">
              Submit an expense claim using AI-powered receipt
              extraction or manual entry.
            </p>
          </div>
        </div>
      </div>

      {/* MODE SELECTOR */}
      <div>
        <h2 className="text-lg font-semibold">
          How would you like to create your claim?
        </h2>

        <p className="mt-1 text-sm text-base-content/60">
          Choose the option that works best for you.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* AI UPLOAD OPTION */}
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`rounded-2xl border p-6 text-left transition-all ${
              mode === "upload"
                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                : "border-base-300 bg-base-100 hover:border-primary/40 hover:shadow-sm"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sparkles size={24} />
              </div>

              {mode === "upload" && (
                <span className="badge badge-primary">
                  Selected
                </span>
              )}
            </div>

            <h3 className="mt-5 text-lg font-bold">
              AI-Powered Upload
            </h3>

            <p className="mt-2 text-sm leading-6 text-base-content/60">
              Upload a receipt and let Azure Document Intelligence
              automatically extract the vendor, amount, and date.
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-primary">
              <FileText size={15} />
              Recommended
            </div>
          </button>

          {/* MANUAL ENTRY OPTION */}
          <button
            type="button"
            onClick={() => setMode("manual")}
            className={`rounded-2xl border p-6 text-left transition-all ${
              mode === "manual"
                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                : "border-base-300 bg-base-100 hover:border-primary/40 hover:shadow-sm"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-base-200 text-base-content">
                <PenLine size={24} />
              </div>

              {mode === "manual" && (
                <span className="badge badge-primary">
                  Selected
                </span>
              )}
            </div>

            <h3 className="mt-5 text-lg font-bold">
              Manual Entry
            </h3>

            <p className="mt-2 text-sm leading-6 text-base-content/60">
              Enter your expense details manually when AI extraction
              is unavailable or when you dont have a receipt.
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-base-content/60">
              <PenLine size={15} />
              No AI required
            </div>
          </button>
        </div>
      </div>

      {/* INFORMATION ALERT */}
      {mode === "upload" && (
        <div className="alert alert-info">
          <Info size={20} />

          <div>
            <h3 className="font-semibold">
              AI-powered receipt processing
            </h3>

            <p className="text-sm">
              Upload a clear receipt image or PDF. The system will
              attempt to extract the vendor, amount, and date
              automatically.
            </p>
          </div>
        </div>
      )}

      {mode === "manual" && (
        <div className="alert alert-warning">
          <Info size={20} />

          <div>
            <h3 className="font-semibold">
              Manual claim entry
            </h3>

            <p className="text-sm">
              Enter the expense information below. You can submit
              the claim without using AI document processing.
            </p>
          </div>
        </div>
      )}

      {/* FORM AREA */}
      <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm md:p-8">
        {mode === "upload" ? (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold">
                Upload Receipt
              </h2>

              <p className="mt-1 text-sm text-base-content/60">
                Upload your receipt to automatically extract
                expense information.
              </p>
            </div>

            <UploadForm
  onManualClick={() => setMode("manual")}
/>
          </div>
        ) : (
          <ManualClaimForm />
        )}
      </div>
    </div>
  );
}

