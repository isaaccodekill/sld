"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { PuzzleColor } from "@/lib/tokens";
import { PuzzleDot } from "@/components/ui/PuzzleDot";
import { cn } from "@/lib/cn";
import { ParentEnquiryForm } from "./ParentEnquiryForm";
import { ReferrerForm } from "./ReferrerForm";
import { LinkButton } from "@/components/ui/Button";
import { BUSINESS_EMAIL, waLink } from "@/lib/constants";

type Topic = "quick" | "parent" | "referrer";

type Option = { id: Topic; label: string; blurb: string; color: PuzzleColor };

const options: Option[] = [
  { id: "quick", label: "I have a quick question", blurb: "One-line answer kind of thing.", color: "blue" },
  { id: "parent", label: "I'd like to talk about my child", blurb: "A proper conversation.", color: "yellow" },
  { id: "referrer", label: "I'm a referrer", blurb: "Doctor, school, or other professional.", color: "green" },
];

export function ContactTopicSelector() {
  const [topic, setTopic] = useState<Topic | null>(null);
  const reduced = useReducedMotion();

  return (
    <div>
      <div role="radiogroup" aria-label="What kind of message is this?" className="grid gap-3 md:grid-cols-3">
        {options.map((o) => {
          const active = topic === o.id;
          return (
            <button
              key={o.id}
              role="radio"
              aria-checked={active}
              onClick={() => setTopic(o.id)}
              className={cn(
                "group relative flex h-full flex-col justify-between rounded-xl border bg-cream p-5 text-left transition-all duration-180 ease-soft",
                active
                  ? "border-green shadow-[0_0_0_3px_rgba(47,93,58,0.15)]"
                  : "border-line hover:border-ink/30",
              )}
            >
              <div>
                <div className="flex items-center gap-2">
                  <PuzzleDot color={o.color} size={10} />
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
                    Path {options.indexOf(o) + 1}
                  </span>
                </div>
                <div className="mt-4 font-display text-xl leading-tight">{o.label}</div>
                <div className="mt-1 text-sm text-ink-3">{o.blurb}</div>
              </div>
              <div className="mt-4 text-sm text-green group-hover:text-green-2">
                {active ? "Selected" : "Choose →"}
              </div>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {topic === "quick" && (
          <motion.div
            key="quick"
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 rounded-xl border border-line bg-cream-2/40 p-6 md:p-8"
          >
            <h3 className="font-display text-2xl">WhatsApp is the fastest path.</h3>
            <p className="mt-2 max-w-prose text-ink-2">
              For a quick question, you'll usually get an answer the same day.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <LinkButton
                href={waLink("Hi Fullgrace, quick question:")}
                target="_blank"
                rel="noopener"
                variant="primary"
                size="md"
              >
                Chat on WhatsApp
              </LinkButton>
              <LinkButton href={`mailto:${BUSINESS_EMAIL}`} variant="outline" size="md">
                Email us
              </LinkButton>
            </div>
          </motion.div>
        )}
        {topic === "parent" && (
          <motion.div
            key="parent"
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10"
          >
            <ParentEnquiryForm />
          </motion.div>
        )}
        {topic === "referrer" && (
          <motion.div
            key="referrer"
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10"
          >
            <ReferrerForm />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
