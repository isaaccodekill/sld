import { NumberedMarker } from "@/components/ui/NumberedMarker";
import { Reveal } from "@/components/ui/Reveal";
import { PuzzleDot } from "@/components/ui/PuzzleDot";
import type { PuzzleColor } from "@/lib/tokens";

type T = {
  quote: string;
  name: string;
  child: string;
  color: PuzzleColor;
};

// REPLACE BEFORE LAUNCH — first-name + child-age only
const list: T[] = [
  {
    quote:
      "We arrived anxious. Awele sat with us for an hour before doing any 'therapy' at all. A year on, our daughter is reading bedtime stories to us.",
    name: "Adaeze",
    child: "mum of Tola (6)",
    color: "blue",
  },
  {
    quote:
      "The first place that talked to our son instead of around him. The difference showed up at home within a month.",
    name: "Ifeanyi",
    child: "dad of Chioma (8)",
    color: "red",
  },
  {
    quote:
      "Calm, honest, detailed. Every progress letter we get feels like it was written by somebody who actually knows our child.",
    name: "Folake",
    child: "mum of Kunle (4)",
    color: "yellow",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" aria-labelledby="testi-title" className="py-16 md:py-28">
      <NumberedMarker n={6} label="Parents are saying" color="blue" className="mb-6 md:mb-10" />

      <h2 id="testi-title" className="sr-only">
        Parents are saying
      </h2>

      <div className="grid gap-10 md:grid-cols-3 md:gap-8">
        {list.map((t, i) => (
          <Reveal key={t.name + i} delay={i * 0.05}>
            <figure className="flex h-full flex-col justify-between rounded-xl border border-line bg-cream-2/40 p-7">
              <blockquote className="font-display text-xl leading-snug text-ink">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-3 text-sm text-ink-3">
                <PuzzleDot color={t.color} size={10} />
                <span>
                  <span className="text-ink-2">{t.name}</span>, {t.child}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
