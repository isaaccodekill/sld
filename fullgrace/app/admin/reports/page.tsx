import Link from "next/link";
import { clients, getClient, reports } from "@/lib/mock";
import { formatDate, relative } from "@/lib/format";
import { Tag } from "@/components/ui/Tag";

export default function ReportsPage() {
  const sorted = [...reports].sort((a, b) => b.generatedAt.localeCompare(a.generatedAt));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-medium">Reports</h1>
        <p className="text-sm text-ink-2">Every parent-facing progress report, across all clients.</p>
      </header>

      <div className="overflow-hidden rounded-xl border border-line bg-cream">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-cream-2/60 text-[11px] uppercase tracking-[0.14em] text-ink-3">
            <tr>
              <th className="p-3 font-mono">Client</th>
              <th className="p-3 font-mono">Window</th>
              <th className="p-3 font-mono">Occasion</th>
              <th className="p-3 font-mono">Generated</th>
              <th className="p-3 font-mono">Status</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {sorted.map((r) => {
              const c = getClient(r.clientId);
              return (
                <tr key={r.id} className="hover:bg-cream-2/40">
                  <td className="p-3 font-medium text-ink">{c?.firstName}</td>
                  <td className="p-3 text-ink-2">
                    {formatDate(r.windowStart)} → {formatDate(r.windowEnd)}
                  </td>
                  <td className="p-3 text-ink-2">{r.occasionNote ?? "—"}</td>
                  <td className="p-3 text-ink-3">{relative(r.generatedAt)}</td>
                  <td className="p-3">
                    {r.markedSharedAt ? (
                      <Tag tone="good">Shared</Tag>
                    ) : r.exportedAt ? (
                      <Tag tone="neutral">Exported</Tag>
                    ) : (
                      <Tag tone="warn">Draft</Tag>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <Link href={`/admin/reports/${r.id}`} className="text-green hover:text-green-2">
                      Open →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-dashed border-line p-6 text-sm text-ink-3">
        <strong className="text-ink">Tip.</strong> Start a new report from a client's page —{" "}
        <Link href="/admin/clients" className="text-green hover:text-green-2">
          go to Clients
        </Link>{" "}
        and click <em>Generate report for parent</em>.
      </div>
      {/* keep clients import used */}
      <div className="sr-only">{clients.length}</div>
    </div>
  );
}
