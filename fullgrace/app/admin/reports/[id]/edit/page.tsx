"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { updateProgressReport, useClients, useReports } from "@/lib/admin-data";
import type { ProgressReport } from "@/lib/mock/types";

export default function EditProgressReportPage() {
  const params = useParams<{ id: string }>();
  const reports = useReports();
  const { clients } = useClients();
  const report = reports.find((item) => item.id === params.id);

  if (!report) {
    return <div className="rounded-2xl border border-line bg-white p-8"><h1 className="font-display text-2xl">Loading report…</h1><Link href="/admin/reports" className="mt-4 inline-block text-green">← Back to reports</Link></div>;
  }

  return <ProgressReportForm key={report.id} report={report} clients={clients} />;
}

function ProgressReportForm({ report, clients }: { report: ProgressReport; clients: ReturnType<typeof useClients>["clients"] }) {
  const router = useRouter();
  const [form, setForm] = useState({
    clientId: report.clientId,
    title: report.title || report.occasionNote || "Progress report",
    occasion: report.occasionNote || "Progress review",
    windowStart: report.windowStart,
    windowEnd: report.windowEnd,
    opening: report.sections.note,
    focus: report.sections.workingOn.join("\n"),
    noticing: report.sections.noticing,
    home: report.sections.homeSuggestions.join("\n"),
    nextSteps: report.sections.whatsNext,
  });
  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((current) => ({ ...current, [key]: value }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <nav><Link href={`/admin/reports/${report.id}`} className="text-sm text-ink-3 hover:text-ink">← Back to report</Link></nav>
      <header><h1 className="font-display text-3xl font-medium">Edit progress report</h1><p className="text-sm text-ink-2">Update the parent-facing summary while keeping its current draft or shared status.</p></header>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          setSaving(true);
          setError("");
          try {
            await updateProgressReport({ id: report.id, clientId: form.clientId, windowStart: form.windowStart, windowEnd: form.windowEnd, occasion: form.occasion, title: form.title, sections: { opening: form.opening, focus: form.focus, noticing: form.noticing, home: form.home, nextSteps: form.nextSteps } });
            router.push(`/admin/reports/${report.id}?updated=1`);
            router.refresh();
          } catch (reason) {
            setError(reason instanceof Error ? reason.message : "The progress report could not be updated.");
            setSaving(false);
          }
        }}
        className="space-y-6 rounded-xl border border-line bg-cream p-4 sm:p-6 md:p-8"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Select label="Client" value={form.clientId} onChange={(event) => set("clientId", event.target.value)} options={clients.map((client) => ({ label: client.firstName, value: client.id }))} />
          <Input label="Report title" required value={form.title} onChange={(event) => set("title", event.target.value)} />
          <Input label="Review period starts" required type="date" value={form.windowStart} onChange={(event) => set("windowStart", event.target.value)} />
          <Input label="Review period ends" required type="date" value={form.windowEnd} onChange={(event) => set("windowEnd", event.target.value)} />
          <Input className="md:col-span-2" label="Occasion" value={form.occasion} onChange={(event) => set("occasion", event.target.value)} />
        </div>
        <Textarea label="Opening note" rows={5} value={form.opening} onChange={(event) => set("opening", event.target.value)} />
        <Textarea label="What we have been working on" hint="Put each focus area on a new line." rows={5} value={form.focus} onChange={(event) => set("focus", event.target.value)} />
        <Textarea label="Progress we are noticing" rows={7} value={form.noticing} onChange={(event) => set("noticing", event.target.value)} />
        <div className="grid gap-5 md:grid-cols-2">
          <Textarea label="Ideas for home" hint="Put each suggestion on a new line." rows={5} value={form.home} onChange={(event) => set("home", event.target.value)} />
          <Textarea label="What comes next" rows={5} value={form.nextSteps} onChange={(event) => set("nextSteps", event.target.value)} />
        </div>
        {error && <p role="alert" className="rounded-lg border border-puzzle-red/25 bg-puzzle-red/5 p-3 text-sm text-puzzle-red">{error}</p>}
        <div className="grid grid-cols-2 gap-2 border-t border-line pt-6 sm:flex sm:justify-end sm:gap-3">
          <Link href={`/admin/reports/${report.id}`} className="inline-flex items-center px-4 text-sm text-ink-3 hover:text-ink">Cancel</Link>
          <Button className="w-full sm:w-auto" type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
        </div>
      </form>
    </div>
  );
}
