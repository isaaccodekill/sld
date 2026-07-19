"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { LogoLockup } from "@/components/ui/Logo";
import { LinkButton } from "@/components/ui/Button";
import { waLink } from "@/lib/constants";

const links = [
  { href: "/#approach", label: "Approach" },
  { href: "/#who-we-help", label: "Who we help" },
  { href: "/#programs", label: "Programs" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-colors duration-420 ease-soft",
          scrolled ? "border-b border-line bg-cream/85 backdrop-blur-md" : "bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-wide items-center justify-between px-5 md:h-20 md:px-8">
          <Link href="/" aria-label="Fullgrace home" className="-my-2">
            <LogoLockup />
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-ink-2 transition-colors hover:text-ink"
              >
                {l.label}
              </Link>
            ))}
            <LinkButton
              href={waLink("Hi Fullgrace, I'd like to chat.")}
              target="_blank"
              rel="noopener"
              size="sm"
              variant="primary"
              iconLeft={<span aria-hidden>●</span>}
            >
              WhatsApp us
            </LinkButton>
          </nav>
          <button
            className="rounded-md border border-line px-3 py-2 text-sm md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            Menu
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-cream p-5 md:hidden">
          <div className="flex items-center justify-between">
            <LogoLockup />
            <button
              onClick={() => setOpen(false)}
              className="rounded-md border border-line px-3 py-2 text-sm"
              aria-label="Close menu"
            >
              Close
            </button>
          </div>
          <nav className="mt-16 flex flex-col gap-7">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-display text-3xl text-ink"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto pb-8">
            <LinkButton
              href={waLink("Hi Fullgrace, I'd like to chat.")}
              target="_blank"
              rel="noopener"
              variant="primary"
              size="lg"
              className="w-full"
            >
              WhatsApp us
            </LinkButton>
          </div>
        </div>
      )}
    </>
  );
}
