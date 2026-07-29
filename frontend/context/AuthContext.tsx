
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt?: string;
  updatedAt?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

const AuthContext =
  createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  /**
   * ============================================================
   * FETCH CURRENT USER
   * ============================================================
   *
   * Authentication is handled entirely by the
   * HTTP-only cookie.
   *
   * The browser automatically sends the cookie
   * with credentials: "include".
   */
  const refreshUser =
    useCallback(async (): Promise<void> => {
      try {
        const response = await fetch(
          "/api/auth/me",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        /**
         * A 401 simply means the user is
         * not authenticated.
         */
        if (response.status === 401) {
          setUser(null);
          return;
        }

        const data =
          await response.json();

        if (
          response.ok &&
          data.success &&
          data.user
        ) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error(
          "Failed to fetch current user:",
          error
        );

        setUser(null);
      } finally {
        setLoading(false);
      }
    }, []);

  /**
   * ============================================================
   * INITIAL AUTHENTICATION CHECK
   * ============================================================
   *
   * The effect only subscribes/starts the asynchronous
   * authentication check.
   *
   * We do not directly call refreshUser() in the
   * effect body.
   */
  useEffect(() => {
    let cancelled = false;

    const loadUser = async () => {
      try {
        const response = await fetch(
          "/api/auth/me",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        if (cancelled) {
          return;
        }

        if (response.status === 401) {
          setUser(null);
          setLoading(false);
          return;
        }

        const data =
          await response.json();

        if (
          response.ok &&
          data.success &&
          data.user
        ) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to load current user:",
            error
          );

          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}

