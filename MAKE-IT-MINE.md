# Making this portfolio mine

This repo started as a clone of [SinghCharanjeet11/My_Portfolio](https://github.com/SinghCharanjeet11/My_Portfolio).
The design, layout and motion are unchanged — the content is now Atul Kumar Singh's.

**Status: done.** Content, resume, photo and all three project screenshots are in.
Nothing is outstanding except the optional item below.

---

## Optional — a signature

`profile.signature` is set to `''`, so the About section skips the signature block
entirely. To add one: **white ink on a solid black background**, saved as
`public/signature.png`, then set `signature: '/signature.png'`. It renders with
`mix-blend-mode: lighten`, which drops the black — a white-background scan would show
as a white slab.

---

## What changed

**Content** — all five files in `src/content/` were rewritten from your resume:
`profile.ts` (identity, links, capabilities, proof stats), `projects.ts` (Yojna Setu,
VEDA, SignEase, each with a full case study), `experience.ts` (ServiceNow, KIET + Elpis,
10 achievements), `dsa.ts` (LeetCode 500+/top 15%, with a Python top-k retrieval snippet
replacing the Dijkstra one), `skills.ts`.

**The four places content escapes `src/content/`** — all updated:

| File | What was hardcoded |
|---|---|
| `index.html` | Title, description, OG tags, `<noscript>` block. Also fixed a stale preload for a font the site does not use, and the light-mode `theme-color` left over from an older design. |
| `src/ui/SkillsCards.tsx` | The visible skills grid — its own list, not `content/skills.ts` |
| `src/ui/Mark.tsx` | Nav logo, hardcoded to `/portrait.png` — unchanged, now your photo |
| `src/ui/Splash.tsx` | Loader copy — left as "Building Your Portfolio" |

**Images** — `public/portrait.png` and `public/cutout.png` are generated from your studio
photo. The cutout needed a real alpha channel, so
[scripts/make-cutout-chroma.py](scripts/make-cutout-chroma.py) was added: it separates
the red backdrop by g/r and b/r *ratio* rather than brightness (skin is red-dominant too,
so any absolute threshold eats the face), floods inward from the frame edge so enclosed
regions survive, and despills the red rim in a 4px band along the edge. Re-run it if you
swap the photo:

```bash
python3 scripts/make-cutout-chroma.py <your-photo.png> public/cutout.png
```

**Project cards** — the three screenshots are letterboxed onto a 1600×1000 canvas filled
with the card's own surface colour (`#1a1a1c`), rather than dropped in raw. The card is
`aspect-[16/10]` with `object-cover`, so a source that is not 16:10 gets cropped: VEDA
(2.08:1) would have lost its nav and the Yojna splash (square) its version footer.
Letterboxing makes the fit exact and the padding invisible. The Yojna source was only
408px, so upscaling is capped at 1.5× — past that a splash screen turns to mush, and a
smaller sharp image inside a padded card reads as deliberate.

**Icons** — the skills grid now uses [simple-icons](https://simpleicons.org) fetched into
`public/icons/si-*.svg` and recoloured to one light neutral (`#e8e8e8`), because
simple-icons ship black and this page has a near-black ground. Uniform monochrome is
deliberate: a row of full-colour brand logos outshouts the skill names beside them.
Six new marks were added to `src/ui/techMarks.tsx` for the tools row, paths copied
verbatim from simple-icons rather than transcribed.

**Small code fixes** made along the way:

- `src/ui/Work.tsx` showed the metric badge only for a project whose `id` was
  `'itinera'`. Now every card shows its own metric, truncated so a long label cannot
  overrun the card.
- `ProblemSolving` hardcoded a three-link row for LeetCode, Codeforces and GeeksforGeeks.
  You only have LeetCode, so it is LeetCode + GitHub, and the unused Codeforces and
  GeeksforGeeks icon handling was removed.
- Removed the vestigial `preview` field and `PreviewKind` type from `projects.ts` —
  nothing had rendered it since the 3D layer was deleted.
- Removed the Work Experience section and its timeline component, matching the resume,
  which leads with projects. The `experience` data is still in
  `src/content/experience.ts` — kept because it is true, and unrendered until something
  renders it again.
- Fixed the six pre-existing TypeScript errors (`npm run typecheck` was already failing
  on a fresh clone). `typecheck` and `build` are both clean now.

---

## Editing it later

Content lives in `src/content/`, **except** the skills grid, which lives in
`src/ui/SkillsCards.tsx`. `src/content/skills.ts` feeds an unrendered `Skills()`
component in `Sections.tsx` — editing it changes nothing on the page.

Constraints worth knowing before you change things:

- **`heroWords` must be two *long* words.** The cut-out figure stands in the middle of
  the masthead, so a short word disappears behind it — `['AI', 'ENGINEER']` was tried and
  the "AI" was completely hidden. Ten to eleven characters each is the band that fills
  the width without wrapping.
- **`metric.label` on a project: two or three words.** It renders as a pill on the card
  image; a sentence there overruns the card.
- **`dsa.stats` wants exactly two.** The grid is `grid-cols-2`, despite an old comment
  claiming it needs three.
- **`profile.tools` keys must exist in `TECH_MARKS`** (`src/ui/techMarks.tsx`). An
  unknown key renders nothing. Eight fits on one row at desktop width.
- `experience` and `achievements` self-hide when empty.

## Changing the look

One place: the `@theme` block in `src/styles/index.css`. Change `--color-accent` and the
whole page re-themes. If you do, keep the split between `--color-accent` and
`--color-accent-text`: crimson `#EA0044` is 4.12:1 against the ground, which passes for
large text and borders but fails for body text, so small labels use the lighter
`#FF1A5C` (5.00:1) and accent buttons carry white rather than dark text.

## Verifying

```bash
npm run typecheck
npm run build
npm run dev
CHROME=/usr/bin/google-chrome npm run capture -- shots
```

`capture` shoots the page at 1440px and 420px and reports console errors, failed requests
and 4xx — which is how you catch a missing image path, since a broken `/portrait.png`
type-checks fine.
