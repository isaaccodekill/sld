"use client";

import { useEffect, useSyncExternalStore } from "react";
import { createClient } from "@/lib/supabase/client";
import { getClient } from "@/lib/mock";

export type AppointmentStatus = "scheduled" | "completed" | "cancelled" | "no_show";

export type Appointment = {
  id: string;
  clientId: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  sessionType: "assessment" | "therapy" | "parent_consult" | "review";
  status: AppointmentStatus;
  notes?: string;
  recurrenceGroupId?: string;
  createdAt: string;
};

export type SavedSession = {
  id: string;
  appointmentId?: string;
  clientId: string;
  date: string;
  durationMinutes: number;
  sessionType: string;
  focusAreas: string;
  observations: string;
  techniques: string;
  engagement: number;
  progressNotes: string;
  nextSteps: string;
  tag: string;
  status: "draft" | "final";
  updatedAt: string;
};

const APPOINTMENTS_KEY = "fullgrace.appointments.v1";
const SESSIONS_KEY = "fullgrace.sessions.v1";
const eventName = "fullgrace-store-change";
let appointmentCache: Appointment[] | null = null;
let sessionCache: SavedSession[] | null = null;
let appointmentsLoaded = false;
let sessionsLoaded = false;

const clientIds: Record<string, string> = {
  c_tola: "a1000000-0000-4000-8000-000000000001",
  c_chioma: "a1000000-0000-4000-8000-000000000002",
  c_kunle: "a1000000-0000-4000-8000-000000000003",
  c_amara: "a1000000-0000-4000-8000-000000000004",
  c_bayo: "a1000000-0000-4000-8000-000000000005",
  c_ife: "a1000000-0000-4000-8000-000000000006",
};
const legacyClientIds = Object.fromEntries(Object.entries(clientIds).map(([legacy, id]) => [id, legacy]));

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
  if (key === APPOINTMENTS_KEY) appointmentCache = value as Appointment[];
  if (key === SESSIONS_KEY) sessionCache = value as SavedSession[];
  window.dispatchEvent(new Event(eventName));
}

function subscribe(callback: () => void) {
  const onLocalChange = () => callback();
  const onStorage = () => { appointmentCache = null; sessionCache = null; callback(); };
  window.addEventListener(eventName, onLocalChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(eventName, onLocalChange);
    window.removeEventListener("storage", onStorage);
  };
}

const emptyAppointments: Appointment[] = [];
const emptySessions: SavedSession[] = [];

export function useAppointments() {
  useEffect(() => {
    if (appointmentsLoaded) return;
    appointmentsLoaded = true;
    void loadAppointments();
  }, []);
  return useSyncExternalStore(
    subscribe,
    () => (appointmentCache ??= read<Appointment[]>(APPOINTMENTS_KEY, emptyAppointments)),
    () => emptyAppointments,
  );
}

export function useSavedSessions() {
  useEffect(() => {
    if (sessionsLoaded) return;
    sessionsLoaded = true;
    void loadSessions();
  }, []);
  return useSyncExternalStore(
    subscribe,
    () => (sessionCache ??= read<SavedSession[]>(SESSIONS_KEY, emptySessions)),
    () => emptySessions,
  );
}

export function saveAppointment(appointment: Appointment) {
  const current = read<Appointment[]>(APPOINTMENTS_KEY, []);
  write(APPOINTMENTS_KEY, [...current.filter((item) => item.id !== appointment.id), appointment]);
  void persistAppointments([appointment]);
}

export function saveAppointments(appointments: Appointment[]) {
  const current = read<Appointment[]>(APPOINTMENTS_KEY, []);
  const ids = new Set(appointments.map((item) => item.id));
  write(APPOINTMENTS_KEY, [...current.filter((item) => !ids.has(item.id)), ...appointments]);
  void persistAppointments(appointments);
}

export function updateAppointment(id: string, patch: Partial<Appointment>) {
  const current = read<Appointment[]>(APPOINTMENTS_KEY, []);
  write(
    APPOINTMENTS_KEY,
    current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
  );
  const updated = current.find((item) => item.id === id);
  if (updated) void persistAppointments([{ ...updated, ...patch }]);
}

export function saveSession(session: SavedSession) {
  const current = read<SavedSession[]>(SESSIONS_KEY, []);
  write(SESSIONS_KEY, [...current.filter((item) => item.id !== session.id), session]);
  void persistSession(session);
  if (session.status === "final" && session.appointmentId) {
    updateAppointment(session.appointmentId, { status: "completed" });
  }
}

export function hasAppointmentConflict(candidate: Pick<Appointment, "date" | "startTime" | "durationMinutes">, ignoreId?: string) {
  const current = read<Appointment[]>(APPOINTMENTS_KEY, []).filter(
    (item) => item.id !== ignoreId && item.date === candidate.date && item.status === "scheduled",
  );
  const start = timeToMinutes(candidate.startTime);
  const end = start + candidate.durationMinutes;
  return current.some((item) => {
    const itemStart = timeToMinutes(item.startTime);
    const itemEnd = itemStart + item.durationMinutes;
    return start < itemEnd && end > itemStart;
  });
}

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function createId(prefix: string) {
  void prefix;
  return crypto.randomUUID();
}

async function loadAppointments() {
  const supabase = createClient();
  const { data, error } = await supabase.from("appointments").select("*").order("starts_at");
  if (error || !data) return;
  const rows = data.map((row) => {
    const startsAt = new Date(row.starts_at);
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Africa/Lagos",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(startsAt);
    const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? "";
    return {
      id: row.id,
      clientId: legacyClientIds[row.client_id] ?? row.client_id,
      date: `${part("year")}-${part("month")}-${part("day")}`,
      startTime: `${part("hour")}:${part("minute")}`,
      durationMinutes: row.duration_minutes,
      sessionType: row.session_type,
      status: row.status,
      notes: row.private_notes ?? undefined,
      recurrenceGroupId: row.recurrence_group_id ?? undefined,
      createdAt: row.created_at,
    } as Appointment;
  });
  write(APPOINTMENTS_KEY, rows);
}

async function loadSessions() {
  const supabase = createClient();
  const { data, error } = await supabase.from("session_notes").select("*").order("session_date", { ascending: false });
  if (error || !data) return;
  write(SESSIONS_KEY, data.map((row) => ({
    id: row.id,
    appointmentId: row.appointment_id ?? undefined,
    clientId: legacyClientIds[row.client_id] ?? row.client_id,
    date: row.session_date,
    durationMinutes: row.duration_minutes,
    sessionType: row.session_type,
    focusAreas: row.focus_areas ?? "",
    observations: row.observations ?? "",
    techniques: row.techniques ?? "",
    engagement: row.engagement ?? 3,
    progressNotes: row.progress_notes ?? "",
    nextSteps: row.next_steps ?? "",
    tag: row.tag ?? "",
    status: row.status,
    updatedAt: row.updated_at,
  })) as SavedSession[]);
}

async function persistAppointments(appointments: Appointment[]) {
  const supabase = createClient();
  await persistClients(supabase, appointments.map((item) => item.clientId));
  const { error } = await supabase.from("appointments").upsert(appointments.map((item) => ({
    id: item.id,
    client_id: clientIds[item.clientId] ?? item.clientId,
    starts_at: `${item.date}T${item.startTime}:00+01:00`,
    duration_minutes: item.durationMinutes,
    session_type: item.sessionType,
    status: item.status,
    private_notes: item.notes ?? null,
    recurrence_group_id: item.recurrenceGroupId ?? null,
    updated_at: new Date().toISOString(),
  })));
  if (error) console.error("Could not sync appointments", error.message);
}

async function persistSession(session: SavedSession) {
  const supabase = createClient();
  await persistClients(supabase, [session.clientId]);
  const { error } = await supabase.from("session_notes").upsert({
    id: session.id,
    appointment_id: session.appointmentId ?? null,
    client_id: clientIds[session.clientId] ?? session.clientId,
    session_date: session.date,
    duration_minutes: session.durationMinutes,
    session_type: session.sessionType,
    focus_areas: session.focusAreas,
    observations: session.observations,
    techniques: session.techniques,
    engagement: session.engagement,
    progress_notes: session.progressNotes,
    next_steps: session.nextSteps,
    tag: session.tag,
    status: session.status,
    updated_at: session.updatedAt,
  });
  if (error) console.error("Could not sync session note", error.message);
}

async function persistClients(supabase: ReturnType<typeof createClient>, ids: string[]) {
  const rows = [...new Set(ids)].map((id) => getClient(id)).filter(Boolean).map((client) => ({
    id: clientIds[client!.id] ?? client!.id,
    first_name: client!.firstName,
    nickname: client!.nickname ?? null,
    date_of_birth: client!.dob ?? null,
    parent_name: client!.parentName,
    parent_phone: client!.parentPhone ?? null,
    parent_email: client!.parentEmail ?? null,
    relationship: client!.relationship ?? null,
    primary_concern: client!.primaryConcern ?? null,
    tags: client!.tags,
    working_hypothesis: client!.workingHypothesis ?? null,
    start_date: client!.startDate,
    internal_notes: client!.internalNotes ?? null,
    status: client!.status,
    updated_at: new Date().toISOString(),
  }));
  if (rows.length) {
    const { error } = await supabase.from("clients").upsert(rows);
    if (error) console.error("Could not sync clients", error.message);
  }
}
