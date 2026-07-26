"use client";

import Link from "next/link";
import { useClients } from "@/lib/admin-data";
import { useSavedSessions } from "@/lib/admin-store";
import { formatDate } from "@/lib/format";
import { Tag } from "@/components/ui/Tag";
import { LinkButton } from "@/components/ui/Button";

export default function SessionsPage() {
  const { clients } = useClients();
  const saved = useSavedSessions();
  const combined = [...saved].sort((a, b) => b.date.localeCompare(a.date));
  const groups = clients
    .map((client) => ({
      client,
      sessions: combined.filter((session) => session.clientId === client.id),
    }))
    .filter((group) => group.sessions.length)
    .sort((a, b) => b.sessions[0].date.localeCompare(a.sessions[0].date));
  const knownClientIds = new Set(clients.map((client) => client.id));
  const unassigned = combined.filter((session) => !knownClientIds.has(session.clientId));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="font-display text-3xl font-medium">Session reports</h1><p className="text-sm text-ink-2">Grouped by client, with each child&apos;s newest report first.</p></div>
        <LinkButton href="/admin/sessions/new" variant="black">+ Log a report</LinkButton>
      </header>
      {combined.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line p-10 text-center"><p className="text-ink-3">No session reports yet.</p><div className="mt-4"><LinkButton href="/admin/sessions/new" size="sm">Log the first report</LinkButton></div></div>
      ) : (
        <div className="space-y-5">
          {groups.map((group, index) => (
            <ClientSessionGroup key={group.client.id} clientId={group.client.id} clientName={group.client.firstName} sessions={group.sessions} tour={index === 0} />
          ))}
          {unassigned.length > 0 && <ClientSessionGroup clientName="Client unavailable" sessions={unassigned} />}
        </div>
      )}
    </div>
  );
}

function ClientSessionGroup({ clientId, clientName, sessions, tour = false }: { clientId?: string; clientName: string; sessions: ReturnType<typeof useSavedSessions>; tour?: boolean }) {
  return (
    <section data-tour={tour ? "sessions-list" : undefined} className="overflow-hidden rounded-2xl border border-line bg-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-cream-2/45 px-4 py-4 sm:px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-3 font-display text-green-2">{clientName[0]}</div>
          <div><h2 className="font-display text-xl">{clientName}</h2><p className="text-xs text-ink-3">{sessions.length} report{sessions.length === 1 ? "" : "s"} · latest {formatDate(sessions[0].date)}</p></div>
        </div>
        {clientId && <Link href={`/admin/clients/${clientId}`} className="text-sm font-medium text-green hover:text-green-2">View client →</Link>}
      </header>
      <ol className="divide-y divide-line">
        {sessions.map((session) => (
          <li key={session.id} className="grid gap-3 p-4 sm:grid-cols-[140px_minmax(0,1fr)_auto] sm:items-center sm:px-5">
            <div><div className="text-sm font-medium">{formatDate(session.date)}</div><div className="text-xs capitalize text-ink-3">{session.sessionType.replace("_", " ")} · {session.durationMinutes} min</div></div>
            <div className="min-w-0"><p className="truncate text-sm text-ink-2">{session.focusAreas || "No focus area added"}</p><p className="mt-1 truncate text-xs text-ink-3">{session.progressNotes || "Progress not recorded"}</p></div>
            <div className="flex items-center justify-between gap-2 sm:justify-end">
              <Tag tone={session.status === "draft" ? "warn" : "good"}>{session.status}</Tag>
              <Link href={`/admin/sessions/${session.id}`} className="inline-flex min-h-10 items-center rounded-lg border border-line px-3 text-sm font-medium text-ink hover:border-green hover:text-green">View</Link>
              <Link href={`/admin/sessions/new?edit=${session.id}`} className="inline-flex min-h-10 items-center rounded-lg bg-green px-3 text-sm font-medium text-white hover:bg-green-2">Edit</Link>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
