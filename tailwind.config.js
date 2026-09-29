/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* ── Color system via CSS variables ── */
      colors: {
        /* Background layers */
        "bg-0":  "rgb(var(--bg-0) / <alpha-value>)",
        "bg-1":  "rgb(var(--bg-1) / <alpha-value>)",
        "bg-2":  "rgb(var(--bg-2) / <alpha-value>)",
        "bg-3":  "rgb(var(--bg-3) / <alpha-value>)",
        surface: "rgb(var(--bg-2) / <alpha-value>)",
        "surface-1": "rgb(var(--bg-2) / <alpha-value>)",
        "surface-2": "rgb(var(--bg-3) / <alpha-value>)",

        /* Border */
        border:        "rgb(var(--border) / <alpha-value>)",
        "border-subtle": "rgb(var(--border-subtle) / <alpha-value>)",

        /* Text */
        "text-primary":   "rgb(var(--text-primary) / <alpha-value>)",
        "text-secondary": "rgb(var(--text-secondary) / <alpha-value>)",
        "text-tertiary":  "rgb(var(--text-tertiary) / <alpha-value>)",
        "text-disabled":  "rgb(var(--text-disabled) / <alpha-value>)",
        muted:  "rgb(var(--text-tertiary) / <alpha-value>)",

        /* Accent ramp */
        accent:   "rgb(var(--accent-1) / <alpha-value>)",
        "accent-1": "rgb(var(--accent-1) / <alpha-value>)",
        "accent-2": "rgb(var(--accent-2) / <alpha-value>)",
        "accent-3": "rgb(var(--accent-3) / <alpha-value>)",
        "accent-4": "rgb(var(--accent-4) / <alpha-value>)",
        "accent-5": "rgb(var(--accent-5) / <alpha-value>)",
        "accent-6": "rgb(var(--accent-6) / <alpha-value>)",
        "accent-7": "rgb(var(--accent-7) / <alpha-value>)",
        "accent-8": "rgb(var(--accent-8) / <alpha-value>)",
        "accent-9": "rgb(var(--accent-9) / <alpha-value>)",

        /* Semantic */
        danger:  "rgb(var(--danger) / <alpha-value>)",
        warn:    "rgb(var(--warn) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
      },

      /* ── Font families ── */
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans:    ["var(--font-sans)",    "ui-sans-serif", "system-ui", "sans-serif"],
        mono:    ["var(--font-mono)",    "ui-monospace",  "monospace"],
      },

      /* ── Box shadows using CSS vars ── */
      boxShadow: {
        sm:   "var(--shadow-sm)",
        md:   "var(--shadow-md)",
        lg:   "var(--shadow-lg)",
        glow: "var(--shadow-glow)",
      },

      /* ── Border radius ── */
      borderRadius: {
        sm:   "var(--radius-sm)",
        DEFAULT: "var(--radius-md)",
        md:   "var(--radius-md)",
        lg:   "var(--radius-lg)",
        xl:   "var(--radius-xl)",
        full: "var(--radius-full)",
      },

      /* ── Transition timing ── */
      transitionTimingFunction: {
        "out-cubic":  "var(--ease-out-cubic)",
        "out-spring": "var(--ease-out-spring)",
        "in-out":     "var(--ease-in-out)",
      },

      /* ── Backdrop blur ── */
      backdropBlur: {
        xs: "4px",
        sm: "8px",
        md: "16px",
      },
    },
  },
  plugins: [],
};
