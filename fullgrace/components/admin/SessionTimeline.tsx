import type { SessionNote } from "@/lib/mock";
import { formatShortDate } from "@/lib/format";

const tagColor: Record<SessionNote["tag"], string> = {
  good: "#2A8B3D",
  challenging: "#F5C23A",
  admin: "#8A8278",
};

export function SessionTimeline({ sessions }: { sessions: SessionNote[] }) {
  if (sessions.length === 0) {
    return <div className="py-10 text-sm text-ink-3">No sessions to plot yet.</div>;
  }
  const sorted = [...sessions].sort((a, b) => a.date.localeCompare(b.date));
  const startMs = new Date(sorted[0].date).getTime();
  const endMs = new Date(sorted[sorted.length - 1].date).getTime();
  const span = Math.max(endMs - startMs, 1);

  const height = 88;
  const padX = 24;
  const trackY = height / 2;

  return (
    <div className="rounded-xl border border-line bg-cream-2/40 p-4">
      <div className="mb-3 flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.14em] text-ink-3">
        <span>{formatShortDate(sorted[0].date)}</span>
        <span>Session timeline · {sorted.length} total</span>
        <span>{formatShortDate(sorted[sorted.length - 1].date)}</span>
      </div>
      <svg viewBox={`0 0 1000 ${height}`} preserveAspectRatio="none" className="h-20 w-full">
        <line x1={padX} x2={1000 - padX} y1={trackY} y2={trackY} stroke="#E3DACB" strokeWidth={1} />
        {sorted.map((s) => {
          const t = (new Date(s.date).getTime() - startMs) / span;
          const x = padX + t * (1000 - padX * 2);
          return (
            <g key={s.id}>
              <circle
                cx={x}
                cy={trackY}
                r={7}
                fill={tagColor[s.tag]}
                stroke="#F7F3EC"
                strokeWidth={2}
              >
                <title>{`${formatShortDate(s.date)} — ${s.focusAreas} (${s.tag})`}</title>
              </circle>
            </g>
          );
        })}
      </svg>
      <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-ink-2">
        <Legend color="#2A8B3D" label="Good session" />
        <Legend color="#F5C23A" label="Challenging" />
        <Legend color="#8A8278" label="Admin" />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono uppercase tracking-[0.12em] text-ink-3">
      <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}
