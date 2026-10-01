# FOONTRO — "The Scoreboard" (concept redesign)

A dark, editorial, animation-first landing page concept for **foontro.com** —
India's verified freelance marketplace. Built with Next.js 16 (App Router),
TypeScript, Tailwind CSS v4, `motion` and `lenis`. Zero other dependencies.

## The concept

The page is a **live freelance league scoreboard**: thin notebook margin
rails, mono inning labels (`01 / First pitch` … `08 / Final call`), a
character-heavy display face (Archivo Black) against Space Mono labels, and
ember orange (`#F36938` — lifted from Foontro's real brand) on near-black.

The hero is a **playable mini-Foontro**: post a gig, watch verified freelancer
cards answer, lock money in escrow, approve the work. A second mode lets you
play the freelancer side — log streak days and earn metallic frames.

## Run it

```bash
cd foontro-redesign
npm install
npm run dev      # http://localhost:3000
npm run lint     # ESLint (clean)
npm run build    # production build (passes)
```

## Folder structure

```
app/
  layout.tsx        # fonts, metadata, Open Graph, JSON-LD, margin rails, grain
  page.tsx          # section composition (8 innings)
  globals.css       # design tokens, notebook rails, film grain, keyframes,
                    # reduced-motion kill-switch
  icon.svg          # favicon
components/
  ui.tsx            # LenisRoot, SplitText, SectionShell, MagneticButton,
                    # NumTicker, Marquee, Reveal
  nav.tsx           # direction-aware ticker nav -> floating pill
  hero-console.tsx  # ★ signature moment 1: the playable board (client +
                    #   freelancer desks, escrow vault, paid stamp)
  rulebook.tsx      # how it works: 4 tappable plays with live diagrams
  house-rules.tsx   # features: 5 editorial rules, focus-dim list + demo stage
  streak-gauntlet.tsx # ★ signature moment 2: 30-day streak arena
  sonar-field.tsx   # the one canvas piece (lazy-loaded, zero-dep, 2D)
  on-the-board.tsx  # freelancer proof: filterable player cards w/ tier frames
  the-ledger.tsx    # client proof: streaming escrow -> approve -> paid ledger
  money-mechanics.tsx # pricing as one sentence + escrow flow + fee rows
  footer.tsx        # final CTA + ledger-style sitemap + giant wordmark
lib/
  data.ts           # typed demo data (seeded freelancers, gigs, ledger rows)
  fees.ts           # fee/payout figures — unconfirmed values marked "to confirm"
public/
  foontro-logo.svg  # real Foontro logo (downloaded from foontro.com)
  foontro-mark.svg  # cleaned single-path mark used in the nav/footer
```

## What's real vs. demo

- **Real:** brand name, ember `#F36938` / near-black `#181818` brand colors,
  "5,000+ creators and teams", verified-freelancer flow, escrow-until-approval,
  "Login Streaks are live — earn metallic frames & boost search visibility",
  India-first positioning, Play Store app existence.
- **Demo / placeholders:** freelancer names, gig amounts, ledger rows and
  aggregates, streak tier names/thresholds (Bronze 7 / Silver 15 / Gold 30),
  commission and payout timing (marked "to confirm" — see `lib/fees.ts`).
  Nothing invented is presented as a company fact.

## Performance budget (measured, production build)

| Item | Budget | Actual |
|---|---|---|
| Total JS, gzipped (whole app) | < 300 kB | **246 kB** |
| Runtime dependencies | ≤ 5 | **5** (next, react, react-dom, motion, lenis) |
| Canvas / WebGL pieces | ≤ 1 | **1** (custom 2D sonar canvas, lazy-loaded, `ssr: false`) |
| Motion primitives | transform/opacity only | motion lib (transform/opacity) + cheap CSS keyframes |
| Images | SVG only | 2 tiny SVGs + favicon |
| Fonts | ≤ 3, subset + swap | 3 (Archivo Black / Archivo / Space Mono), latin, `display: swap` |

## Accessibility & motion

- One `<h1>`, real HTML text, landmarks (`header`/`main`/`footer`/`nav`),
  meta + Open Graph + JSON-LD (`Organization` + `WebSite`).
- All interactive elements are native buttons/inputs/links; visible
  `:focus-visible` styles; the gig input is labelled; decorative grids carry
  `role="img"` labels; the boost meter is a real `role="progressbar"`.
- Text contrast: body 16.2:1, secondary 7.4:1, small mono labels 5.4:1 (AA).
- `prefers-reduced-motion`: global CSS kill-switch forces final states;
  Lenis, the canvas loop, streaming ledger, auto-play and delays are all
  disabled — content appears statically.
- Touch: 44px+ targets, tap-safe streak board, no hover-only content
  (house rules also respond to focus/tap).

No browser-based visual QA was run (per standing instruction — Chromium/
Playwright only on explicit request).
