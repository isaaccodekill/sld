"use client";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

export function ReferrerForm() {
  const [sent, setSent] = useState(false);
  const [data, setData] = useState({
    name: "",
    organisation: "",
    role: "",
    phone: "",
    email: "",
    message: "",
  });
  const set = <K extends keyof typeof data>(k: K, v: (typeof data)[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  if (sent) {
    return (
      <div className="rounded-xl border border-line bg-cream p-8">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">Message received</div>
        <h3 className="mt-3 font-display text-3xl">Thank you — Awele will be in touch.</h3>
        <p className="mt-3 max-w-prose text-ink-2">
          We'll reply within a working day with next steps. If the matter is urgent, please call the centre directly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="rounded-xl border border-line bg-cream p-6 md:p-8"
    >
      <h3 className="font-display text-2xl md:text-3xl">Professional referral</h3>
      <p className="mt-1 text-sm text-ink-3">
        We keep referrals confidential. Tell us what you know; we'll reach out directly to the family.
      </p>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Input
          label="Your name"
          value={data.name}
          onChange={(e) => set("name", e.target.value)}
          required
        />
        <Input
          label="Organisation"
          value={data.organisation}
          onChange={(e) => set("organisation", e.target.value)}
        />
        <Input label="Role" value={data.role} onChange={(e) => set("role", e.target.value)} />
        <Input label="Email" type="email" value={data.email} onChange={(e) => set("email", e.target.value)} required />
        <Input label="Phone" type="tel" value={data.phone} onChange={(e) => set("phone", e.target.value)} className="md:col-span-2" />
        <Textarea
          label="Tell us about the child and what you're looking for"
          rows={6}
          value={data.message}
          onChange={(e) => set("message", e.target.value)}
          className="md:col-span-2"
        />
      </div>
      <div className="mt-6 flex justify-end border-t border-line pt-6">
        <Button type="submit" variant="primary" size="md">
          Send to Fullgrace
        </Button>
      </div>
    </form>
  );
}
