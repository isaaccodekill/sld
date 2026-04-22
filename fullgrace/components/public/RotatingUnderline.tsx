"use client";
import type { PuzzleColor } from "@/lib/tokens";
import { puzzleHex } from "@/lib/tokens";

type Props = {
  color: PuzzleColor;
  children: React.ReactNode;
};

export function RotatingUnderline({ color, children }: Props) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      <span className="relative z-10">{children}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 100 12"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-[-0.18em] h-[0.36em] w-full"
      >
        <path
          d="M1 7 C 15 2, 35 11, 52 5 S 85 9, 99 4"
          fill="none"
          stroke={puzzleHex[color]}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: 0.9 }}
        />
      </svg>
    </span>
  );
}
