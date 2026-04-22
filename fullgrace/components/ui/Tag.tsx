import { cn } from "@/lib/cn";

type Props = {
  tone?: "neutral" | "good" | "warn" | "admin" | "green";
  children: React.ReactNode;
  className?: string;
};

const toneMap: Record<NonNullable<Props["tone"]>, string> = {
  neutral: "bg-cream-2 text-ink-2 border-line",
  good: "bg-puzzle-green/12 text-puzzle-green border-puzzle-green/25",
  warn: "bg-puzzle-yellow/20 text-ink border-puzzle-yellow/40",
  admin: "bg-ink-3/12 text-ink-2 border-ink-3/25",
  green: "bg-green-3 text-green-2 border-green/25",
};

export function Tag({ tone = "neutral", children, className }: Props) {
  return (
    <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium", toneMap[tone], className)}>
      {children}
    </span>
  );
}
