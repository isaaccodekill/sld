"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { clients, getClient } from "@/lib/mock";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";

export default function NewSessionPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-ink-3">Loading…</div>}>
      <NewSessionInner />
    </Suspense>
  );
}

function NewSessionInner() {
  const params = useSearchParams();
  const preClient = params?.get("client") ?? clients[0]?.id ?? "";

  const [form, setForm] = useState({
    clientId: preClient,
    date: new Date().toISOString().slice(0, 10),
    duration: "45",
    sessionType: "therapy",
    focusAreas: "",
    observations: "",
    techniques: "",
    engagement: "4",
    progress: "",
    nextSteps: "",
    tag: "good",
  });
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const [savedAt, setSavedAt] = useState<number | null>(null);
  useEffect(() => {
    const t = window.setTimeout(() => setSavedAt(Date.now()), 1200);
    return () => window.clearTimeout(t);
  }, [form]);

  const secondsAgo = useMemo(() => {
    if (!savedAt) return null;
    return Math.round((Date.now() - savedAt) / 1000);
  }, [savedAt]);

  const client = getClient(form.clientId);

  const [done, setDone] = useState(false);
  if (done) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-line bg-cream p-8">
        <h1 className="font-display text-2xl">Session logged (mock).</h1>
        <p className="mt-2 text-ink-2">In the real system this would save to the database and update the AI "since last session" summary.</p>
        <div className="mt-5 flex gap-3">
          <Link href={`/admin/clients/${form.clientId}`} className="text-green hover:text-green-2">
            ← Back to client
          </Link>
          <Link href="/admin/sessions" className="text-ink-3 hover:text-ink">
            Sessions list
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <nav className="flex items-center justify-between text-sm">
        <Link href="/admin/sessions" className="text-ink-3 hover:text-ink">
          ← Sessions
        </Link>
        <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
          {savedAt ? `Draft saved ${secondsAgo ?? 0}s ago` : "Draft will autosave…"}
        </div>
      </nav>

      <header>
        <h1 className="font-display text-3xl font-medium">Log a session</h1>
        {client && (
          <p className="text-sm text-ink-2">
            for <span className="text-ink">{client.firstName}</span>
          </p>
        )}
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setDone(true);
        }}
        className="space-y-8 rounded-xl border border-line bg-cream p-6 md:p-8"
      >
        <div className="grid gap-5 md:grid-cols-3">
          <Select
            label="Client"
            value={form.clientId}
            onChange={(e) => set("clientId", e.target.value)}
            options={clients.map((c) => ({ label: `${c.firstName} (${c.tags.join(", ")})`, value: c.id }))}
          />
          <Input label="Date" type="date" value={form.date} onChange={(e) => set("date", e.target.value)} required />
          <Input label="Duration (min)" type="number" min={5} max={180} value={form.duration} onChange={(e) => set("duration", e.target.value)} />
          <Select
            label="Session type"
            value={form.sessionType}
            onChange={(e) => set("sessionType", e.target.value)}
            options={[
              { label: "Assessment", value: "assessment" },
              { label: "Therapy", value: "therapy" },
              { label: "Parent consult", value: "parent_consult" },
              { label: "Review", value: "review" },
            ]}
          />
          <Input
            label="Focus areas"
            placeholder="Short — e.g. requesting verbs"
            value={form.focusAreas}
            onChange={(e) => set("focusAreas", e.target.value)}
            className="md:col-span-2"
          />
        </div>

        <Textarea
          label="Observations"
          rows={8}
          hint="Markdown supported."
          value={form.observations}
          onChange={(e) => set("observations", e.target.value)}
        />

        <div className="grid gap-5 md:grid-cols-2">
          <Textarea
            label="Techniques / materials used"
            rows={3}
            value={form.techniques}
            onChange={(e) => set("techniques", e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-ink-2">Engagement (1–5)</label>
            <div className="mt-2 flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => set("engagement", String(n))}
                  className={`h-10 w-10 rounded-md border text-sm font-medium transition-colors ${
                    Number(form.engagement) === n
                      ? "border-green bg-green-3 text-green-2"
                      : "border-line bg-cream text-ink-2 hover:border-ink/30"
                  }`}
                  aria-label={`Engagement ${n}`}
                >
                  {n}
                </button>
              ))}
              <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
                {
                  ["withdrawn", "reluctant", "engaged", "engaged", "highly engaged"][
                    Number(form.engagement) - 1
                  ]
                }
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Textarea
            label="Progress against goals"
            rows={5}
            value={form.progress}
            onChange={(e) => set("progress", e.target.value)}
          />
          <Textarea
            label="Next steps"
            rows={5}
            value={form.nextSteps}
            onChange={(e) => set("nextSteps", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-2">Session tag</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {(["good", "challenging", "admin"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => set("tag", t)}
                className={`rounded-md border px-3 py-1.5 text-xs transition-colors ${
                  form.tag === t ? "border-green bg-green-3" : "border-line bg-cream hover:border-ink/30"
                }`}
              >
                <Tag tone={t === "good" ? "good" : t === "challenging" ? "warn" : "admin"}>{t}</Tag>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-line pt-6">
          <Link href="/admin/sessions" className="inline-flex items-center px-4 text-sm text-ink-3 hover:text-ink">
            Cancel
          </Link>
          <Button type="submit" variant="primary" size="md">
            Save session
          </Button>
        </div>
      </form>
    </div>
  );
}
