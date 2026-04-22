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
        cream: "#F7F3EC",
        "cream-2": "#F1EADC",
        "cream-3": "#ECE2CF",
        ink: "#1F1B16",
        "ink-2": "#4A433B",
        "ink-3": "#8A8278",
        line: "#E3DACB",
        green: {
          DEFAULT: "#2F5D3A",
          2: "#264B2F",
          3: "#E6EEE7",
        },
        puzzle: {
          blue: "#2E6FC7",
          red: "#D64438",
          yellow: "#F5C23A",
          green: "#2A8B3D",
        },
        brandblack: "#0B0A08",
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
      },
    },
  },
  plugins: [],
};

export default config;
