"use client";

import {
  FormEvent,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  Eye,
  EyeOff,
  Loader2,
  LogIn,
} from "lucide-react";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

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
      /**
       * Send login request to
       * Next.js API route.
       *
       * The Next.js API route will:
       *
       * 1. Call the Express backend.
       * 2. Receive the JWT.
       * 3. Store JWT in an HTTP-only cookie.
       */
      const response =
        await fetch(
          "/api/auth/login",
          {
            method: "POST",
credentials: "include",
            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              email:
                email.trim(),

              password,
            }),
          }
        );

      const result =
        await response.json();

      console.log(
        "Login response:",
        result
      );

      /**
       * Handle HTTP errors.
       */
      if (!response.ok) {
        throw new Error(
          result.message ||
            "Invalid email or password"
        );
      }

      /**
       * Handle API-level errors.
       */
      if (!result.success) {
        throw new Error(
          result.message ||
            "Login failed"
        );
      }

      /**
       * Authentication succeeded.
       *
       * The API route should have
       * already created the HTTP-only
       * token cookie.
       */

      console.log(
        "Authentication successful"
      );

      /**
       * Navigate to dashboard.
       *
       * Using window.location.href
       * forces a full browser request.
       *
       * This allows Next.js middleware
       * to immediately read the cookie.
       */
      window.location.href =
        "/dashboard";

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to login"
      );

    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* ERROR */}

      {error && (
        <div className="alert alert-error">
          <span>
            {error}
          </span>
        </div>
      )}

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
            setEmail(
              e.target.value
            )
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
            placeholder="Enter your password"
            className="input input-bordered w-full pr-12"
            required
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
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
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

            Signing in...
          </>
        ) : (
          <>
            <LogIn size={18} />

            Sign In
          </>
        )}
      </button>
    </form>
  );
}