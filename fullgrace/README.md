# Fullgrace — Visual Prototype

Next.js 14 (App Router) + Tailwind + Framer Motion visual prototype of the Fullgrace public site + admin panel. No backend — all data is typed mock fixtures in `lib/mock/`.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000

## What's in this prototype

### Public site
- `/` — homepage with sticky identity card, rotating underlines, values marquee, approach, who-we-help, programs, team, testimonials, FAQ, oversized footer CTA.
- `/contact` — topic selector (quick / parent / referrer), 3-step parent form with progress hint, referrer form, post-submit confirmation.
- `/privacy` — template privacy policy.
- Floating WhatsApp widget, appears after 800ms, dismiss persists in `sessionStorage`, hidden on `/admin/*`.

### Admin panel (no auth — publicly reachable in this prototype)
- `/admin` — dashboard (today, new enquiries, recent clients, needs follow-up, reports due).
- `/admin/enquiries` — inbox + `/admin/enquiries/[id]` detail with WhatsApp reply deep-link + "Register as client" flow.
- `/admin/clients` — list + `/admin/clients/new` registration form (pre-fills from enquiry via `?from=`) + `/admin/clients/[id]` with four tabs: Overview, Sessions, Timeline, Reports.
- `/admin/sessions` — global list + `/admin/sessions/new` session logging form with autosave indicator + 1-5 engagement scale.
- `/admin/reports` — index + `/admin/reports/[id]` split-pane editor with live print-styled PDF preview. **Export PDF** triggers `window.print()`. Regenerate / write manually / mark as shared.
- `/admin/settings` — therapist profile, notification prefs, AI prefs.

## Design tokens

See `lib/tokens.ts` and `tailwind.config.ts`. Colour rule: 90% cream + ink, 8% brand green, 2% playful puzzle accents. Type: Fraunces (display) + Inter (body) + JetBrains Mono (markers).

## Placeholder content

Every piece of user-facing copy is flagged `{/* REPLACE BEFORE LAUNCH */}` or sits behind a constant in `lib/constants.ts`:

- **`WHATSAPP_NUMBER`** — placeholder `+2348000000000`.
- Business address, phone, email — Lagos placeholders.
- Founder: **Awele Bello**.
- Mock clients use Yoruba/Igbo/Hausa first names. All 6 clients, ~25 sessions, 5 enquiries, 2 progress reports are fabricated.

## What this prototype *doesn't* do

- No Supabase / Postgres / RLS / migrations.
- No real auth — admin is publicly reachable.
- No Anthropic API — AI summaries are canned strings.
- No Puppeteer — PDF export is `window.print()` against the on-page preview.
- No Resend / Turnstile / rate limiting — form submits are client-side state only.
- No deploy config beyond `npm run dev`.

See `../docs/superpowers/specs/2026-04-22-fullgrace-visual-prototype-design.md` for the full design spec, and `../project.md` / the PRD for the product requirements this prototype is a v0 of.
