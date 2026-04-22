import { cn } from "@/lib/cn";
import type { PuzzleColor } from "@/lib/tokens";

type Props = {
  color?: PuzzleColor | "green" | "ink";
  children: React.ReactNode;
  className?: string;
};

const colorMap: Record<string, string> = {
  blue: "bg-puzzle-blue/12 text-puzzle-blue border-puzzle-blue/25",
  red: "bg-puzzle-red/12 text-puzzle-red border-puzzle-red/25",
  yellow: "bg-puzzle-yellow/20 text-ink border-puzzle-yellow/40",
  green: "bg-green-3 text-green-2 border-green/25",
  ink: "bg-cream-2 text-ink-2 border-line",
};

export function Chip({ color = "ink", children, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[9999px] border px-2.5 py-0.5 text-xs font-medium tracking-tight",
        colorMap[color],
        className,
      )}
    >
      {children}
    </span>
  );
}
