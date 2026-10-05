# Atul Kumar Singh — Portfolio

A single-page portfolio for an AI engineer. Fast, typographic, dark-only, and
readable in one pass. No WebGL, no carousels, nothing that moves on a timer.

**Sections:** hero → proof → work → capabilities → about → skills → problem
solving → achievements → contact.

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # → dist/
npm run typecheck    # the repo's only automated check
```

## Credit

The design, layout and motion are by **[Charanjeet Singh](https://github.com/SinghCharanjeet11)**
— this started as a fork of [SinghCharanjeet11/My_Portfolio](https://github.com/SinghCharanjeet11/My_Portfolio)
and the visual system is his work. What changed here is the content: copy,
projects, skills, imagery and links.

## Stack

React 19 · TypeScript · Vite 8 · Tailwind v4 · Framer Motion

Everything is self-hosted — fonts in `public/fonts/`, icons in `public/icons/` —
so the page renders on a first visit with zero third-party requests.

## Where things live

| Path | What it holds |
|---|---|
| `src/content/` | All copy and data, imported as `@/content` |
| `src/ui/FlatPortfolio.tsx` | The only place section order is expressed |
| `src/ui/Sections.tsx` | Most sections, plus the shared `Section` shell |
| `src/ui/Work.tsx` | Project grid and the slide-up case-study view |
| `src/ui/motion.tsx` | Every animation on the site routes through here |
| `src/styles/index.css` | Design tokens in a Tailwind v4 `@theme` block |
| `assets-src/` | Full-resolution source images, before processing |

Two things live outside `src/content/` despite being content: the skills grid
(`src/ui/SkillsCards.tsx`) and the page metadata plus `<noscript>` fallback
(`index.html`).

`MAKE-IT-MINE.md` records the layout constraints worth knowing before editing —
why the hero words must be long, why project metric labels must be short, and
why project images are letterboxed to 16:10. `CLAUDE.md` covers the architecture
in more depth.

## Deploying

Static SPA. `npm run build`, then serve `dist/`. Vercel, Netlify and GitHub
Pages all work with no configuration.
# atullly
