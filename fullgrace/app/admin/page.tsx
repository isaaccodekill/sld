import Link from "next/link";
import {
  clients,
  enquiries,
  enquirySourceLabel,
  getClient,
  lastSessionDate,
  latestSinceLast,
  reports,
  sessions,
  tagLabel,
  therapist,
} from "@/lib/mock";
import { formatShortDate, formatTodayLong, daysSince, ageFromDOB } from "@/lib/format";
import { Tag } from "@/components/ui/Tag";
import { Chip } from "@/components/ui/Chip";
import { PuzzleDot } from "@/components/ui/PuzzleDot";

const FOLLOWUP_DAYS = 14;
const REPORT_DUE_WEEKS = 12;

export default function AdminDashboard() {
  const newEnquiries = enquiries.filter((e) => e.status === "new");
  const recent = clients
    .map((c) => ({ client: c, last: lastSessionDate(c.id) }))
    .sort((a, b) => (b.last ?? "").localeCompare(a.last ?? ""))
    .slice(0, 5);

  const needFollowup = clients
    .filter((c) => c.status === "active")
    .map((c) => ({ client: c, last: lastSessionDate(c.id) }))
    .filter(({ last }) => !last || daysSince(last) > FOLLOWUP_DAYS);

  const reportsDue = clients
    .filter((c) => c.status === "active")
    .filter((c) => {
      const theirReports = reports.filter((r) => r.clientId === c.id);
      const latest = theirReports.sort((a, b) => b.generatedAt.localeCompare(a.generatedAt))[0];
      if (!latest) return true;
      return daysSince(latest.generatedAt) > REPORT_DUE_WEEKS * 7;
    });

  const todaySessionsCount = sessions.filter((s) => s.date === new Date().toISOString().slice(0, 10)).length;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
          Today, {formatTodayLong()}
        </div>
        <h1 className="font-display text-4xl font-medium tracking-[-0.02em]">Welcome back, {therapist.name.split(" ")[0]}.</h1>
        <p className="max-w-prose text-ink-2">
          {todaySessionsCount === 0
            ? "No sessions scheduled yet for today — a good window to catch up on notes."
            : `${todaySessionsCount} session${todaySessionsCount === 1 ? "" : "s"} on the board today.`}
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-3">
        <StatCard label="Active clients" value={clients.filter((c) => c.status === "active").length} color="blue" />
        <StatCard
          label="Sessions this month"
          value={sessions.filter((s) => s.date.startsWith(new Date().toISOString().slice(0, 7))).length}
          color="green"
        />
        <StatCard label="Reports shared this quarter" value={reports.filter((r) => r.markedSharedAt).length} color="yellow" />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <section className="rounded-xl border border-line bg-cream p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl">New enquiries</h2>
            <Link href="/admin/enquiries" className="text-sm text-green hover:text-green-2">
              All enquiries →
            </Link>
          </div>
          {newEnquiries.length === 0 ? (
            <p className="mt-4 text-sm text-ink-3">You're all caught up.</p>
          ) : (
            <ul className="mt-4 divide-y divide-line">
              {newEnquiries.slice(0, 4).map((e) => (
                <li key={e.id}>
                  <Link href={`/admin/enquiries/${e.id}`} className="flex items-start gap-3 py-3 hover:bg-cream-2/60">
                    <span aria-hidden className="mt-2 h-2 w-2 shrink-0 rounded-full bg-puzzle-red" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Chip color={e.source === "form_referrer" ? "green" : e.source === "form_quick" ? "blue" : "yellow"}>
                          {enquirySourceLabel(e.source)}
                        </Chip>
                        <span className="text-sm text-ink">
                          {e.payload.parentName ?? e.payload.referrerName}
                        </span>
                        {e.payload.childFirstName && (
                          <span className="text-xs text-ink-3">
                            · {e.payload.childFirstName} ({e.payload.childAge})
                          </span>
                        )}
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-ink-2">
                        {e.payload.concern ?? e.payload.message}
                      </p>
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3">
                      {formatShortDate(e.receivedAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-line bg-cream p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl">Recent clients</h2>
            <Link href="/admin/clients" className="text-sm text-green hover:text-green-2">
              All clients →
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-line">
            {recent.map(({ client: c, last }) => {
              const sum = latestSinceLast(c.id);
              return (
                <li key={c.id}>
                  <Link href={`/admin/clients/${c.id}`} className="block py-3 hover:bg-cream-2/60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ClientAvatar name={c.firstName} />
                        <div>
                          <div className="text-sm font-medium text-ink">
                            {c.firstName} <span className="text-ink-3">· age {ageFromDOB(c.dob)}</span>
                          </div>
                          <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
                            {c.tags.map(tagLabel).join(" · ")}
                          </div>
                        </div>
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3">
                        {last ? formatShortDate(last) : "no sessions"}
                      </span>
                    </div>
                    {sum && (
                      <p className="mt-2 line-clamp-2 rounded-md bg-cream-2/60 p-2 text-xs text-ink-2">
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
                          Since last ·
                        </span>{" "}
                        {sum.editedOutput ?? sum.rawOutput}
                      </p>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <section className="rounded-xl border border-line bg-cream p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl">Needs follow-up</h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
              {">"} {FOLLOWUP_DAYS} days
            </span>
          </div>
          {needFollowup.length === 0 ? (
            <p className="mt-4 text-sm text-ink-3">No one is overdue — nice work.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {needFollowup.map(({ client: c, last }) => (
                <li key={c.id}>
                  <Link
                    href={`/admin/clients/${c.id}`}
                    className="flex items-center justify-between rounded-md p-2 hover:bg-cream-2/60"
                  >
                    <div className="flex items-center gap-3">
                      <PuzzleDot color="yellow" size={8} />
                      <span className="text-sm text-ink">{c.firstName}</span>
                      <span className="text-xs text-ink-3">{c.tags.map(tagLabel).join(", ")}</span>
                    </div>
                    <span className="text-xs text-ink-3">
                      {last ? `${daysSince(last)} days ago` : "no sessions"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-line bg-cream p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl">Reports due</h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
              {">"} {REPORT_DUE_WEEKS} weeks
            </span>
          </div>
          {reportsDue.length === 0 ? (
            <p className="mt-4 text-sm text-ink-3">Everyone's up to date.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {reportsDue.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/admin/clients/${c.id}`}
                    className="flex items-center justify-between rounded-md p-2 hover:bg-cream-2/60"
                  >
                    <div className="flex items-center gap-3">
                      <PuzzleDot color="blue" size={8} />
                      <span className="text-sm text-ink">{c.firstName}</span>
                    </div>
                    <Tag tone="neutral">Nudge</Tag>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "blue" | "yellow" | "green";
}) {
  return (
    <div className="rounded-xl border border-line bg-cream p-5">
      <div className="flex items-center gap-2">
        <PuzzleDot color={color} size={8} />
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">{label}</span>
      </div>
      <div className="mt-3 font-display text-4xl font-medium tracking-tight">{value}</div>
    </div>
  );
}

function ClientAvatar({ name }: { name: string }) {
  const initials = name.slice(0, 1);
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-3 font-display text-sm text-green-2">
      {initials}
    </div>
  );
}

// Import used outside — silence lint-unused since getClient isn't used directly here but kept for future.
void getClient;
