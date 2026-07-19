const blocks = [
  { position: "ambient-block-1", color: "blue" },
  { position: "ambient-block-2", color: "yellow" },
  { position: "ambient-block-3", color: "red" },
  { position: "ambient-block-4", color: "green" },
  { position: "ambient-block-5", color: "yellow" },
  { position: "ambient-block-6", color: "blue" },
  { position: "ambient-block-7", color: "red" },
  { position: "ambient-block-8", color: "green" },
  { position: "ambient-block-9", color: "blue" },
] as const;

const colorClass = {
  blue: "ambient-block-blue",
  yellow: "ambient-block-yellow",
  red: "ambient-block-red",
  green: "ambient-block-green",
} as const;

export function AmbientBlocks() {
  return (
    <div className="ambient-block-field" aria-hidden>
      {blocks.map((block) => (
        <span
          key={block.position}
          className={`ambient-block ${block.position} ${colorClass[block.color]}`}
        />
      ))}
    </div>
  );
}
