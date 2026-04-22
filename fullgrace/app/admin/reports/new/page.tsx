"use client";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { clients, getClient, reports } from "@/lib/mock";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function NewReportPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-ink-3">Loading…</div>}>
      <NewReportInner />
    </Suspense>
  );
}

function NewReportInner() {
  const params = useSearchParams();
  const router = useRouter();
  const preClient = params?.get("client") ?? clients[0]?.id ?? "";

  const [clientId, setClientId] = useState(preClient);
  const [occasion, setOccasion] = useState("");
  const [windowStart, setWindowStart] = useState("");
  const [windowEnd, setWindowEnd] = useState(new Date().toISOString().slice(0, 10));

  const client = getClient(clientId);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <nav className="text-sm">
        <Link href="/admin/reports" className="text-ink-3 hover:text-ink">
          ← Reports
        </Link>
      </nav>

      <header>
        <h1 className="font-display text-3xl font-medium">Generate report for parent</h1>
        <p className="text-sm text-ink-2">
          Pick a window and an occasion. You'll land in the editor with an AI-generated first draft.
          Nothing is sent to the parent.
        </p>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          // In the prototype we open the first existing report for this client as a stand-in,
          // or fall back to the first report overall.
          const theirs = reports.find((r) => r.clientId === clientId) ?? reports[0];
          router.push(`/admin/reports/${theirs.id}`);
        }}
        className="space-y-5 rounded-xl border border-line bg-cream p-6 md:p-8"
      >
        <Select
          label="Client"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          options={clients.map((c) => ({ label: c.firstName, value: c.id }))}
        />
        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Window start"
            type="date"
            value={windowStart || (client?.startDate ?? "")}
            onChange={(e) => setWindowStart(e.target.value)}
            hint="Defaults to start date."
          />
          <Input
            label="Window end"
            type="date"
            value={windowEnd}
            onChange={(e) => setWindowEnd(e.target.value)}
          />
        </div>
        <Input
          label="What's the occasion?"
          placeholder="End of term, mid-point review, parent's request…"
          value={occasion}
          onChange={(e) => setOccasion(e.target.value)}
          hint="Shapes the tone of the opening paragraph."
        />

        <div className="flex justify-end gap-3 border-t border-line pt-6">
          <Link href="/admin/reports" className="inline-flex items-center px-4 text-sm text-ink-3 hover:text-ink">
            Cancel
          </Link>
          <Button type="submit" variant="primary" size="md">
            Draft report →
          </Button>
        </div>
      </form>
    </div>
  );
}
