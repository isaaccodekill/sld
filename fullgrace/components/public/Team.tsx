import { NumberedMarker } from "@/components/ui/NumberedMarker";
import { Reveal } from "@/components/ui/Reveal";
import { PuzzlePiece } from "@/components/ui/PuzzleDot";

export function Team() {
  return (
    <section id="team" aria-labelledby="team-title" className="py-16 md:py-28">
      <NumberedMarker n={5} label="The team" color="green" className="mb-6 md:mb-10" />

      <div className="grid gap-12 md:grid-cols-[minmax(0,360px)_1fr] md:gap-16">
        <Reveal>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-puzzle-green/15 via-cream-2 to-puzzle-yellow/25" />
            <div className="absolute inset-0 flex items-end p-6">
              <div className="rounded-lg bg-cream/80 p-4 backdrop-blur-sm ring-1 ring-line">
                <div className="flex items-center gap-2">
                  <PuzzlePiece color="green" size={24} />
                  <span className="font-display text-md">Awele Bello</span>
                </div>
                <div className="mt-0.5 text-xs text-ink-3">
                  {/* REPLACE BEFORE LAUNCH — founder portrait */}
                  Founder & Lead Therapist · portrait placeholder
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 id="team-title" className="font-display text-3xl font-medium leading-[1.1] tracking-[-0.02em] md:text-4xl">
            Hi, I'm Awele.
          </h2>
          <div className="prose-editorial mt-6 max-w-prose text-ink-2">
            <p>
              {/* REPLACE BEFORE LAUNCH — first-person founder bio */}
              I started Fullgrace after years of working with children across public and private
              settings and seeing, again and again, how much one careful room and one patient plan
              could change for a family. Montessori training gave me a way of seeing the child; my
              behavioural training gave me the tools to help them move forward.
            </p>
            <p>
              I work with each family myself, from the first conversation through to the progress
              letters I write at the end of each term. When we need another set of hands, I bring in
              therapists I've trained alongside. Our waiting list is small on purpose.
            </p>
            <p>
              If any of this sounds like the fit you've been looking for, I'd love to hear from you.
            </p>
          </div>

          <div className="mt-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
            <span>Awele Bello</span>
            <span className="h-px w-8 bg-line" />
            <span>Founder & Lead Therapist</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
