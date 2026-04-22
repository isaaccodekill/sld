import type { Metadata } from "next";
import { NumberedMarker } from "@/components/ui/NumberedMarker";
import { BUSINESS_EMAIL, BUSINESS_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy · Fullgrace",
  description: "How Fullgrace stores and protects your family's information.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-content px-5 pt-10 md:px-8 md:pt-16">
      <div className="max-w-prose pb-24">
          <NumberedMarker n="00" label="Privacy" color="blue" className="mb-6 md:mb-10" />
          <h1 className="font-display text-[clamp(2.2rem,5vw,3.75rem)] font-medium leading-[1.04] tracking-[-0.02em]">
            How we handle your family's information.
          </h1>
          <p className="mt-4 text-sm text-ink-3">{/* REPLACE BEFORE LAUNCH — therapist to review */}Last updated: April 2026</p>

          <div className="prose-editorial mt-10 space-y-6 text-ink-2">
            <section>
              <h2 className="font-display text-xl text-ink">What we collect</h2>
              <p>
                When you send us a message, we collect the details you provide — your name, your contact
                information, your child's first name and age, and anything you write in the message body.
                When your child becomes a client, we also keep clinical notes from each session.
              </p>
            </section>
            <section>
              <h2 className="font-display text-xl text-ink">How we store it</h2>
              <p>
                All information is stored on encrypted infrastructure. Access is limited to the therapist
                treating your child. We do not sell, share, or lease information to third parties.
              </p>
            </section>
            <section>
              <h2 className="font-display text-xl text-ink">How we use AI</h2>
              <p>
                We use AI assistance to help the therapist synthesise session notes into progress summaries.
                Where AI is used, only structured clinical information is shared — your contact details are
                never sent to an AI system. Every AI-generated summary is reviewed and edited by the
                therapist before it's used in any parent-facing way.
              </p>
            </section>
            <section>
              <h2 className="font-display text-xl text-ink">Your rights</h2>
              <p>
                You can request a copy of your family's records at any time. You can also ask us to delete
                them. For anything privacy-related, email{" "}
                <a href={`mailto:${BUSINESS_EMAIL}`} className="text-green underline decoration-green/30 underline-offset-2 hover:decoration-green">
                  {BUSINESS_EMAIL}
                </a>{" "}
                and we'll respond within five working days.
              </p>
            </section>
            <section>
              <h2 className="font-display text-xl text-ink">Children's information</h2>
              <p>
                Because our clients are children, we take particular care. We never publish a child's full
                name, photograph, or identifying details without explicit written consent from a parent or
                guardian.
              </p>
            </section>
            <p className="text-sm text-ink-3">
              This policy applies to {BUSINESS_NAME}, Lagos, Nigeria.
            </p>
          </div>
      </div>
    </div>
  );
}
