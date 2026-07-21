"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button, LinkButton } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { useClients, useReports } from "@/lib/admin-data";
import { formatDate } from "@/lib/format";

export default function ReportPage() {
  const params = useParams<{ id: string }>();
  const reports = useReports();
  const { clients } = useClients();
  const report = reports.find((item) => item.id === params?.id);
  const client = report ? clients.find((item) => item.id === report.clientId) : undefined;

  if (!report || !client) return <div className="rounded-2xl border border-line bg-white p-8"><h1 className="font-display text-2xl">Loading report…</h1><Link href="/admin/reports" className="mt-4 inline-block text-green">← Back to reports</Link></div>;

  return (
    <div className="space-y-5">
      <nav className="flex flex-wrap items-center justify-between gap-3 print:hidden"><Link href="/admin/reports" className="text-sm text-ink-3 hover:text-ink">← Reports</Link><div className="flex flex-wrap items-center gap-2"><Tag tone={report.markedSharedAt ? "good" : "warn"}>{report.markedSharedAt ? "Shared" : "Draft"}</Tag><LinkButton href={`/admin/reports/${report.id}/edit`} variant="outline" size="sm">Edit report</LinkButton><Button variant="outline" size="sm" onClick={() => window.print()}>Print / Save PDF</Button></div></nav>
      <article className="mx-auto min-h-[850px] max-w-[820px] rounded-2xl border border-line bg-white p-6 shadow-[0_18px_60px_rgba(23,35,45,.06)] sm:p-10 md:p-14 print:border-0 print:p-0 print:shadow-none">
        <header className="border-b border-line pb-7"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-green">Fullgrace Children Therapy Centre</p><h1 className="mt-3 font-display text-3xl sm:text-4xl">{report.title || report.occasionNote || "Progress report"}</h1><div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-2"><span><strong>Child:</strong> {client.firstName}</span><span><strong>Period:</strong> {formatDate(report.windowStart)} – {formatDate(report.windowEnd)}</span></div></header>
        <ReportSection title="A note from your therapist"><p>{report.sections.note}</p></ReportSection>
        <ReportSection title="What we have been working on"><ul>{report.sections.workingOn.map((item) => <li key={item}>{item}</li>)}</ul></ReportSection>
        <ReportSection title="Progress we are noticing"><p>{report.sections.noticing}</p></ReportSection>
        <ReportSection title="Ideas for home"><ul>{report.sections.homeSuggestions.map((item) => <li key={item}>{item}</li>)}</ul></ReportSection>
        <ReportSection title="What comes next"><p>{report.sections.whatsNext}</p></ReportSection>
        <footer className="mt-12 border-t border-line pt-5 text-xs text-ink-3">Prepared with care by Fullgrace Children Therapy Centre.</footer>
      </article>
    </div>
  );
}

function ReportSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="report-section"><h2>{title}</h2>{children}</section>;
}
