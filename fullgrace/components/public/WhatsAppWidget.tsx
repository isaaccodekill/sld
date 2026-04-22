"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { BUSINESS_HOURS, waLink } from "@/lib/constants";
import { PuzzlePiece } from "@/components/ui/PuzzleDot";

const DISMISS_KEY = "fg_wa_dismissed";

export function WhatsAppWidget() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const dismissed = typeof window !== "undefined" && sessionStorage.getItem(DISMISS_KEY);
    if (dismissed) return;
    const t = window.setTimeout(() => setVisible(true), reduced ? 0 : 800);
    return () => window.clearTimeout(t);
  }, [reduced]);

  const dismiss = () => {
    setVisible(false);
    setOpen(false);
    sessionStorage.setItem(DISMISS_KEY, "1");
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3 md:bottom-6 md:right-6">
      <AnimatePresence>
        {open && (
          <motion.div
            key="card"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-[min(88vw,340px)] overflow-hidden rounded-xl border border-line bg-cream shadow-2xl"
          >
            <div className="bg-green px-4 py-4 text-cream">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-cream/15 p-1.5">
                  <PuzzlePiece color="yellow" size={20} />
                </div>
                <div>
                  <div className="font-display text-lg leading-tight">Hi 👋 — got a question?</div>
                  <div className="mt-0.5 text-sm text-cream/85">
                    Message us and we'll reply, usually within a few hours.
                  </div>
                </div>
              </div>
              <div className="mt-3 inline-flex items-center gap-2 rounded-md bg-cream/10 px-2 py-1 text-[11px] font-mono uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-puzzle-yellow" />
                {BUSINESS_HOURS}
              </div>
            </div>
            <div className="p-3">
              <div className="grid gap-2">
                <Chip
                  href={waLink("Hi Fullgrace — I'd like to talk about my child.")}
                  text="I'd like to talk about my child"
                />
                <Chip
                  href={waLink("Hi Fullgrace — I have a question about your programs.")}
                  text="I have a question about your programs"
                />
                <Chip
                  href={waLink("Hi Fullgrace —")}
                  text="Type your own message"
                  tone="outline"
                />
              </div>
              <button
                onClick={dismiss}
                className="mt-3 block w-full rounded-md py-1 text-center text-xs text-ink-3 hover:text-ink"
              >
                Hide for this visit
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close WhatsApp widget" : "Open WhatsApp widget"}
        aria-expanded={open}
        initial={reduced ? false : { opacity: 0, y: 12, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "group relative flex h-14 w-14 items-center justify-center rounded-full bg-green text-cream shadow-xl ring-1 ring-green-2/40 transition-transform duration-180 ease-soft hover:scale-105",
        )}
      >
        <span aria-hidden className="absolute inset-0 rounded-full bg-green animate-ping opacity-15 motion-reduce:hidden" />
        <PuzzlePiece color="yellow" size={26} />
      </motion.button>
    </div>
  );
}

function Chip({ href, text, tone = "solid" }: { href: string; text: string; tone?: "solid" | "outline" }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className={cn(
        "block rounded-md border px-3 py-2.5 text-sm transition-colors",
        tone === "solid"
          ? "border-line bg-cream-2 text-ink hover:border-green/40 hover:bg-green-3"
          : "border-dashed border-line text-ink-2 hover:border-ink-2 hover:text-ink",
      )}
    >
      {text}
      <span aria-hidden className="float-right text-ink-3">→</span>
    </a>
  );
}
