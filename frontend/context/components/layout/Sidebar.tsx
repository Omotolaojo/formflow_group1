"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  FileText,
  Upload,
  Settings,
  LogOut,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";




export default function Sidebar() {
  const pathname = usePathname();

  const { user, loading } = useAuth();

  /**
   * ============================================================
   * BASE NAVIGATION
   * ============================================================
   *
   * Available to every authenticated user.
   */

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Claims",
      href: "/dashboard/claims",
      icon: FileText,
    },
    {
      name: "Upload Receipt",
      href: "/dashboard/upload",
      icon: Upload,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  /**
   * ============================================================
   * ADMIN NAVIGATION
   * ============================================================
   *
   * Only authenticated administrators
   * can see these links.
   */

  if (!loading && user?.role === "ADMIN") {
    navigation.push(
      {
        name: "Admin",
        href: "/dashboard/admin",
        icon: ShieldCheck,
      },
      // {
      //   name: "Users",
      //   href: "/dashboard/admin/users",
      //   icon: Users,
      // },
    );
  }

  /**
   * ============================================================
   * LOGOUT
   * ============================================================
   */

async function handleLogout() {
  try {
    console.log("[Logout] Starting logout...");

    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
      cache: "no-store",
    });

    console.log("[Logout] HTTP status:", response.status);
    console.log("[Logout] HTTP status text:", response.statusText);

    const responseText = await response.text();

    console.log("[Logout] Raw response:", responseText);

    let result: {
      success?: boolean;
      message?: string;
    } = {};

    try {
      if (responseText) {
        result = JSON.parse(responseText);
      }
    } catch (parseError) {
      console.error(
        "[Logout] Failed to parse API response:",
        parseError
      );
    }

    console.log("[Logout] Parsed response:", result);

    if (!response.ok) {
      throw new Error(
        result.message ||
          `Logout API failed with HTTP ${response.status}`
      );
    }

    console.log("[Logout] Logout successful");

    window.location.href = "/login";
  } catch (error) {
    console.error("[Logout] Logout error:", error);
  }
}
  return (
    <div className="flex h-full flex-col">
      {/* ====================================================== */}
      {/* SIDEBAR HEADER */}
      {/* ====================================================== */}

      <div className="border-b border-base-300 px-6 py-5">
        <h2 className="text-lg font-bold">ExpenseAI</h2>

        <p className="mt-1 text-xs text-base-content/50">Expense Management</p>
      </div>

      {/* ====================================================== */}
      {/* NAVIGATION */}
      {/* ====================================================== */}

      <nav className="flex-1 overflow-y-auto p-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-base-content/40">
          Workspace
        </p>

        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            /**
             * Dashboard should only be active
             * on the exact /dashboard path.
             *
             * Other links are active when the
             * current path starts with their
             * href.
             */

            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : item.href === "/dashboard/admin"
                  ? pathname === "/dashboard/admin"
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                    flex items-center gap-3
                    rounded-xl px-3 py-3
                    text-sm font-medium
                    transition-all
                    ${
                      isActive
                        ? "bg-primary text-primary-content shadow-sm"
                        : "text-base-content/60 hover:bg-base-200 hover:text-base-content"
                    }
                  `}
              >
                <Icon size={19} />

                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ====================================================== */}
      {/* SIDEBAR FOOTER */}
      {/* ====================================================== */}

      <div className="border-t border-base-300 p-4">
        {/* USER INFORMATION */}

        {!loading && user && (
          <div className="mb-3 rounded-xl bg-base-200 px-3 py-3">
            <p className="truncate text-sm font-medium">{user.name}</p>

            <p className="truncate text-xs text-base-content/50">
              {user.email}
            </p>

            {user.role === "ADMIN" && (
              <span className="badge badge-primary badge-sm mt-2">
                Administrator
              </span>
            )}
          </div>
        )}

        {/* LOGOUT */}

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-error transition-colors hover:bg-error/10"
        >
          <LogOut size={19} />

          <span>Logout</span>
        </button>
   
      </div>
    </div>
  );
}
