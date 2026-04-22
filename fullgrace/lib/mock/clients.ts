import type { Client } from "./types";

export const clients: Client[] = [
  {
    id: "c_tola",
    firstName: "Tola",
    nickname: "Tola",
    dob: "2020-09-14",
    parentName: "Adaeze Adebayo",
    parentPhone: "+2348121234501",
    parentEmail: "adaeze.adebayo@example.com",
    relationship: "Mother",
    primaryConcern:
      "Slow expressive language. Mostly single words at 5, difficulty sequencing requests.",
    tags: ["speech_delay"],
    workingHypothesis: "Expressive language delay, typical receptive. Watch for early phonological patterning.",
    startDate: "2026-01-12",
    internalNotes:
      "Warm parent, very engaged. Uses Yoruba and English at home. Child is shy on first visits but opens up with hand-eye objects.",
    status: "active",
    sourceEnquiryId: "e_003",
  },
  {
    id: "c_chioma",
    firstName: "Chioma",
    nickname: "Chi",
    dob: "2018-03-22",
    parentName: "Ifeanyi Eze",
    parentPhone: "+2348137654302",
    parentEmail: "ifeanyi.eze@example.com",
    relationship: "Father",
    primaryConcern: "ASD diagnosis at 5. Works on flexible routines and peer interaction at school.",
    tags: ["asd"],
    workingHypothesis: "Level 1 ASD support needs — sensory regulation + social reciprocity primary targets.",
    startDate: "2025-10-03",
    internalNotes: "Loves puzzles. Sensitive to loud environments — keep 1:1 room for now.",
    status: "active",
  },
  {
    id: "c_kunle",
    firstName: "Kunle",
    nickname: "Kunle",
    dob: "2021-07-02",
    parentName: "Folake Bakare",
    parentPhone: "+2348024567803",
    parentEmail: "folake.bakare@example.com",
    relationship: "Mother",
    primaryConcern: "Down's Syndrome. Working on chewing, spoon use, two-step directions.",
    tags: ["downs"],
    workingHypothesis: "Oromotor support + graded self-help programme. Coordinate with family's physio.",
    startDate: "2025-11-20",
    internalNotes: "Grandmother often brings him. Swap to afternoon slots when possible.",
    status: "active",
  },
  {
    id: "c_amara",
    firstName: "Amara",
    nickname: "Ama",
    dob: "2016-05-11",
    parentName: "Nkechi Okeke",
    parentPhone: "+2348091112204",
    parentEmail: "nkechi.okeke@example.com",
    relationship: "Mother",
    primaryConcern: "Articulation — distortions on /s/, /sh/, /r/ past age expectation.",
    tags: ["speech_delay"],
    workingHypothesis: "Articulation-only, no receptive concerns. Short targeted block.",
    startDate: "2025-08-08",
    internalNotes:
      "Hiatus since February for family travel. Mum will confirm restart in May. Keep file open but paused.",
    status: "paused",
  },
  {
    id: "c_bayo",
    firstName: "Bayo",
    nickname: "Bayo",
    dob: "2022-11-30",
    parentName: "Tosin Adeyemi",
    parentPhone: "+2348055678105",
    parentEmail: "tosin.adeyemi@example.com",
    relationship: "Father",
    primaryConcern: "Pre-verbal at 3. Minimal joint attention. Recent ASD screening.",
    tags: ["asd"],
    workingHypothesis: "Early intervention — joint attention + requesting foundations.",
    startDate: "2026-02-16",
    internalNotes: "New. Parents processing the screening. Go gentle on diagnostic framing.",
    status: "active",
  },
  {
    id: "c_ife",
    firstName: "Ife",
    nickname: "Ife",
    dob: "2019-12-04",
    parentName: "Kemi Ogundimu",
    parentPhone: "+2348171234006",
    parentEmail: "kemi.ogundimu@example.com",
    relationship: "Mother",
    primaryConcern: "Stuttering onset ~8 months ago. Impact on school participation.",
    tags: ["other"],
    workingHypothesis: "Developmental stuttering, demand-capacity patterns. Parent-child interaction therapy focus.",
    startDate: "2025-09-27",
    internalNotes: "Teacher very supportive, keen to coordinate on classroom accommodations.",
    status: "active",
  },
];

export function getClient(id: string): Client | undefined {
  return clients.find((c) => c.id === id);
}

export function tagLabel(t: Client["tags"][number]): string {
  switch (t) {
    case "speech_delay":
      return "Speech delay";
    case "asd":
      return "ASD";
    case "downs":
      return "Down's Syndrome";
    case "other":
      return "Other";
  }
}
