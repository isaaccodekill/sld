import { NumberedMarker } from "@/components/ui/NumberedMarker";
import { Reveal } from "@/components/ui/Reveal";
import { PuzzleDot } from "@/components/ui/PuzzleDot";
import type { PuzzleColor } from "@/lib/tokens";

type T = {
  pullQuote: string;
  quote: string[];
  name: string;
  role: string;
  color: PuzzleColor;
};

const list: T[] = [
  {
    pullQuote: "Our children have blossomed under her tutelage.",
    quote: [
      "Mrs. Bello has been our children’s speech and behavioural therapist for the past two years, and we cannot recommend her highly enough.",
      "From the very beginning, she demonstrated exceptional professionalism, patience, and genuine care. Her ability to connect with our children, understand their unique needs, and create a supportive learning environment has been truly remarkable.",
      "We have witnessed tremendous growth in their communication skills, confidence, and overall development. She celebrates every milestone, provides thoughtful guidance, and approaches her work with both excellence and compassion. Our children have blossomed under her tutelage.",
    ],
    name: "Mrs. Azuike",
    role: "Parent",
    color: "blue",
  },
  {
    pullQuote: "Adesire is now more engaged, responsive and independent.",
    quote: [
      "We are deeply grateful for the dedication and care shown to our child from the very beginning. Working with a child with additional needs requires patience, understanding, and consistency, and these qualities have been evident every step of the way.",
      "We have noticed progress in Adesire’s communication, basic literacy and numeracy, confidence, and independence. She is now more engaged, responsive, and willing to participate in daily learning activities.",
      "Beyond academics, you created a warm, supportive, and structured environment that made learning enjoyable. We highly recommend your services to any family seeking a compassionate and effective home teacher for a special child.",
    ],
    name: "The Adekanbis",
    role: "Family",
    color: "red",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" aria-labelledby="testi-title" className="py-14 md:py-20">
      <NumberedMarker n={6} label="Families are saying" color="blue" className="mb-6 md:mb-8" />

      <h2 id="testi-title" className="max-w-[20ch] font-display text-3xl font-medium leading-[1.1] tracking-[-0.02em] md:text-4xl">
        Real progress, shared by families.
      </h2>

      <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
        {list.map((t, i) => (
          <Reveal key={t.name + i} delay={i * 0.05}>
            <figure className="flex h-full flex-col justify-between rounded-xl border border-line bg-cream-2/50 p-7 md:p-9">
              <blockquote className="font-display text-2xl leading-snug text-ink md:text-3xl">
                &ldquo;{t.pullQuote}&rdquo;
              </blockquote>
              <details className="group mt-7 border-t border-line pt-5">
                <summary className="cursor-pointer list-none text-sm text-green marker:content-none">
                  <span className="group-open:hidden">Read their story&nbsp; +</span>
                  <span className="hidden group-open:inline">Close story&nbsp; −</span>
                </summary>
                <div className="mt-5 space-y-4 text-sm leading-relaxed text-ink-2">
                  {t.quote.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </details>
              <figcaption className="mt-8 flex items-center gap-3 text-sm text-ink-3">
                <PuzzleDot color={t.color} size={10} />
                <span>
                  <span className="text-ink-2">{t.name}</span> · {t.role}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
