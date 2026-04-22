import type { AiSummary } from "./types";

export const aiSummaries: AiSummary[] = [
  {
    id: "ai_tola_sl",
    clientId: "c_tola",
    kind: "since_last",
    windowStart: "2026-04-02",
    windowEnd: "2026-04-16",
    generatedAt: "2026-04-19T08:00:00Z",
    model: "claude-opus-4-7",
    rawOutput:
      "Tola's three-word utterances that emerged on 2 April held into the 16 April session, though descriptor production (big/small) remained modelling-only — 3/10 spontaneous. Fatigue was a clear factor in the late-day slot; engagement dropped to 3/5 in the final 10 minutes. Consolidation work on familiar verb scripts remains solid. Consider moving Tola to a morning slot where possible and holding the descriptor target steady for another 1–2 sessions before escalating.",
  },
  {
    id: "ai_chioma_sl",
    clientId: "c_chioma",
    kind: "since_last",
    windowStart: "2026-03-19",
    windowEnd: "2026-04-09",
    generatedAt: "2026-04-10T08:30:00Z",
    model: "claude-opus-4-7",
    rawOutput:
      "Chioma's ability to recover from deliberate routine disruption has improved materially — from ~10 minutes dysregulated in early sessions to ~4 minutes with a breathing routine on 9 April. Break-asking has generalised to the home context (reported once by parent). Peer-interaction work remains demand-sensitive; the current 10-minute-plus-cooldown structure is working. Maintain controlled routine variation; flag for parent consult that self-advocacy around breaks is the strongest current generalisation.",
  },
  {
    id: "ai_kunle_sl",
    clientId: "c_kunle",
    kind: "since_last",
    windowStart: "2026-03-04",
    windowEnd: "2026-04-01",
    generatedAt: "2026-04-02T08:00:00Z",
    model: "claude-opus-4-7",
    rawOutput:
      "Self-feeding endurance has doubled since baseline (4 → 8 minutes). Grandmother-led home routines appear well-aligned with session work, evidenced by photos reviewed on 1 April. Spoon rotation remains the open target. Next block should focus on fading visual prompts for two-step directions while holding feeding progression steady.",
  },
  {
    id: "ai_bayo_sl",
    clientId: "c_bayo",
    kind: "since_last",
    windowStart: "2026-03-27",
    windowEnd: "2026-04-10",
    generatedAt: "2026-04-11T08:00:00Z",
    model: "claude-opus-4-7",
    rawOutput:
      "Single-button requesting ('more') is stabilising — 5 activations in a session and a successful parent training on 10 April. Joint attention duration has extended from ~1s at baseline to 3–4s on high-preference toys. Parents are processing the recent ASD screening; keep developmental framing at the centre of next contacts. Device loan in play for 2 weeks is the next data point.",
  },
  {
    id: "ai_ife_sl",
    clientId: "c_ife",
    kind: "since_last",
    windowStart: "2026-03-07",
    windowEnd: "2026-04-11",
    generatedAt: "2026-04-12T08:00:00Z",
    model: "claude-opus-4-7",
    rawOutput:
      "Ife delivered the prepared class presentation successfully. Self-reflection in the 11 April debrief was composed and proud; %SS inside rehearsal was ~3%. This is a natural point to transition Ife from weekly to monthly maintenance for the coming term. Teacher communication remains strong.",
  },
  {
    id: "ai_amara_sl",
    clientId: "c_amara",
    kind: "since_last",
    windowStart: "2026-01-22",
    windowEnd: "2026-02-04",
    generatedAt: "2026-02-05T08:00:00Z",
    model: "claude-opus-4-7",
    rawOutput:
      "Word-level /sh/ reached 8/10 at the 4 February session, marking a clean block endpoint. Client paused for family travel. Sentence-level /sh/ is the indicated restart target whenever therapy resumes.",
  },
  {
    id: "ai_chioma_arc",
    clientId: "c_chioma",
    kind: "arc",
    windowStart: "2026-01-08",
    windowEnd: "2026-04-09",
    generatedAt: "2026-04-10T09:00:00Z",
    model: "claude-opus-4-7",
    rawOutput:
      "Over the January-to-April window, Chioma has shown the clearest gains in self-regulation and self-advocacy. Early sessions (8 Jan, 5 Feb) were characterised by prolonged dysregulation and reactive withdrawal, particularly around peer-interaction demands. A structural pivot on 19 February to shorter segments with built-in cool-downs has been the hinge of the arc — from that point she has sustained engagement, started to lead segments herself, and begun spontaneously requesting breaks. By 19 March, break-asking had generalised to home. On 9 April she recovered from deliberate routine disruption within 4 minutes.\n\nObserved patterns:\n- Improving: self-regulation recovery time; break-asking as a named strategy; peer-work stamina under the current structure.\n- Plateau: spontaneous peer initiation (rather than response). Will need direct targeting in the next block.\n- Regressing: none observed in-window.\n\nSuggested focus for next block: peer initiation (asking to join, offering a turn). Keep the segment/cool-down structure. Begin a slow taper of adult scaffolding during peer role-plays.\n\nFlag for parent: the break-asking skill is this quarter's headline. Acknowledge it explicitly at the next check-in so family reinforcement continues.",
  },
];

export function latestSinceLast(clientId: string): AiSummary | undefined {
  return aiSummaries
    .filter((s) => s.clientId === clientId && s.kind === "since_last")
    .sort((a, b) => b.generatedAt.localeCompare(a.generatedAt))[0];
}

export function latestArc(clientId: string): AiSummary | undefined {
  return aiSummaries
    .filter((s) => s.clientId === clientId && s.kind === "arc")
    .sort((a, b) => b.generatedAt.localeCompare(a.generatedAt))[0];
}
