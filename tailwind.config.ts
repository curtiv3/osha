import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "hsl(var(--color-void))",
        surface: "hsl(var(--color-surface))",
        elevated: "hsl(var(--color-elevated))",
        "text-primary": "hsl(var(--color-text-primary))",
        "text-secondary": "hsl(var(--color-text-secondary))",
        "text-tertiary": "hsl(var(--color-text-tertiary))",
        "accent-warm": "hsl(var(--color-accent-warm))",
        "accent-cool": "hsl(var(--color-accent-cool))",
        "accent-dream": "hsl(var(--color-accent-dream))",
        border: "hsl(var(--color-border))",
        ring: "hsl(var(--color-ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Inter", "sans-serif"],
        data: ["var(--font-data)", "JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
