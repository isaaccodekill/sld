"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button, LinkButton } from "@/components/ui/Button";
import { waLink } from "@/lib/constants";
import { submitEnquiry } from "@/lib/admin-data";

type Data = {
  parentName: string;
  phone: string;
  email: string;
  preferredChannel: "whatsapp" | "email" | "phone";
  city: string;
  childFirstName: string;
  childAge: string;
  concern: string;
  howTheyFound: string;
  extra: string;
};

export function ParentEnquiryForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Data>({
    parentName: "",
    phone: "",
    email: "",
    preferredChannel: "whatsapp",
    city: "Lagos",
    childFirstName: "",
    childAge: "",
    concern: "",
    howTheyFound: "",
    extra: "",
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const reduced = useReducedMotion();

  const set = <K extends keyof Data>(k: K, v: Data[K]) => setData((d) => ({ ...d, [k]: v }));

  if (sent) return <Confirmation />;

  return (
    <div className="rounded-xl border border-line bg-cream p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
          Step {step} of 3{step === 2 && ", almost there"}
        </div>
        <StepDots current={step} total={3} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={reduced ? false : { opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, x: -12 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {step === 1 && (
            <div className="grid gap-5 md:grid-cols-2">
              <h3 className="col-span-full font-display text-2xl md:text-3xl">About you</h3>
              <Input
                label="Your name"
                placeholder="Adaeze Adebayo"
                value={data.parentName}
                onChange={(e) => set("parentName", e.target.value)}
                required
              />
              <Input
                label="Phone"
                type="tel"
                placeholder="+234 ..."
                value={data.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={data.email}
                onChange={(e) => set("email", e.target.value)}
                required
              />
              <Select
                label="Preferred contact"
                value={data.preferredChannel}
                onChange={(e) => set("preferredChannel", e.target.value as Data["preferredChannel"])}
                options={[
                  { label: "WhatsApp", value: "whatsapp" },
                  { label: "Email", value: "email" },
                  { label: "Phone call", value: "phone" },
                ]}
              />
              <Input
                label="City"
                value={data.city}
                onChange={(e) => set("city", e.target.value)}
                className="md:col-span-2"
              />
            </div>
          )}
          {step === 2 && (
            <div className="grid gap-5 md:grid-cols-2">
              <h3 className="col-span-full font-display text-2xl md:text-3xl">About your child</h3>
              <Input
                label="First name (or nickname)"
                placeholder="Tola"
                value={data.childFirstName}
                onChange={(e) => set("childFirstName", e.target.value)}
                required
              />
              <Input
                label="Age"
                type="number"
                min={1}
                max={16}
                value={data.childAge}
                onChange={(e) => set("childAge", e.target.value)}
                required
              />
              <Textarea
                label="What you're noticing"
                placeholder="In a few sentences, what's on your mind?"
                rows={6}
                value={data.concern}
                onChange={(e) => set("concern", e.target.value)}
                className="md:col-span-2"
              />
            </div>
          )}
          {step === 3 && (
            <div className="grid gap-5">
              <h3 className="font-display text-2xl md:text-3xl">Anything else</h3>
              <Input
                label="How did you hear about Fullgrace?"
                placeholder="A friend, your paediatrician, Instagram…"
                value={data.howTheyFound}
                onChange={(e) => set("howTheyFound", e.target.value)}
              />
              <Textarea
                label="Anything you want me to know before we talk"
                placeholder="Optional."
                rows={5}
                value={data.extra}
                onChange={(e) => set("extra", e.target.value)}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-6">
        <div>
          {step > 1 && (
            <Button variant="ghost" size="md" onClick={() => setStep((s) => s - 1)}>
              ← Back
            </Button>
          )}
        </div>
        {step < 3 ? (
          <Button variant="primary" size="md" onClick={() => setStep((s) => s + 1)}>
            Continue →
          </Button>
        ) : (
          <Button variant="primary" size="md" disabled={sending} onClick={async () => {
            if (!data.parentName || !data.email || !data.childFirstName || !data.childAge) { setError("Please complete the required fields before sending."); return; }
            setSending(true); setError("");
            try {
              await submitEnquiry("form_parent", { ...data, childAge: Number(data.childAge) });
              setSent(true);
            } catch { setError("Your message could not be sent. Please try again or use WhatsApp."); setSending(false); }
          }}>
            {sending ? "Sending…" : "Send to Fullgrace"}
          </Button>
        )}
      </div>
      {error && <p role="alert" className="mt-3 text-sm text-puzzle-red">{error}</p>}
    </div>
  );
}

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all ${
            i + 1 === current ? "w-6 bg-green" : i + 1 < current ? "w-1.5 bg-green/60" : "w-1.5 bg-line"
          }`}
        />
      ))}
    </div>
  );
}

function Confirmation() {
  return (
    <div className="rounded-xl border border-line bg-cream p-8 md:p-10">
      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">Message received</div>
      <h3 className="mt-3 font-display text-3xl font-medium leading-tight md:text-4xl">
        Thank you. We'll be in touch.
      </h3>
      <p className="mt-4 max-w-prose text-ink-2">
        We reply personally to every enquiry, usually within one working day. If your message is
        urgent or you'd rather just chat, WhatsApp is the fastest way to reach us.
      </p>
      <div className="mt-6">
        <LinkButton
          href={waLink("Hi Fullgrace, I've just sent a form.")}
          target="_blank"
          rel="noopener"
          variant="primary"
          size="md"
        >
          Chat on WhatsApp
        </LinkButton>
      </div>
    </div>
  );
}
