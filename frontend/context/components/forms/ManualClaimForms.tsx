"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function ManualClaimForm() {
const [isSubmitting, setIsSubmitting] =
useState(false);

const [formData, setFormData] = useState({
vendor: "",
amount: "",
date: "",
receiptUrl: "",
});

const handleChange = (
e: React.ChangeEvent<HTMLInputElement>
) => {
const { name, value } = e.target;


setFormData((previous) => ({
  ...previous,
  [name]: value,
}));


};

const handleSubmit = async (
e: React.FormEvent<HTMLFormElement>
) => {
// Prevent the browser from refreshing
// or navigating to:
// /upload?vendor=...&amount=...


e.preventDefault();
e.stopPropagation();

console.log(
  "================================="
);

console.log(
  "MANUAL FORM SUBMIT HANDLER FIRED"
);

console.log(
  "Form data:",
  formData
);

console.log(
  "================================="
);

setIsSubmitting(true);

try {
  // Make sure the API URL exists
  const baseApiUrl =
    process.env.NEXT_PUBLIC_API_URL;

  if (!baseApiUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not configured"
    );
  }

  const apiUrl =
    `${baseApiUrl}/claims`;

  console.log(
    "POST URL:",
    apiUrl
  );

  const response =
    await fetch(apiUrl, {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        vendor:
          formData.vendor.trim(),

        amount:
          Number(formData.amount),

        date:
          formData.date,

        receiptUrl:
          formData.receiptUrl.trim() ||
          null,
      }),
    });

  console.log(
    "Response status:",
    response.status
  );

  const result =
    await response.json();

  console.log(
    "Response body:",
    result
  );

  // Handle API errors
  if (!response.ok) {
    throw new Error(
      result.message ||
        result.error ||
        "Failed to create claim"
    );
  }

  // SUCCESS TOAST
  toast.success(
    "Expense claim submitted successfully!",
    {
      duration: 4000,
      position: "top-right",
    }
  );

  // Clear form
  setFormData({
    vendor: "",
    amount: "",
    date: "",
    receiptUrl: "",
  });
} catch (error) {
  console.error(
    "Failed to create claim:",
    error
  );

  // ERROR TOAST
  toast.error(
    error instanceof Error
      ? error.message
      : "Failed to submit expense claim",
    {
      duration: 5000,
      position: "top-right",
    }
  );
} finally {
  setIsSubmitting(false);
}


};

return ( <div>
{/* HEADER */}


  <div className="mb-6">
    <h2 className="text-xl font-bold">
      Enter Claim Details
    </h2>

    <p className="mt-1 text-sm text-base-content/60">
      Provide your expense details manually.
      A receipt is optional.
    </p>
  </div>

  {/* FORM */}

  <form
    onSubmit={handleSubmit}
    className="space-y-5"
  >
    {/* VENDOR */}

    <div className="form-control">
      <label className="label">
        <span className="label-text font-medium">
          Vendor
        </span>
      </label>

      <input
        type="text"
        name="vendor"
        value={formData.vendor}
        onChange={handleChange}
        placeholder="e.g. Microsoft, Amazon, Uber"
        className="input input-bordered w-full"
        required
        disabled={isSubmitting}
      />
    </div>

    {/* AMOUNT */}

    <div className="form-control">
      <label className="label">
        <span className="label-text font-medium">
          Amount
        </span>
      </label>

      <div className="join w-full">
        <span className="join-item flex items-center bg-base-200 px-4">
          ₦
        </span>

        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          min="0"
          step="0.01"
          placeholder="0.00"
          className="input input-bordered join-item w-full"
          required
          disabled={isSubmitting}
        />
      </div>
    </div>

    {/* DATE */}

    <div className="form-control">
      <label className="label">
        <span className="label-text font-medium">
          Expense Date
        </span>
      </label>

      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        className="input input-bordered w-full"
        required
        disabled={isSubmitting}
      />
    </div>

    {/* RECEIPT URL */}

    <div className="form-control">
      <label className="label">
        <span className="label-text font-medium">
          Receipt URL

          <span className="ml-2 text-xs text-base-content/50">
            Optional
          </span>
        </span>
      </label>

      <input
        type="url"
        name="receiptUrl"
        value={formData.receiptUrl}
        onChange={handleChange}
        placeholder="https://example.com/receipt"
        className="input input-bordered w-full"
        disabled={isSubmitting}
      />

      <label className="label">
        <span className="label-text-alt text-base-content/50">
          You can leave this blank if you
          dont have a digital copy of the
          receipt.
        </span>
      </label>
    </div>

    {/* SUBMIT */}

    <button
      type="submit"
      className="btn btn-primary w-full"
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <span className="loading loading-spinner loading-sm" />

          Submitting...
        </>
      ) : (
        "Submit Expense Claim"
      )}
    </button>
  </form>
</div>


);
}
