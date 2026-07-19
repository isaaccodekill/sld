import { NumberedMarker } from "@/components/ui/NumberedMarker";
import { LinkButton } from "@/components/ui/Button";
import { RotatingUnderline } from "./RotatingUnderline";
import { waLink } from "@/lib/constants";
import { PuzzleDot } from "@/components/ui/PuzzleDot";

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="pb-8 md:pb-16">
      <NumberedMarker n={1} label="Introduction" color="blue" className="mb-6 md:mb-10" />
      <h1
        id="hero-title"
        className="font-display text-[clamp(2.4rem,6.2vw,5rem)] font-medium leading-[1.02] tracking-[-0.02em] text-ink"
      >
        Every child deserves to be <RotatingUnderline color="blue">understood.</RotatingUnderline>
      </h1>

      <p className="mt-7 max-w-[58ch] text-md text-ink-2 md:mt-8">
        Speech, self-help and behavioural therapy shaped around the child, not the diagnosis.
        Montessori-rooted, family-inclusive and based in Lagos.
      </p>

      <div className="mt-6 flex flex-wrap gap-2.5" aria-label="Our areas of support">
        <FocusChip label="Speech & language" color="blue" />
        <FocusChip label="Self-help skills" color="yellow" />
        <FocusChip label="Behavioural support" color="red" />
      </div>

      <div className="mt-8 flex flex-wrap gap-3 md:mt-10">
        <LinkButton
          href={waLink("Hi Fullgrace, I'd like to chat about my child.")}
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

function FocusChip({ label, color }: { label: string; color: "blue" | "yellow" | "red" }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-cream-2/60 px-3.5 py-2 text-sm text-ink-2 transition-transform duration-420 ease-soft hover:-translate-y-0.5">
      <PuzzleDot color={color} size={8} />
      {label}
    </span>
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
