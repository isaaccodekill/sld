import { NumberedMarker } from "@/components/ui/NumberedMarker";
import { PuzzlePiece } from "@/components/ui/PuzzleDot";
import { Reveal } from "@/components/ui/Reveal";

const initiatives = [
  {
    year: "2025",
    title: "Special Needs Awareness Summit",
    partner: "Organised by Bloomrite",
    description:
      "Sharing practical experience with families and professionals at Bloomrite’s awareness summit.",
    color: "green" as const,
  },
  {
    year: "4 days",
    title: "Free therapy outreach",
    partner: "GOY Foundation × Lagos State House of Assembly",
    description:
      "Four days of free therapy support for children with neurodevelopmental disorders.",
    color: "yellow" as const,
  },
];

export function CommunityImpact() {
  return (
    <section id="community-impact" aria-labelledby="impact-title" className="py-14 md:py-20">
      <NumberedMarker n={7} label="Community impact" color="yellow" className="mb-6 md:mb-8" />

      <div className="grid gap-6 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-14">
        <div>
          <h2 id="impact-title" className="max-w-[18ch] font-display text-3xl font-medium leading-[1.1] tracking-[-0.02em] md:text-4xl">
            Care that reaches further.
          </h2>
          <p className="mt-5 max-w-[44ch] text-ink-2">
            Partnerships help more children and families access support.
          </p>
        </div>

        <div className="divide-y divide-line border-y border-line">
          {initiatives.map((initiative, index) => (
            <Reveal key={initiative.title} delay={index * 0.05}>
              <article className="grid gap-5 py-7 sm:grid-cols-[64px_1fr] md:py-8">
                <PuzzlePiece color={initiative.color} size={48} />
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
                    {initiative.year} · {initiative.partner}
                  </div>
                  <h3 className="mt-2 font-display text-2xl leading-tight">{initiative.title}</h3>
                  <p className="mt-3 text-ink-2">{initiative.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
