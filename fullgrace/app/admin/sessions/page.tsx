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

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="font-display text-3xl font-medium">Session reports</h1><p className="text-sm text-ink-2">Daily clinical reports and saved drafts, most recent first.</p></div>
        <LinkButton href="/admin/sessions/new" variant="black">+ Log a report</LinkButton>
      </header>
      <ol className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
        {combined.map((session, index) => (
          <li data-tour={index === 0 ? "sessions-list" : undefined} key={session.id}>
            <Link href={`/admin/clients/${session.clientId}`} className="grid grid-cols-[1fr_auto] gap-4 p-4 hover:bg-cream-2/40 md:grid-cols-[150px_1fr_160px_auto]">
              <div><div className="text-sm font-medium">{formatDate(session.date)}</div><div className="text-xs capitalize text-ink-3">{session.sessionType.replace("_", " ")}</div></div>
              <div><div className="font-medium">{clients.find((item) => item.id === session.clientId)?.firstName ?? "Client"}</div><div className="truncate text-xs text-ink-3">{session.focusAreas || "No focus area added"}</div></div>
              <div className="hidden truncate text-xs text-ink-2 md:block">{session.progressNotes || "Progress not recorded"}</div>
              <Tag tone={session.status === "draft" ? "warn" : "good"}>{session.status}</Tag>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
