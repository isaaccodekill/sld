"use client";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream text-ink">
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
            <div className={cn("absolute inset-y-0 left-0 w-64 border-r border-line bg-cream shadow-xl")}>
              <AdminSidebar onNavigate={() => setOpen(false)} />
            </div>
          </div>
        )}

        <div className="flex-1">
          <AdminTopbar onOpenSidebar={() => setOpen(true)} />
          <main className="mx-auto max-w-wide p-5 md:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
