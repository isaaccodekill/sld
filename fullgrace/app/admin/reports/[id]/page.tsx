"use client";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { getClient, getReport, reports, sessionsFor, therapist } from "@/lib/mock";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { ReportPDFPreview } from "@/components/admin/ReportPDFPreview";
import { Dialog } from "@/components/ui/Dialog";
import { formatDate } from "@/lib/format";

export default function ReportEditorPage() {
  const params = useParams<{ id: string }>();
  const base = useMemo(() => (params?.id ? getReport(params.id) : undefined), [params?.id]);
  if (!base) notFound();

  const client = getClient(base.clientId);
  if (!client) notFound();

  const sessionsCount = sessionsFor(client.id).filter(
    (s) => s.date >= base.windowStart && s.date <= base.windowEnd,
  ).length;

  const [sections, setSections] = useState(base.sections);
  const [occasion, setOccasion] = useState(base.occasionNote ?? "");
  const [confirmRegen, setConfirmRegen] = useState(false);
  const [confirmManual, setConfirmManual] = useState(false);
  const [shared, setShared] = useState(!!base.markedSharedAt);

  const set = <K extends keyof typeof sections>(k: K, v: (typeof sections)[K]) =>
    setSections((s) => ({ ...s, [k]: v }));

  const setListAt = (k: "workingOn" | "homeSuggestions", i: number, v: string) =>
    setSections((s) => ({
      ...s,
      [k]: s[k].map((item, idx) => (idx === i ? v : item)),
    }));

  const addListItem = (k: "workingOn" | "homeSuggestions") =>
    setSections((s) => ({ ...s, [k]: [...s[k], ""] }));

  const removeListItem = (k: "workingOn" | "homeSuggestions", i: number) =>
    setSections((s) => ({ ...s, [k]: s[k].filter((_, idx) => idx !== i) }));

  return (
    <div className="space-y-4">
      <nav className="flex items-center justify-between text-sm no-print">
        <Link href={`/admin/clients/${client.id}`} className="text-ink-3 hover:text-ink">
          ← {client.firstName}
        </Link>
        <div className="flex items-center gap-2">
          {shared ? <Tag tone="good">Shared with parent</Tag> : base.exportedAt ? <Tag tone="neutral">Exported</Tag> : <Tag tone="warn">Draft</Tag>}
        </div>
      </nav>

      <header className="no-print flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="font-display text-3xl font-medium">Report editor — {client.firstName}</h1>
          <p className="text-sm text-ink-2">
            {formatDate(base.windowStart)} → {formatDate(base.windowEnd)} · {sessionsCount} sessions
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setConfirmRegen(true)}>Regenerate draft</Button>
          <Button variant="ghost" size="sm" onClick={() => setConfirmManual(true)}>Write manually</Button>
          <Button variant="ghost" size="sm" onClick={() => setShared((x) => !x)}>
            {shared ? "Unmark shared" : "Mark as shared"}
          </Button>
          <Button variant="primary" size="sm" onClick={() => window.print()}>
            Export PDF
          </Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2 print-root">
        {/* Editor pane */}
        <div className="no-print space-y-5">
          <div className="rounded-xl border border-line bg-cream p-5">
            <label className="block text-sm font-medium text-ink-2">What's the occasion?</label>
            <input
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              placeholder="End of term, mid-point review, parent's request…"
              className="mt-1.5 w-full rounded-md border border-line bg-cream px-3 py-2 text-sm text-ink focus:border-green focus:outline-none focus:ring-2 focus:ring-green/20"
            />
            <p className="mt-1 text-xs text-ink-3">Shapes the opening sentence.</p>
          </div>

          <Section title="A note from your therapist">
            <Textarea
              label=""
              rows={5}
              value={sections.note}
              onChange={(e) => set("note", e.target.value)}
              className="bg-cream"
            />
          </Section>

          <Section title="What we've been working on">
            <List
              items={sections.workingOn}
              onChange={(i, v) => setListAt("workingOn", i, v)}
              onRemove={(i) => removeListItem("workingOn", i)}
              onAdd={() => addListItem("workingOn")}
              placeholder="Short bullet"
            />
          </Section>

          <Section title="What we're noticing">
            <Textarea
              label=""
              rows={7}
              value={sections.noticing}
              onChange={(e) => set("noticing", e.target.value)}
            />
          </Section>

          <Section title="Suggestions for home">
            <List
              items={sections.homeSuggestions}
              onChange={(i, v) => setListAt("homeSuggestions", i, v)}
              onRemove={(i) => removeListItem("homeSuggestions", i)}
              onAdd={() => addListItem("homeSuggestions")}
              placeholder="One activity the parent can try"
            />
          </Section>

          <Section title="What's next">
            <Textarea
              label=""
              rows={4}
              value={sections.whatsNext}
              onChange={(e) => set("whatsNext", e.target.value)}
            />
          </Section>

          <div className="rounded-xl border border-dashed border-puzzle-yellow/40 bg-puzzle-yellow/10 p-4 text-xs text-ink-2">
            <strong className="font-medium">Review before exporting.</strong> This draft is AI-assisted.
            Cross-check every claim against your session notes — especially names, dates, and specific examples.
          </div>
        </div>

        {/* Preview pane */}
        <div className="overflow-hidden">
          <div className="no-print mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
            Print preview
          </div>
          <div className="overflow-x-auto rounded-md bg-cream-2/40 p-4">
            <div style={{ transform: "scale(0.82)", transformOrigin: "top left" }}>
              <ReportPDFPreview
                client={client}
                therapist={therapist}
                report={{ ...base, sections, occasionNote: occasion || undefined }}
                sessionCount={sessionsCount}
              />
            </div>
          </div>
        </div>
      </div>

      <Dialog open={confirmRegen} onClose={() => setConfirmRegen(false)} title="Regenerate draft?">
        <p className="text-sm text-ink-2">
          This will replace the current draft with a fresh AI-generated version. Any edits you've made will be discarded.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setConfirmRegen(false)}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={() => setConfirmRegen(false)}>Regenerate (mock)</Button>
        </div>
      </Dialog>

      <Dialog open={confirmManual} onClose={() => setConfirmManual(false)} title="Write from scratch?">
        <p className="text-sm text-ink-2">
          This will clear the current draft. You'll get a blank editor with the same section headings.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setConfirmManual(false)}>Cancel</Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setSections({
                note: "",
                workingOn: [""],
                noticing: "",
                homeSuggestions: [""],
                whatsNext: "",
              });
              setConfirmManual(false);
            }}
          >
            Clear and write manually
          </Button>
        </div>
      </Dialog>
      {/* silence unused reports import — keeps index stable */}
      <div className="sr-only">{reports.length}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 font-display text-lg text-green">{title}</h3>
      {children}
    </section>
  );
}

function List({
  items,
  onChange,
  onRemove,
  onAdd,
  placeholder,
}: {
  items: string[];
  onChange: (i: number, v: string) => void;
  onRemove: (i: number) => void;
  onAdd: () => void;
  placeholder: string;
}) {
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="flex items-start gap-2">
          <span aria-hidden className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-green" />
          <input
            value={it}
            onChange={(e) => onChange(i, e.target.value)}
            placeholder={placeholder}
            className="flex-1 rounded-md border border-line bg-cream px-3 py-2 text-sm text-ink focus:border-green focus:outline-none focus:ring-2 focus:ring-green/20"
          />
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="rounded-md p-2 text-ink-3 hover:text-ink"
            aria-label={`Remove item ${i + 1}`}
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-green hover:bg-green-3"
      >
        + Add item
      </button>
    </div>
  );
}
