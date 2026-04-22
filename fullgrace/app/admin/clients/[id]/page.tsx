import Link from "next/link";
import { notFound } from "next/navigation";
import {
  clients,
  getClient,
  latestArc,
  latestSinceLast,
  reportsFor,
  sessionsFor,
  tagLabel,
} from "@/lib/mock";
import { ageFromDOB, formatDate, formatShortDate, relative } from "@/lib/format";
import { Tabs, TabList, Tab, TabPanel } from "@/components/ui/Tabs";
import { Tag } from "@/components/ui/Tag";
import { Chip } from "@/components/ui/Chip";
import { LinkButton, Button } from "@/components/ui/Button";
import { AISummaryCard } from "@/components/admin/AISummaryCard";
import { SessionTimeline } from "@/components/admin/SessionTimeline";

export function generateStaticParams() {
  return clients.map((c) => ({ id: c.id }));
}

export default function ClientDetail({ params }: { params: { id: string } }) {
  const client = getClient(params.id);
  if (!client) notFound();

  const theirSessions = sessionsFor(client.id);
  const theirReports = reportsFor(client.id);
  const sinceLast = latestSinceLast(client.id);
  const arc = latestArc(client.id);

  return (
    <div className="space-y-6">
      <nav className="text-sm">
        <Link href="/admin/clients" className="text-ink-3 hover:text-ink">
          ← Clients
        </Link>
      </nav>

      <header className="flex flex-wrap items-start justify-between gap-6 border-b border-line pb-6">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-3 font-display text-xl text-green-2">
            {client.firstName[0]}
          </div>
          <div>
            <h1 className="font-display text-3xl font-medium leading-tight">
              {client.firstName} {client.nickname && <span className="text-ink-3">"{client.nickname}"</span>}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-ink-2">
              <span>Age {ageFromDOB(client.dob)} · born {formatDate(client.dob)}</span>
              <span className="text-ink-3">·</span>
              <span>Started {formatDate(client.startDate)}</span>
              <span className="text-ink-3">·</span>
              <Tag tone={client.status === "active" ? "good" : client.status === "paused" ? "warn" : "admin"}>
                {client.status}
              </Tag>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {client.tags.map((t) => (
                <Chip
                  key={t}
                  color={
                    t === "speech_delay" ? "blue" : t === "asd" ? "red" : t === "downs" ? "yellow" : "ink"
                  }
                >
                  {tagLabel(t)}
                </Chip>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <LinkButton href={`/admin/sessions/new?client=${client.id}`} variant="primary" size="sm">
            + Add session
          </LinkButton>
          <LinkButton href={`/admin/reports/new?client=${client.id}`} variant="black" size="sm">
            Generate report for parent
          </LinkButton>
        </div>
      </header>

      <Tabs defaultValue="overview">
        <TabList className="-mx-2 overflow-x-auto px-2">
          <Tab value="overview">Overview</Tab>
          <Tab value="sessions">Sessions ({theirSessions.length})</Tab>
          <Tab value="timeline">Timeline</Tab>
          <Tab value="reports">Reports ({theirReports.length})</Tab>
        </TabList>

        <TabPanel value="overview">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-5 md:col-span-2">
              <AISummaryCard summary={sinceLast} />
              {arc && (
                <div className="rounded-xl border border-line bg-cream">
                  <div className="flex items-center justify-between border-b border-line px-5 py-3">
                    <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
                      <Tag tone="green">Arc summary</Tag>
                      <span>· {formatDate(arc.windowStart)} → {formatDate(arc.windowEnd)}</span>
                    </div>
                    <Button variant="outline" size="sm">Regenerate</Button>
                  </div>
                  <div className="px-5 py-4 text-sm leading-relaxed text-ink-2">
                    <div className="whitespace-pre-wrap">{arc.rawOutput}</div>
                  </div>
                </div>
              )}
            </div>

            <aside className="space-y-5">
              <InfoCard title="Primary concern">
                <p className="text-sm text-ink-2">{client.primaryConcern}</p>
              </InfoCard>
              <InfoCard title="Working hypothesis">
                <p className="text-sm text-ink-2">{client.workingHypothesis}</p>
              </InfoCard>
              <InfoCard title="Parent / guardian">
                <div className="space-y-1 text-sm">
                  <div className="text-ink">{client.parentName}</div>
                  <div className="text-ink-3">{client.relationship}</div>
                  <div className="text-ink-2">{client.parentPhone}</div>
                  <div className="text-ink-2">{client.parentEmail}</div>
                </div>
              </InfoCard>
              <InfoCard title="Internal notes">
                <p className="whitespace-pre-wrap text-sm text-ink-2">{client.internalNotes}</p>
              </InfoCard>
            </aside>
          </div>
        </TabPanel>

        <TabPanel value="sessions">
          {theirSessions.length === 0 ? (
            <div className="py-10 text-center text-ink-3">No sessions yet.</div>
          ) : (
            <ol className="space-y-3">
              {theirSessions.map((s) => (
                <li key={s.id}>
                  <details className="group rounded-xl border border-line bg-cream open:shadow-[0_0_0_1px_rgba(47,93,58,0.08)]">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-left">
                      <div className="flex items-center gap-3">
                        <Tag tone={s.tag === "good" ? "good" : s.tag === "challenging" ? "warn" : "admin"}>
                          {s.tag}
                        </Tag>
                        <div>
                          <div className="text-sm font-medium text-ink">{formatDate(s.date, { day: "numeric", month: "long", year: "numeric" })} · {s.sessionType.replace("_", " ")}</div>
                          <div className="text-xs text-ink-3">{s.focusAreas}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-ink-3">
                        <span>{s.durationMinutes} min</span>
                        <span>Engagement {s.engagement}/5</span>
                        <span className="transition-transform group-open:rotate-45">+</span>
                      </div>
                    </summary>
                    <div className="space-y-4 border-t border-line px-5 py-4">
                      <Field label="Observations">{s.observations}</Field>
                      {s.techniques && <Field label="Techniques">{s.techniques}</Field>}
                      <Field label="Progress">{s.progressNotes}</Field>
                      <Field label="Next steps">{s.nextSteps}</Field>
                    </div>
                  </details>
                </li>
              ))}
            </ol>
          )}
        </TabPanel>

        <TabPanel value="timeline">
          <SessionTimeline sessions={theirSessions} />
        </TabPanel>

        <TabPanel value="reports">
          {theirReports.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line p-8 text-center">
              <p className="text-ink-3">No progress reports yet for this client.</p>
              <div className="mt-4">
                <LinkButton href={`/admin/reports/new?client=${client.id}`} variant="black" size="md">
                  Generate first report
                </LinkButton>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-line rounded-xl border border-line bg-cream">
              {theirReports.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 p-4">
                  <div>
                    <div className="text-sm font-medium text-ink">
                      {r.occasionNote ?? "Progress report"}
                    </div>
                    <div className="text-xs text-ink-3">
                      {formatShortDate(r.windowStart)} → {formatShortDate(r.windowEnd)} · generated {relative(r.generatedAt)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {r.markedSharedAt ? (
                      <Tag tone="good">Shared {relative(r.markedSharedAt)}</Tag>
                    ) : r.exportedAt ? (
                      <Tag tone="neutral">Exported</Tag>
                    ) : (
                      <Tag tone="warn">Draft</Tag>
                    )}
                    <LinkButton href={`/admin/reports/${r.id}`} variant="outline" size="sm">
                      Open
                    </LinkButton>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </TabPanel>
      </Tabs>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-cream p-4">
      <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">{title}</div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">{label}</div>
      <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-ink-2">{children}</p>
    </div>
  );
}
