import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FAFCFD",
        "cream-2": "#EDF4F8",
        "cream-3": "#E2EDF3",
        ink: "#17232D",
        "ink-2": "#43515C",
        "ink-3": "#788893",
        line: "#D8E3EA",
        green: {
          DEFAULT: "#315F86",
          2: "#254B6B",
          3: "#E4EEF5",
        },
        puzzle: {
          blue: "#3478C7",
          red: "#D85A4A",
          yellow: "#F3C64F",
          green: "#4B9461",
        },
        brandblack: "#0F1922",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.4" }],
        sm: ["0.875rem", { lineHeight: "1.5" }],
        base: ["1rem", { lineHeight: "1.65" }],
        md: ["1.125rem", { lineHeight: "1.6" }],
        lg: ["1.25rem", { lineHeight: "1.55" }],
        xl: ["1.5rem", { lineHeight: "1.35" }],
        "2xl": ["2rem", { lineHeight: "1.2" }],
        "3xl": ["2.75rem", { lineHeight: "1.1" }],
        "4xl": ["3.75rem", { lineHeight: "1.02" }],
        "5xl": ["5rem", { lineHeight: "0.98" }],
        "6xl": ["6.5rem", { lineHeight: "0.96" }],
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "16px",
        xl: "28px",
      },
      maxWidth: {
        prose: "68ch",
        content: "1200px",
        wide: "1440px",
      },
      transitionTimingFunction: {
        soft: "cubic-bezier(.22, 1, .36, 1)",
      },
      transitionDuration: {
        "180": "180ms",
        "420": "420ms",
        "720": "720ms",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translate3d(0,0,0)" },
          "100%": { transform: "translate3d(-50%,0,0)" },
        },
        revealUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        drawUnderline: {
          "0%": { strokeDashoffset: "240" },
          "100%": { strokeDashoffset: "0" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "marquee-slow": "marquee 60s linear infinite",
        "reveal-up": "revealUp 420ms cubic-bezier(.22,1,.36,1) both",
        "fade-up": "fadeUp 420ms cubic-bezier(.22,1,.36,1) both",
        "draw-underline": "drawUnderline 900ms cubic-bezier(.22,1,.36,1) 180ms both",
      },
    },
  },
  plugins: [],
};

export default config;
