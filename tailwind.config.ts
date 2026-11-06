import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        "surface-raised": "var(--color-surface-raised)",
        border: "var(--color-border)",
        "border-strong": "var(--color-border-strong)",
        text: "var(--color-text)",
        "text-muted": "var(--color-text-muted)",
        "text-faint": "var(--color-text-faint)",
        accent: "var(--color-accent)",
        "accent-dim": "var(--color-accent-dim)",
        // Remap the neutral scale so every tool page lands on the approved
        // dark backgrounds (B4) without touching 29 files.
        neutral: {
          50: "#fafafa",
          100: "#f4f4f4",
          200: "#e4e4e4",
          300: "#cfcfcf",
          400: "#a8a8a8",
          500: "#8a8a8a",
          600: "#6b6b6b",
          700: "#313131",
          800: "#272727",
          900: "#181818",
          950: "#000000",
        },
      },
      transitionTimingFunction: {
        base: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
