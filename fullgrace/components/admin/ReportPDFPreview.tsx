import type { Client, ProgressReport, Therapist } from "@/lib/mock";
import { formatDate } from "@/lib/format";
import { BUSINESS_ADDRESS_LINE_1, BUSINESS_ADDRESS_LINE_2, BUSINESS_EMAIL, BUSINESS_NAME, BUSINESS_PHONE } from "@/lib/constants";
import { LogoMark } from "@/components/ui/Logo";

type Props = {
  client: Client;
  therapist: Therapist;
  report: ProgressReport;
  sessionCount: number;
};

export function ReportPDFPreview({ client, therapist, report, sessionCount }: Props) {
  return (
    <article
      className="print-page mx-auto bg-white text-ink shadow-xl ring-1 ring-line"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "22mm 18mm",
        fontFamily: "var(--font-body)",
      }}
    >
      <header className="flex items-start justify-between border-b border-line pb-5">
        <div className="flex items-center gap-3">
          <LogoMark size={44} />
          <div>
            <div className="font-display text-lg leading-tight">{BUSINESS_NAME}</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
              {BUSINESS_ADDRESS_LINE_1} · {BUSINESS_ADDRESS_LINE_2}
            </div>
          </div>
        </div>
        <div className="text-right font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
          Report · {formatDate(report.generatedAt)}
        </div>
      </header>

      <div className="mt-8">
        <h1 className="font-display text-[2.4rem] font-medium leading-[1.05] tracking-[-0.02em]">
          Progress update for {client.firstName}
        </h1>
        <p className="mt-2 text-sm text-ink-3">
          Covering sessions from {formatDate(report.windowStart)} to {formatDate(report.windowEnd)} · {sessionCount} sessions
          {report.occasionNote && ` · ${report.occasionNote}`}
        </p>
      </div>

      <Section title="A note from your therapist">
        <p>{report.sections.note}</p>
      </Section>

      <Section title="What we've been working on">
        <ul className="list-disc space-y-1.5 pl-5">
          {report.sections.workingOn.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      </Section>

      <Section title="What we're noticing">
        <p className="whitespace-pre-wrap">{report.sections.noticing}</p>
      </Section>

      <Section title="Suggestions for home">
        <ul className="list-disc space-y-1.5 pl-5">
          {report.sections.homeSuggestions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </Section>

      <Section title="What's next">
        <p>{report.sections.whatsNext}</p>
      </Section>

      <footer className="mt-12 border-t border-line pt-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="font-display text-lg leading-tight">{therapist.name}</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
              {therapist.role}
            </div>
          </div>
          <div className="text-right text-xs text-ink-3">
            {BUSINESS_EMAIL}
            <br />
            {BUSINESS_PHONE}
          </div>
        </div>
        <p className="mt-6 text-[10px] uppercase tracking-[0.16em] text-ink-3">
          This report is confidential and intended for {client.parentName} only.
        </p>
      </footer>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <h2 className="font-display text-lg font-medium text-green">{title}</h2>
      <div className="mt-2 text-[14.5px] leading-[1.65] text-ink-2">{children}</div>
    </section>
  );
}
