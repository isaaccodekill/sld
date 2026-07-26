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
    <div className={cn("flex items-center gap-3", className)}>
      <LogoMark size={44} />
      <div className="leading-tight">
        <div className="font-display text-lg text-ink">Fullgrace</div>
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">Therapy & Learning</div>
      </div>
    </div>
  );
}
