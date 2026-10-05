# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is right now

Started as a clone of `SinghCharanjeet11/My_Portfolio` (a friend's site), was
personalized for Rudra Sharma, and has since been **re-personalized for Atul Kumar
Singh**, a native Android developer. The design, layout and motion are deliberately
unchanged through both swaps; only the content was replaced.

So the default assumption for any request here is a **content edit, not a redesign**.
Don't restyle, restructure sections, or change the palette unless asked directly.

`MAKE-IT-MINE.md` records what was swapped and the constraints that bit during the swap:
hero words must be long or the cut-out figure hides them, metric labels must be short or
they overrun the card, and project images must be letterboxed to 16:10 or `object-cover`
crops the part that mattered.

Section order lives only in `FlatPortfolio.tsx`. The Work Experience section was removed
there; `experience` in `src/content/experience.ts` is now unrendered data.

## Commands

```bash
npm install
npm run dev          # Vite dev server, http://localhost:5173
npm run build        # → dist/ (static SPA, no SSR)
npm run preview      # serve the built bundle
npm run typecheck    # tsc --noEmit — the only automated check in the repo
npm run capture -- shots   # screenshot the running dev server at 1440px and 420px
```

There is no test runner, no linter and no formatter configured. `npm run typecheck`
is the gate; `strict`, `noUnusedLocals` and `noUnusedParameters` are all on, so an
unused import or parameter fails the build-equivalent check.

### Puppeteer scripts

`scripts/*.mjs` all drive `puppeteer-core` against a **locally installed** Chrome and
default `CHROME` to a Windows path. On Linux/macOS export it first:

```bash
CHROME=/usr/bin/google-chrome npm run capture -- shots
```

| Script | Purpose |
|---|---|
| `capture.mjs` | Scroll-and-shoot the whole page at both widths; reports console errors, failed requests and 4xx. `CAP_URL`, `CAP_W`, `CAP_H` override. |
| `capture-detail.mjs` | Clicks into the first project case study (the detail view only exists after a click, so `capture.mjs` never sees it). Defaults to port **5188**. |
| `shoot-projects.mjs` | Regenerates `public/work/*.jpg` by screenshotting each project's `links.live` read straight from `src/content/projects.ts`. |
| `extract-design.mjs` | Loads any URL in a real browser and dumps resolved fonts/colours/headings — used to measure design references. |
| `make-cutout.mjs` | Flood-fills a painted-in transparency checkerboard out of a PNG. |

`shots/` and `probe/` are gitignored.

## Architecture

Single-page React 19 + TypeScript + Vite + Tailwind v4 site. No router, no data
fetching, no backend, no lazy boundaries — one bundle, everything self-hosted
(fonts in `public/fonts/`, icons in `public/icons/`), zero third-party requests.

The render path is deliberately linear and worth knowing before editing anything:

```
main.tsx → App.tsx → ui/FlatPortfolio.tsx → the whole page
```

`FlatPortfolio` is the only place the page order is expressed. It owns the splash
gate (`showSplash` blocks `Cursor` and `Nav` until the loader finishes), the
scroll-collapsing nav pill, the fixed bottom edge-blur, and then renders sections
in sequence: `Hero → ProofStrip → Work → Capabilities → About → WorkExperience →
SkillsCards → ProblemSolving → Achievements → ClosingCTA`.

Three layers, and changes usually belong in exactly one of them:

**`src/content/`** — all copy and data, re-exported through `src/content/index.ts`
and imported as `@/content` (the `@` alias maps to `src/`). Editing text, projects,
skills, experience or links should mostly not require touching `src/ui/`. Note the
field-level intent documented in the data files: `metric` on a project is the
largest element on its card, and `skills[].level` is **never rendered** — it only
sorts each group and decides which entries get emphasis at `>= 0.85`.

Four exceptions leak content out of that layer, and they are the usual source of
"I changed it and nothing happened": `index.html` (title, meta, OG tags, the
`<noscript>` contact block), `src/ui/Mark.tsx` (hardcodes `/portrait.png` as the nav
logo), `src/ui/SkillsCards.tsx` (owns the entire visible skills grid — `content/skills.ts`
feeds an unrendered component), and `src/ui/Splash.tsx` (loader copy).

**`src/ui/`** — presentation. `Sections.tsx` (~900 lines) holds most numbered
sections plus the shared `Section` wrapper and the `WRAP` container class; `Work.tsx`
holds the project grid and the slide-up case-study detail view; `Hero`, `SkillsCards`,
`Splash`, `Cursor`, `Mark`, `techMarks` are standalone.

**`src/ui/motion.tsx`** — every animation on the site routes through `Reveal`,
`Stagger`, `StaggerItem`, `hoverLift` and `EASE_OUT_EXPO`. Do not add per-component
easings or durations; the single curve is what keeps the page from feeling assembled
from parts. `useReducedMotion` is handled here, with a global CSS fallback in
`index.css` for anything not driven by Framer Motion.

**`src/styles/index.css`** — the design system's single source of truth. Tokens live
in the Tailwind v4 `@theme` block (there is intentionally no TypeScript copy to drift
out of sync); `@layer components` defines the named type scale (`.t-hero`, `.t-display`,
`.t-h2`, `.t-lead`, `.t-body`, `.t-label`), `.btn` / `.btn-accent` / `.card`,
`.edge-blur-bottom` and `.tool-tile`. Use the named steps rather than ad-hoc
`text-[...]` clamps.

### Design constraints that are decisions, not accidents

- Palette is dark-only: ground `--color-ink #111112` with a three-step surface ramp,
  accent crimson `#EA0044`. Crimson measures **4.12:1** on the ground — fine for large
  type and borders, short for body text. Small accent text must use
  `--color-accent-text` (`#FF1A5C`, 5.00:1), and accent-filled buttons carry white,
  not ink. Changing `--color-accent` re-themes the whole page.
- Type is Space Grotesk (display) + Roboto (body) + IBM Plex Mono (labels/code), with
  Fredoka used for exactly one rotating word in `ClosingCTA`.
- `Cursor` is additive — the native cursor is never hidden — and mounts only for
  `(pointer: fine)` with motion enabled.
- `index.html` carries a `<noscript>` fallback with name, work and contact.

### Known state of the repo

- **`README.md` is stale.** It describes an earlier light-ground design (bone/brass
  palette, Inter, `src/ui/useReveal.ts`, five numbered sections, "two runtime
  dependencies, no framer-motion"). None of that matches the current code. Trust the
  source; if you change behaviour the README documents, fix the README too.
- `src/ui/Services.tsx` and `src/ui/SkillsNetwork.tsx` are orphaned — nothing imports
  them. `Skills()` and `WorkHistory()` in `Sections.tsx` are exported but not rendered;
  the live skills section is `SkillsCards.tsx`, which hardcodes its own categories
  rather than reading `skillGroups` from `src/content/skills.ts`.
- `deep-research-report (2).md` at the repo root is a design research artifact, not
  project documentation.
- Open content gaps are tracked as `TODO`s: `grep -rn TODO src/content`.

## Verifying a change

`npm run typecheck`, then `npm run dev` plus `npm run capture -- shots` — the capture
catches broken asset paths, console errors and both-width layout breaks that the type
checker cannot see.
