"use client";

import Link from "next/link";
import { enquirySourceLabel } from "@/lib/mock";
import { useEnquiries } from "@/lib/admin-data";
import { formatShortDate } from "@/lib/format";
import { Chip } from "@/components/ui/Chip";

export default function EnquiriesPage() {
  const enquiries = useEnquiries();
  const sorted = [...enquiries].sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="font-display text-3xl font-medium">Enquiries</h1>
        <p className="text-sm text-ink-2">
          Messages from the public site. Read, reply out of band, and promote to a client when you're ready.
        </p>
      </header>

      <div className="grid gap-3 md:hidden">
        {sorted.map((enquiry, index) => (
          <Link data-tour={index === 0 ? "enquiries-list" : undefined} key={enquiry.id} href={`/admin/enquiries/${enquiry.id}`} className="rounded-2xl border border-line bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                {enquiry.status === "new" && <span aria-label="Unread" className="h-2 w-2 shrink-0 rounded-full bg-puzzle-red" />}
                <p className="truncate font-medium">{enquiry.payload.parentName ?? enquiry.payload.referrerName ?? "Website enquiry"}</p>
              </div>
              <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-ink-3">{formatShortDate(enquiry.receivedAt)}</span>
            </div>
            <div className="mt-3"><Chip color={enquiry.source === "form_referrer" ? "green" : enquiry.source === "form_quick" ? "blue" : "yellow"}>{enquirySourceLabel(enquiry.source)}</Chip></div>
            <p className="mt-3 line-clamp-2 text-sm text-ink-2">{enquiry.payload.concern ?? enquiry.payload.message ?? "Open to read the full enquiry."}</p>
          </Link>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-xl border border-line bg-cream md:block">
        <table className="w-full table-fixed text-left text-sm">
          <thead className="border-b border-line bg-cream-2/60 text-[11px] uppercase tracking-[0.14em] text-ink-3">
            <tr>
              <th className="w-6 p-3" aria-label="Status" />
              <th className="w-32 p-3 font-mono">Source</th>
              <th className="p-3 font-mono">From</th>
              <th className="p-3 font-mono">Message</th>
              <th className="w-24 p-3 text-right font-mono">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {sorted.map((e, index) => (
              <tr data-tour={index === 0 ? "enquiries-list" : undefined} key={e.id} className="hover:bg-cream-2/40">
                <td className="p-3">
                  {e.status === "new" ? (
                    <span aria-label="Unread" className="inline-block h-2 w-2 rounded-full bg-puzzle-red" />
                  ) : null}
                </td>
                <td className="p-3">
                  <Chip
                    color={
                      e.source === "form_referrer" ? "green" : e.source === "form_quick" ? "blue" : "yellow"
                    }
                  >
                    {enquirySourceLabel(e.source)}
                  </Chip>
                </td>
                <td className="p-3">
                  <div className="truncate text-ink">
                    <Link href={`/admin/enquiries/${e.id}`} className="font-medium hover:underline">
                      {e.payload.parentName ?? e.payload.referrerName}
                    </Link>
                  </div>
                  {e.payload.childFirstName && (
                    <div className="text-xs text-ink-3">
                      {e.payload.childFirstName} · age {e.payload.childAge}
                    </div>
                  )}
                  {e.payload.organisation && (
                    <div className="text-xs text-ink-3">{e.payload.organisation}</div>
                  )}
                </td>
                <td className="p-3">
                  <Link href={`/admin/enquiries/${e.id}`} className="block truncate text-ink-2 hover:text-ink">
                    {e.payload.concern ?? e.payload.message}
                  </Link>
                </td>
                <td className="p-3 text-right font-mono text-[11px] uppercase tracking-wider text-ink-3">
                  {formatShortDate(e.receivedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
