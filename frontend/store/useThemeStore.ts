// app/store/useThemeStore.ts
import { create } from "zustand";

type Theme = "light" | "dark";

type ThemeStore = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export const useThemeStore = create<ThemeStore>((set) => {
  // 1. Get safe initial state
  const initialTheme = typeof window !== "undefined" 
    ? ((localStorage.getItem("theme") as Theme) || "light") 
    : "light";

  // 2. Apply theme directly to DOM immediately if running in the browser
  if (typeof window !== "undefined") {
    document.documentElement.setAttribute("data-theme", initialTheme);
    // If you use Tailwind classes instead of DaisyUI attributes, use this instead:
    // document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }

  return {
    theme: initialTheme,

    setTheme: (theme: Theme) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", theme);
        document.documentElement.setAttribute("data-theme", theme);
        // document.documentElement.classList.toggle("dark", theme === "dark");
      }
      set({ theme });
    },
  };
});
