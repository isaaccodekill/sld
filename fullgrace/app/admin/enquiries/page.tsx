import Link from "next/link";
import { enquiries, enquirySourceLabel } from "@/lib/mock";
import { formatShortDate } from "@/lib/format";
import { Chip } from "@/components/ui/Chip";

export default function EnquiriesPage() {
  const sorted = [...enquiries].sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="font-display text-3xl font-medium">Enquiries</h1>
        <p className="text-sm text-ink-2">
          Messages from the public site. Read, reply out of band, and promote to a client when you're ready.
        </p>
      </header>

      <div className="overflow-hidden rounded-xl border border-line bg-cream">
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
            {sorted.map((e) => (
              <tr key={e.id} className="hover:bg-cream-2/40">
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
