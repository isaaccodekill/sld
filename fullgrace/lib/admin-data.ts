"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { clients as demoClients, enquiries as demoEnquiries, reports as demoReports } from "@/lib/mock";
import type { Client, Enquiry, ProgressReport } from "@/lib/mock/types";

export type ClientInput = Omit<Client, "id" | "sourceEnquiryId"> & { sourceEnquiryId?: string };

export function useClients() {
  const [clients, setClients] = useState<Client[]>(demoClients);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from("clients").select("*").order("first_name");
    if (!error && data?.length) setClients(data.map(clientFromRow));
    setLoading(false);
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);
  return { clients, loading, refresh };
}

export async function createClientRecord(input: ClientInput) {
  validateClientInput(input);

  const supabase = createClient();
  const { data, error } = await supabase.from("clients").insert({
    first_name: input.firstName,
    nickname: input.nickname || null,
    date_of_birth: input.dob || null,
    parent_name: input.parentName,
    parent_phone: input.parentPhone || null,
    parent_email: input.parentEmail || null,
    relationship: input.relationship || null,
    primary_concern: input.primaryConcern || null,
    tags: input.tags,
    working_hypothesis: input.workingHypothesis || null,
    start_date: input.startDate,
    internal_notes: input.internalNotes || null,
    status: input.status,
  }).select("id").single();
  if (error) throw error;

  if (input.sourceEnquiryId) {
    await supabase.from("enquiries").update({
      promoted_to_client_id: data.id,
      status: "archived",
    }).eq("id", input.sourceEnquiryId);
  }
  return data.id as string;
}

export async function updateClientRecord(id: string, input: ClientInput) {
  validateClientInput(input);
  const { error } = await createClient().from("clients").update({
    first_name: input.firstName,
    nickname: input.nickname || null,
    date_of_birth: input.dob,
    parent_name: input.parentName,
    parent_phone: input.parentPhone || null,
    parent_email: input.parentEmail || null,
    relationship: input.relationship || null,
    primary_concern: input.primaryConcern || null,
    tags: input.tags,
    working_hypothesis: input.workingHypothesis || null,
    start_date: input.startDate,
    internal_notes: input.internalNotes || null,
    status: input.status,
    updated_at: new Date().toISOString(),
  }).eq("id", databaseClientId(id));
  if (error) throw error;
}

export async function deleteClientRecord(id: string) {
  const { error } = await createClient().rpc("delete_client_record", {
    target_client_id: databaseClientId(id),
  });
  if (error) throw error;
}

function validateClientInput(input: ClientInput) {
  if (!input.firstName.trim()) throw new Error("Add the child's first name before saving.");
  if (!input.parentName.trim()) throw new Error("Add a parent or guardian name before saving.");
  if (!input.dob) throw new Error("Add the child's date of birth before saving.");
  const parsedDob = new Date(input.dob);
  if (Number.isNaN(parsedDob.getTime())) throw new Error("Enter a valid date of birth.");
  if (input.dob > new Date().toISOString().slice(0, 10)) throw new Error("Date of birth cannot be in the future.");
  if (!input.startDate || Number.isNaN(new Date(input.startDate).getTime())) throw new Error("Enter a valid start date.");
}

export function useEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(demoEnquiries);
  useEffect(() => {
    void (async () => {
      const { data } = await createClient().from("enquiries").select("*").order("created_at", { ascending: false });
      if (data?.length) setEnquiries(data.map(enquiryFromRow));
    })();
  }, []);
  return enquiries;
}

export async function submitEnquiry(source: Enquiry["source"], payload: Enquiry["payload"]) {
  const { error } = await createClient().from("enquiries").insert({ source, payload, status: "new" });
  if (error) throw error;
}

export async function archiveEnquiry(id: string) {
  const { error } = await createClient().from("enquiries").update({ status: "archived" }).eq("id", id);
  if (error) throw error;
}

export function useReports() {
  const [reports, setReports] = useState<ProgressReport[]>(demoReports);
  useEffect(() => {
    void (async () => {
      const supabase = createClient();
      const { data } = await supabase.from("reports").select("*").order("created_at", { ascending: false });
      if (!data?.length) return;
      const { data: sections } = await supabase
        .from("report_sections")
        .select("*")
        .in("report_id", data.map((report) => report.id));
      setReports(data.map((report) => ({
        ...report,
        report_sections: sections?.filter((section) => section.report_id === report.id) ?? [],
      })).map(reportFromRow));
    })();
  }, []);
  return reports;
}

export async function saveReportDraft(input: {
  id?: string;
  clientId: string;
  windowStart: string;
  windowEnd: string;
  occasion: string;
  title: string;
  sections: Record<string, string>;
}) {
  const supabase = createClient();
  const { data, error } = await supabase.from("reports").upsert({
    ...(input.id ? { id: input.id } : {}),
    client_id: databaseClientId(input.clientId),
    window_start: input.windowStart,
    window_end: input.windowEnd,
    occasion: input.occasion || null,
    title: input.title,
    status: "draft",
    updated_at: new Date().toISOString(),
  }).select("id").single();
  if (error) throw error;

  const rows = Object.entries(input.sections).map(([section_key, content], position) => ({
    report_id: data.id,
    section_key,
    position,
    content,
  }));
  const { error: sectionError } = await supabase.from("report_sections").upsert(rows, { onConflict: "report_id,section_key" });
  if (sectionError) throw sectionError;
  return data.id as string;
}

const legacyIds: Record<string, string> = {
  c_tola: "a1000000-0000-4000-8000-000000000001",
  c_chioma: "a1000000-0000-4000-8000-000000000002",
  c_kunle: "a1000000-0000-4000-8000-000000000003",
  c_amara: "a1000000-0000-4000-8000-000000000004",
  c_bayo: "a1000000-0000-4000-8000-000000000005",
  c_ife: "a1000000-0000-4000-8000-000000000006",
};
const reverseLegacyIds = Object.fromEntries(Object.entries(legacyIds).map(([legacy, id]) => [id, legacy]));

export function databaseClientId(id: string) { return legacyIds[id] ?? id; }
export function displayClientId(id: string) { return reverseLegacyIds[id] ?? id; }

function clientFromRow(row: Record<string, any>): Client {
  return {
    id: displayClientId(row.id),
    firstName: row.first_name,
    nickname: row.nickname ?? undefined,
    dob: row.date_of_birth ?? "",
    parentName: row.parent_name,
    parentPhone: row.parent_phone ?? "",
    parentEmail: row.parent_email ?? "",
    relationship: row.relationship ?? "",
    primaryConcern: row.primary_concern ?? "",
    tags: row.tags ?? [],
    workingHypothesis: row.working_hypothesis ?? "",
    startDate: row.start_date,
    internalNotes: row.internal_notes ?? "",
    status: row.status,
  };
}

function enquiryFromRow(row: Record<string, any>): Enquiry {
  return {
    id: row.id,
    source: row.source,
    status: row.status,
    receivedAt: row.created_at,
    payload: row.payload ?? {},
    promotedToClientId: row.promoted_to_client_id ?? undefined,
  };
}

function reportFromRow(row: Record<string, any>): ProgressReport {
  const sections = Object.fromEntries((row.report_sections ?? []).map((section: any) => [section.section_key, section.content]));
  return {
    id: row.id,
    clientId: displayClientId(row.client_id),
    windowStart: row.window_start,
    windowEnd: row.window_end,
    occasionNote: row.occasion ?? undefined,
    sections: {
      note: sections.opening ?? "",
      workingOn: (sections.focus ?? "").split("\n").filter(Boolean),
      noticing: sections.noticing ?? "",
      homeSuggestions: (sections.home ?? "").split("\n").filter(Boolean),
      whatsNext: sections.nextSteps ?? "",
    },
    generatedAt: row.created_at,
    markedSharedAt: row.shared_at ?? undefined,
  };
}
