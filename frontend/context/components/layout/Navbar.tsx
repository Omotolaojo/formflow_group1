"use client";

import {
  LogOut,
  User,
  Menu,
} from "lucide-react";

import ThemeToggle from "../ui/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";


type NavbarProps = {
  onMenuClick: () => void;
};

export default function Navbar({
  onMenuClick,
}: NavbarProps) {
  const {
    user,
  
  } = useAuth();

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-base-300 bg-base-100 px-4 sm:px-6">

      {/* LEFT SIDE */}

      <div className="flex items-center gap-3">

        {/* MOBILE MENU BUTTON */}

        <button
          type="button"
          onClick={onMenuClick}
          className="btn btn-ghost btn-square lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu size={24} />
        </button>

        <div>
          <h1 className="text-lg font-semibold">
            Dashboard
          </h1>
        </div>

      </div>

      {/* RIGHT SIDE */}

      <div className="flex items-center gap-2 sm:gap-4">

        {/* USER */}

        <div className="hidden items-center gap-2 text-sm sm:flex">
          <User size={16} />

         <span>
  {user?.name || "Guest"}
</span>
        </div>

        {/* THEME */}

        <ThemeToggle />

        {/* LOGOUT */}

        {/* <button
          type="button"
          onClick={handleLogout}
          className="btn btn-error btn-sm flex items-center gap-1"
        >
          <LogOut size={14} />

          <span className="hidden sm:inline">
            Logout
          </span>
        </button> */}

      </div>

    </header>
  );
}