import Image from "next/image";
import { NumberedMarker } from "@/components/ui/NumberedMarker";
import { Reveal } from "@/components/ui/Reveal";
import { PuzzlePiece } from "@/components/ui/PuzzleDot";

export function Team() {
  return (
    <section id="team" aria-labelledby="team-title" className="py-14 md:py-20">
      <NumberedMarker n={5} label="The team" color="green" className="mb-6 md:mb-8" />

      <div className="grid gap-12 md:grid-cols-[minmax(0,360px)_1fr] md:gap-16">
        <Reveal>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl">
            <Image
              src="/owner-image.jpg"
              alt="Awele Bello, founder and lead therapist at Fullgrace"
              fill
              sizes="(min-width: 768px) 360px, 100vw"
              className="object-cover object-[center_35%] transition-transform duration-720 ease-soft hover:scale-[1.025]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brandblack/50 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-end p-6">
              <div className="rounded-lg bg-cream/90 p-4 backdrop-blur-sm ring-1 ring-white/30">
                <div className="flex items-center gap-2">
                  <PuzzlePiece color="green" size={24} />
                  <span className="font-display text-md">Awele Bello</span>
                </div>
                <div className="mt-0.5 text-xs text-ink-3">
                  Founder & Lead Therapist
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 id="team-title" className="font-display text-3xl font-medium leading-[1.1] tracking-[-0.02em] md:text-4xl">
            Meet Awele.
          </h2>
          <div className="prose-editorial mt-6 max-w-prose text-ink-2">
            <p>
              {/* REPLACE BEFORE LAUNCH: first-person founder bio */}
              I founded Fullgrace after years of seeing how much a patient plan and a carefully
              prepared room could change for a child. Montessori helps me see the whole child;
              behavioural practice gives us tools for steady progress.
            </p>
            <p>
              I stay close to every family, from the first conversation to each progress review.
              Our caseload is intentionally small, so every child is known.
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
