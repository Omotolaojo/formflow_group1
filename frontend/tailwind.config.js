import daisyui from "daisyui";

module.exports = {
content: [
  "./app/**/*.{js,ts,jsx,tsx}",
  "./pages/**/*.{js,ts,jsx,tsx}",
  "./components/**/*.{js,ts,jsx,tsx}",
],
  theme: {
  extend: {
    colors: {
      primary: "#7c3aed",
      secondary: "#06b6d4",
      accent: "#22c55e",
      dark: "#0a0a0a",
    },
    backdropBlur: {
      xs: "2px",
    },
  },
},
plugins: [daisyui],
  daisyui: {
    themes: ["light", "dark"],
  },
};