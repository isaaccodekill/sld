import Link from "next/link";
import type { PuzzleColor } from "@/lib/tokens";
import { NumberedMarker } from "@/components/ui/NumberedMarker";
import { Reveal } from "@/components/ui/Reveal";
import { PuzzlePiece } from "@/components/ui/PuzzleDot";

type Block = {
  title: string;
  description: string;
  color: PuzzleColor;
};

const blocks: Block[] = [
  {
    title: "Children with speech & language delays",
    description:
      "Clearer expression, understanding, articulation and early literacy, built through play.",
    color: "blue",
  },
  {
    title: "Children on the autism spectrum",
    description:
      "Quiet, predictable sessions supporting communication, flexibility, regulation and routines.",
    color: "red",
  },
  {
    title: "Children with Down's Syndrome",
    description:
      "Individual support for language, feeding, self-help and early learning at their pace.",
    color: "yellow",
  },
];

export function WhoWeHelp() {
  return (
    <section id="who-we-help" aria-labelledby="who-title" className="py-14 md:py-20">
      <NumberedMarker n={3} label="Who we help" color="red" className="mb-6 md:mb-8" />

      <h2 id="who-title" className="max-w-[22ch] font-display text-3xl font-medium leading-[1.1] tracking-[-0.02em] md:text-4xl">
        Support shaped around your child.
      </h2>
      <p className="mt-4 max-w-[56ch] text-ink-2">
        The diagnosis can guide us, but we are mindful of the demonstrated needs of the child.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {blocks.map((b, i) => (
          <Reveal key={b.title} delay={i * 0.05}>
            <article className="flex h-full flex-col rounded-xl border border-line bg-cream-2/35 p-6 transition-all duration-420 ease-soft hover:-translate-y-1 hover:border-green/25 hover:bg-cream-2/65 md:p-7">
              <PuzzlePiece color={b.color} size={52} />
              <h3 className="mt-7 font-display text-2xl font-medium leading-tight">{b.title}</h3>
              <p className="mt-3 text-ink-2">{b.description}</p>
              <div className="mt-auto pt-7">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 text-sm text-green hover:text-green-2"
                >
                  See how we help
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
