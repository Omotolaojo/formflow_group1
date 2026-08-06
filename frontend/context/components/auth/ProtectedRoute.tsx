"use client";

import {
  ReactNode,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { getToken } from "@/lib/auth";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const router = useRouter();

  // Initialize state directly; during SSR it's false, on client mount it evaluates.
  // Alternatively, use a standard client-only check.
  const [hasMounted, setHasMounted] = useState(false);

 useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasMounted(true);

    const token = getToken();

    if (!token) {
      router.replace("/login");
    }
  }, [router]);
  /**
   * Prevent rendering protected content
   * during the initial server/client render.
   */
  if (!hasMounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary" />
          <p className="mt-4 text-sm text-base-content/60">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  const token = getToken();

  if (!token) {
    return null;
  }

  return <>{children}</>;
}