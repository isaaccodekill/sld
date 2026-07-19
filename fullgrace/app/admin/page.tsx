"use client";

import Link from "next/link";
import { therapist } from "@/lib/mock";
import { useAppointments, useSavedSessions, updateAppointment } from "@/lib/admin-store";
import { useClients, useEnquiries, useReports } from "@/lib/admin-data";
import { formatTodayLong } from "@/lib/format";
import { LinkButton } from "@/components/ui/Button";

export default function AdminDashboard() {
  const { clients } = useClients();
  const enquiries = useEnquiries();
  const reports = useReports();
  const appointments = useAppointments();
  const savedSessions = useSavedSessions();
  const today = new Date().toLocaleDateString("en-CA");
  const todayAppointments = appointments.filter((item) => item.date === today && item.status !== "cancelled").sort((a, b) => a.startTime.localeCompare(b.startTime));
  const drafts = savedSessions.filter((item) => item.status === "draft");
  const next = todayAppointments.find((item) => item.status === "scheduled");
  const newEnquiries = enquiries.filter((item) => item.status === "new").length;

  return (
    <div className="space-y-6 sm:space-y-8">
      <header data-tour="dashboard-welcome" className="flex flex-col items-stretch gap-5 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">{formatTodayLong()}</p>
          <h1 className="mt-1 font-display text-3xl font-medium tracking-[-0.02em] sm:text-4xl">Good morning, {therapist.name.split(" ")[0]}.</h1>
          <p className="mt-2 text-ink-2">{todayAppointments.length ? `${todayAppointments.length} appointment${todayAppointments.length === 1 ? "" : "s"} today. Log each session report while the details are fresh.` : "Ready when you are. Log a session report or schedule the next visit."}</p>
        </div>
        <div data-tour="dashboard-log-report" className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap"><LinkButton href="/admin/calendar" variant="outline">+ Schedule</LinkButton><LinkButton href="/admin/sessions/new" variant="primary">+ Log report</LinkButton></div>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Summary label="Today" value={todayAppointments.length} detail={next ? `Next at ${next.startTime}` : "No upcoming session"} />
        <Summary label="Reports to finish" value={drafts.length} detail={drafts.length ? "Daily drafts saved safely" : "All caught up"} accent />
        <Summary label="Progress reports" value={reports.filter((item) => !item.markedSharedAt).length} detail="Parent reports awaiting review" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.55fr_.85fr]">
        <section data-tour="dashboard-today" className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_16px_50px_rgba(23,35,45,0.04)]">
          <div className="flex items-center justify-between border-b border-line px-5 py-4"><div><h2 className="font-display text-xl">Today’s sessions</h2><p className="text-xs text-ink-3">Your day, in order</p></div><Link href="/admin/calendar" className="text-sm font-medium text-green">View week →</Link></div>
          {todayAppointments.length === 0 ? (
            <div className="px-6 py-14 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-green-3 text-xl">✎</div><h3 className="mt-4 font-display text-xl">No scheduled sessions today</h3><p className="mt-1 text-sm text-ink-3">You can still log an unscheduled session report in one click.</p><div className="mt-5 flex flex-wrap justify-center gap-2"><LinkButton href="/admin/sessions/new" size="sm">Log session report</LinkButton><LinkButton href="/admin/calendar" variant="outline" size="sm">Schedule appointment</LinkButton></div></div>
          ) : (
            <ol className="divide-y divide-line">
              {todayAppointments.map((appointment) => {
                const client = clients.find((item) => item.id === appointment.clientId);
                return <li key={appointment.id} className="grid grid-cols-[52px_1fr] items-center gap-3 px-4 py-4 sm:grid-cols-[64px_1fr_auto] sm:gap-4 sm:px-5"><div className="font-display text-lg text-ink">{appointment.startTime}</div><div><div className="font-medium">{client?.firstName}</div><div className="text-xs capitalize text-ink-3">{appointment.sessionType.replace("_", " ")} · {appointment.durationMinutes} minutes</div></div><div className="col-span-2 flex items-center gap-2 sm:col-span-1">{appointment.status === "scheduled" ? <><LinkButton href={`/admin/sessions/new?client=${appointment.clientId}&appointment=${appointment.id}`} size="sm">Log report</LinkButton><button onClick={() => updateAppointment(appointment.id, { status: "no_show" })} className="min-h-9 px-2 text-xs text-ink-3 hover:text-ink">No-show</button></> : <span className="rounded-full bg-[#E8F4EC] px-3 py-1 text-xs font-medium text-puzzle-green">Completed</span>}</div></li>;
              })}
            </ol>
          )}
        </section>

        <aside className="space-y-5">
          <section data-tour="dashboard-actions" className="rounded-2xl border border-line bg-green-3/60 p-5"><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-green-2">Quick actions</p><div className="mt-4 grid gap-2"><QuickLink href="/admin/sessions/new" title="Log a session report" subtitle="Daily report · autosaves while you type" primary /><QuickLink href="/admin/calendar" title="Schedule an appointment" subtitle="Choose a client and time" /><QuickLink href="/admin/reports/new" title="Create a progress report" subtitle="Periodic parent-facing summary" /></div></section>
          <section className="rounded-2xl border border-line bg-white p-5"><div className="flex items-center justify-between"><h2 className="font-display text-lg">Needs attention</h2><span className="h-2 w-2 rounded-full bg-puzzle-yellow" /></div><div className="mt-4 divide-y divide-line text-sm"><Link href="/admin/enquiries" className="flex justify-between py-3"><span>New enquiries</span><strong>{newEnquiries}</strong></Link><Link href="/admin/reports" className="flex justify-between py-3"><span>Reports in draft</span><strong>{reports.filter((item) => !item.markedSharedAt).length}</strong></Link><Link href="/admin/clients" className="flex justify-between py-3"><span>Active clients</span><strong>{clients.filter((item) => item.status === "active").length}</strong></Link></div></section>
        </aside>
      </div>
    </div>
  );
}

function Summary({ label, value, detail, accent = false }: { label: string; value: number; detail: string; accent?: boolean }) { return <div className={`rounded-2xl border p-5 ${accent ? "border-puzzle-yellow/30 bg-puzzle-yellow/10" : "border-line bg-white"}`}><div className="flex items-end justify-between"><span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">{label}</span><strong className="font-display text-3xl font-medium">{value}</strong></div><p className="mt-3 text-xs text-ink-3">{detail}</p></div>; }
function QuickLink({ href, title, subtitle, primary = false }: { href: string; title: string; subtitle: string; primary?: boolean }) { return <Link href={href} className={`group rounded-xl border p-3 transition ${primary ? "border-green/20 bg-green text-white shadow-sm hover:bg-green-2" : "border-transparent bg-white/75 hover:border-green/20 hover:bg-white"}`}><div className="flex items-center justify-between text-sm font-medium"><span>{title}</span><span className={`transition-transform group-hover:translate-x-0.5 ${primary ? "text-white" : "text-green"}`}>→</span></div><p className={`mt-0.5 text-xs ${primary ? "text-white/75" : "text-ink-3"}`}>{subtitle}</p></Link>; }
