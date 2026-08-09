// components/ui/ThemeToggle.tsx
"use client";

import { useSyncExternalStore } from "react";
import { useThemeStore } from "@/store/useThemeStore";
import { Moon, Sun } from "lucide-react";

const emptySubscribe = () => () => {};

export default function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();

  // Safely check if we are hydrated on the client browser
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Structural fallback matching server HTML perfectly
  if (!isClient) {
    return (
      <button className="btn btn-sm" aria-label="Loading theme" disabled>
        <span className="invisible"><Moon /></span> 
      </button>
    );
  }

  return (
    <button
      className="btn btn-sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </button>
  );
}
