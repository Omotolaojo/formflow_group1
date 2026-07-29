"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function LandingPage() {
  const router = useRouter();

  function handleGetStarted() {
    const token = getToken();

    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }

  return (
    <main className="min-h-screen bg-base-100">
      {/* NAVBAR */}

      <nav className="border-b border-base-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-bold text-primary">
            ClaimFlow
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              type="button"
              onClick={handleGetStarted}
              className="btn btn-ghost transition-all duration-200 hover:-translate-y-0.5 hover:bg-base-200 hover:shadow-sm"
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={handleGetStarted}
              className="btn btn-primary transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}

      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <ShieldCheck size={16} />
              Secure Expense Management
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Simplify your expense claims.
              <span className="block text-primary">
                Approve with confidence.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-base-content/60">
              ClaimFlow gives your organization a centralized platform to
              submit, review, approve and monitor expense claims with complete
              visibility.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleGetStarted}
                className="btn btn-primary btn-lg"
              >
                Access Dashboard
                <ArrowRight size={20} />
              </button>

              <a href="#features" className="btn btn-outline btn-lg">
                Explore Features
              </a>
            </div>
          </div>

          {/* DASHBOARD PREVIEW */}

          <div className="relative">
            <div className="rounded-3xl border border-base-300 bg-base-200 p-4 shadow-2xl">
              <div className="rounded-2xl border border-base-300 bg-base-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-base-content/50">
                      Expense Overview
                    </p>

                    <h3 className="mt-1 text-2xl font-bold">Dashboard</h3>
                  </div>

                  <div className="rounded-xl bg-success/10 p-3 text-success">
                    <TrendingUp size={24} />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-base-200 p-4">
                    <p className="text-xs text-base-content/50">Total Claims</p>

                    <p className="mt-2 text-2xl font-bold">128</p>
                  </div>

                  <div className="rounded-xl bg-success/10 p-4">
                    <p className="text-xs text-base-content/50">Approved</p>

                    <p className="mt-2 text-2xl font-bold text-success">94</p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-base-300 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-success/10 p-2 text-success">
                      <CheckCircle2 size={20} />
                    </div>

                    <div>
                      <p className="font-medium">Claim Approved</p>

                      <p className="text-xs text-base-content/50">
                        Expense review completed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}

      <section id="features" className="border-t border-base-300 bg-base-200">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-medium text-primary">Everything you need</p>

            <h2 className="mt-2 text-3xl font-bold">
              A better way to manage expenses
            </h2>

            <p className="mt-4 text-base-content/60">
              From submission to approval, keep your organizations expense
              workflow organized.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileCheck2 size={24} />
              </div>

              <h3 className="mt-5 text-lg font-bold">Easy Claim Submission</h3>

              <p className="mt-2 text-sm leading-6 text-base-content/60">
                Submit expense claims manually and keep supporting receipt
                information organized in one place.
              </p>
            </div>

            <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
                <CheckCircle2 size={24} />
              </div>

              <h3 className="mt-5 text-lg font-bold">Fast Approval Workflow</h3>

              <p className="mt-2 text-sm leading-6 text-base-content/60">
                Review pending claims and approve or reject expenses through a
                streamlined administrative workflow.
              </p>
            </div>

            <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-info/10 text-info">
                <TrendingUp size={24} />
              </div>

              <h3 className="mt-5 text-lg font-bold">Real-Time Visibility</h3>

              <p className="mt-2 text-sm leading-6 text-base-content/60">
                Monitor claim statuses, approval rates, pending workloads and
                total expenses from your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="border-t border-base-300">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="text-3xl font-bold">
            Ready to take control of your expenses?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base-content/60">
            Sign in to your ClaimFlow account and start managing your
            organizations expense claims.
          </p>

          <button
            type="button"
            onClick={handleGetStarted}
            className="btn btn-primary btn-lg mt-8 transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg"
          >
            Go to Dashboard
            <ArrowRight
              size={20}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </button>
        </div>
      </section>
    </main>
  );
}
