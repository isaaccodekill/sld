"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { LogoLockup } from "@/components/ui/Logo";
import { PuzzleDot } from "@/components/ui/PuzzleDot";

const items = [
  { href: "/admin", label: "Dashboard", match: "/admin" },
  { href: "/admin/enquiries", label: "Enquiries", match: "/admin/enquiries", badge: 3 },
  { href: "/admin/clients", label: "Clients", match: "/admin/clients" },
  { href: "/admin/sessions", label: "Sessions", match: "/admin/sessions" },
  { href: "/admin/reports", label: "Reports", match: "/admin/reports" },
  { href: "/admin/settings", label: "Settings", match: "/admin/settings" },
];

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-full flex-col bg-cream">
      <div className="px-5 py-5">
        <Link href="/admin" onClick={onNavigate} className="inline-block" aria-label="Fullgrace admin">
          <LogoLockup />
        </Link>
      </div>
      <nav className="mt-2 flex-1 px-2">
        <ul className="space-y-0.5">
          {items.map((it) => {
            const active =
              it.match === "/admin" ? pathname === "/admin" : pathname?.startsWith(it.match);
            return (
              <li key={it.href}>
                <Link
                  href={it.href}
                  onClick={onNavigate}
                  className={cn(
                    "group relative flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-green-3 font-medium text-green-2"
                      : "text-ink-2 hover:bg-cream-2 hover:text-ink",
                  )}
                >
                  <span className="flex items-center gap-3">
                    {active && (
                      <span
                        aria-hidden
                        className="absolute left-0 top-1/2 h-5 -translate-y-1/2 rounded-r-md bg-green"
                        style={{ width: 3 }}
                      />
                    )}
                    {it.label}
                  </span>
                  {it.badge && (
                    <span className="ml-3 inline-flex h-5 min-w-[20px] items-center justify-center rounded-[9999px] bg-puzzle-red/15 px-1.5 text-[10px] font-medium text-puzzle-red">
                      {it.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t border-line px-4 py-4 text-[11px] font-mono uppercase tracking-[0.14em] text-ink-3">
        <div className="flex items-center gap-2">
          <PuzzleDot color="green" size={6} />
          Prototype — no backend
        </div>
      </div>
    </aside>
  );
}
