"use client";
import { useEffect } from "react";
import { cn } from "@/lib/cn";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export function Dialog({ open, onClose, title, children, className }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 bg-brandblack/40 backdrop-blur-sm"
      />
      <div className={cn("relative w-full max-w-lg rounded-xl border border-line bg-cream p-6 shadow-2xl", className)}>
        {title && <h2 className="mb-4 font-display text-xl">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
