import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        bg:             "var(--color-bg)",
        surface:        "var(--color-surface)",
        "surface-raised": "var(--color-surface-raised)",
        border:         "var(--color-border)",
        "border-strong": "var(--color-border-strong)",
        text:           "var(--color-text)",
        "text-muted":   "var(--color-text-muted)",
        "text-faint":   "var(--color-text-faint)",
        accent:         "var(--color-accent)",
        "accent-dim":   "var(--color-accent-dim)",
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        sm:  "0.375rem",
        md:  "0.5rem",
        lg:  "0.75rem",
        xl:  "1rem",
        "2xl": "1.25rem",
      },
      animation: {
        "fade-up":    "fadeUp 400ms var(--ease-out) both",
        "fade-in":    "fadeIn 250ms var(--ease-out) both",
        "scale-in":   "scaleIn 300ms var(--ease-out) both",
        "slide-down": "slideDown 200ms var(--ease-out) both",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.97)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
        slideDown: {
          from: { opacity: "0", transform: "translateY(-8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
