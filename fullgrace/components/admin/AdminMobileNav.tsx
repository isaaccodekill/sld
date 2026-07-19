"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Today", icon: "⌂" },
  { href: "/admin/calendar", label: "Calendar", icon: "□" },
  { href: "/admin/sessions/new", label: "Report", icon: "+", primary: true },
  { href: "/admin/clients", label: "Clients", icon: "○" },
  { href: "/admin/enquiries", label: "Inbox", icon: "✉" },
];

export function AdminMobileNav() {
  const pathname = usePathname() ?? "/admin";
  return (
    <nav aria-label="Mobile admin navigation" className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-[max(.5rem,env(safe-area-inset-left))] pb-[max(.35rem,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-10px_35px_rgba(23,35,45,.1)] backdrop-blur-md md:hidden">
      <ul className="grid grid-cols-5">
        {items.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href.replace("/new", ""));
          return <li key={item.href}><Link href={item.href} aria-current={active ? "page" : undefined} className={`flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl text-[10px] font-medium ${active ? "text-green-2" : "text-ink-3"}`}><span aria-hidden className={`${item.primary ? "-mt-5 flex h-11 w-11 items-center justify-center rounded-full bg-green text-2xl text-white shadow-lg ring-4 ring-white" : "text-lg leading-none"}`}>{item.icon}</span><span>{item.label}</span></Link></li>;
        })}
      </ul>
    </nav>
  );
}
