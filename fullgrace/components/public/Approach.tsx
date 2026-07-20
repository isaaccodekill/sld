import { NumberedMarker } from "@/components/ui/NumberedMarker";
import { Reveal } from "@/components/ui/Reveal";
import { BuildingBlocksScene } from "@/components/public/BuildingBlocksScene";
import { RotatingUnderline } from "@/components/public/RotatingUnderline";

export function Approach() {
  return (
    <section id="approach" aria-labelledby="approach-title" className="py-14 md:py-20">
      <NumberedMarker n={2} label="Our approach" color="green" className="mb-6 md:mb-8" />

      <div className="grid gap-10 md:grid-cols-[minmax(0,420px)_1fr] md:gap-16">
        <Reveal>
          <BuildingBlocksScene />
        </Reveal>

        <Reveal delay={0.06}>
          <h2 id="approach-title" className="font-display text-3xl font-medium leading-[1.1] tracking-[-0.02em] md:text-4xl">
            Carefully structured <RotatingUnderline color="red" delay={0.12}>child-tailored plans.</RotatingUnderline>
          </h2>
          <div className="prose-editorial mt-6 max-w-prose text-base text-ink-2 md:text-md">
            <p>
              Our programs also integrate the Montessori method of education and effective
              behavioural interventions suited to the needs of each client.
            </p>
          </div>

          <figure className="mt-10 border-l-2 border-green pl-6">
            <blockquote className="font-display text-xl italic leading-snug text-ink md:text-2xl">
              &ldquo;The child is not a vessel to be filled, but a person to be understood.&rdquo;
            </blockquote>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
