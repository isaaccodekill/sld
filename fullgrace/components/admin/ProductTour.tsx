"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

type Demo = "overview" | "schedule" | "client" | "session" | "report" | "inbox" | "security";

const steps = [
  { route: "/admin", target: "dashboard-welcome", eyebrow: "Today · your starting point", title: "Begin every day here", body: "Today turns the whole workspace into a short action list: upcoming sessions, daily reports to finish and progress reports awaiting review.", tip: "Nothing is sent or changed from this overview.", demo: "overview" as Demo },
  { route: "/admin", target: "dashboard-log-report", eyebrow: "Today · your main action", title: "Log the daily session report", body: "This is the action you will use most often. Open it after a session, choose the child and capture the clinical details while they are fresh.", tip: "The same Log report shortcut stays in the top bar on every page.", demo: "session" as Demo, click: true },
  { route: "/admin/calendar", target: "calendar-controls", eyebrow: "Calendar · choose a week", title: "Move around the diary", body: "Use the arrows to move one week at a time, or Today to return instantly. All times are shown in Lagos time.", tip: "The date range confirms which week you are editing.", demo: "schedule" as Demo },
  { route: "/admin/calendar", target: "calendar-grid", eyebrow: "Calendar · choose a slot", title: "Click an open time", body: "Select any empty block under the correct day. The appointment panel opens with that date and time already filled in.", tip: "Existing appointments remain visible, so clashes are easier to avoid.", demo: "schedule" as Demo, click: true },
  { route: "/admin/calendar", target: "calendar-add", eyebrow: "Calendar · another option", title: "Or start with + Appointment", body: "This opens the same scheduling panel. Choose the child, duration and type, then repeat daily, weekdays only, Mon–Sat, weekly, fortnightly or monthly.", tip: "Preview the generated dates before saving the series.", demo: "schedule" as Demo, click: true },
  { route: "/admin/clients", target: "clients-list", eyebrow: "Clients · secure records", title: "Find everything under the child", body: "Open a child to see guardian details, concerns, session history and progress together. On mobile, each record becomes a large tap-friendly card.", tip: "Status labels help separate active, paused and discharged clients.", demo: "client" as Demo, click: true },
  { route: "/admin/clients", target: "clients-new", eyebrow: "Clients · registration", title: "Register a new child", body: "Use this after an initial conversation. Add only the information needed for care; the record can be updated later.", tip: "An Inbox enquiry can also be promoted into a client record.", demo: "client" as Demo, click: true },
  { route: "/admin/sessions", target: "sessions-list", eyebrow: "Session reports · clinical history", title: "Drafts and final reports stay visible", body: "The newest daily reports appear first. Yellow means the report still needs finishing; green means it has been finalised for progress reporting.", tip: "Open + Log a report for an unscheduled visit.", demo: "session" as Demo },
  { route: "/admin/sessions/new", target: "session-form", eyebrow: "Session reports · write", title: "Capture the useful clinical story", body: "Choose the child, then record focus, observations, techniques, engagement, progress and next steps. Your report autosaves as a draft while you type.", tip: "Use clear observations; these become the evidence for progress reports.", demo: "session" as Demo },
  { route: "/admin/sessions/new", target: "session-finalize", eyebrow: "Session reports · finish safely", title: "Finalise only when the report is ready", body: "Finalising makes it available to progress report generation and marks a linked appointment complete. You can leave earlier and return to the saved draft.", tip: "The animated pointer shows the exact finishing action.", demo: "session" as Demo, click: true },
  { route: "/admin/reports/new", target: "report-setup", eyebrow: "Progress reports · choose evidence", title: "Select the child and review period", body: "The builder gathers only final daily session reports inside this date window. Add the occasion to shape the opening, such as end of term or a parent review.", tip: "Nothing is shared automatically.", demo: "report" as Demo },
  { route: "/admin/reports/new", target: "report-draft", eyebrow: "Reports · build the first draft", title: "Create, review, then print", body: "Draft report prepares a parent-friendly starting point. On the next screen you can rewrite every sentence before saving or printing to PDF.", tip: "Always personalise the generated text before sharing.", demo: "report" as Demo, click: true },
  { route: "/admin/enquiries", target: "enquiries-list", eyebrow: "Inbox · first contact", title: "Move a family from enquiry to care", body: "Open a message to review the family’s details. When they are ready, promote the enquiry to a client so you do not retype their information.", tip: "Reply outside the app for now, then archive the enquiry when handled.", demo: "inbox" as Demo, click: true },
  { route: "/admin/settings", target: "tour-replay", eyebrow: "Settings · help", title: "Replay this guide whenever needed", body: "The Take a tour button in the top bar and this Settings card both restart the full walkthrough from the beginning.", tip: "Use Escape at any point to close the tour.", demo: "security" as Demo },
  { route: "/admin/settings", target: "account-security", eyebrow: "Settings · security", title: "Finish by protecting client information", body: "This workspace contains private therapy records. Sign out whenever the computer is shared, and review every parent-facing report before downloading it.", tip: "You are ready. Finish returns you to Today.", demo: "security" as Demo },
];

type TargetRect = { top: number; left: number; width: number; height: number };

export function ProductTour() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const current = steps[step];

  const close = useCallback((complete = true) => {
    if (complete) window.localStorage.setItem("fullgrace.tour.complete", "true");
    setOpen(false);
    setTargetRect(null);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }, []);

  const finish = useCallback(() => {
    close(true);
    router.push("/admin");
  }, [close, router]);

  useEffect(() => {
    const launch = () => {
      triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setStep(0);
      setOpen(true);
    };
    window.addEventListener("fullgrace:tour", launch);
    if (!window.localStorage.getItem("fullgrace.tour.complete")) launch();
    return () => window.removeEventListener("fullgrace:tour", launch);
  }, []);

  useEffect(() => {
    if (!open) return;
    if (pathname !== current.route) {
      setTargetRect(null);
      router.push(current.route);
      return;
    }

    let cancelled = false;
    let tries = 0;
    let timer = 0;
    const locate = () => {
      if (cancelled) return;
      const element = Array.from(document.querySelectorAll<HTMLElement>(`[data-tour="${current.target}"]`))
        .find((candidate) => candidate.offsetWidth > 0 && candidate.offsetHeight > 0);
      if (!element && tries++ < 20) {
        timer = window.setTimeout(locate, 100);
        return;
      }
      if (!element) return;
      element.scrollIntoView({ block: "center", inline: "nearest" });
      window.requestAnimationFrame(() => {
        if (cancelled) return;
        const rect = element.getBoundingClientRect();
        const padding = 8;
        setTargetRect({ top: Math.max(8, rect.top - padding), left: Math.max(8, rect.left - padding), width: Math.min(window.innerWidth - 16, rect.width + padding * 2), height: rect.height + padding * 2 });
        cardRef.current?.focus();
      });
    };
    timer = window.setTimeout(locate, 180);
    const refresh = () => window.setTimeout(locate, 50);
    window.addEventListener("resize", refresh);
    window.addEventListener("scroll", refresh, true);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener("resize", refresh);
      window.removeEventListener("scroll", refresh, true);
    };
  }, [current.route, current.target, open, pathname, router, step]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(true);
      if (event.key === "ArrowRight" && step < steps.length - 1) setStep((value) => value + 1);
      if (event.key === "ArrowLeft" && step > 0) setStep((value) => value - 1);
      if (event.key !== "Tab" || !cardRef.current) return;
      const focusable = Array.from(cardRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close, open, step]);

  if (!open) return null;
  const placeAtTop = targetRect ? targetRect.top > window.innerHeight * 0.5 : false;

  return (
    <div className="fixed inset-0 z-[80] pointer-events-none" aria-live="polite">
      {targetRect ? (
        <div className="tour-spotlight" style={targetRect} aria-hidden>
          {current.click && <span className="tour-pointer"><CursorIcon /></span>}
        </div>
      ) : <div className="absolute inset-0 bg-brandblack/45" />}

      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-title"
        aria-describedby="tour-description"
        tabIndex={-1}
        onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null; }}
        onTouchEnd={(event) => {
          if (touchStartX.current === null) return;
          const distance = (event.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
          touchStartX.current = null;
          if (distance < -55 && step < steps.length - 1) setStep((value) => value + 1);
          if (distance > 55 && step > 0) setStep((value) => value - 1);
        }}
        className={`pointer-events-auto absolute z-[83] inset-x-3 max-h-[calc(100vh-1.5rem)] overflow-y-auto rounded-3xl border border-white/70 bg-white p-5 shadow-2xl outline-none sm:inset-x-auto sm:right-6 sm:w-[410px] sm:p-6 ${placeAtTop ? "top-3 sm:top-6" : "bottom-3 sm:bottom-6"}`}
      >
        <div className="h-1 overflow-hidden rounded-full bg-cream-3"><div className="h-full rounded-full bg-green transition-[width] duration-500" style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-green">{current.eyebrow}</p>
          <span className="shrink-0 text-xs text-ink-3">{step + 1} of {steps.length}</span>
        </div>
        <h2 id="tour-title" className="mt-3 font-display text-2xl text-ink">{current.title}</h2>
        <p id="tour-description" className="mt-2 text-sm leading-6 text-ink-2">{current.body}</p>
        <TourDemo type={current.demo} />
        <div className="mt-4 flex gap-2 rounded-xl bg-green-3/60 p-3 text-xs leading-5 text-green-2"><span aria-hidden>✦</span><p>{current.tip}</p></div>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
          <button onClick={() => close(true)} className="min-h-11 px-2 text-sm text-ink-3 hover:text-ink">Exit tour</button>
          <div className="flex gap-2">
            {step > 0 && <Button variant="outline" size="sm" onClick={() => setStep((value) => value - 1)}>Back</Button>}
            <Button size="sm" onClick={() => step === steps.length - 1 ? finish() : setStep((value) => value + 1)}>{step === steps.length - 1 ? "Finish" : "Next"}</Button>
          </div>
        </div>
        <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.13em] text-ink-3"><span className="sm:hidden">Swipe or use the buttons to move</span><span className="hidden sm:inline">Use ← → to move · Esc to exit</span></p>
      </div>
    </div>
  );
}

function TourDemo({ type }: { type: Demo }) {
  const labels: Record<Demo, [string, string, string]> = {
    overview: ["09:00 session", "1 report to finish", "Review progress"],
    schedule: ["Choose a time", "Select child", "Schedule"],
    client: ["Family details", "Goals & history", "Progress"],
    session: ["Observe", "Record progress", "Finalise"],
    report: ["Final notes", "Review draft", "Save PDF"],
    inbox: ["Read enquiry", "Contact family", "Create client"],
    security: ["Private records", "Review sharing", "Sign out"],
  };
  return <div className="tour-demo mt-4" aria-hidden>{labels[type].map((label, index) => <div key={label} className="tour-demo-step"><span>{index + 1}</span><b>{label}</b>{index < 2 && <i>→</i>}</div>)}<span className="tour-demo-cursor"><CursorIcon /></span></div>;
}

function CursorIcon() {
  return <svg viewBox="0 0 24 24" className="h-7 w-7 drop-shadow-md" fill="none" aria-hidden><path d="M5 3.8v14.7l3.8-3.5 2.5 5.2 3-1.45-2.45-5.05h5.35L5 3.8Z" fill="white" stroke="#17232d" strokeWidth="1.5" strokeLinejoin="round" /></svg>;
}
