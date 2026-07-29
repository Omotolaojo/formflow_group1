"use client";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { useState } from "react";

import { Toaster } from "react-hot-toast";

import { useThemeStore } from "@/store/useThemeStore";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () => new QueryClient()
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
        }}
      />

      {children}
    </QueryClientProvider>
  );
}