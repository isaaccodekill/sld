import type { PuzzleColor } from "@/lib/tokens";
import { NumberedMarker } from "@/components/ui/NumberedMarker";
import { PuzzleDot } from "@/components/ui/PuzzleDot";
import { Reveal } from "@/components/ui/Reveal";

type Program = {
  title: string;
  blurb: string;
  rhythm: string;
  color: PuzzleColor;
};

const programs: Program[] = [
  {
    title: "Language therapy",
    blurb:
      "Receptive and expressive language work, articulation, early literacy. Built around play, not drills.",
    rhythm: "Usually 2–3× per week · 45 min",
    color: "blue",
  },
  {
    title: "Behavioural intervention",
    blurb:
      "Structured, evidence-based work on routines, flexibility, peer interaction, and emotional regulation.",
    rhythm: "Usually 2× per week · 60 min",
    color: "red",
  },
  {
    title: "Self-help skills coaching",
    blurb:
      "Dressing, feeding, toileting, tidying up, getting ready in the morning — the skills that build independence.",
    rhythm: "Weekly · 45 min",
    color: "yellow",
  },
  {
    title: "Parent support",
    blurb:
      "Dedicated time to talk through what you're seeing at home, practise strategies together, and coordinate with schools.",
    rhythm: "Monthly · 30 min",
    color: "green",
  },
];

export function Programs() {
  return (
    <section id="programs" aria-labelledby="programs-title" className="py-16 md:py-28">
      <NumberedMarker n={4} label="Programs" color="yellow" className="mb-6 md:mb-10" />
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
        <h2 id="programs-title" className="max-w-[22ch] font-display text-3xl font-medium leading-[1.1] tracking-[-0.02em] md:text-4xl">
          Four steady programmes — mixed and matched for each child.
        </h2>
        <p className="max-w-prose text-ink-2">
          We don't publish prices on the site because they depend on the plan we build together.
          The fastest way to get a clear quote is a WhatsApp message.
        </p>
      </div>

      <ol className="mt-12 divide-y divide-line border-t border-line">
        {programs.map((p, i) => (
          <Reveal as="li" key={p.title} delay={i * 0.04}>
            <div className="grid items-start gap-5 py-8 md:grid-cols-[80px_1fr_auto] md:gap-10">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-3">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <PuzzleDot color={p.color} size={10} />
              </div>
              <div className="max-w-prose">
                <h3 className="font-display text-2xl font-medium leading-tight md:text-3xl">{p.title}</h3>
                <p className="mt-2 text-ink-2">{p.blurb}</p>
              </div>
              <div className="md:pt-2">
                <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
                  Rhythm
                </div>
                <div className="mt-1 text-sm text-ink-2">{p.rhythm}</div>
              </div>
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
