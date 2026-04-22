import Link from "next/link";
import { getClient, sessions } from "@/lib/mock";
import { formatDate } from "@/lib/format";
import { Tag } from "@/components/ui/Tag";
import { LinkButton } from "@/components/ui/Button";

export default function SessionsPage() {
  const sorted = [...sessions].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium">Sessions</h1>
          <p className="text-sm text-ink-2">All sessions, most recent first.</p>
        </div>
        <LinkButton href="/admin/sessions/new" variant="black" size="md">
          + Log a session
        </LinkButton>
      </header>

      <ol className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-cream">
        {sorted.map((s) => {
          const client = getClient(s.clientId);
          return (
            <li key={s.id}>
              <Link href={`/admin/clients/${s.clientId}`} className="grid grid-cols-[1fr_auto] items-start gap-4 p-4 hover:bg-cream-2/40 md:grid-cols-[160px_1fr_160px_80px_auto]">
                <div className="text-sm">
                  <div className="font-medium text-ink">{formatDate(s.date, { day: "numeric", month: "short", year: "numeric" })}</div>
                  <div className="text-xs text-ink-3">{s.sessionType.replace("_", " ")}</div>
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-ink">{client?.firstName ?? "—"}</div>
                  <div className="mt-0.5 truncate text-xs text-ink-3">{s.focusAreas}</div>
                </div>
                <div className="hidden truncate text-xs text-ink-2 md:block">{s.progressNotes}</div>
                <div className="hidden text-right text-xs text-ink-3 md:block">
                  {s.durationMinutes} min · E{s.engagement}
                </div>
                <div className="col-start-2 md:col-start-auto">
                  <Tag tone={s.tag === "good" ? "good" : s.tag === "challenging" ? "warn" : "admin"}>{s.tag}</Tag>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
