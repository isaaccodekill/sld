import Image from "next/image";
import { NumberedMarker } from "@/components/ui/NumberedMarker";
import { Reveal } from "@/components/ui/Reveal";

export function Approach() {
  return (
    <section id="approach" aria-labelledby="approach-title" className="py-16 md:py-28">
      <NumberedMarker n={2} label="Our approach" color="green" className="mb-6 md:mb-10" />

      <div className="grid gap-10 md:grid-cols-[minmax(0,420px)_1fr] md:gap-16">
        <Reveal>
          <figure>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-cream-3">
              <Image
                src="https://images.unsplash.com/photo-1745208865705-a6b54c0c9b60?auto=format&fit=crop&q=80&w=1200"
                alt="A wooden Montessori counting tray with coloured sticks arranged in compartments"
                fill
                sizes="(min-width: 768px) 420px, 100vw"
                className="object-cover"
                priority={false}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brandblack/30 via-transparent to-transparent"
              />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/85">
                <span>A careful, unhurried room</span>
                <a
                  href="https://unsplash.com/@duke91"
                  target="_blank"
                  rel="noopener nofollow"
                  className="text-cream/60 hover:text-cream"
                >
                  Photo · Duc Van
                </a>
              </figcaption>
            </div>
          </figure>
        </Reveal>

        <Reveal delay={0.06}>
          <h2 id="approach-title" className="font-display text-3xl font-medium leading-[1.1] tracking-[-0.02em] md:text-4xl">
            We blend the Montessori method with behavioural intervention — in plain language, that means a child-led room with structure underneath.
          </h2>
          <div className="prose-editorial mt-6 max-w-prose text-base text-ink-2 md:text-md">
            <p>
              Montessori gives us the environment: uncluttered, tactile, organised so that a child
              can reach for what pulls them. Behavioural methods give us the structure: clear
              targets, consistent responses, careful data on what is working and what isn't. Neither
              on its own is enough. Together, they let us meet a child where they actually are.
            </p>
            <p>
              We don't start from the label — the label points us, but the plan always starts from
              the child in the room. That's why our first session is unhurried, why we invite
              parents to watch, and why we take detailed notes and share them back with you.
            </p>
          </div>

          <figure className="mt-10 border-l-2 border-green pl-6">
            <blockquote className="font-display text-xl italic leading-snug text-ink md:text-2xl">
              &ldquo;The child is not a vessel to be filled, but a person to be understood.&rdquo;
            </blockquote>
            <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">
              — A line we keep on the wall
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
