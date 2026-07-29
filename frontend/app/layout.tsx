import type { Metadata } from "next";

import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import "./globals.css";

import Providers from "./providers";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClaimFlow",
  description:
    "Manage your expenses easily",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-base-200 text-base-content antialiased">
        <Providers>
           <AuthProvider>
          {children}
        </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}