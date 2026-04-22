import { NumberedMarker } from "@/components/ui/NumberedMarker";
import { LinkButton } from "@/components/ui/Button";
import { RotatingUnderline } from "./RotatingUnderline";
import { waLink } from "@/lib/constants";

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="pb-8 md:pb-16">
      <NumberedMarker n={1} label="Introduction" color="blue" className="mb-6 md:mb-10" />
      <h1
        id="hero-title"
        className="font-display text-[clamp(2.4rem,6.2vw,5rem)] font-medium leading-[1.02] tracking-[-0.02em] text-ink"
      >
        Hi, we're Fullgrace — a therapy and learning centre in Lagos helping children{" "}
        <RotatingUnderline color="blue">find their voice</RotatingUnderline>, build{" "}
        <RotatingUnderline color="yellow">self-help skills</RotatingUnderline>, and move through{" "}
        <RotatingUnderline color="red">difficulty</RotatingUnderline> with support.
      </h1>

      <p className="mt-8 max-w-prose text-md text-ink-2 md:mt-10">
        We work with children who have speech and language delays, autism, and Down's Syndrome.
        Our programmes blend the Montessori method with evidence-based behavioural interventions,
        and we design each one around the child in front of us — not the label.
      </p>

      <div className="mt-8 flex flex-wrap gap-3 md:mt-10">
        <LinkButton
          href={waLink("Hi Fullgrace — I'd like to chat about my child.")}
          target="_blank"
          rel="noopener"
          variant="primary"
          size="lg"
        >
          Chat on WhatsApp
        </LinkButton>
        <LinkButton href="/contact" variant="outline" size="lg">
          Send us a message
        </LinkButton>
      </div>

      <div className="mt-12 grid max-w-prose grid-cols-3 gap-6 border-t border-line pt-6 md:mt-16">
        <Stat number="8+" label="years caring" color="blue" />
        <Stat number="60+" label="families supported" color="yellow" />
        <Stat number="1:1" label="always" color="green" />
      </div>
    </section>
  );
}

function Stat({ number, label, color }: { number: string; label: string; color: "blue" | "yellow" | "green" }) {
  const dotColor: Record<string, string> = {
    blue: "bg-puzzle-blue",
    yellow: "bg-puzzle-yellow",
    green: "bg-puzzle-green",
  };
  return (
    <div>
      <div className="flex items-center gap-2">
        <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${dotColor[color]}`} />
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">{label}</span>
      </div>
      <div className="mt-1 font-display text-3xl font-medium tracking-tight">{number}</div>
    </div>
  );
}
