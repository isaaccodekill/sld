import { cn } from "@/lib/cn";
import { PuzzleDot } from "./PuzzleDot";
import type { PuzzleColor } from "@/lib/tokens";

type Props = {
  n: string | number;
  label: string;
  color?: PuzzleColor;
  className?: string;
};

export function NumberedMarker({ n, label, color, className }: Props) {
  const num = typeof n === "number" ? String(n).padStart(2, "0") : n;
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-3">{`{${num}}`}</span>
      {color && <PuzzleDot color={color} size={8} />}
      <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-2">{label}</span>
    </div>
  );
}
