"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LogoLockup } from "@/components/ui/Logo";

export default function LoginPage() {
  return <Suspense fallback={<main className="flex min-h-screen items-center justify-center bg-cream-2 text-sm text-ink-3">Loading secure workspace…</main>}><LoginForm /></Suspense>;
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault(); setLoading(true); setError("");
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      const { data: allowed } = await supabase.from("admin_users").select("email").eq("email", email.toLowerCase()).maybeSingle();
      if (!allowed) { await supabase.auth.signOut(); throw new Error("This email is not approved for the admin workspace."); }
      router.replace(params.get("next") || "/admin"); router.refresh();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to sign in."); setLoading(false); }
  }

  return <main className="flex min-h-screen items-center justify-center bg-cream-2 px-5"><div className="w-full max-w-md rounded-3xl border border-line bg-white p-8 shadow-[0_24px_80px_rgba(23,35,45,.09)]"><LogoLockup /><div className="mt-10"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-green">Private workspace</p><h1 className="mt-2 font-display text-3xl">Welcome back</h1><p className="mt-2 text-sm text-ink-2">Sign in with the single approved therapist account.</p></div><form onSubmit={submit} className="mt-8 space-y-5"><Input label="Email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /><Input label="Password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />{error && <p className="rounded-lg bg-puzzle-red/10 px-3 py-2 text-sm text-puzzle-red">{error}</p>}<Button type="submit" disabled={loading} className="w-full">{loading ? "Signing in…" : "Sign in"}</Button></form><p className="mt-6 text-center text-xs text-ink-3">No public sign-up. Access is controlled by the admin allowlist.</p></div></main>;
}
