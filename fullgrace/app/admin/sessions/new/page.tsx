"use client";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useClients } from "@/lib/admin-data";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { createId, saveSession, useAppointments, useSavedSessions } from "@/lib/admin-store";
import type { SessionType } from "@/lib/mock/types";

export default function NewSessionPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-ink-3">Loading…</div>}>
      <NewSessionInner />
    </Suspense>
  );
}

function NewSessionInner() {
  const { clients } = useClients();
  const params = useSearchParams();
  const requestedClient = params?.get("client") ?? "";
  const preClient = requestedClient || clients[0]?.id || "";
  const appointmentId = params?.get("appointment") ?? undefined;
  const editId = params?.get("edit") ?? "";
  const appointments = useAppointments();
  const savedSessions = useSavedSessions();
  const editingSession = savedSessions.find((item) => item.id === editId);
  const appointment = appointments.find((item) => item.id === appointmentId);
  const generatedId = useMemo(() => createId("session"), []);
  const draftId = editingSession?.id ?? generatedId;

  const [form, setForm] = useState({
    clientId: preClient,
    date: appointment?.date ?? new Date().toISOString().slice(0, 10),
    duration: String(appointment?.durationMinutes ?? 45),
    sessionType: appointment?.sessionType ?? "therapy",
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
  const [done, setDone] = useState(false);
  const autosaveTimer = useRef<number | null>(null);
  const loadedEditId = useRef<string | null>(null);

  useEffect(() => {
    if (!editingSession || loadedEditId.current === editingSession.id) return;
    loadedEditId.current = editingSession.id;
    setForm({
      clientId: editingSession.clientId,
      date: editingSession.date,
      duration: String(editingSession.durationMinutes),
      sessionType: editingSession.sessionType as SessionType,
      focusAreas: editingSession.focusAreas,
      observations: editingSession.observations,
      techniques: editingSession.techniques,
      engagement: String(editingSession.engagement),
      progress: editingSession.progressNotes,
      nextSteps: editingSession.nextSteps,
      tag: editingSession.tag,
    });
  }, [editingSession]);

  useEffect(() => {
    if (!clients.length) return;
    setForm((current) => {
      const preferredClient = appointment?.clientId || requestedClient;
      const nextClient = preferredClient && clients.some((item) => item.id === preferredClient)
        ? preferredClient
        : clients.some((item) => item.id === current.clientId)
          ? current.clientId
          : clients[0].id;
      return {
        ...current,
        clientId: nextClient,
        ...(appointment ? {
          date: appointment.date,
          duration: String(appointment.durationMinutes),
          sessionType: appointment.sessionType,
        } : {}),
      };
    });
  }, [appointment, clients, requestedClient]);

  useEffect(() => {
    if (done || !form.clientId || (editId && !editingSession)) return;
    autosaveTimer.current = window.setTimeout(() => {
      saveSession({ id: draftId, appointmentId: editingSession?.appointmentId ?? appointmentId, clientId: form.clientId, date: form.date, durationMinutes: Number(form.duration), sessionType: form.sessionType, focusAreas: form.focusAreas, observations: form.observations, techniques: form.techniques, engagement: Number(form.engagement), progressNotes: form.progress, nextSteps: form.nextSteps, tag: form.tag, status: editingSession?.status ?? "draft", updatedAt: new Date().toISOString() });
      setSavedAt(Date.now());
    }, 900);
    return () => {
      if (autosaveTimer.current) window.clearTimeout(autosaveTimer.current);
    };
  }, [appointmentId, done, draftId, editId, editingSession, form]);

  const secondsAgo = useMemo(() => {
    if (!savedAt) return null;
    return Math.round((Date.now() - savedAt) / 1000);
  }, [savedAt]);

  const client = clients.find((item) => item.id === form.clientId);
  const finalisingDraft = !editingSession || editingSession.status === "draft";

  if (done) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-line bg-cream p-5 sm:p-8">
        <h1 className="font-display text-2xl">Session report {finalisingDraft ? "finalised" : "updated"}.</h1>
        <p className="mt-2 text-ink-2">The report is saved{finalisingDraft && (editingSession?.appointmentId || appointmentId) ? " and the linked appointment has been marked complete." : "."}</p>
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
          ← Session reports
        </Link>
        <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
          {savedAt ? `Draft saved ${secondsAgo ?? 0}s ago` : "Draft will autosave…"}
        </div>
      </nav>

      <header>
        <h1 className="font-display text-3xl font-medium">{editingSession ? "Edit session report" : "Log a session report"}</h1>
        {client && (
          <p className="text-sm text-ink-2">
            for <span className="text-ink">{client.firstName}</span>
          </p>
        )}
      </header>

      <form
        data-tour="session-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (autosaveTimer.current) window.clearTimeout(autosaveTimer.current);
          saveSession({ id: draftId, appointmentId: editingSession?.appointmentId ?? appointmentId, clientId: form.clientId, date: form.date, durationMinutes: Number(form.duration), sessionType: form.sessionType, focusAreas: form.focusAreas, observations: form.observations, techniques: form.techniques, engagement: Number(form.engagement), progressNotes: form.progress, nextSteps: form.nextSteps, tag: form.tag, status: "final", updatedAt: new Date().toISOString() });
          setDone(true);
        }}
        className="space-y-7 rounded-xl border border-line bg-cream p-4 sm:p-6 md:p-8"
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
            onChange={(e) => set("sessionType", e.target.value as typeof form.sessionType)}
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
            <div className="mt-2 flex flex-wrap items-center gap-2">
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
              <span className="w-full font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3 sm:ml-2 sm:w-auto">
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

        <div data-tour="session-finalize" className="grid grid-cols-2 gap-2 border-t border-line pt-6 sm:flex sm:justify-end sm:gap-3">
          <Link href="/admin/sessions" className="inline-flex items-center px-4 text-sm text-ink-3 hover:text-ink">
            Cancel
          </Link>
          <Button className="w-full sm:w-auto" type="submit" variant="primary" size="md">
            {editingSession?.status === "final" ? "Save changes" : "Finalise report"}
          </Button>
        </div>
      </form>
    </div>
  );
}
