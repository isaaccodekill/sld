"use client";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import type { PuzzleColor } from "@/lib/tokens";
import { puzzleHex } from "@/lib/tokens";

type Props = {
  color: PuzzleColor | "cream";
  children: React.ReactNode;
  delay?: number;
};

export function RotatingUnderline({ color, children, delay = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.7 });
  const reducedMotion = useReducedMotion();
  const stroke = color === "cream" ? "currentColor" : puzzleHex[color];

  return (
    <span ref={ref} className="relative inline-block whitespace-nowrap">
      <span className="relative z-10">{children}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 100 12"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-[-0.2em] h-[0.38em] w-full overflow-visible"
      >
        <motion.path
          d="M1 7 C 15 2, 35 11, 52 5 S 85 9, 99 4"
          fill="none"
          stroke={stroke}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reducedMotion ? false : { pathLength: 0, opacity: 0.25 }}
          animate={inView ? { pathLength: 1, opacity: color === "cream" ? 0.62 : 0.88 } : undefined}
          transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    </span>
  );
}
