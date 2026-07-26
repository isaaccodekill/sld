import { cn } from "@/lib/cn";

type Props = {
  tone?: "neutral" | "good" | "warn" | "admin" | "green";
  children: React.ReactNode;
  className?: string;
};

const toneMap: Record<NonNullable<Props["tone"]>, string> = {
  neutral: "bg-white text-ink-2 border-line before:bg-ink-3",
  good: "bg-[#F1F9F3] text-[#267444] border-[#CBE3D2] before:bg-[#2D9252]",
  warn: "bg-[#FFF8E7] text-[#7D5A0A] border-[#EED89E] before:bg-[#D7A72A]",
  admin: "bg-[#F2F3F4] text-ink-2 border-ink-3/20 before:bg-ink-3",
  green: "bg-green-3 text-green-2 border-green/20 before:bg-green",
};

export function Tag({ tone = "neutral", children, className }: Props) {
  return (
    <span className={cn("inline-flex min-h-7 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize leading-none tracking-[0.01em] shadow-[0_1px_2px_rgba(23,35,45,0.04)] before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full", toneMap[tone], className)}>
      {children}
    </span>
  );
}
