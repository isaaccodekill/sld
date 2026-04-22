import type { PuzzleColor } from "@/lib/tokens";
import { puzzleHex } from "@/lib/tokens";

type Props = {
  color: PuzzleColor;
  size?: number;
  className?: string;
};

export function PuzzleDot({ color, size = 12, className }: Props) {
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        background: puzzleHex[color],
      }}
    />
  );
}

/** Small stylised puzzle piece — used as a single-colour section accent. */
export function PuzzlePiece({ color, size = 22, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M3 5a2 2 0 0 1 2-2h4.5a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0 .5.5 0 0 1 .5-.5H19a2 2 0 0 1 2 2v4.5a.5.5 0 0 1-.5.5 1.5 1.5 0 1 0 0 3 .5.5 0 0 1 .5.5V19a2 2 0 0 1-2 2h-4.5a.5.5 0 0 1-.5-.5 1.5 1.5 0 1 0-3 0 .5.5 0 0 1-.5.5H5a2 2 0 0 1-2-2v-4.5a.5.5 0 0 1 .5-.5 1.5 1.5 0 1 0 0-3A.5.5 0 0 1 3 9.5V5Z"
        fill={puzzleHex[color]}
      />
    </svg>
  );
}
