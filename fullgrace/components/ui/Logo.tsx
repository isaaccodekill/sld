import Image from "next/image";
import { cn } from "@/lib/cn";

export function LogoMark({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <Image
      src="/logo/logo-mark.png"
      width={size}
      height={size}
      alt="Fullgrace"
      className={cn("select-none", className)}
      priority
    />
  );
}

export function LogoLockup({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark size={36} />
      <div className="leading-tight">
        <div className="font-display text-base text-ink">Fullgrace</div>
        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">Therapy & Learning</div>
      </div>
    </div>
  );
}
