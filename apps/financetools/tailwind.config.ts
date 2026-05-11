import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#6C3AED",
          light: "#F3EEFE",
          dark: "#2F1C6A",
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
          800: "#5B21B6",
          900: "#4C1D95",
          950: "#2E1065",
        },
        accent: "#059669",
        danger: "#DC2626",
        surface: {
          DEFAULT: "#FFFFFF",
          secondary: "#FAFAFA",
          dark: "#0F0622",
          "dark-secondary": "#1A0D3B",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        h1: ["2.5rem", { lineHeight: "1.15", fontWeight: "700", letterSpacing: "-0.025em" }],
        h2: ["1.75rem", { lineHeight: "1.25", fontWeight: "600", letterSpacing: "-0.02em" }],
        h3: ["1.125rem", { lineHeight: "1.4", fontWeight: "600" }],
        body: ["1rem", { lineHeight: "1.7", fontWeight: "400" }],
        small: ["0.75rem", { lineHeight: "1.5", fontWeight: "400" }],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        "soft": "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
        "card": "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05)",
        "card-hover": "0 10px 25px -5px rgba(108,58,237,0.1), 0 8px 10px -6px rgba(108,58,237,0.05)",
        "glow": "0 0 40px rgba(108,58,237,0.15)",
      },
    },
  },
  plugins: [],
};
export default config;
