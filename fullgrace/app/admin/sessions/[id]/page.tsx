"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { LinkButton } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { useClients } from "@/lib/admin-data";
import { useSavedSessions } from "@/lib/admin-store";
import { formatDate } from "@/lib/format";

export default function SessionReportPage() {
  const params = useParams<{ id: string }>();
  const sessions = useSavedSessions();
  const { clients } = useClients();
  const session = sessions.find((item) => item.id === params.id);
  const client = session ? clients.find((item) => item.id === session.clientId) : undefined;

  if (!session) {
    return <div className="rounded-2xl border border-line bg-white p-8"><h1 className="font-display text-2xl">Loading session report…</h1><Link href="/admin/sessions" className="mt-4 inline-block text-green">← Back to session reports</Link></div>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <nav className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/sessions" className="text-sm text-ink-3 hover:text-ink">← Session reports</Link>
        <LinkButton href={`/admin/sessions/new?edit=${session.id}`} size="sm" className="min-w-[120px]">Edit report</LinkButton>
      </nav>

      <article className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_18px_60px_rgba(23,35,45,.05)]">
        <header className="border-b border-line bg-cream-2/40 p-5 sm:p-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-green">Session report</p>
          <div className="mt-2 flex flex-wrap items-center gap-3"><h1 className="font-display text-3xl sm:text-4xl">{client?.firstName ?? "Client"}</h1><Tag tone={session.status === "draft" ? "warn" : "good"}>{session.status}</Tag></div>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-2">
            <span>{formatDate(session.date, { day: "numeric", month: "long", year: "numeric" })}</span>
            <span className="capitalize">{session.sessionType.replace("_", " ")}</span>
            <span>{session.durationMinutes} minutes</span>
            <span>Engagement {session.engagement}/5</span>
          </div>
          {client && <Link href={`/admin/clients/${client.id}`} className="mt-4 inline-block text-sm font-medium text-green hover:text-green-2">View {client.firstName}&apos;s profile →</Link>}
        </header>

        <div className="grid gap-0 md:grid-cols-2">
          <ReportField label="Focus areas" className="md:col-span-2">{session.focusAreas}</ReportField>
          <ReportField label="Observations" className="md:col-span-2">{session.observations}</ReportField>
          <ReportField label="Techniques / materials used">{session.techniques}</ReportField>
          <ReportField label="Session tag"><Tag tone={session.tag === "good" ? "good" : session.tag === "challenging" ? "warn" : "admin"}>{session.tag || "Not tagged"}</Tag></ReportField>
          <ReportField label="Progress against goals">{session.progressNotes}</ReportField>
          <ReportField label="Next steps">{session.nextSteps}</ReportField>
        </div>
      </article>
    </div>
  );
}

function ReportField({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`border-b border-line p-5 last:border-b-0 md:border-r md:p-7 ${className}`}>
      <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">{label}</h2>
      <div className="mt-2 whitespace-pre-wrap text-sm leading-7 text-ink-2">{children || "Not recorded"}</div>
    </section>
  );
}
