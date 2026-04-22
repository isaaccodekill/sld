import Link from "next/link";
import type { PuzzleColor } from "@/lib/tokens";
import { NumberedMarker } from "@/components/ui/NumberedMarker";
import { Reveal } from "@/components/ui/Reveal";
import { PuzzlePiece } from "@/components/ui/PuzzleDot";

type Block = {
  title: string;
  parent: string;
  detail: string;
  color: PuzzleColor;
};

const blocks: Block[] = [
  {
    title: "Children with speech & language delays",
    parent:
      "You might be noticing your child is slower to find words than their friends, or stuck on single words when you'd expect phrases. Or maybe the words are there but they're hard to understand.",
    detail:
      "We run assessments, design a clear programme, and work with you on what to practise at home. Usually 2–3 sessions a week to start.",
    color: "blue",
  },
  {
    title: "Children on the autism spectrum",
    parent:
      "Whether you have a recent diagnosis, a working suspicion, or you just know your child thinks in their own wonderful way — we meet you there without a script.",
    detail:
      "Our rooms are quiet, predictable, and sensory-aware. We work on communication, flexibility, and self-help skills, and we coordinate with schools when you want us to.",
    color: "red",
  },
  {
    title: "Children with Down's Syndrome",
    parent:
      "Every child with Down's Syndrome is their whole own person — and we treat them that way. We focus on where they are, not where a chart says they should be.",
    detail:
      "Language, self-help, feeding, early literacy — chosen based on what your child is ready for now, with the long view in mind.",
    color: "yellow",
  },
];

export function WhoWeHelp() {
  return (
    <section id="who-we-help" aria-labelledby="who-title" className="py-16 md:py-28">
      <NumberedMarker n={3} label="Who we help" color="red" className="mb-6 md:mb-10" />

      <h2 id="who-title" className="max-w-[22ch] font-display text-3xl font-medium leading-[1.1] tracking-[-0.02em] md:text-4xl">
        Three areas we work in the most — and one belief behind all of them.
      </h2>
      <p className="mt-4 max-w-prose text-ink-2">
        Every child is a full person first. The diagnosis helps us map the terrain, but the plan is
        always theirs alone.
      </p>

      <div className="mt-10 divide-y divide-line border-y border-line">
        {blocks.map((b, i) => (
          <Reveal key={b.title} delay={i * 0.05}>
            <div className="grid gap-6 py-10 md:grid-cols-[80px_1fr_auto] md:items-start md:gap-10 md:py-12">
              <div className="flex items-center gap-3 md:block">
                <PuzzlePiece color={b.color} size={56} />
              </div>
              <div className="max-w-prose">
                <h3 className="font-display text-2xl font-medium leading-tight md:text-3xl">{b.title}</h3>
                <p className="mt-3 text-base text-ink-2 md:text-md">{b.parent}</p>
                <p className="mt-3 text-sm text-ink-3 md:text-base">{b.detail}</p>
              </div>
              <div className="md:pt-2">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 text-sm text-green hover:text-green-2"
                >
                  See how we help
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
