import { PuzzleDot } from "@/components/ui/PuzzleDot";

const values = [
  { label: "Montessori-rooted", color: "green" as const },
  { label: "Child-led", color: "blue" as const },
  { label: "Evidence-based", color: "yellow" as const },
  { label: "Patient", color: "red" as const },
  { label: "Family-inclusive", color: "green" as const },
  { label: "Honest about progress", color: "blue" as const },
];

export function ValuesMarquee() {
  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden border-y border-line bg-cream-2 py-5"
    >
      <div className="flex w-max animate-marquee md:animate-marquee-slow motion-reduce:animate-none">
        {[...values, ...values, ...values].map((v, i) => (
          <div key={i} className="flex items-center gap-3 px-8 font-display text-2xl text-ink">
            <PuzzleDot color={v.color} size={10} />
            <span>{v.label}</span>
            <span className="ml-6 text-ink-3">·</span>
          </div>
        ))}
      </div>
    </div>
  );
}
