"use client";
import { useState } from "react";
import type { AiSummary } from "@/lib/mock";
import { Button } from "@/components/ui/Button";
import { formatDate, relative } from "@/lib/format";
import { Tag } from "@/components/ui/Tag";

export function AISummaryCard({ summary }: { summary: AiSummary | undefined }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(summary?.editedOutput ?? summary?.rawOutput ?? "");

  if (!summary) {
    return (
      <div className="rounded-xl border border-dashed border-line p-5 text-sm text-ink-3">
        No AI summary generated yet. Log a session, then click <em>Regenerate</em>.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-line bg-cream">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
          <Tag tone="green">Since last session</Tag>
          <span>·</span>
          <span>Generated {relative(summary.generatedAt)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setEditing((e) => !e)}>
            {editing ? "Cancel" : "Edit"}
          </Button>
          <Button variant="outline" size="sm">
            Regenerate
          </Button>
        </div>
      </div>
      <div className="px-5 py-4">
        <div className="mb-3 inline-flex items-center gap-2 rounded-md bg-puzzle-yellow/15 px-2 py-1 text-[11px] font-medium text-ink-2">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-puzzle-yellow" />
          Generated — therapist to review
        </div>
        {editing ? (
          <div>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={8}
              className="w-full rounded-md border border-line bg-cream p-3 text-sm text-ink focus:border-green focus:outline-none focus:ring-2 focus:ring-green/20"
            />
            <div className="mt-3 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={() => setEditing(false)}>
                Save as source of truth
              </Button>
            </div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-base leading-relaxed text-ink-2">{draft}</p>
        )}
      </div>
      <div className="border-t border-line bg-cream-2/40 px-5 py-3 text-[11px] font-mono uppercase tracking-[0.14em] text-ink-3">
        Window: {formatDate(summary.windowStart)} → {formatDate(summary.windowEnd)} · Model: {summary.model}
      </div>
    </div>
  );
}
