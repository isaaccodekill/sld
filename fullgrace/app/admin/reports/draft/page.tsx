"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { saveReportDraft, useClients } from "@/lib/admin-data";
import { useSavedSessions } from "@/lib/admin-store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

export default function DraftReportPage() {
  return <Suspense fallback={<div className="p-8 text-sm text-ink-3">Building report…</div>}><DraftReport /></Suspense>;
}

function DraftReport() {
  const { clients } = useClients();
  const params = useSearchParams();
  const saved = useSavedSessions().filter((item) => item.status === "final");
  const clientId = params.get("client") ?? clients[0]?.id ?? "";
  const start = params.get("start") ?? "";
  const end = params.get("end") ?? new Date().toLocaleDateString("en-CA");
  const occasion = params.get("occasion") ?? "Progress review";
  const client = clients.find((item) => item.id === clientId);
  const included = useMemo(
    () => saved.filter((item) => item.clientId === clientId && (!start || item.date >= start) && item.date <= end).sort((a, b) => a.date.localeCompare(b.date)),
    [clientId, end, saved, start],
  );
  const focus = Array.from(new Set(included.flatMap((item) => item.focusAreas.split(",").map((value) => value.trim()).filter(Boolean)))).slice(0, 5);
  const progress = included.map((item) => item.progressNotes).filter(Boolean).slice(-3).join(" ");
  const next = included.map((item) => item.nextSteps).filter(Boolean).slice(-2).join(" ");
  const reportDefaults = useMemo(() => ({
    title: occasion || "Progress review",
    opening: `${client?.firstName ?? "Your child"} has taken part in ${included.length} session${included.length === 1 ? "" : "s"} during this review period. This report shares the progress we are seeing and the next steps we recommend.`,
    noticing: progress || "Add a concise description of the progress observed across sessions.",
    nextSteps: next || "Add the next clinical priorities for the coming review period.",
    home: "Add one or two practical activities the family can use at home.",
  }), [client?.firstName, included.length, occasion, progress, next]);
  const [form, setForm] = useState(reportDefaults);
  const [pristine, setPristine] = useState(true);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  useEffect(() => {
    if (pristine) setForm(reportDefaults);
  }, [pristine, reportDefaults]);
  const set = (key: keyof typeof form, value: string) => {
    setPristine(false);
    setForm((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <nav className="print:hidden"><Link href="/admin/reports/new" className="text-sm text-ink-3 hover:text-ink">← Report setup</Link></nav>
      <header className="flex flex-wrap items-end justify-between gap-4 print:hidden">
        <div><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">Draft · {included.length} final notes included</p><h1 className="font-display text-3xl">Review and personalise</h1><p className="text-sm text-ink-2">The therapist stays in control of every parent-facing sentence.</p></div>
        <div className="flex flex-wrap items-center gap-2"><Button variant="outline" onClick={() => window.print()}>Print / Save PDF</Button><Button disabled={saveState === "saving"} onClick={async () => { setSaveState("saving"); try { await saveReportDraft({ clientId, windowStart: start || client?.startDate || end, windowEnd: end, occasion, title: form.title, sections: { opening: form.opening, focus: focus.join("\n"), noticing: form.noticing, nextSteps: form.nextSteps, home: form.home } }); setSaveState("saved"); } catch { setSaveState("error"); } }}>{saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved" : "Save draft"}</Button>{saveState === "error" && <span role="alert" className="text-sm text-puzzle-red">Could not save</span>}</div>
      </header>
      <div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
        <form className="space-y-5 rounded-2xl border border-line bg-white p-6 print:hidden">
          <Input label="Report title" value={form.title} onChange={(e) => set("title", e.target.value)} />
          <Textarea label="Opening note" rows={5} value={form.opening} onChange={(e) => set("opening", e.target.value)} />
          <Textarea label="Progress we are noticing" rows={7} value={form.noticing} onChange={(e) => set("noticing", e.target.value)} />
          <Textarea label="What comes next" rows={5} value={form.nextSteps} onChange={(e) => set("nextSteps", e.target.value)} />
          <Textarea label="Ideas for home" rows={5} value={form.home} onChange={(e) => set("home", e.target.value)} />
        </form>
        <article className="min-h-[850px] rounded-2xl border border-line bg-white p-5 shadow-[0_18px_60px_rgba(23,35,45,0.06)] sm:p-8 md:p-12 print:border-0 print:p-0 print:shadow-none">
          <div className="border-b border-line pb-7"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-green">Fullgrace Therapy &amp; Learning</p><h2 className="mt-3 font-display text-4xl">{form.title}</h2><div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-2"><span><strong>Child:</strong> {client?.firstName}</span><span><strong>Period:</strong> {start || client?.startDate} – {end}</span></div></div>
          <section className="report-section"><p>{form.opening}</p></section>
          <section className="report-section"><h3>What we have been working on</h3>{focus.length ? <ul>{focus.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="text-ink-3">Add focus areas in the session notes to populate this section.</p>}</section>
          <section className="report-section"><h3>Progress we are noticing</h3><p>{form.noticing}</p></section>
          <section className="report-section"><h3>Ideas for home</h3><p>{form.home}</p></section>
          <section className="report-section"><h3>What comes next</h3><p>{form.nextSteps}</p></section>
          <footer className="mt-12 border-t border-line pt-5 text-xs text-ink-3">Prepared with care by Fullgrace Therapy &amp; Learning.</footer>
        </article>
      </div>
    </div>
  );
}
