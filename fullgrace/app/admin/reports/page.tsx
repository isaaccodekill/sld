"use client";

import Link from "next/link";
import { useClients, useReports } from "@/lib/admin-data";
import { formatDate, relative } from "@/lib/format";
import { Tag } from "@/components/ui/Tag";

export default function ReportsPage() {
  const { clients } = useClients();
  const reports = useReports();
  const sorted = [...reports].sort((a, b) => b.generatedAt.localeCompare(a.generatedAt));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-medium">Progress reports</h1>
        <p className="text-sm text-ink-2">Periodic parent-facing summaries built from final daily session reports.</p>
      </header>

      <div className="grid gap-3 md:hidden">
        {sorted.map((report) => {
          const client = clients.find((item) => item.id === report.clientId);
          return (
            <Link key={report.id} href={`/admin/reports/${report.id}`} className="rounded-2xl border border-line bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0"><p className="truncate font-medium">{client?.firstName ?? "Client"}</p><p className="mt-1 text-xs text-ink-3">{formatDate(report.windowStart)} → {formatDate(report.windowEnd)}</p></div>
                <Tag tone={report.markedSharedAt ? "good" : "warn"}>{report.markedSharedAt ? "Shared" : "Draft"}</Tag>
              </div>
              <p className="mt-4 text-sm text-ink-2">{report.occasionNote ?? "Progress review"}</p>
              <p className="mt-2 text-xs text-ink-3">Created {relative(report.generatedAt)}</p>
            </Link>
          );
        })}
      </div>

      <div className="hidden overflow-x-auto rounded-xl border border-line bg-cream md:block">
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
              const c = clients.find((item) => item.id === r.clientId);
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
    </div>
  );
}
