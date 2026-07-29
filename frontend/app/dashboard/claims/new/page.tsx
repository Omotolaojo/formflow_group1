import ManualClaimForm from "@/components/forms/ManualClaimForms";

export default function NewClaimPage() {
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6">
        Submit Expense Claim
      </h1>

      <ManualClaimForm />
    </div>
  );
}