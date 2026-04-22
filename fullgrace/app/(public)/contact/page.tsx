import type { Metadata } from "next";
import { NumberedMarker } from "@/components/ui/NumberedMarker";
import { ContactTopicSelector } from "@/components/public/ContactTopicSelector";
import { FAQ } from "@/components/public/FAQ";

export const metadata: Metadata = {
  title: "Contact · Fullgrace",
  description: "Start a conversation with us — usually a reply within one working day.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-content px-5 pt-10 md:px-8 md:pt-16">
      <section className="pb-12 md:pb-20">
        <NumberedMarker n="00" label="Contact" color="green" className="mb-6 md:mb-10" />
        <h1 className="max-w-[18ch] font-display text-[clamp(2.4rem,6vw,4.5rem)] font-medium leading-[1.04] tracking-[-0.02em]">
          Tell us a little about your child.
        </h1>
        <p className="mt-6 max-w-prose text-md text-ink-2">
          We reply personally to every enquiry — usually within one working day — to talk through whether we're a good
          fit. Sending a message isn't a booking; it's the start of a conversation.
        </p>
        <p className="mt-3 max-w-prose text-sm text-ink-3">
          The fastest way to reach us is WhatsApp.
        </p>
      </section>

      <section aria-labelledby="topic-title" className="pb-20">
        <h2 id="topic-title" className="font-mono text-xs uppercase tracking-[0.18em] text-ink-3">
          What kind of conversation is this?
        </h2>
        <div className="mt-5">
          <ContactTopicSelector />
        </div>
      </section>

      <FAQ />
    </div>
  );
}
