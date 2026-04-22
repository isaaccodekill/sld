import type { ProgressReport } from "./types";

export const reports: ProgressReport[] = [
  {
    id: "r_tola_mar",
    clientId: "c_tola",
    windowStart: "2026-01-15",
    windowEnd: "2026-03-20",
    occasionNote: "End of first term",
    sections: {
      note:
        "It's been a real pleasure working with Tola this term. She has settled into our Wednesday sessions and I can see her confidence grow each time she walks in. This update covers our first ten weeks together.",
      workingOn: [
        "Using short action words like 'want', 'give' and 'open' to ask for what she needs",
        "Putting two words together — 'want juice', 'more biscuit'",
        "Starting to use the word 'where' when looking for familiar people",
      ],
      noticing:
        "Tola began the term mostly using single words. By week four she was combining two words spontaneously, and by week nine she produced her first three-word sentence — 'where mummy go?' — which she has now repeated across several sessions. At home, Adaeze has noticed her using 'want juice' without any prompting, which is exactly the kind of carry-over we hope for.\n\nShe understands everything we ask of her, which was clear from our first session. The work this term has been about giving her the words to match what she already knows.",
      homeSuggestions: [
        "Keep offering choices at snack-time — 'juice or water?' — so she has a reason to use her words",
        "When she points, gently model the phrase once, then hand the item over whether or not she says it back",
        "At bedtime, add a 'where' question into your usual routine — 'where is teddy?' — even if she answers with a point",
      ],
      whatsNext:
        "Over the next few weeks we'll focus on descriptive words like big and small, and continue to extend her sentence length naturally through play. I'd like to invite you for a short parent consult in late May to check in.",
    },
    generatedAt: "2026-03-21T10:00:00Z",
    exportedAt: "2026-03-21T10:14:00Z",
    markedSharedAt: "2026-03-21T11:02:00Z",
    sharedVia: "whatsapp",
  },
  {
    id: "r_chioma_qtr",
    clientId: "c_chioma",
    windowStart: "2026-01-08",
    windowEnd: "2026-04-09",
    occasionNote: "Quarterly review",
    sections: {
      note:
        "This update covers our January-to-April work with Chioma. It has been a quarter of real, steady growth — particularly in how she manages moments that used to overwhelm her.",
      workingOn: [
        "Using visual scripts to make school transitions feel predictable",
        "Taking short turns in small group play, with a cool-down activity ready afterwards",
        "Asking for a break when she needs one, instead of withdrawing",
      ],
      noticing:
        "At the start of the year, Chioma found transitions and small-group play very demanding. Over the last three months, we've seen her begin to notice when she needs a pause — and, importantly, ask for it in her own words. This quarter she began using 'I need a break' spontaneously both with me and, on one occasion, at home. That is a meaningful step.\n\nShe now manages short peer activities (around ten minutes) with a cool-down afterwards, and recovers from unexpected changes in routine noticeably faster than she did in January.",
      homeSuggestions: [
        "When you see her start to wind up, gently say 'do you need a break?' to give her the language",
        "Keep her visual transition chart where she can see it at the start of the day",
        "Celebrate break-asking when she does it — naming it aloud ('good asking for a break') helps it stick",
      ],
      whatsNext:
        "Our next focus will be on starting interactions with other children, rather than only responding to them. We'll keep the short-segment structure that's been working so well. I'll share an updated visual script for school at our next session.",
    },
    generatedAt: "2026-04-11T09:30:00Z",
  },
];

export function reportsFor(clientId: string): ProgressReport[] {
  return reports
    .filter((r) => r.clientId === clientId)
    .sort((a, b) => b.generatedAt.localeCompare(a.generatedAt));
}

export function getReport(id: string): ProgressReport | undefined {
  return reports.find((r) => r.id === id);
}
