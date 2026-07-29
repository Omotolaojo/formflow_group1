"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-base-200">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT SIDE */}

        <div className="hidden bg-primary p-12 text-primary-content lg:flex lg:flex-col lg:justify-between">
          <div>
            <Link href="/" className="text-2xl font-bold">
              ClaimFlow
            </Link>
          </div>

          <div className="max-w-lg">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-content/10">
              <ShieldCheck size={30} />
            </div>

            <h1 className="text-4xl font-bold">
              Manage your expense claims with confidence.
            </h1>

            <p className="mt-6 text-lg opacity-80">
              Submit, review, approve and track organizational expenses from one
              centralized dashboard.
            </p>
          </div>

          <p className="text-sm opacity-60">
            © 2026 ClaimFlow. All rights reserved.
          </p>
        </div>

        {/* LOGIN */}

        <div className="flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Link href="/" className="text-2xl font-bold text-primary">
                ClaimFlow
              </Link>
            </div>

            <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold">Welcome back</h2>

                <p className="mt-2 text-sm text-base-content/60">
                  Sign in to access your expense management dashboard.
                </p>
              </div>

              <LoginForm />

              <p className="mt-6 text-center text-sm text-base-content/60">
                Dont have an account?{" "}
                <Link
                  href="/register"
                  className="font-medium text-primary hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
