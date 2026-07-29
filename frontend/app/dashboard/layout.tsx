"use client";

import { ReactNode, useState } from "react";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import MobileSidebar from "@/components/layout/MobileSidebar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] =
    useState(false);

  function handleOpenMobileSidebar() {
    setIsMobileSidebarOpen(true);
  }

  function handleCloseMobileSidebar() {
    setIsMobileSidebarOpen(false);
  }

  return (
    <div className="min-h-screen bg-base-200">

      {/* ========================================
          DESKTOP SIDEBAR
      ======================================== */}

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <Sidebar />
      </aside>


      {/* ========================================
          MOBILE SIDEBAR
      ======================================== */}

      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={handleCloseMobileSidebar}
      />


      {/* ========================================
          MAIN CONTENT AREA
      ======================================== */}

      <div className="lg:pl-64">

        {/* ========================================
            NAVBAR
        ======================================== */}

        <header className="sticky top-0 z-30">
          <Navbar
            onMenuClick={handleOpenMobileSidebar}
          />
        </header>


        {/* ========================================
            PAGE CONTENT
        ======================================== */}

        <main className="p-4 sm:p-6">
          {children}
        </main>

      </div>

    </div>
  );
}