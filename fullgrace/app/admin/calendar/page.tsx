"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Client } from "@/lib/mock/types";
import { useClients } from "@/lib/admin-data";
import {
  createId,
  hasAppointmentConflict,
  saveAppointment,
  saveAppointments,
  updateAppointment,
  useAppointments,
  type Appointment,
} from "@/lib/admin-store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";

const hours = Array.from({ length: 9 }, (_, index) => index + 9);
const durationOptions = [30, 45, 60, 90];

export default function CalendarPage() {
  const { clients } = useClients();
  const appointments = useAppointments();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [mobileDate, setMobileDate] = useState(() => {
    const today = new Date();
    return isoDate(today.getDay() === 0 ? addDays(startOfWeek(today), 5) : today);
  });
  const [composer, setComposer] = useState<{ date: string; time: string; appointment?: Appointment } | null>(null);
  const [message, setMessage] = useState("");
  const days = useMemo(
    () => Array.from({ length: 6 }, (_, index) => addDays(weekStart, index)),
    [weekStart],
  );

  const visible = appointments.filter((appointment) => days.some((day) => isoDate(day) === appointment.date));
  const mobileAppointments = visible.filter((appointment) => appointment.date === mobileDate && appointment.status !== "cancelled").sort((a, b) => a.startTime.localeCompare(b.startTime));
  const changeWeek = (amount: number) => {
    const nextStart = addDays(weekStart, amount * 7);
    setWeekStart(nextStart);
    setMobileDate(isoDate(nextStart));
  };
  const returnToToday = () => {
    const today = new Date();
    const nextStart = startOfWeek(today);
    setWeekStart(nextStart);
    setMobileDate(isoDate(today.getDay() === 0 ? addDays(nextStart, 5) : today));
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">Lagos time · Mon–Sat</p>
          <h1 className="font-display text-3xl font-medium">Calendar</h1>
          <p className="mt-1 text-sm text-ink-2">Click an open time to schedule, or click a booking to view and edit it.</p>
        </div>
        <Button className="w-full sm:w-auto" data-tour="calendar-add" onClick={() => setComposer({ date: mobileDate, time: "09:00" })}>+ Appointment</Button>
      </header>

      <div data-tour="calendar-controls" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-white p-3">
        <div className="flex items-center gap-2">
          <button className="calendar-control" onClick={() => changeWeek(-1)} aria-label="Previous week">←</button>
          <button className="calendar-control px-4" onClick={returnToToday}>Today</button>
          <button className="calendar-control" onClick={() => changeWeek(1)} aria-label="Next week">→</button>
        </div>
        <strong className="text-sm text-ink">{formatRange(days[0], days[5])}</strong>
        <div className="hidden items-center gap-4 text-xs text-ink-3 sm:flex">
          <span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-green" />Scheduled</span>
          <span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-puzzle-green" />Completed</span>
        </div>
      </div>

      {message && <div className="rounded-lg border border-puzzle-red/25 bg-puzzle-red/5 px-4 py-3 text-sm text-puzzle-red">{message}</div>}

      <section className="space-y-4 md:hidden">
        <div className="grid grid-cols-6 gap-1.5" aria-label="Choose a day">
          {days.map((day) => {
            const date = isoDate(day);
            const selected = date === mobileDate;
            const count = visible.filter((appointment) => appointment.date === date && appointment.status !== "cancelled").length;
            return <button key={date} onClick={() => setMobileDate(date)} aria-pressed={selected} className={`min-h-16 rounded-xl border px-1 py-2 text-center transition ${selected ? "border-green bg-green text-white shadow-sm" : "border-line bg-white text-ink-2"}`}><span className="block font-mono text-[9px] uppercase">{day.toLocaleDateString("en", { weekday: "short" })}</span><strong className="mt-0.5 block text-base">{day.getDate()}</strong>{count > 0 && <span className={`mx-auto mt-1 block h-1.5 w-1.5 rounded-full ${selected ? "bg-white" : "bg-green"}`} />}</button>;
          })}
        </div>

        <div className="rounded-2xl border border-line bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3"><div><p className="font-mono text-[10px] uppercase tracking-[.14em] text-ink-3">Appointments</p><h2 className="font-display text-xl">{formatMobileDay(mobileDate)}</h2></div><span className="rounded-full bg-green-3 px-3 py-1 text-xs font-medium text-green-2">{mobileAppointments.length}</span></div>
          {mobileAppointments.length ? <div className="mt-4 space-y-3">{mobileAppointments.map((appointment) => {
            const client = clients.find((item) => item.id === appointment.clientId);
            return <article key={appointment.id} className={`rounded-xl border p-4 ${appointment.status === "completed" ? "border-puzzle-green/25 bg-[#E8F4EC]" : "border-green/20 bg-green-3/65"}`}><button type="button" onClick={() => setComposer({ date: appointment.date, time: appointment.startTime, appointment })} className="w-full text-left" aria-label={`View or edit ${client?.firstName ?? "client"} appointment at ${appointment.startTime}`}><div className="flex items-start justify-between gap-3"><div><strong className="text-base">{appointment.startTime} · {client?.firstName}</strong><p className="mt-1 text-xs capitalize text-ink-2">{appointment.sessionType.replace("_", " ")} · {appointment.durationMinutes} minutes</p></div><span className="rounded-full bg-white/80 px-2 py-1 text-[10px] capitalize text-ink-2">{appointment.status.replace("_", " ")}</span></div>{appointment.notes && <p className="mt-3 line-clamp-2 text-xs text-ink-3">{appointment.notes}</p>}</button>{appointment.status === "scheduled" && <div className="mt-4 flex gap-2 border-t border-green/10 pt-3"><Link href={`/admin/sessions/new?client=${appointment.clientId}&appointment=${appointment.id}`} className="flex min-h-10 flex-1 items-center justify-center rounded-full bg-green px-3 text-sm font-medium text-white">Log report</Link><button onClick={() => setComposer({ date: appointment.date, time: appointment.startTime, appointment })} className="min-h-10 rounded-full border border-line bg-white px-4 text-sm font-medium">Edit</button></div>}</article>;
          })}</div> : <div className="mt-5 rounded-xl bg-cream-2/70 px-4 py-6 text-center"><p className="font-display text-lg">No appointments yet</p><p className="mt-1 text-sm text-ink-3">Choose an available time below.</p></div>}
        </div>

        <div data-tour="calendar-grid" className="rounded-2xl border border-line bg-white p-4 shadow-sm"><p className="font-mono text-[10px] uppercase tracking-[.14em] text-ink-3">Available times</p><div className="mt-3 grid grid-cols-3 gap-2">{hours.map((hour) => {
          const time = `${String(hour).padStart(2, "0")}:00`;
          const booked = mobileAppointments.some((appointment) => timeToMinutes(appointment.startTime) < hour * 60 + 60 && timeToMinutes(appointment.startTime) + appointment.durationMinutes > hour * 60);
          return <button key={hour} disabled={booked} onClick={() => setComposer({ date: mobileDate, time })} className="min-h-12 rounded-xl border border-line bg-white text-sm font-medium text-ink transition active:scale-[.98] disabled:bg-cream-2 disabled:text-ink-3">{time}{booked && <span className="block text-[9px] font-normal">Booked</span>}</button>;
        })}</div></div>
      </section>

      <div className="hidden overflow-x-auto rounded-xl border border-line bg-white shadow-[0_16px_50px_rgba(23,35,45,0.05)] md:block">
        <div className="min-w-[860px]">
          <div className="grid grid-cols-[72px_repeat(6,minmax(125px,1fr))] border-b border-line">
            <div />
            {days.map((day) => {
              const today = isoDate(day) === isoDate(new Date());
              return (
                <div key={day.toISOString()} className={`border-l border-line px-3 py-3 text-center ${today ? "bg-green-3/60" : ""}`}>
                  <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3">{day.toLocaleDateString("en", { weekday: "short" })}</div>
                  <div className={`mx-auto mt-1 flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${today ? "bg-green text-white" : "text-ink"}`}>{day.getDate()}</div>
                </div>
              );
            })}
          </div>

          <div className="relative grid grid-cols-[72px_repeat(6,minmax(125px,1fr))]">
            <div>
              {hours.map((hour) => <div key={hour} className="h-20 border-b border-line px-3 pt-2 text-right font-mono text-[10px] text-ink-3">{String(hour).padStart(2, "0")}:00</div>)}
            </div>
            {days.map((day) => {
              const date = isoDate(day);
              const dayAppointments = visible.filter((item) => item.date === date && item.status !== "cancelled");
              return (
                <div key={date} className="relative border-l border-line">
                  {hours.map((hour) => (
                    <button
                      key={hour}
                      data-tour={day.getTime() === days[0].getTime() && hour === 9 ? "calendar-grid" : undefined}
                      className="block h-20 w-full border-b border-line bg-white text-left transition-colors hover:bg-green-3/35 focus:z-10"
                      onClick={() => { setMessage(""); setComposer({ date, time: `${String(hour).padStart(2, "0")}:00` }); }}
                      aria-label={`Schedule ${date} at ${hour}:00`}
                    />
                  ))}
                  {dayAppointments.map((appointment) => {
                    const [h, m] = appointment.startTime.split(":").map(Number);
                    const top = ((h - 9) * 60 + m) * (80 / 60);
                    const height = Math.max(38, appointment.durationMinutes * (80 / 60) - 4);
                    const client = clients.find((item) => item.id === appointment.clientId);
                    return (
                      <div
                        key={appointment.id}
                        className={`absolute left-1 right-1 z-10 overflow-hidden rounded-lg border px-2 py-1.5 text-left shadow-sm ${appointment.status === "completed" ? "border-puzzle-green/30 bg-[#E8F4EC]" : "border-green/25 bg-green-3"}`}
                        style={{ top: top + 2, height }}
                      >
                        <button type="button" onClick={() => { setMessage(""); setComposer({ date: appointment.date, time: appointment.startTime, appointment }); }} className="block w-full text-left" aria-label={`View or edit ${client?.firstName ?? "client"} appointment at ${appointment.startTime}`}>
                          <div className="truncate text-xs font-semibold text-ink">{appointment.startTime} · {client?.firstName}</div>
                          <div className="truncate text-[10px] capitalize text-ink-2">{appointment.sessionType.replace("_", " ")} · {appointment.durationMinutes}m</div>
                        </button>
                        {appointment.status === "scheduled" && (
                          <div className="mt-1 flex gap-2 text-[10px] font-medium">
                            <Link href={`/admin/sessions/new?client=${appointment.clientId}&appointment=${appointment.id}`} className="text-green-2">Log</Link>
                            <button onClick={() => updateAppointment(appointment.id, { status: "cancelled" })} className="text-ink-3">Cancel</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {composer && (
        <AppointmentComposer
          initial={composer}
          onClose={() => setComposer(null)}
          onError={setMessage}
          onSaved={() => { setComposer(null); setMessage(""); }}
          clients={clients}
        />
      )}
    </div>
  );
}

function AppointmentComposer({ initial, onClose, onError, onSaved, clients }: { initial: { date: string; time: string; appointment?: Appointment }; onClose: () => void; onError: (message: string) => void; onSaved: () => void; clients: Client[] }) {
  const existing = initial.appointment;
  const [form, setForm] = useState({
    clientId: existing?.clientId ?? clients[0]?.id ?? "",
    date: existing?.date ?? initial.date,
    startTime: existing?.startTime ?? initial.time,
    duration: String(existing?.durationMinutes ?? 45),
    sessionType: existing?.sessionType ?? "therapy" as Appointment["sessionType"],
    status: existing?.status ?? "scheduled" as Appointment["status"],
    notes: existing?.notes ?? "",
    repeat: "none",
    occurrences: "8",
  });
  const set = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }));

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  const previewDates = !existing && form.repeat !== "none"
    ? recurrenceDates(form.date, Math.min(6, Math.max(2, Number(form.occurrences) || 2)), form.repeat)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-brandblack/25 backdrop-blur-[2px]" role="dialog" aria-modal="true" aria-label={existing ? "Appointment details" : "New appointment"}>
      <button className="absolute inset-0" onClick={onClose} aria-label="Close" />
      <div className="relative h-full w-full max-w-md overflow-y-auto bg-cream p-4 pb-28 shadow-2xl sm:p-6 sm:pb-24 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">{existing ? "Appointment details" : "New appointment"}</p>
            <h2 className="font-display text-2xl">{existing ? "View or edit booking" : "Schedule a session"}</h2>
            {existing?.recurrenceGroupId && <p className="mt-2 text-xs text-ink-3">Part of a recurring series · changes apply to this appointment only.</p>}
          </div>
          <button onClick={onClose} className="text-2xl text-ink-3" aria-label="Close">×</button>
        </div>
        <form className="mt-6 space-y-5 sm:mt-8" onSubmit={(event) => {
          event.preventDefault();
          const duration = Number(form.duration);
          const count = existing || form.repeat === "none" ? 1 : Math.max(2, Math.min(52, Number(form.occurrences) || 2));
          const dates = recurrenceDates(form.date, count, form.repeat);
          const conflict = dates.some((date) => hasAppointmentConflict({ date, startTime: form.startTime, durationMinutes: duration }, existing?.id));
          if (conflict) { onError("One of those times overlaps another appointment. Change the time, date or repeat settings."); return; }

          const now = new Date().toISOString();
          if (existing) {
            saveAppointment({ ...existing, clientId: form.clientId, date: form.date, startTime: form.startTime, durationMinutes: duration, sessionType: form.sessionType, status: form.status, notes: form.notes || undefined });
          } else {
            const group = count > 1 ? createId("series") : undefined;
            saveAppointments(dates.map((date): Appointment => ({ id: createId("apt"), clientId: form.clientId, date, startTime: form.startTime, durationMinutes: duration, sessionType: form.sessionType, status: "scheduled", notes: form.notes || undefined, recurrenceGroupId: group, createdAt: now })));
          }
          onSaved();
        }}>
          <Select label="Client" value={form.clientId} onChange={(e) => set("clientId", e.target.value)} options={clients.filter((client) => client.status === "active" || client.id === existing?.clientId).map((client) => ({ label: client.firstName, value: client.id }))} />
          <div className="grid gap-4 sm:grid-cols-2"><Input label="Date" type="date" required value={form.date} onChange={(e) => set("date", e.target.value)} /><Input label="Start" type="time" min="09:00" max="17:00" step="900" required value={form.startTime} onChange={(e) => set("startTime", e.target.value)} /></div>
          <div className="grid gap-4 sm:grid-cols-2"><Select label="Duration" value={form.duration} onChange={(e) => set("duration", e.target.value)} options={durationOptions.map((value) => ({ label: `${value} min`, value: String(value) }))} /><Select label="Type" value={form.sessionType} onChange={(e) => set("sessionType", e.target.value)} options={[{ label: "Therapy", value: "therapy" }, { label: "Assessment", value: "assessment" }, { label: "Parent consult", value: "parent_consult" }, { label: "Review", value: "review" }]} /></div>
          {existing ? (
            <Select label="Status" value={form.status} onChange={(e) => set("status", e.target.value)} options={[{ label: "Scheduled", value: "scheduled" }, { label: "Completed", value: "completed" }, { label: "No show", value: "no_show" }, { label: "Cancelled", value: "cancelled" }]} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
              <Select label="Repeat" value={form.repeat} onChange={(e) => set("repeat", e.target.value)} options={[{ label: "Does not repeat", value: "none" }, { label: "Every day", value: "daily" }, { label: "Weekdays only (Mon–Fri)", value: "weekdays" }, { label: "Working days (Mon–Sat)", value: "working_days" }, { label: "Weekly", value: "weekly" }, { label: "Every 2 weeks", value: "biweekly" }, { label: "Monthly", value: "monthly" }]} />
              {form.repeat !== "none" && <Input label="Occurrences" type="number" min={2} max={52} value={form.occurrences} onChange={(e) => set("occurrences", e.target.value)} hint="Including this one." />}
            </div>
          )}
          {previewDates.length > 0 && <div className="rounded-xl border border-green/15 bg-green-3/55 p-4"><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-green-2">First appointments</p><div className="mt-2 flex flex-wrap gap-2">{previewDates.map((date) => <span key={date} className="rounded-full bg-white px-3 py-1 text-xs text-ink-2">{formatPreviewDate(date)}</span>)}</div>{Number(form.occurrences) > previewDates.length && <p className="mt-2 text-xs text-ink-3">+ {Number(form.occurrences) - previewDates.length} more in this series</p>}</div>}
          <Textarea label="Private note (optional)" rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Materials, location or reminder…" />
          {existing && <div className="rounded-xl border border-line bg-white p-4 text-sm text-ink-2"><strong className="text-ink">Created booking</strong><p className="mt-1">{existing.recurrenceGroupId ? "This is one occurrence in a repeating series." : "This is a single appointment."}</p></div>}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
            <div>{existing?.status === "scheduled" && <button type="button" onClick={() => { updateAppointment(existing.id, { status: "cancelled" }); onSaved(); }} className="min-h-11 px-2 text-sm font-medium text-puzzle-red hover:underline">Cancel booking</button>}</div>
            <div className="flex w-full gap-2 sm:w-auto"><Button className="flex-1 sm:flex-none" type="button" variant="ghost" onClick={onClose}>Close</Button><Button className="flex-1 sm:flex-none" type="submit">{existing ? "Save changes" : countLabel(form.repeat)}</Button></div>
          </div>
        </form>
      </div>
    </div>
  );
}

function countLabel(repeat: string) { return repeat === "none" ? "Schedule" : "Schedule series"; }
function recurrenceDates(date: string, count: number, repeat: string) {
  const start = new Date(`${date}T12:00:00`);
  if (repeat === "weekdays" || repeat === "working_days") {
    const dates: string[] = [];
    let cursor = new Date(start);
    while (dates.length < count) {
      const day = cursor.getDay();
      if (repeat === "weekdays" ? day >= 1 && day <= 5 : day !== 0) dates.push(isoDate(cursor));
      cursor = addDays(cursor, 1);
    }
    return dates;
  }
  return Array.from({ length: count }, (_, index) => {
    if (repeat === "daily") return isoDate(addDays(start, index));
    if (repeat === "weekly") return isoDate(addDays(start, index * 7));
    if (repeat === "biweekly") return isoDate(addDays(start, index * 14));
    if (repeat === "monthly") return isoDate(addMonths(start, index));
    return isoDate(start);
  });
}
function formatPreviewDate(date: string) { return new Date(`${date}T12:00:00`).toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" }); }
function addMonths(date: Date, count: number) {
  const value = new Date(date);
  const requestedDay = value.getDate();
  value.setDate(1);
  value.setMonth(value.getMonth() + count);
  const lastDay = new Date(value.getFullYear(), value.getMonth() + 1, 0).getDate();
  value.setDate(Math.min(requestedDay, lastDay));
  return value;
}
function startOfWeek(date: Date) { const value = new Date(date); const day = value.getDay(); value.setDate(value.getDate() - (day === 0 ? 6 : day - 1)); value.setHours(12, 0, 0, 0); return value; }
function addDays(date: Date, count: number) { const value = new Date(date); value.setDate(value.getDate() + count); return value; }
function isoDate(date: Date) { return date.toLocaleDateString("en-CA"); }
function timeToMinutes(time: string) { const [hour, minute] = time.split(":").map(Number); return hour * 60 + minute; }
function formatMobileDay(date: string) { return new Date(`${date}T12:00:00`).toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" }); }
function formatRange(start: Date, end: Date) { return `${start.toLocaleDateString("en", { month: "short", day: "numeric" })} – ${end.toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}`; }
