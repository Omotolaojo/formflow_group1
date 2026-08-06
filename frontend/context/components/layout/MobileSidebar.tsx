"use client";

import Link from "next/link";

import {
  X,
  LayoutDashboard,
  FileText,
  Upload,
  ShieldCheck,
} from "lucide-react";

type MobileSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MobileSidebar({
  isOpen,
  onClose,
}: MobileSidebarProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">

      {/* BACKDROP */}

      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* SIDEBAR */}

      <aside className="relative z-10 flex h-full w-72 flex-col bg-base-100 shadow-xl">

        {/* HEADER */}

        <div className="flex h-16 items-center justify-between border-b border-base-300 px-5">

          <h2 className="text-lg font-bold">
            ExpenseAI
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-square"
            aria-label="Close navigation menu"
          >
            <X size={22} />
          </button>

        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 space-y-2 p-4">

          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex items-center gap-3 rounded-lg px-4 py-3 transition hover:bg-base-200"
          >
            <LayoutDashboard size={20} />

            <span>
              Dashboard
            </span>
          </Link>

          <Link
            href="/dashboard/claims"
            onClick={onClose}
            className="flex items-center gap-3 rounded-lg px-4 py-3 transition hover:bg-base-200"
          >
            <FileText size={20} />

            <span>
              Claims
            </span>
          </Link>

          <Link
            href="/dashboard/upload"
            onClick={onClose}
            className="flex items-center gap-3 rounded-lg px-4 py-3 transition hover:bg-base-200"
          >
            <Upload size={20} />

            <span>
              Upload
            </span>
          </Link>

          <Link
            href="/dashboard/admin"
            onClick={onClose}
            className="flex items-center gap-3 rounded-lg px-4 py-3 transition hover:bg-base-200"
          >
            <ShieldCheck size={20} />

            <span>
              Admin
            </span>
          </Link>

        </nav>

      </aside>

    </div>
  );
}