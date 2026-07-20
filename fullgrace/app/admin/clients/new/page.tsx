"use client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { getEnquiry } from "@/lib/mock";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { createClientRecord } from "@/lib/admin-data";

export default function NewClientPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-ink-3">Loading…</div>}>
      <NewClientInner />
    </Suspense>
  );
}

function NewClientInner() {
  const router = useRouter();
  const params = useSearchParams();
  const fromId = params?.get("from");
  const enquiry = useMemo(() => (fromId ? getEnquiry(fromId) : undefined), [fromId]);
  const p = enquiry?.payload;

  const [form, setForm] = useState({
    firstName: p?.childFirstName ?? "",
    nickname: "",
    dob: "",
    parentName: p?.parentName ?? "",
    parentPhone: p?.phone ?? "",
    parentEmail: p?.email ?? "",
    relationship: "",
    primaryConcern: p?.concern ?? "",
    hypothesis: "",
    tag: "speech_delay",
    startDate: new Date().toISOString().slice(0, 10),
    internalNotes: "",
  });
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <nav className="text-sm">
        <Link href="/admin/clients" className="text-ink-3 hover:text-ink">
          ← Clients
        </Link>
      </nav>
      <header className="space-y-1">
        <h1 className="font-display text-3xl font-medium">Register a client</h1>
        {enquiry && (
          <p className="text-sm text-ink-2">
            Pre-filled from the enquiry from{" "}
            <Link href={`/admin/enquiries/${enquiry.id}`} className="text-green hover:text-green-2">
              {enquiry.payload.parentName}
            </Link>
            .
          </p>
        )}
      </header>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setSaving(true);
          setError("");
          try {
            await createClientRecord({
              firstName: form.firstName,
              nickname: form.nickname,
              dob: form.dob,
              parentName: form.parentName,
              parentPhone: form.parentPhone,
              parentEmail: form.parentEmail,
              relationship: form.relationship,
              primaryConcern: form.primaryConcern,
              tags: [form.tag as "speech_delay" | "asd" | "downs" | "other"],
              workingHypothesis: form.hypothesis,
              startDate: form.startDate,
              internalNotes: form.internalNotes,
              status: "active",
              sourceEnquiryId: fromId ?? undefined,
            });
            router.push("/admin/clients?created=1");
          } catch (reason) {
            setError(reason instanceof Error ? reason.message : "The client could not be saved.");
            setSaving(false);
          }
        }}
        className="space-y-7 rounded-xl border border-line bg-cream p-4 sm:p-6 md:p-8"
      >
        <Section title="About the child">
          <div className="grid gap-5 md:grid-cols-2">
            <Input label="First name" required value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
            <Input label="Nickname" value={form.nickname} onChange={(e) => set("nickname", e.target.value)} />
            <Input label="Date of birth" type="date" required max={new Date().toISOString().slice(0, 10)} value={form.dob} onChange={(e) => set("dob", e.target.value)} />
            <Input label="Start date" type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
          </div>
        </Section>

        <Section title="Parent / guardian">
          <div className="grid gap-5 md:grid-cols-2">
            <Input label="Parent or guardian name" required value={form.parentName} onChange={(e) => set("parentName", e.target.value)} />
            <Input label="Relationship" placeholder="Mother, father, grandparent…" value={form.relationship} onChange={(e) => set("relationship", e.target.value)} />
            <Input label="Phone" type="tel" value={form.parentPhone} onChange={(e) => set("parentPhone", e.target.value)} />
            <Input label="Email" type="email" value={form.parentEmail} onChange={(e) => set("parentEmail", e.target.value)} />
          </div>
        </Section>

        <Section title="Clinical">
          <div className="grid gap-5">
            <Textarea
              label="Primary concern"
              rows={4}
              value={form.primaryConcern}
              onChange={(e) => set("primaryConcern", e.target.value)}
              hint="Parent's words are fine; you can reshape later."
            />
            <Select
              label="Working hypothesis — tag"
              value={form.tag}
              onChange={(e) => set("tag", e.target.value)}
              options={[
                { label: "Speech & language delay", value: "speech_delay" },
                { label: "Autism Spectrum Disorder", value: "asd" },
                { label: "Down's Syndrome", value: "downs" },
                { label: "Other", value: "other" },
              ]}
            />
            <Textarea
              label="Working hypothesis — notes"
              rows={3}
              value={form.hypothesis}
              onChange={(e) => set("hypothesis", e.target.value)}
            />
            <Textarea
              label="Internal notes (therapist-only)"
              rows={4}
              value={form.internalNotes}
              onChange={(e) => set("internalNotes", e.target.value)}
            />
          </div>
        </Section>

        {error && <p role="alert" className="rounded-lg border border-puzzle-red/25 bg-puzzle-red/5 p-3 text-sm text-puzzle-red">{error}</p>}
        <div className="grid grid-cols-2 gap-2 border-t border-line pt-6 sm:flex sm:justify-end sm:gap-3">
          <Link href="/admin/clients" className="inline-flex items-center px-4 text-sm text-ink-3 hover:text-ink">
            Cancel
          </Link>
          <Button className="w-full sm:w-auto" type="submit" variant="primary" size="md" disabled={saving}>
            {saving ? "Saving…" : "Save client"}
          </Button>
        </div>
      </form>
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
