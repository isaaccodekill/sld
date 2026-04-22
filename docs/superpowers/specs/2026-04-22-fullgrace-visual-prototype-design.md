---
title: Fullgrace — Visual Prototype (Public Site + Admin Panel)
date: 2026-04-22
status: approved
---

# Fullgrace — Visual Prototype (Public Site + Admin Panel)

This spec covers the **Phase-0 visual prototype** of the Fullgrace product described in the PRD (v0.2). It is a static, no-backend prototype of both the parent-facing public website and the therapist-facing admin panel, built as a single Next.js 14 app. Its job is to let the stakeholder *feel* the PRD's design intent in a browser before committing to the backend build. Every artefact that would normally touch a real service (Supabase, Anthropic, Resend, Turnstile, Puppeteer, WhatsApp) is either stubbed or mocked in a way that preserves the UX.

## Scope

### In
- Next.js 14 App Router project scaffold, TypeScript, Tailwind, Framer Motion.
- Design tokens (colour / type / spacing / motion) exposed as CSS variables and Tailwind theme extensions.
- Public homepage with all seven numbered sections from PRD §5.2 (§01 Introduction → §07 FAQ) + footer-as-CTA.
- `/contact` page with the Slack-style topic selector, 3-step parent form, single-page referrer form, post-submit confirmation.
- `/privacy` page (template text).
- Always-on WhatsApp widget (bottom-right bubble, greeting card, pre-filled chips → `wa.me` deeplink), hidden on `/admin/*`.
- `/admin/*` panel with sidebar + topbar, and these routes: dashboard, enquiries inbox + detail, clients list + detail (4 tabs) + new, sessions list + new, reports list + detail (split-pane editor + print-styled preview), settings.
- Mock data module (`lib/mock/`) supplying a single therapist (`Awele Bello, founder`), 6 clients with Nigerian names, ~25 sessions, 5 enquiries across the three source types, 2 progress reports (one exported, one in draft), and canned AI summaries.
- Placeholder copy in the PRD's voice, flagged for replacement. Placeholder WhatsApp number `+234 800 000 0000` in a single constant.
- `prefers-reduced-motion` respected across all motion.

### Out (deferred to later phases)
- Real Supabase project, RLS, schema migrations.
- Real Anthropic Claude API integration (admin shows canned summaries).
- Real Puppeteer PDF generation (admin shows a print-styled HTML preview; "Export" triggers `window.print()`).
- Real email (Resend), Turnstile captcha, rate limiting.
- Real auth (admin is publicly reachable; a mock-auth toggle in the layout simulates session state for screenshots).
- Deploy to Vercel.
- Real content and photography. Image slots use CSS-art / abstract treatments, not stock photos of children.

## Decisions locked in at brainstorm

- **Display font:** Fraunces (Google Fonts, variable).
- **Body font:** Inter (Google Fonts, variable).
- **Mono accent (section markers):** JetBrains Mono.
- **Brand green:** `#2F5D3A` with hover `#264B2F` and tint `#E6EEE7`.
- **Copy:** placeholder in PRD voice, each block tagged `{/* REPLACE BEFORE LAUNCH */}`.
- **Photography:** CSS-art / abstract treatments only; no photos of people.
- **WhatsApp number:** placeholder constant.
- **Mock admin data:** fabricated — Nigerian names, clinical-plausible notes.
- **Admin auth:** no gate in the prototype; mock-auth toggle in the admin topbar.
- **Deploy target:** local `npm run dev` only.
- **PDF:** print-styled HTML page inside the admin; stub `window.print()` export.

## Design tokens

```
Colour
  cream        #F7F3EC   ground
  cream-2      #F1EADC   subtle banding
  ink          #1F1B16   body
  ink-2        #4A433B   secondary
  ink-3        #8A8278   tertiary / captions
  green        #2F5D3A   primary brand
  green-2      #264B2F   hover / pressed
  green-3      #E6EEE7   tint backgrounds (rare)
  puzzle-blue  #2E6FC7
  puzzle-red   #D64438
  puzzle-yellow#F5C23A
  puzzle-green #2A8B3D
  black        #0B0A08   logo + rare brand moments only

Type
  display   Fraunces        400/500/600 (opsz on)
  body      Inter           400/500/600
  mono      JetBrains Mono  500
  scale rem .75 .875 1 1.125 1.25 1.5 2 2.75 3.75 5 6.5

Rhythm
  radii     sm 4   md 8   lg 16   xl 28   pill 9999
  space     4 8 12 16 24 32 48 64 96 128 160  (8-pt grid)
  maxw      prose 68ch · content 1200 · wide 1440

Motion
  ease      cubic-bezier(.22, 1, .36, 1)
  dur       fast 180 · base 420 · slow 720
  reveal    opacity 0→1 + translateY 16→0 @ base
  marquee   40s linear infinite; 60s < md
  reduced   prefers-reduced-motion collapses all durations to 0
```

**Colour rule enforced in code:** no component may render more than one puzzle colour simultaneously unless it accepts an explicit `brandMoment` prop (reserved for the hero lockup and the footer statement).

## Project structure

```
fullgrace/
├── app/
│   ├── (public)/
│   │   ├── layout.tsx              public nav + WhatsApp widget + footer
│   │   ├── page.tsx                homepage (§01–§07)
│   │   ├── contact/page.tsx        topic selector + 3-step form + referrer form
│   │   └── privacy/page.tsx
│   ├── admin/
│   │   ├── layout.tsx              sidebar + topbar + mock-auth provider
│   │   ├── page.tsx                dashboard
│   │   ├── enquiries/page.tsx
│   │   ├── enquiries/[id]/page.tsx
│   │   ├── clients/page.tsx
│   │   ├── clients/new/page.tsx
│   │   ├── clients/[id]/page.tsx   tabs: overview / sessions / timeline / reports
│   │   ├── sessions/page.tsx
│   │   ├── sessions/new/page.tsx
│   │   ├── reports/page.tsx
│   │   ├── reports/[id]/page.tsx   split-pane editor + print preview
│   │   └── settings/page.tsx
│   ├── layout.tsx                  root: fonts, tokens, reduced-motion
│   └── globals.css
├── components/
│   ├── public/   Nav · Hero · RotatingUnderline · StickyIdentityCard ·
│   │             ValuesMarquee · SectionMarker · Approach · WhoWeHelp ·
│   │             Programs · Team · Testimonials · FAQ · FooterCTA ·
│   │             WhatsAppWidget · ContactTopicSelector · ParentEnquiryForm ·
│   │             ReferrerForm
│   ├── admin/    AdminSidebar · AdminTopbar · MockAuthToggle · EnquiryRow ·
│   │             ClientCard · ClientTabs · SessionForm · SessionTimeline ·
│   │             AISummaryCard · ReportEditor · ReportPDFPreview ·
│   │             DashboardWidgets
│   └── ui/       Button · Input · Textarea · Select · Chip · Dialog · Tabs ·
│                 Tag · PuzzleDot · NumberedMarker · Reveal
├── lib/
│   ├── mock/     therapist.ts · clients.ts · sessions.ts · enquiries.ts ·
│   │             reports.ts · ai-summaries.ts · index.ts
│   ├── tokens.ts
│   ├── format.ts dates, age, relative time
│   └── constants.ts WHATSAPP_NUMBER, OPENING_HOURS, BUSINESS_EMAIL
├── public/       logo assets copied from /assets
└── package.json
```

## Key interaction specs

### Public

**Sticky identity card (hero's fluidity move).**
Grid: `lg:grid-cols-[320px_1fr] gap-16`. Left column contains a card (logo mark, one-line tagline, small WhatsApp button, open-hours strip). `position: sticky; top: 96px`. It stays visible from the hero through §02 Approach. At `<lg` it collapses into a small pill at the top of the page carrying just the logo + WhatsApp.

**Rotating underline in hero.**
Phrases *find their voice / build self-help skills / move through difficulty* each wrapped in a `<RotatingUnderline color="blue|red|yellow|green">` that renders an inline SVG path underline. Default static; on focus/hover the stroke-dashoffset animates over 600ms. `prefers-reduced-motion` disables the redraw.

**Values marquee.**
One horizontal marquee per page, CSS `@keyframes` translate. Items: *Montessori-rooted · Child-led · Evidence-based · Patient · Family-inclusive*. Duplicates content twice so the loop seams. Slows to 60s duration below `md`.

**WhatsApp widget.**
Floating bubble, bottom-right, brand green, with an inline SVG puzzle-piece mark (not the generic WhatsApp glyph). First page load: appears after 800ms with a fade-up. Click → greeting card slides up with opening-hours strip + two pre-filled message chips + "Type your own" link. All chip clicks open `https://wa.me/<NUMBER>?text=<encoded>` in a new tab. Dismissal persists in `sessionStorage` under `fg_wa_dismissed`. Hidden on `/admin/*` via a pathname check in the public layout.

**Contact page — topic selector.**
Three radio-style cards. Selecting "quick question" collapses the form area and surfaces a `[Chat on WhatsApp]` + email link. Selecting "talk about my child" reveals the 3-step parent form with `Step X of 3` caption. Selecting "referrer" reveals a single-page referrer form. Step transitions use `AnimatePresence` fade+slide (8px).

**Post-submit confirmation.**
In-page state swap (no navigation). Warm message + WhatsApp fallback button.

### Admin

**Sidebar + topbar.**
Sidebar 240px, cream background, ink text, active row has green left-border. Topbar holds breadcrumb + mock-auth toggle (`Signed in as Awele · Sign out (mock)`). Mobile: sidebar collapses into an off-canvas drawer.

**Dashboard.**
Widgets in a CSS grid: *Today* date card, *New enquiries* (count + first two previews), *Recent clients* (5 rows with since-last-session chips), *Needs follow-up* (list), *Reports due* (nudge list).

**Enquiries inbox.**
Table-like list with source chip (quick / parent / referrer), parent name, child first name + age (if parent enquiry), one-line preview, unread dot, received-at. Detail route renders the full payload in a structured layout + three actions: *Mark as read/archived*, *Copy WhatsApp link* (builds `wa.me` URL with parent's phone), *Register as client →* (deep-links to `/admin/clients/new?from=<enquiryId>`, which pre-fills fields from mock enquiry data).

**Client detail — tabs.**
- **Overview**: identity header, status pill, AI "since last session" card with *Last generated N days ago · Regenerate*, pinned *+ Add session* button, *Generate report for parent* button.
- **Sessions**: reverse-chronological list; each row expands to show observations/progress/next-steps.
- **Timeline**: horizontal SVG strip; each session a dot coloured by tag (good → `puzzle-green`, challenging → `puzzle-yellow`, admin → `ink-3`). Hover shows date + focus area.
- **Reports**: list of generated PDFs with download (stub) and *Mark as shared* toggle.

**Session form.**
Single calm page, not a modal. Autosave indicator ("Draft saved 4s ago") runs off a timer in state. All long-text fields accept markdown (rendered read-only on session detail). Keyboard-first: every field reachable via tab.

**AI summary card.**
Two flavours:
- *Since last session* — 3–5 sentence canned text, with a banner "Generated — therapist to review" and a textarea that lets the therapist edit and "Save edited version".
- *Arc summary* — opened in a side drawer; includes narrative paragraph + observed patterns bullets + suggested focus areas + flagged items.

**Report editor.**
Split-pane (`lg:grid-cols-2`). Left: form sections (*A note from your therapist / What we've been working on / What we're noticing / Suggestions for home / What's next*). Right: A4-proportioned preview frame with print styles. "Export PDF" calls `window.print()` scoped to the preview via a print-only stylesheet. Also: *Regenerate draft* (swaps in a different canned draft with confirmation), *Write manually* (clears to an empty template), *Mark as shared*.

## Mock data shape

Typed TS fixtures matching the PRD §7.2 data model:

```
therapist:  { id, name: "Awele Bello", email, role: "Founder & Lead Therapist" }
clients[6]: Tola Adebayo (5, speech_delay, active),
            Chioma Eze (7, asd, active),
            Kunle Bakare (4, downs, active),
            Amara Okeke (9, speech_delay, paused),
            Bayo Adeyemi (3, asd, active),
            Ife Ogundimu (6, other, active)
sessions[~25]: spread across last ~4 months, mix of good/challenging/admin tags
enquiries[5]: 1 quick-question, 3 parent enquiries (1 already promoted to Tola),
              1 referrer (paediatrician)
reports[2]:   Tola (exported, shared), Chioma (in-draft)
ai_summaries: 6 since_last, 2 arc
```

## Accessibility

- WCAG AA contrast verified for all token pairings used on text.
- Every interactive element has a visible focus ring (`focus-visible:outline-2 outline-green`).
- All form labels are visible; no placeholder-only labels.
- Multi-step form is keyboard-navigable with clear step headings announced.
- Decorative puzzle-piece accents `aria-hidden="true"`; meaningful SVG icons get `role="img"` + `<title>`.
- `prefers-reduced-motion`: marquee, reveals, and WhatsApp widget entrance all disabled when set.

## Non-goals and deferred risk

- Anything backend. The prototype has zero persistence — refreshing the page resets state.
- Real LLM calls. All "AI" outputs are static canned strings.
- Real PDFs. `window.print()` is good enough to feel the layout; Puppeteer comes in Phase 4.
- Deploy / CI. Local dev only.

## Acceptance

The prototype is "done" when:
1. `npm install && npm run dev` produces a working site at `localhost:3000`.
2. Homepage, contact, privacy, and all admin routes render without errors.
3. The sticky identity card, rotating underline, values marquee, and WhatsApp widget all behave as specified, with reduced-motion respected.
4. The admin client detail page shows all four tabs with realistic mock data; the report editor's split-pane preview updates as text is typed; `window.print()` produces a clean, paginated view of the report.
5. No TypeScript or ESLint errors.

## After this prototype

Next spec would cover **Phase 0 (Foundation)** — Supabase project + schema + RLS + auth + env plumbing — on top of this UI, followed by phased wiring of enquiries → admin → AI → PDFs per the PRD.
