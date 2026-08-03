# UI Rework — Diagnosis & Implementation Plan

**Project:** `UpdatedPortfolio`
**Date:** 2026-08-04
**Status:** Approved, not started

---

## 1. Situation

`D:\dev\MyPortfolio` contains two independent Vite applications:

| | `UpdatedPortfolio/` | `OldPortfolio/` |
|---|---|---|
| Status | **Live — all work happens here** | Frozen reference, last touched Jun 7 |
| Framework | React 19 + Vite 8 | React 19 + Vite 7 |
| Styling | Tailwind v4 (CSS-first, no config file) | Tailwind v4 (PostCSS) |
| Animation | GSAP 3.15 + ScrollTrigger + SplitText + Lenis 1.3 | Framer Motion 12 |
| Routing | None (single page) | react-router-dom 7 |
| Language | Plain JSX (no TypeScript) | Plain JSX |

`OldPortfolio` is out of scope. It is referenced only where its earlier implementation was richer than the current one (notably the phone mockup).

### Architecture

```
src/
├── main.jsx              MotionProvider → SmoothScroll → App
├── App.jsx               Preloader, ProgressBar, Nav, Grain + <main>
├── index.css             entire design system (@theme tokens)
├── assets/
│   └── profile_photo.png 186 KB — imported by nothing
├── data/
│   └── content.js        all copy: profile, manifesto, stack, projects, milestones
├── animations/
│   ├── MotionContext.jsx global motion on/off, sets html[data-motion]
│   ├── SmoothScroll.jsx  Lenis ↔ GSAP ticker bridge
│   ├── useReveal.js      useReveal + useWordScrub
│   └── useMagnetic.js    pointer-follow effect
└── sections/
    Preloader, Nav, ProgressBar, Grain,
    Hero → Manifesto → Marquee → Work → Experience → Contact
```

Scroll order is section order. Three sections pin: Hero, Work, Experience.

### What is working

The typographic direction, the palette, and the overall editorial concept are strong and are **not** being changed. Bricolage Grotesque + JetBrains Mono, ink `#0f0f0f` with Android green `#3ddc84`, the numbered section labels, the mono/uppercase micro-type — all of it stays.

The problems are in execution, not direction.

---

## 2. Diagnosis

Five defects, ordered by severity.

### 2.1 — Experience cards visibly stack on top of each other

**Severity: critical. This is the "one animation comes over another" the user reported.**

`src/sections/Experience.jsx`

```jsx
// line 54 — every card parked at y:100%, but never hidden
gsap.set(cards, { y: '100%', scale: 1, rotation: 0 })
gsap.set(cards[0], { y: '0%' })

// line 105 — overflow-hidden is on the SECTION
className="relative flex h-svh flex-col justify-center overflow-hidden px-6 py-24 md:px-10"

// line 109 — but NOT on the stack container
<div ref={stack} className="relative h-[min(60vh,32rem)] w-full">
```

The geometry:

- The stack container is `60vh` tall, vertically centred in an `h-svh` section with `py-24`
- Its top edge lands at ≈20vh, bottom edge at ≈80vh
- A card at `y: '100%'` is offset one container-height down → it occupies **80vh → 140vh**
- The section clips at 100vh — **but nothing clips at 80vh**
- `autoAlpha` is never set on waiting cards, so they are fully opaque

**Result:** a ~20vh sliver of every waiting card is permanently visible below the active card, all four stacked. Compounding this, dismissed cards are left at `autoAlpha: 0.45, scale: 0.86, rotation: -3` with no `zIndex` management (line 71) — ordering is DOM-only, so previously-dismissed cards fan out visibly behind the active one.

Secondary issue at line 75:

```js
return () => tl.scrollTrigger?.kill()
```

Kills the ScrollTrigger but leaves the timeline alive and never reverts the `gsap.set` transforms from line 54. On re-run (Motion toggle), cards can be stranded mid-transform.

### 2.2 — Full-viewport blend layers force whole-page recompositing

**Severity: high. Primary cause of general scroll jank.**

| File | Line | Element |
|---|---|---|
| `Grain.jsx` | 8 | `fixed inset-0 z-[70] opacity-[0.05] mix-blend-overlay` |
| `Nav.jsx` | 26 | `fixed inset-x-0 top-0 z-50 … mix-blend-difference` |

A full-viewport fixed element with `mix-blend-*` forces the entire page into one blended compositing group. Every scroll frame re-composites the whole viewport rather than just the moving layers. Two such layers stack the cost.

`mix-blend-difference` on the nav additionally defeats subpixel text antialiasing.

**Z-index is also unordered:** Nav 50, ProgressBar 60, Grain 70, Preloader 100 — the grain layer blends over the progress bar, which is not intended.

### 2.3 — Duplicate ScrollTriggers after Motion toggle

**Severity: high. Causes two tweens to fight over the same nodes.**

`src/animations/useReveal.js` — both hooks, lines 30 and 83:

```js
document.fonts.ready.then(() => {
  targets.forEach((el) => {
    splits.push(SplitText.create(el, { /* … creates ScrollTriggers … */ }))
  })
  ScrollTrigger.refresh()
})

return () => splits.forEach((s) => s.revert())
```

The `useGSAP` context function returns **before** the promise resolves. Everything created inside `.then()` is therefore never recorded in the gsap context. The returned cleanup closes over a `splits` array that is still empty at registration time.

Both hooks declare `dependencies: [motionEnabled]`, so toggling Motion in the Nav re-runs them and leaves the previous generation of triggers alive.

Also: no guard against the component unmounting before `fonts.ready` resolves.

### 2.4 — Uncoordinated `ScrollTrigger.refresh()`

**Severity: medium. Causes position jumps.**

Three call sites, two of them async:

- `SmoothScroll.jsx:25` — on mount
- `useReveal.js:58` — after `fonts.ready`
- `useReveal.js:96` — after `fonts.ready`

Each refresh recalculates every pin (Hero, Work, Experience) plus the 7 `containerAnimation` triggers inside Work. A refresh landing mid-scroll produces a visible jump.

Additionally, all three pinned sections use `h-svh` and `ScrollTrigger.config({ ignoreMobileResize: true })` is never called. On mobile, URL-bar collapse changes `svh` → fires resize → full pin recompute mid-scroll.

### 2.5 — Content gaps

**No portrait.** `src/assets/profile_photo.png` (186 KB) was copied from `OldPortfolio` on Aug 4 and is imported by nothing. Grepping `src/` for `profile_photo`, `.png`, `<img>` returns zero matches — there is no `<img>` tag anywhere in the project. The hero is pure type with a large dead zone on the right at desktop widths.

The source photo is a casual outdoor shot with a visually busy background (foliage, signage, railings). It cannot be dropped in raw without fighting the minimal design.

**Phone mockups are skeleton bars.** `Work.jsx:10–51`, `PhoneFrame`:

```jsx
<span className="font-mono text-[0.55rem] text-bone-dim">9:41</span>  // hardcoded
<div className="h-1.5 w-2/3 rounded-full bg-raised" />                // grey bar
<div className="h-1.5 w-1/2 rounded-full bg-raised" />                // grey bar
{[0,1,2].map(…)}                                                      // 3 grey rows
<div className="h-9 rounded-full" style={{background: accent}} />     // accent pill
```

The only project-specific content is `project.stack[0]` and the accent colour. For reference, `OldPortfolio/src/components/Hero.jsx:175–315` had a far richer mockup — 3D perspective, a syntax-highlighted Kotlin snippet, a real profile screen, a fake `kotlinc` compilation animation. The current version is a regression.

**Flat background.** `Grain.jsx` is the entire background treatment: one `feTurbulence` noise tile at 5% opacity over flat `#0f0f0f`. No gradient, no depth, no per-section differentiation. `OldPortfolio` layered a dot grid, two blurred orbs, and a radial body gradient.

### 2.6 — Timing and consistency issues

Lower severity, addressed in Phase 4.

| Location | Issue |
|---|---|
| `useReveal.js:90` | `stagger: 0.5` × ~35 words = a 17.5s virtual timeline compressed into ~1 viewport of scroll. Unreadably dense. |
| `Marquee.jsx:68` | Allocates a `gsap.to` on every scroll tick (60+/s). `timeScale` clamp of ±8 permits mid-frame direction flips, which Lenis's 1.1s easing tail keeps oscillating. |
| `Hero.jsx:112–116` | Scrim fades to fully opaque black *while the hero is still pinned* — the tail of the pin is a blank screen before Manifesto arrives. |
| `Work.jsx:155`, `Experience.jsx:65` | `anticipatePin: 1` pre-applies the pin one frame early; with Lenis transform-scroll this is a known 1-frame-jump source. |
| `Preloader.jsx:28` | `setState` every frame for 2.2s (~130 re-renders) on a z-100 full-screen overlay. Blocks first paint, delays `ready`, delays first refresh. |
| `index.css:14,17,22,63` | `--color-accent-dim`, `--color-line-bright`, `--ease-out-expo`, `.text-section` all declared, none used. Meanwhile every section heading hardcodes its own `text-[clamp(…)]`. |
| `content.js:9` | LinkedIn is `linkedin.com/in/atulkumarsingh5002`; OldPortfolio used `linkedin.com/in/atul-kumar-singh-3a828332b`. **Needs confirmation.** |
| `index.html` | Declares `twitter:card = summary_large_image` but sets no `og:image` — link previews render blank. |

---

## 3. Decisions

Settled before implementation:

| Question | Decision |
|---|---|
| Portrait treatment | Editorial cutout, right side of hero, name overlapping its left edge. Duotone in ink + accent so the busy background crushes to texture. |
| Phone mockups | Build CSS recreations now; structure `PhoneFrame` so a screenshot prop can drop in later without a rewrite. |
| Animation scope | Commit a baseline first, then fix bugs **and** retune choreography. |
| Version control | `git init` inside `UpdatedPortfolio` only. `OldPortfolio` stays untracked. Local only — no remote, no push. |

---

## 4. Implementation

### Phase 0 — Baseline commit

No git repository exists anywhere under `D:\dev\MyPortfolio`.

1. `git init` in `UpdatedPortfolio`
2. Existing `.gitignore` already covers `node_modules`, `dist`, `*.local` — no change needed
3. Stage `src/`, `public/`, `index.html`, `package.json`, `package-lock.json`, `vite.config.js`, `.oxlintrc.json`, `.gitignore`, `README.md`
4. Run `git status` after staging — confirm no `node_modules` or `dist` slipped in
5. Commit: `baseline before UI rework`

Everything after this point is revertable.

### Phase 1 — Layering fixes

Correctness only. Verify in browser before touching timing.

**1a. Experience card stack** — `sections/Experience.jsx`

- Add `overflow-hidden` to the stack container (line 109) so cards clip to their own box
- Set waiting cards to `autoAlpha: 0` in the `gsap.set` (line 54); card 0 gets `autoAlpha: 1`. Fade the incoming card in as it translates so it does not pop
- Assign index-ordered `zIndex` per card so dismissed cards cannot render over later ones
- Fix cleanup (line 75): kill the timeline, not just its ScrollTrigger, and revert the sets. `useGSAP` already has `revertOnUpdate: true` — verify the manual return is not fighting it
- Two JSX branches exist (`motionEnabled` early-return, line 80). Styling changes land in **both**

**1b. Blend layers** — `sections/Grain.jsx`, `sections/Nav.jsx`

- Drop `mix-blend-overlay` from Grain. Achieve the same visual with a lower-opacity noise tile over flat ink — composites once instead of per-frame. Keep `pointer-events-none`
- Replace Nav's `mix-blend-difference` with explicit colours. Nav sits over `bg-ink` for the whole scroll, so `text-bone` + accent hover reads identically
- Normalize z-index scale. Target: Preloader > Nav > ProgressBar > Grain > content

**1c. ScrollTrigger lifecycle** — `animations/useReveal.js`

- Create the async work inside the gsap context (`ctx.add(…)`), or track created triggers in a ref and kill them explicitly
- Guard against unmount before `fonts.ready` resolves
- Verify: toggle Motion off→on 3×, confirm `ScrollTrigger.getAll().length` is stable

**1d. Refresh coordination** — `animations/SmoothScroll.jsx`, `useReveal.js`

- Consolidate to a single refresh after fonts settle and all splits exist
- Add `ScrollTrigger.config({ ignoreMobileResize: true })` in `SmoothScroll.jsx`

### Phase 2 — Hero portrait

`sections/Hero.jsx`, `index.css`, `index.html`

- Import `profile_photo.png`. Apply duotone treatment — grayscale, raised contrast, accent tint — so the busy background crushes toward black and reads as texture. CSS filters + scoped blend layer. No new dependencies
- Place as a tall right-hand column. The name (`h1[data-hero-name]`, lines 82–97) overlaps its left edge; set stacking order deliberately, name above image. Section already has `overflow-hidden`
- Wire into the existing intro timeline (lines 29–41) and the pinned outro (lines 56–59) so it recedes with the name rather than sitting static
- **Mobile:** hide below `md` or reflow — decide by testing at 375px. Must not squeeze the name
- Real `alt` text, explicit `width`/`height` to prevent CLS, `fetchpriority="high"`. Convert 186 KB PNG → WebP at display size
- Add `og:image` to `index.html`

### Phase 3 — Phone mockups

`sections/Work.jsx` (replace `PhoneFrame`, lines 10–51), `data/content.js`

- Restructure `PhoneFrame` to accept an optional screenshot source: image when present, CSS screen when absent. One prop — no rewrite when real screenshots arrive
- Raise frame fidelity: proper bezel, rounded corners, subtle screen gradient. **Keep `data-phone`** — `Work.jsx:173` parallaxes it
- Per-project screens:
  - **Fluence Pay** (`#3ddc84`, Flutter fintech admin) — balance header, cashback stat, transaction rows with merchant labels
  - **LookGig** (`#7f52ff`, Flutter job marketplace) — job listing cards + a chat row reflecting the real-time chat highlight
  - **Health Assistant** (`#3ddc84`, Kotlin/Compose) — step-count ring, prescription list, AI-summary card
- Screen content goes in `content.js` as structured per-project data, not hardcoded JSX — matches the existing convention
- Replace the hardcoded `9:41`
- `aria-hidden` on screen internals; screen readers should get the real project copy, not fake UI labels

### Phase 4 — Choreography retune

Only after Phase 1 is verified. These are judgment calls — implement, look, adjust.

- **Manifesto** — reduce word stagger and/or extend the trigger window (`useReveal.js:90`)
- **Marquee** — set `timeScale` directly instead of tweening per tick; narrow the clamp so speed bends without reversing (`Marquee.jsx:62–70`)
- **Hero scrim** — cap peak opacity and/or shorten range so the handoff overlaps rather than cutting to black (`Hero.jsx:112–116`)
- **Pin boundaries** — test each of the three; remove `anticipatePin` where it hurts more than it helps
- **Preloader** — write the counter to the DOM node directly instead of through React state (`Preloader.jsx:28`)
- **Background depth** — with the blend mode gone, add cheap static depth: radial gradient on `body`, light per-section tonal variation. Static only — no animated orbs, nothing costing per-frame work
- **Token sweep** — adopt or delete the four unused tokens; confirm the LinkedIn URL

---

## 5. Verification

This is entirely visual work. It cannot be verified by reading code — run `npm run dev` and check in a real browser.

**Per phase:**

| After | Check |
|---|---|
| Phase 1 | Scroll Experience end to end — exactly one card visible at a time, no sliver below, no ghost cards behind. Toggle Motion off→on 3×, confirm `ScrollTrigger.getAll().length` is stable. |
| Phase 2 | Hero at 375 / 768 / 1440px. Portrait must not squeeze the name or cause horizontal scroll. Check CLS on reload. |
| Phase 3 | Horizontal-scroll all three cards at desktop; confirm the vertical fallback below 768px still reads. |
| Phase 4 | DevTools Performance recording of a full-page scroll — sustained 60fps, whole-viewport repaint gone. |

**Full pass before done:**

- Scroll top→bottom slowly, then fast. No overlap, no jump at any pin boundary, no flash of black
- Motion toggle off — every section readable, nothing stuck invisible or mid-transform
- OS-level reduced-motion on — same check
- Keyboard tab: Nav → email CTA → footer links, focus rings visible throughout
- `npx oxlint` clean
- 375 / 768 / 1024 / 1440 with no horizontal scrollbar

Commit per phase so any step can be reverted independently.

---

## 6. Out of scope

- `OldPortfolio` — untouched, untracked
- No new dependencies
- No remote, no push, no deploy
- Palette, typography, and overall editorial direction — unchanged by design
