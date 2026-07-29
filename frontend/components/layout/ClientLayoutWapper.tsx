"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* DESKTOP SIDEBAR */}
      <aside className="w-64 bg-base-100 border-r p-4 hidden md:block">
        <h2 className="text-xl font-bold mb-6"> ExpenseAI</h2>
        <Sidebar />
      </aside>

      {/* MOBILE SIDEBAR */}
      {open && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-64 bg-base-100 p-4 shadow-lg z-50">
            <h2 className="text-xl font-bold mb-6"> ExpenseAI</h2>
            <Sidebar />
          </div>
          <div
            className="flex-1 bg-black/40 dynamic-backdrop"
            onClick={() => setOpen(false)}
          />
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col">
        {/* MOBILE MENU TRIGGER BAR */}
        <div className="md:hidden flex items-center px-4 pt-3">
          <button
            className="btn btn-ghost p-2"
            onClick={() => setOpen(true)}
            aria-label="Open Menu"
          >
            <Menu size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
