export type ClientTag = "speech_delay" | "asd" | "downs" | "other";
export type ClientStatus = "active" | "paused" | "discharged";
export type SessionType = "assessment" | "therapy" | "parent_consult" | "review";
export type SessionTag = "good" | "challenging" | "admin";
export type EnquirySource = "form_quick" | "form_parent" | "form_referrer" | "widget";
export type EnquiryStatus = "new" | "read" | "archived";

export type Therapist = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type Client = {
  id: string;
  firstName: string;
  nickname?: string;
  dob: string; // ISO
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  relationship: string;
  primaryConcern: string;
  tags: ClientTag[];
  workingHypothesis: string;
  startDate: string; // ISO
  internalNotes: string;
  status: ClientStatus;
  sourceEnquiryId?: string;
};

export type SessionNote = {
  id: string;
  clientId: string;
  date: string; // ISO
  durationMinutes: number;
  sessionType: SessionType;
  focusAreas: string;
  observations: string;
  techniques?: string;
  engagement: 1 | 2 | 3 | 4 | 5;
  progressNotes: string;
  nextSteps: string;
  tag: SessionTag;
  createdAt: string;
};

export type AiSummary = {
  id: string;
  clientId: string;
  kind: "since_last" | "arc";
  windowStart: string;
  windowEnd: string;
  generatedAt: string;
  model: string;
  rawOutput: string;
  editedOutput?: string;
  editedAt?: string;
};

export type ProgressReport = {
  id: string;
  clientId: string;
  title?: string;
  windowStart: string;
  windowEnd: string;
  occasionNote?: string;
  sections: {
    note: string;
    workingOn: string[];
    noticing: string;
    homeSuggestions: string[];
    whatsNext: string;
  };
  generatedAt: string;
  exportedAt?: string;
  markedSharedAt?: string;
  sharedVia?: "whatsapp" | "email" | "other";
};

export type Enquiry = {
  id: string;
  source: EnquirySource;
  status: EnquiryStatus;
  receivedAt: string;
  payload: {
    parentName?: string;
    phone?: string;
    email?: string;
    preferredChannel?: "whatsapp" | "email" | "phone";
    city?: string;
    childFirstName?: string;
    childAge?: number;
    concern?: string;
    howTheyFound?: string;
    extra?: string;
    // referrer fields
    referrerName?: string;
    organisation?: string;
    role?: string;
    message?: string;
  };
  promotedToClientId?: string;
};
