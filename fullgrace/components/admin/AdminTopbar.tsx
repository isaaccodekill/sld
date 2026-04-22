"use client";
import { usePathname } from "next/navigation";
import { therapist } from "@/lib/mock";
import { formatTodayLong } from "@/lib/format";

function breadcrumbs(pathname: string): string[] {
  if (pathname === "/admin") return ["Dashboard"];
  const parts = pathname.replace("/admin", "").split("/").filter(Boolean);
  return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1));
}

export function AdminTopbar({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const pathname = usePathname() ?? "/admin";
  const crumbs = breadcrumbs(pathname);
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-line bg-cream/85 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          aria-label="Open navigation"
          className="rounded-md border border-line px-2.5 py-1.5 text-xs md:hidden"
        >
          Menu
        </button>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-ink-3">/</span>}
              <span className={i === crumbs.length - 1 ? "font-medium text-ink" : "text-ink-3"}>{c}</span>
            </span>
          ))}
        </div>
      </div>
      <div className="hidden items-center gap-4 md:flex">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">{formatTodayLong()}</span>
        <div className="h-5 w-px bg-line" />
        <MockAuthToggle />
      </div>
    </header>
  );
}

function MockAuthToggle() {
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex h-8 w-8 items-center justify-center rounded-full bg-green text-xs font-medium text-cream"
        aria-hidden
      >
        {therapist.name
          .split(" ")
          .map((s) => s[0])
          .join("")}
      </div>
      <div className="text-sm">
        <div className="leading-tight text-ink">{therapist.name}</div>
        <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">Signed in (mock)</div>
      </div>
    </div>
  );
}
