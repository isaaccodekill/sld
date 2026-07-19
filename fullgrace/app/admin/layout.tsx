"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { ProductTour } from "@/components/admin/ProductTour";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", close);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", close); };
  }, [open]);

  return (
    <div className="min-h-screen bg-cream text-ink">
      <a href="#admin-main" className="skip-link">Skip to main content</a>
      <div className="flex min-h-screen">
        <div className="hidden w-60 shrink-0 border-r border-line md:block">
          <AdminSidebar />
        </div>

        {open && (
          <div className="fixed inset-0 z-40 md:hidden">
            <button
              aria-label="Close navigation"
              className="absolute inset-0 bg-brandblack/30"
              onClick={() => setOpen(false)}
            />
            <div role="dialog" aria-modal="true" aria-label="Admin navigation" className={cn("absolute inset-y-0 left-0 w-72 max-w-[86vw] border-r border-line bg-cream shadow-xl")}>
              <AdminSidebar onNavigate={() => setOpen(false)} />
            </div>
          </div>
        )}

        <div className="flex-1">
          <AdminTopbar onOpenSidebar={() => setOpen(true)} />
          <main id="admin-main" className="mx-auto max-w-wide p-4 pb-28 sm:p-5 sm:pb-28 md:p-8">{children}</main>
        </div>
      </div>
      <ProductTour />
      <AdminMobileNav />
    </div>
  );
}
