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
    blurb: "Communication, articulation and early literacy built through play.",
    rhythm: "Usually 2–3× per week · 45 min",
    color: "blue",
  },
  {
    title: "Behavioural intervention",
    blurb: "Practical support for routines, flexibility, interaction and regulation.",
    rhythm: "Usually 2× per week · 60 min",
    color: "red",
  },
  {
    title: "Self-help skills coaching",
    blurb: "Everyday skills that grow confidence and independence.",
    rhythm: "Weekly · 45 min",
    color: "yellow",
  },
  {
    title: "Parent support",
    blurb: "Simple strategies for home and joined-up support with schools.",
    rhythm: "Monthly · 30 min",
    color: "green",
  },
];

export function Programs() {
  return (
    <section id="programs" aria-labelledby="programs-title" className="py-14 md:py-20">
      <NumberedMarker n={4} label="Programs" color="yellow" className="mb-6 md:mb-8" />
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
        <h2 id="programs-title" className="max-w-[22ch] font-display text-3xl font-medium leading-[1.1] tracking-[-0.02em] md:text-4xl">
          Small steps. Steady progress.
        </h2>
        <p className="max-w-[44ch] text-ink-2">
          We combine these programmes into one clear plan for your child.
        </p>
      </div>

      <ol className="mt-10 grid gap-5 md:grid-cols-2">
        {programs.map((p, i) => (
          <Reveal as="li" key={p.title} delay={i * 0.04}>
            <article className="flex h-full flex-col rounded-xl border border-line bg-cream p-6 transition-all duration-420 ease-soft hover:-translate-y-1 hover:border-green/25 hover:bg-cream-2/45 md:p-7">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-3">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <PuzzleDot color={p.color} size={10} />
                </div>
                <span className="rounded-full bg-cream-2 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3">
                  {p.rhythm}
                </span>
              </div>
              <h3 className="mt-7 font-display text-2xl font-medium leading-tight md:text-3xl">{p.title}</h3>
              <p className="mt-3 max-w-[42ch] text-ink-2">{p.blurb}</p>
            </article>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
