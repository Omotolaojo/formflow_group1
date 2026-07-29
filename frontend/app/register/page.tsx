
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        throw new Error(
          "NEXT_PUBLIC_API_URL is not configured"
        );
      }

      const response = await fetch(
        `${apiUrl}/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Registration failed"
        );
      }

      alert(
        "Account created successfully. Please sign in."
      );

      router.replace("/login");

    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to create account"
      );

    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-base-200">

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT SIDE */}

        <div className="hidden bg-primary p-12 text-primary-content lg:flex lg:flex-col lg:justify-between">

          <div>
            <Link
              href="/"
              className="text-2xl font-bold"
            >
              ClaimFlow
            </Link>
          </div>

          <div className="max-w-lg">

            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-content/10">
              <UserPlus size={30} />
            </div>

            <h1 className="text-4xl font-bold">
              Create your ClaimFlow account.
            </h1>

            <p className="mt-6 text-lg opacity-80">
              Join your organization and start
              managing your expense claims from
              one centralized dashboard.
            </p>

          </div>

          <p className="text-sm opacity-60">
            © 2026 ClaimFlow. All rights reserved.
          </p>

        </div>

        {/* REGISTER */}

        <div className="flex items-center justify-center p-6 sm:p-12">

          <div className="w-full max-w-md">

            {/* MOBILE LOGO */}

            <div className="mb-8 lg:hidden">

              <Link
                href="/"
                className="text-2xl font-bold text-primary"
              >
                ClaimFlow
              </Link>

            </div>

            <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">

              <div className="mb-8">

                <h2 className="text-2xl font-bold">
                  Create your account
                </h2>

                <p className="mt-2 text-sm text-base-content/60">
                  Enter your details to create a
                  ClaimFlow account.
                </p>

              </div>

              {/* ERROR */}

              {error && (
                <div className="alert alert-error mb-6">

                  <span>
                    {error}
                  </span>

                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* NAME */}

                <div className="form-control">

                  <label className="label">

                    <span className="label-text font-medium">
                      Full Name
                    </span>

                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Kunle Abowaba"
                    className="input input-bordered w-full"
                    required
                    disabled={isLoading}
                  />

                </div>

                {/* EMAIL */}

                <div className="form-control">

                  <label className="label">

                    <span className="label-text font-medium">
                      Email Address
                    </span>

                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="you@example.com"
                    className="input input-bordered w-full"
                    required
                    disabled={isLoading}
                  />

                </div>

                {/* PASSWORD */}

                <div className="form-control">

                  <label className="label">

                    <span className="label-text font-medium">
                      Password
                    </span>

                  </label>

                  <div className="relative">

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(e) =>
                        setPassword(
                          e.target.value
                        )
                      }
                      placeholder="Create a password"
                      className="input input-bordered w-full pr-12"
                      required
                      minLength={6}
                      disabled={isLoading}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (previous) =>
                            !previous
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>

                  </div>

                </div>

                {/* SUBMIT */}

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isLoading}
                >

                  {isLoading ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />

                      Creating account...
                    </>
                  ) : (
                    <>
                      <UserPlus size={18} />

                      Create Account
                    </>
                  )}

                </button>

              </form>

              {/* LOGIN LINK */}

              <p className="mt-6 text-center text-sm text-base-content/60">

                Already have an account?{" "}

                <Link
                  href="/login"
                  className="font-medium text-primary hover:underline"
                >
                  Sign in
                </Link>

              </p>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}

