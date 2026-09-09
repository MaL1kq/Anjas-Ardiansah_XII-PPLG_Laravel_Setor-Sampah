import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F7F8F4",
        ink: "#16211B",
        line: "#E3E7DE",
        brand: {
          50: "#EAF3EC",
          100: "#CFE6D5",
          400: "#4C8F6C",
          500: "#2E6B4E",
          600: "#245439",
        },
        organik: "#2E6B4E",
        anorganik: "#D9A02A",
        b3: "#B8433A",
        residu: "#5B6660",
      },
      fontFamily: {
        display: ["var(--font-sora)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        card: "10px",
      },
    },
  },
  plugins: [],
};
export default config;
