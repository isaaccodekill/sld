"use client";

import Link from "next/link";
import { tagLabel } from "@/lib/mock";
import { ageFromDOB, formatShortDate, relative } from "@/lib/format";
import { Tag } from "@/components/ui/Tag";
import { LinkButton } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { useClients } from "@/lib/admin-data";
import { useSavedSessions } from "@/lib/admin-store";

function statusTone(s: string): "good" | "warn" | "admin" {
  if (s === "active") return "good";
  if (s === "paused") return "warn";
  return "admin";
}

function ageLabel(dob: string): string {
  const age = ageFromDOB(dob);
  return age === null ? "DOB not recorded" : `age ${age}`;
}

export default function ClientsPage() {
  const { clients, loading } = useClients();
  const savedSessions = useSavedSessions();
  const rows = clients
    .map((c) => ({ c, last: savedSessions.filter((item) => item.clientId === c.id).sort((a, b) => b.date.localeCompare(a.date))[0]?.date }))
    .sort((a, b) => (b.last ?? "").localeCompare(a.last ?? ""));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium">Clients</h1>
          <p className="text-sm text-ink-2">
            {clients.filter((c) => c.status === "active").length} active ·{" "}
            {clients.filter((c) => c.status === "paused").length} paused
          </p>
        </div>
        <div data-tour="clients-new"><LinkButton href="/admin/clients/new" variant="black" size="md">
          + Register a client
        </LinkButton></div>
      </header>

      {loading && <p role="status" className="text-sm text-ink-3">Loading secure client records…</p>}

      <div className="grid gap-3 md:hidden">
        {rows.map(({ c, last }, index) => (
          <Link data-tour={index === 0 ? "clients-list" : undefined} key={c.id} href={`/admin/clients/${c.id}`} className="rounded-2xl border border-line bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-3 font-display text-green-2">{c.firstName[0]}</div>
                <div className="min-w-0"><div className="truncate font-medium">{c.firstName} · {ageLabel(c.dob)}</div><div className="truncate text-xs text-ink-3">{c.parentName}</div></div>
              </div>
              <Tag tone={statusTone(c.status)}>{c.status}</Tag>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-ink-3"><span>Started {formatShortDate(c.startDate)}</span><span>{last ? relative(last) : "No sessions yet"}</span></div>
          </Link>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-xl border border-line bg-cream md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-cream-2/60 text-[11px] uppercase tracking-[0.14em] text-ink-3">
            <tr>
              <th className="p-3 font-mono">Client</th>
              <th className="p-3 font-mono">Status</th>
              <th className="p-3 font-mono">Area</th>
              <th className="p-3 font-mono">Started</th>
              <th className="p-3 text-right font-mono">Last session</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map(({ c, last }, index) => (
              <tr data-tour={index === 0 ? "clients-list" : undefined} key={c.id} className="hover:bg-cream-2/40">
                <td className="p-3">
                  <Link href={`/admin/clients/${c.id}`} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-3 font-display text-sm text-green-2">
                      {c.firstName[0]}
                    </div>
                    <div>
                      <div className="font-medium text-ink">
                        {c.firstName}{" "}
                        <span className="text-ink-3">· {ageLabel(c.dob)}</span>
                      </div>
                      <div className="text-xs text-ink-3">{c.parentName}</div>
                    </div>
                  </Link>
                </td>
                <td className="p-3">
                  <Tag tone={statusTone(c.status)}>{c.status}</Tag>
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1.5">
                    {c.tags.map((t) => (
                      <Chip
                        key={t}
                        color={
                          t === "speech_delay"
                            ? "blue"
                            : t === "asd"
                              ? "red"
                              : t === "downs"
                                ? "yellow"
                                : "ink"
                        }
                      >
                        {tagLabel(t)}
                      </Chip>
                    ))}
                  </div>
                </td>
                <td className="p-3 text-ink-2">{formatShortDate(c.startDate)}</td>
                <td className="p-3 text-right text-ink-3">
                  {last ? relative(last) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
