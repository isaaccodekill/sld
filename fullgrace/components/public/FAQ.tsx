"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { NumberedMarker } from "@/components/ui/NumberedMarker";

type Item = { q: string; a: string };

// REPLACE BEFORE LAUNCH — therapist to confirm answers
const items: Item[] = [
  {
    q: "How do I know if my child needs therapy?",
    a: "Trust what you're noticing. You don't need a diagnosis or a referral to reach out — if something feels behind, different, or stuck, a conversation with us costs nothing and often clears things up quickly either way.",
  },
  {
    q: "How does intake work?",
    a: "Send us a WhatsApp or a form. We review every enquiry personally. Usually within a working day, we reach out to explore whether we're a good fit. If we are, we schedule an initial consultation. No waitlist games — we either have space or we tell you clearly when we will.",
  },
  {
    q: "What happens at a first consultation?",
    a: "A calm 45–60 minute session in our room. You and your child together. We play, we watch, we take notes. By the end, we'll share initial impressions and talk about whether (and how) a programme would help.",
  },
  {
    q: "How long does therapy usually take?",
    a: "It depends on the child. Short focused blocks (8–12 weeks) are common for articulation work. Longer horizons are normal for broader developmental goals. We review progress at the end of every term and adjust openly with you.",
  },
  {
    q: "Do you work with schools and paediatricians?",
    a: "Yes, when you'd like us to. With your permission we share progress notes with your child's school and coordinate directly with paediatricians. We find everyone lines up faster when we're all looking at the same picture.",
  },
  {
    q: "Where are you based?",
    a: "Lagos — our centre is in Ikoyi. We see clients in person. No online-only therapy at the moment; we think the room matters.",
  },
];

export function FAQ() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="py-16 md:py-28">
      <NumberedMarker n={7} label="FAQ" color="red" className="mb-6 md:mb-10" />

      <h2 id="faq-title" className="max-w-[22ch] font-display text-3xl font-medium leading-[1.1] tracking-[-0.02em] md:text-4xl">
        Questions parents ask us the most.
      </h2>

      <div className="mt-10 border-t border-line">
        {items.map((it, i) => (
          <Row key={it.q} idx={i + 1} item={it} />
        ))}
      </div>
    </section>
  );
}

function Row({ idx, item }: { idx: number; item: Item }) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  return (
    <div className="border-b border-line">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="group grid w-full grid-cols-[56px_1fr_auto] items-center gap-4 py-6 text-left"
      >
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-3">
          {String(idx).padStart(2, "0")} /
        </span>
        <span className="font-display text-xl font-medium text-ink md:text-2xl">{item.q}</span>
        <span aria-hidden className={`text-ink-3 transition-transform duration-180 ${open ? "rotate-45" : ""}`}>
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-[56px_1fr] gap-4 pb-7 pl-0">
              <span />
              <p className="max-w-prose text-base text-ink-2 md:text-md">{item.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
