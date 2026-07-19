"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const router = useRouter();
  const [email, setEmail] = useState("Loading…");
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    void createClient().auth.getUser().then(({ data }) => setEmail(data.user?.email ?? "Therapist account"));
  }, []);

  return (
    <div className="mx-auto max-w-3xl space-y-7">
      <header><h1 className="font-display text-3xl font-medium">Settings</h1><p className="mt-1 text-sm text-ink-2">Workspace help and account security.</p></header>

      <section className="rounded-2xl border border-line bg-white p-5 sm:p-7">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-green">Signed-in account</p>
        <h2 className="mt-2 font-display text-xl">{email}</h2>
        <p className="mt-2 text-sm text-ink-2">This is the only account approved to view private client and therapy records.</p>
        <Button data-tour="account-security" className="mt-5" variant="outline" disabled={signingOut} onClick={async () => { setSigningOut(true); await createClient().auth.signOut(); router.replace("/login"); router.refresh(); }}>{signingOut ? "Signing out…" : "Sign out securely"}</Button>
      </section>

      <section data-tour="tour-replay" className="rounded-2xl border border-line bg-green-3/60 p-5 sm:p-7">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-green">Need a refresher?</p>
        <h2 className="mt-2 font-display text-xl">Replay the workspace tour</h2>
        <p className="mt-2 max-w-xl text-sm text-ink-2">A guided, page-by-page walkthrough of scheduling, client records, session notes, reports and enquiries.</p>
        <Button className="mt-5" onClick={() => window.dispatchEvent(new Event("fullgrace:tour"))}>Start product tour</Button>
      </section>

      <section className="rounded-2xl border border-line bg-white p-5 text-sm text-ink-2 sm:p-7">
        <h2 className="font-display text-xl text-ink">Privacy reminder</h2>
        <p className="mt-2">Always sign out on a shared device. Parent-facing reports are never sent automatically; review every report before downloading or sharing it.</p>
      </section>
    </div>
  );
}
