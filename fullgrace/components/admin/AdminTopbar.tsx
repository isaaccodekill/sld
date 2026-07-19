"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { therapist } from "@/lib/mock";
import { formatTodayLong } from "@/lib/format";

function breadcrumbs(pathname: string): string[] {
  if (pathname === "/admin") return ["Today"];
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
        <div className="flex min-w-0 items-center gap-2 text-sm">
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-ink-3">/</span>}
              <span className={`max-w-24 truncate sm:max-w-none ${i === crumbs.length - 1 ? "font-medium text-ink" : "text-ink-3"}`}>{c}</span>
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <Link data-tour="global-log-report" href="/admin/sessions/new" className="inline-flex h-9 items-center rounded-full bg-green px-3 text-xs font-medium text-white shadow-sm transition hover:bg-green-2 sm:px-4"><span className="sm:hidden">+ Report</span><span className="hidden sm:inline">+ Log report</span></Link>
        <button onClick={() => window.dispatchEvent(new Event("fullgrace:tour"))} className="inline-flex h-9 items-center rounded-full border border-line bg-white px-3 text-xs font-medium text-ink-2 transition hover:border-green/30 hover:text-green" aria-label="Start product tour"><span className="md:hidden">Tour</span><span className="hidden md:inline">Take a tour</span></button>
        <div className="hidden items-center gap-4 md:flex">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">{formatTodayLong()}</span>
          <div className="h-5 w-px bg-line" />
          <AuthStatus />
        </div>
      </div>
    </header>
  );
}

function AuthStatus() {
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
        <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
          {process.env.NEXT_PUBLIC_SUPABASE_URL ? "Secure session" : "Local setup mode"}
        </div>
      </div>
    </div>
  );
}
