"use client";

import Link from "next/link";
import { useState } from "react";
import { enquirySourceLabel } from "@/lib/mock";
import { archiveEnquiry, useClients, useEnquiries } from "@/lib/admin-data";
import { formatDate } from "@/lib/format";
import { Chip } from "@/components/ui/Chip";
import { LinkButton, Button } from "@/components/ui/Button";
import { waLink } from "@/lib/constants";

export default function EnquiryDetail({ params }: { params: { id: string } }) {
  const enquiries = useEnquiries();
  const { clients } = useClients();
  const enquiry = enquiries.find((item) => item.id === params.id);
  const [archiving, setArchiving] = useState(false);
  if (!enquiry) return <div className="rounded-2xl border border-line bg-white p-8"><h1 className="font-display text-2xl">Loading enquiry…</h1><Link href="/admin/enquiries" className="mt-4 inline-block text-green">← Back to inbox</Link></div>;

  const promotedClient = enquiry.promotedToClientId ? clients.find((item) => item.id === enquiry.promotedToClientId) : null;
  const p = enquiry.payload;
  const waMessage = waLink(
    `Hi ${p.parentName ?? p.referrerName ?? "there"} — thanks for reaching out to Fullgrace.`,
  );
  const phone = (p.phone ?? "").replace(/\D/g, "");
  const whatsappLink = phone ? `https://wa.me/${phone}?text=${encodeURIComponent("Hi, this is Awele from Fullgrace — thanks for your message.")}` : waMessage;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <nav className="text-sm">
        <Link href="/admin/enquiries" className="text-ink-3 hover:text-ink">
          ← All enquiries
        </Link>
      </nav>

      <header className="space-y-3 border-b border-line pb-6">
        <div className="flex items-center gap-3">
          <Chip
            color={
              enquiry.source === "form_referrer"
                ? "green"
                : enquiry.source === "form_quick"
                  ? "blue"
                  : "yellow"
            }
          >
            {enquirySourceLabel(enquiry.source)}
          </Chip>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
            Received {formatDate(enquiry.receivedAt, { day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>
        <h1 className="font-display text-3xl font-medium leading-tight">
          {p.parentName ?? p.referrerName}
          {p.childFirstName && (
            <span className="text-ink-3">
              {" "}· about {p.childFirstName} ({p.childAge})
            </span>
          )}
        </h1>

        {promotedClient && (
          <div className="inline-flex items-center gap-2 rounded-md border border-green/30 bg-green-3 px-2.5 py-1 text-xs text-green-2">
            Already registered as a client —{" "}
            <Link href={`/admin/clients/${promotedClient.id}`} className="font-medium underline">
              {promotedClient.firstName}
            </Link>
          </div>
        )}
      </header>

      <section className="grid gap-5 md:grid-cols-2">
        <Field label="Name" value={p.parentName ?? p.referrerName} />
        {p.phone && <Field label="Phone" value={p.phone} />}
        {p.email && <Field label="Email" value={p.email} />}
        {p.preferredChannel && <Field label="Preferred channel" value={p.preferredChannel} />}
        {p.city && <Field label="City" value={p.city} />}
        {p.childFirstName && <Field label="Child" value={`${p.childFirstName} (age ${p.childAge})`} />}
        {p.organisation && <Field label="Organisation" value={p.organisation} />}
        {p.role && <Field label="Role" value={p.role} />}
        {p.howTheyFound && <Field label="How they found us" value={p.howTheyFound} />}
      </section>

      {(p.concern || p.message) && (
        <section className="rounded-xl border border-line bg-cream-2/40 p-5">
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">Message</div>
          <p className="mt-2 whitespace-pre-wrap text-base leading-relaxed text-ink">
            {p.concern ?? p.message}
          </p>
          {p.extra && (
            <>
              <div className="mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">Anything else</div>
              <p className="mt-2 whitespace-pre-wrap text-base leading-relaxed text-ink-2">{p.extra}</p>
            </>
          )}
        </section>
      )}

      <section className="flex flex-wrap gap-3 border-t border-line pt-6">
        <LinkButton href={whatsappLink} target="_blank" rel="noopener" variant="primary" size="md">
          Reply on WhatsApp
        </LinkButton>
        {!promotedClient && (
          <LinkButton
            href={`/admin/clients/new?from=${enquiry.id}`}
            variant="black"
            size="md"
          >
            Register as client →
          </LinkButton>
        )}
        <Button variant="ghost" size="md" disabled={enquiry.status === "archived" || archiving} onClick={async () => { setArchiving(true); await archiveEnquiry(enquiry.id); window.location.reload(); }}>
          {enquiry.status === "archived" ? "Archived" : archiving ? "Archiving…" : "Mark as archived"}
        </Button>
      </section>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string | number }) {
  if (!value && value !== 0) return null;
  return (
    <div>
      <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">{label}</div>
      <div className="mt-1 text-base text-ink">{value}</div>
    </div>
  );
}
