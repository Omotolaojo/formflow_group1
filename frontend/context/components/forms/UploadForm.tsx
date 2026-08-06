"use client";

import { Claim } from "@/types/claims";
import {
  FileText,
  Image as ImageIcon,
  Upload,
  X,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

type ProcessResponse = {
  claim: Claim;
  extracted: {
    merchant: string;
    total: number;
    date: string;
  };
};

type UploadFormProps = {
  onManualClick: () => void;
};

export default function UploadForm({ onManualClick }: UploadFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [preview, setPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const [progress, setProgress] = useState(0);

  const [file, setFile] = useState<File | null>(null);

  const [result, setResult] = useState<ProcessResponse | null>(null);

  /**

* Create preview when a file is selected.
  */
  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) {
      setFile(null);
      setPreview(null);
      return;
    }

    // Clean up previous preview URL

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setFile(selectedFile);

    // Only create image previews for image files
    if (selectedFile.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }

    // Clear previous processing result
    setResult(null);
  };

  /**

* Clean up object URL when component unmounts.
  */
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  /**

* Remove selected file.
  */
  const handleRemove = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setFile(null);

    setPreview(null);
    setProgress(0);
    setResult(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /**

* Upload receipt to Express backend
* for Azure Document Intelligence processing.
  */
  const handleUpload = () => {
    if (!file) {
      toast.error("Please select a receipt first.");
      return;
    }

    setLoading(true);

    setProgress(0);
    setResult(null);

    const formData = new FormData();

    formData.append("file", file);

    const xhr = new XMLHttpRequest();

    /**
     * Express endpoint:
     * POST /api/process
     */
    xhr.open("POST", `${process.env.NEXT_PUBLIC_API_URL}/process`);

    /**
     * Track upload progress.
     */
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentage = Math.round((event.loaded / event.total) * 100);

        setProgress(percentage);
      }
    };

    /**
     * Request completed.
     */
    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);

        if (xhr.status < 200 || xhr.status >= 300) {
          throw new Error(
            data.error || data.message || "Receipt processing failed.",
          );
        }

        setResult(data);

        toast.success("Receipt processed successfully!");

        handleRemove();
      } catch (error) {
        console.error("Receipt processing error:", error);

        toast.error(
          error instanceof Error
            ? error.message
            : "Something went wrong while processing the receipt.",
        );
      } finally {
        setLoading(false);
      }
    };

    /**
     * Network error.
     */
    xhr.onerror = () => {
      console.error("Network error while uploading receipt.");

      toast.error("Unable to connect to the Expense Claim API.");

      setLoading(false);
    };

    /**
     * Request timeout.
     */
    xhr.ontimeout = () => {
      toast.error("Receipt processing timed out. Please try again.");

      setLoading(false);
    };

    xhr.timeout = 120000;

    /**
     * Send receipt.
     */
    xhr.send(formData);
  };

  return (
    <div className="space-y-6">
      {/* UPLOAD AREA */}
      <div
        className={`rounded-2xl border-2 border-dashed p-8 text-center transition ${
          file
            ? "border-primary/40 bg-primary/5"
            : "border-base-300 hover:border-primary/40"
        }`}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Upload size={26} />
        </div>

        <h3 className="mt-4 text-lg font-semibold">Upload your receipt</h3>

        <p className="mx-auto mt-2 max-w-md text-sm text-base-content/60">
          Upload a receipt image or PDF and our AI-powered document processing
          service will extract the vendor, amount, and expense date
          automatically.
        </p>

        <div className="mt-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            className="file-input file-input-bordered w-full max-w-md"
            onChange={(event) =>
              handleFileChange(event.target.files?.[0] || null)
            }
            disabled={loading}
          />
        </div>

        <div className="mt-4 flex items-center justify-center gap-3 text-xs text-base-content/50">
          <span className="flex items-center gap-1">
            <ImageIcon size={14} />
            Images
          </span>

          <span>•</span>

          <span className="flex items-center gap-1">
            <FileText size={14} />
            PDF
          </span>
        </div>
      </div>

      {/* SELECTED FILE */}
      {file && (
        <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {file.type.startsWith("image/") ? (
                  <ImageIcon size={20} />
                ) : (
                  <FileText size={20} />
                )}
              </div>

              <div>
                <p className="font-medium break-all">{file.name}</p>

                <p className="text-xs text-base-content/50">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemove}
              disabled={loading}
              className="btn btn-ghost btn-sm btn-circle"
              aria-label="Remove selected file"
            >
              <X size={18} />
            </button>
          </div>

          {/* IMAGE PREVIEW */}
          {preview && (
            <div className="mt-5 overflow-hidden rounded-xl border border-base-300">
              <img
                src={preview}
                alt="Selected receipt preview"
                className="max-h-80 w-full object-contain"
              />
            </div>
          )}

          {/* PDF NOTICE */}
          {file.type === "application/pdf" && (
            <div className="mt-5 flex items-center gap-3 rounded-xl bg-base-200 p-4">
              <FileText size={24} className="text-primary" />

              <div>
                <p className="font-medium">PDF receipt selected</p>

                <p className="text-xs text-base-content/60">
                  The document will be sent to the AI processing service.
                </p>
              </div>
            </div>
          )}

          {/* PROGRESS */}
          {loading && (
            <div className="mt-6">
              <div className="mb-2 flex justify-between text-xs">
                <span className="text-base-content/60">
                  Processing receipt...
                </span>

                <span className="font-medium">{progress}%</span>
              </div>

              <progress
                className="progress progress-primary w-full"
                value={progress}
                max="100"
              />
            </div>
          )}

          {/* PROCESS BUTTON */}
          <button
            type="button"
            onClick={handleUpload}
            disabled={loading || !file}
            className="btn btn-primary mt-6 w-full"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Processing Receipt...
              </>
            ) : (
              <>
                <Upload size={18} />
                Process Receipt with AI
              </>
            )}
          </button>
        </div>
      )}

      {/* SUCCESS RESULT */}
      {result && (
        <div className="rounded-2xl border border-success/20 bg-success/5 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-success/10 text-success">
              <CheckCircle2 size={22} />
            </div>

            <div>
              <h3 className="font-bold">Receipt Processed Successfully</h3>

              <p className="text-sm text-base-content/60">
                The following information was extracted from your receipt.
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-base-100 p-4">
              <p className="text-xs text-base-content/50">Vendor</p>

              <p className="mt-1 font-semibold">{result.extracted.merchant}</p>
            </div>

            <div className="rounded-xl bg-base-100 p-4">
              <p className="text-xs text-base-content/50">Amount</p>

              <p className="mt-1 font-semibold">
                ₦{Number(result.extracted.total).toLocaleString()}
              </p>
            </div>

            <div className="rounded-xl bg-base-100 p-4">
              <p className="text-xs text-base-content/50">Expense Date</p>

              <p className="mt-1 font-semibold">{result.extracted.date}</p>
            </div>
          </div>

          <Link href="/claims" className="btn btn-outline btn-sm mt-6">
            View Claims
            <ExternalLink size={15} />
          </Link>
        </div>
      )}

      {/* MANUAL FALLBACK */}
      <div className="rounded-2xl border border-base-300 bg-base-200/50 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold">Dont have a receipt?</h3>

            <p className="mt-1 text-sm text-base-content/60">
              You can submit your expense claim manually without using AI
              processing.
            </p>
          </div>

          <button
            type="button"
            onClick={onManualClick}
            className="btn btn-outline btn-sm"
          >
            Enter Manually
          </button>
        </div>
      </div>
    </div>
  );
}
