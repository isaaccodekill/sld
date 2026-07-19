const studs = [0, 1, 2, 3];
const brickColorClass = {
  blue: "therapy-brick-blue",
  red: "therapy-brick-red",
  yellow: "therapy-brick-yellow",
  green: "therapy-brick-green",
} as const;

function Brick({ color }: { color: "blue" | "red" | "yellow" | "green" }) {
  return (
    <div className={`therapy-brick ${brickColorClass[color]}`}>
      <div className="therapy-brick-studs" aria-hidden>
        {studs.map((stud) => <span key={stud} />)}
      </div>
    </div>
  );
}

export function BuildingBlocksScene() {
  return (
    <div
      className="block-playground"
      role="img"
      aria-label="Colourful building blocks gently assembling into a small structure"
    >
      <div className="block-glow" aria-hidden />
      <div className="block-orbit block-orbit-one" aria-hidden />
      <div className="block-orbit block-orbit-two" aria-hidden />

      <div className="block-slot block-slot-green"><Brick color="green" /></div>
      <div className="block-slot block-slot-red"><Brick color="red" /></div>
      <div className="block-slot block-slot-yellow"><Brick color="yellow" /></div>
      <div className="block-slot block-slot-blue"><Brick color="blue" /></div>

      <div className="block-slot block-slot-loose-left"><Brick color="blue" /></div>
      <div className="block-slot block-slot-loose-right"><Brick color="yellow" /></div>

      <div className="block-ground" aria-hidden />
      <div className="block-note" aria-hidden>
        <span className="bg-puzzle-blue" />
        <span className="bg-puzzle-yellow" />
        <span className="bg-puzzle-red" />
        <span className="bg-puzzle-green" />
      </div>
    </div>
  );
}
