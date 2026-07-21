"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { deleteClientRecord, updateClientRecord, useClients } from "@/lib/admin-data";
import type { Client, ClientStatus, ClientTag } from "@/lib/mock/types";

export default function EditClientPage() {
  const params = useParams<{ id: string }>();
  const { clients, loading } = useClients();
  const client = clients.find((item) => item.id === params.id);

  if (!client) {
    return (
      <div className="rounded-2xl border border-line bg-white p-8">
        <h1 className="font-display text-2xl">{loading ? "Loading client…" : "Client not found"}</h1>
        <Link href="/admin/clients" className="mt-4 inline-block text-green">← Back to clients</Link>
      </div>
    );
  }

  return <EditClientForm key={client.id} client={client} />;
}

function EditClientForm({ client }: { client: Client }) {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: client.firstName,
    nickname: client.nickname ?? "",
    dob: client.dob,
    parentName: client.parentName,
    parentPhone: client.parentPhone,
    parentEmail: client.parentEmail,
    relationship: client.relationship,
    primaryConcern: client.primaryConcern,
    hypothesis: client.workingHypothesis,
    tag: (client.tags[0] ?? "other") as ClientTag,
    startDate: client.startDate,
    internalNotes: client.internalNotes,
    status: client.status,
  });
  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((current) => ({ ...current, [key]: value }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <nav className="text-sm">
        <Link href={`/admin/clients/${client.id}`} className="text-ink-3 hover:text-ink">← {client.firstName}&apos;s profile</Link>
      </nav>
      <header className="space-y-1">
        <h1 className="font-display text-3xl font-medium">Edit {client.firstName}&apos;s details</h1>
        <p className="text-sm text-ink-2">Update personal, family and clinical information.</p>
      </header>

      <form
        onSubmit={async (event) => {
          event.preventDefault();
          setSaving(true);
          setError("");
          try {
            await updateClientRecord(client.id, {
              firstName: form.firstName,
              nickname: form.nickname,
              dob: form.dob,
              parentName: form.parentName,
              parentPhone: form.parentPhone,
              parentEmail: form.parentEmail,
              relationship: form.relationship,
              primaryConcern: form.primaryConcern,
              tags: [form.tag],
              workingHypothesis: form.hypothesis,
              startDate: form.startDate,
              internalNotes: form.internalNotes,
              status: form.status,
            });
            router.push(`/admin/clients/${client.id}?updated=1`);
            router.refresh();
          } catch (reason) {
            setError(reason instanceof Error ? reason.message : "The client could not be updated.");
            setSaving(false);
          }
        }}
        className="space-y-7 rounded-xl border border-line bg-cream p-4 sm:p-6 md:p-8"
      >
        <Section title="About the child">
          <div className="grid gap-5 md:grid-cols-2">
            <Input label="First name" required value={form.firstName} onChange={(event) => set("firstName", event.target.value)} />
            <Input label="Nickname" value={form.nickname} onChange={(event) => set("nickname", event.target.value)} />
            <Input label="Date of birth" type="date" required max={new Date().toISOString().slice(0, 10)} value={form.dob} onChange={(event) => set("dob", event.target.value)} />
            <Input label="Start date" type="date" required value={form.startDate} onChange={(event) => set("startDate", event.target.value)} />
            <Select
              label="Client status"
              value={form.status}
              onChange={(event) => set("status", event.target.value as ClientStatus)}
              options={[
                { label: "Active", value: "active" },
                { label: "Paused", value: "paused" },
                { label: "Discharged", value: "discharged" },
              ]}
            />
          </div>
        </Section>

        <Section title="Parent / guardian">
          <div className="grid gap-5 md:grid-cols-2">
            <Input label="Parent or guardian name" required value={form.parentName} onChange={(event) => set("parentName", event.target.value)} />
            <Input label="Relationship" placeholder="Mother, father, grandparent…" value={form.relationship} onChange={(event) => set("relationship", event.target.value)} />
            <Input label="Phone" type="tel" value={form.parentPhone} onChange={(event) => set("parentPhone", event.target.value)} />
            <Input label="Email" type="email" value={form.parentEmail} onChange={(event) => set("parentEmail", event.target.value)} />
          </div>
        </Section>

        <Section title="Clinical">
          <div className="grid gap-5">
            <Textarea label="Primary concern" rows={4} value={form.primaryConcern} onChange={(event) => set("primaryConcern", event.target.value)} hint="The parent's words are fine; you can reshape them later." />
            <Select
              label="Working hypothesis — tag"
              value={form.tag}
              onChange={(event) => set("tag", event.target.value as ClientTag)}
              options={[
                { label: "Speech & language delay", value: "speech_delay" },
                { label: "Autism Spectrum Disorder", value: "asd" },
                { label: "Down's Syndrome", value: "downs" },
                { label: "Other", value: "other" },
              ]}
            />
            <Textarea label="Working hypothesis — notes" rows={3} value={form.hypothesis} onChange={(event) => set("hypothesis", event.target.value)} />
            <Textarea label="Internal notes (therapist-only)" rows={4} value={form.internalNotes} onChange={(event) => set("internalNotes", event.target.value)} />
          </div>
        </Section>

        {error && <p role="alert" className="rounded-lg border border-puzzle-red/25 bg-puzzle-red/5 p-3 text-sm text-puzzle-red">{error}</p>}
        <div className="grid grid-cols-2 gap-2 border-t border-line pt-6 sm:flex sm:justify-end sm:gap-3">
          <Link href={`/admin/clients/${client.id}`} className="inline-flex items-center px-4 text-sm text-ink-3 hover:text-ink">Cancel</Link>
          <Button className="w-full sm:w-auto" type="submit" variant="primary" size="md" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
        </div>
      </form>

      <section className="rounded-xl border border-puzzle-red/25 bg-puzzle-red/[0.03] p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl">Delete client</h2>
            <p className="mt-1 text-sm text-ink-2">Permanently removes the client and all appointments, session notes and reports.</p>
          </div>
          {!showDelete && (
            <Button type="button" variant="outline" size="sm" className="border-puzzle-red/40 text-puzzle-red hover:bg-puzzle-red/5" onClick={() => setShowDelete(true)}>Delete client</Button>
          )}
        </div>

        {showDelete && (
          <div className="mt-5 space-y-4 border-t border-puzzle-red/20 pt-5">
            <Input label={`Type ${client.firstName} to confirm`} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} autoComplete="off" />
            {deleteError && <p role="alert" className="text-sm text-puzzle-red">{deleteError}</p>}
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => { setShowDelete(false); setConfirmation(""); setDeleteError(""); }}>Cancel</Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-puzzle-red bg-puzzle-red text-white hover:bg-puzzle-red/90"
                disabled={confirmation.trim() !== client.firstName || deleting}
                onClick={async () => {
                  setDeleting(true);
                  setDeleteError("");
                  try {
                    await deleteClientRecord(client.id);
                    router.push("/admin/clients?deleted=1");
                    router.refresh();
                  } catch (reason) {
                    setDeleteError(reason instanceof Error ? reason.message : "The client could not be deleted.");
                    setDeleting(false);
                  }
                }}
              >
                {deleting ? "Deleting…" : "Permanently delete"}
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">{title}</h2>
      {children}
    </section>
  );
}
