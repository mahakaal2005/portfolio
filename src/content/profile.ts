/**
 * ─────────────────────────────────────────────────────────────────────
 *  Identity. Everything the page says about who he is comes from here.
 * ─────────────────────────────────────────────────────────────────────
 */

export const profile = {
  name: 'Atul Kumar Singh',
  role: 'Android Developer',

  /** The one line that has to survive a 15-second visit. */
  tagline:
    'Building native Android that ships — Kotlin, Jetpack Compose and Clean Architecture, on the Play Store in front of real users.',

  location: 'Ghaziabad, Uttar Pradesh, India',
  status: 'Available for Android Developer roles',
  /** Short form for the hero and the closing call to action. */
  availabilityShort: 'Open to Android roles',

  about:
    'I am a Computer Science undergraduate and native Android developer who builds ' +
    'production apps in Kotlin and Jetpack Compose, structured with Clean Architecture ' +
    'and formal MVI. Two of them are live on the Google Play Store. I coordinate the ' +
    'Android domain at InnoGeeks, KIET’s largest technical club, where I teach Kotlin ' +
    'and Compose to 200+ students, and I work across the stack when a project needs it.',

  greeting: "Hello, I'm",

  /** Role line under the portrait, pipe-separated in the reference's manner. */
  roleLine: 'Android Developer | Kotlin & Jetpack Compose | CS Undergrad',

  /**
   * The about story, in short paragraphs.
   *
   * One long block is a wall nobody reads; three short ones each carrying a
   * single idea get read to the end. Written as a progression — where he
   * started, what changed, where he is going — because that is what makes a
   * junior candidate legible.
   */
  aboutParagraphs: [
    'I started on Android because it was the shortest path between writing code and putting it in someone’s hand. That has not really changed. The thing I care about is the gap between an app that demos and an app that survives a real install base — and the only way to learn that gap is to ship and then keep maintaining it.',
    'PDFit was the first to go up: an offline-first document scanner, no ads, no cloud, everything local through ML Kit and Room. It sits at 4.5 stars. Then came Innogeeks, the official app for a club that takes about 1,500 applicants a year — 20 screens in pure Compose, four distinct roles with their own navigation, and a recruitment tracker people actually check.',
    'What I have been going deeper on is architecture: a domain layer with zero Android imports, typed errors instead of thrown ones, dependencies swappable at the Koin graph so a screen can be built against an in-memory fake long before the endpoint exists. Teaching it to 200+ students at InnoGeeks is what forced me to be able to explain why, not just do it.',
  ] as const,

  /** Two-tone section heading for About: second line takes the accent. */
  aboutHeading: ['Building Android apps', 'that live on the Play Store.'] as const,

  /**
   * The hero masthead, two words. The second takes the accent colour.
   *
   * Both need to be *long*, not short. The cut-out figure stands in the middle
   * of the line, so a two-letter word like "AI" disappears behind it entirely
   * and the layering reads as a bug. Ten to eleven characters each is the band
   * that fills the width without wrapping at 14vw.
   *
   * Single words only — no spaces. "ANDROID APPS" is the right length, but at
   * 420px it wraps to two lines and the figure then covers the whole of the
   * first one, which is worse than the partial occlusion it was fixing.
   * "ANDROID" loses its middle to the figure on desktop and still reads,
   * because the word is familiar enough to complete from its ends.
   */
  heroWords: ['PRODUCTION', 'ANDROID'] as const,

  /**
   * Transparent cut-out for the layered hero.
   *
   * Must have a real alpha channel. The masthead sits *behind* the figure, and
   * an opaque rectangle would paint over it — which is exactly why a flat
   * photograph could never be layered this way.
   *
   * Currently an illustrated avatar. It arrived as a *painted-in* transparency
   * checkerboard — RGB, no alpha channel at all — so it went through
   * scripts/make-cutout.mjs, which floods the board out from the border. The
   * "PORTFOLIO" watermark had to be cropped off first: it sits on the jacket
   * rather than on the board, so the flood can never reach it.
   *
   * For a photograph shot against a solid red backdrop, use
   * scripts/make-cutout-chroma.py instead. Either way, run one of them over the
   * replacement rather than exporting a rectangle.
   */
  heroCutout: '/cutout.png',
  /**
   * Sits under the portrait card in About. Blank hides the block entirely.
   *
   * Needs a real alpha channel — it is composited normally, not blended. If
   * you have ink on a solid black background instead, convert it first: alpha
   * from the per-pixel max channel, then divide the colour back out so the
   * antialiased strokes keep their hue rather than fading to grey.
   */
  signature: '/signature.png',
  aboutPortrait: '/portrait.png',

  links: {
    email: 'atul.k.singh5002@gmail.com',
    /** E.164 for the `tel:` href — dialled, not read. */
    phone: '+919336474830',
    github: 'https://github.com/mahakaal2005',
    linkedin: 'https://linkedin.com/in/atulkumarsingh5002',
    leetcode: 'https://leetcode.com/u/Atul5002/',
    resume: '/resume.pdf',
  },

  /** Display handles. The LinkedIn slug is shortened rather than shown raw. */
  handles: {
    /** Grouped for reading, unlike `links.phone`, which has to stay dialable. */
    phone: '+91 93364 74830',
    github: 'mahakaal2005',
    linkedin: 'atulkumarsingh5002',
    leetcode: 'Atul5002',
  },

  /**
   * The strip under the hero. The reference puts client logos and a happy-
   * client count here; neither exists, so this carries what actually does —
   * measured things, each traceable to a project or a public profile.
   */
  proof: [
    { value: '2', label: 'apps on Google Play' },
    { value: '4.5★', label: 'PDFit user rating' },
    { value: '200+', label: 'students taught Kotlin' },
    { value: '8.89', label: 'CGPA / 10' },
  ] as const,

  /**
   * What he builds. Stands in for the reference's "Services" — reframed from
   * selling to describing, because he is not taking commissions.
   */
  capabilities: [
    {
      title: 'Native Android',
      body: 'Apps built the way the platform wants them: Kotlin throughout, 100% Jetpack Compose UI on Material 3, coroutines and Flow for everything asynchronous.',
      tags: ['Kotlin', 'Jetpack Compose', 'Material 3', 'Coroutines'],
    },
    {
      title: 'App architecture',
      body: 'Structure that survives a second feature — Clean Architecture with a zero-Android-import domain layer, formal MVI state, typed error transport and dependencies swapped at the graph.',
      tags: ['Clean Architecture', 'MVI', 'MVVM', 'Koin / Hilt'],
    },
    {
      title: 'Offline-first & data',
      body: 'Storage that works on a train: Room and DataStore for local truth, Ktor against live REST endpoints, and a sync path that treats the network as optional rather than assumed.',
      tags: ['Room', 'DataStore', 'Ktor', 'REST APIs'],
    },
    {
      title: 'Full-stack when needed',
      body: 'The other half, when a project needs a backend behind it — React and Node with Express over PostgreSQL, deployed and serving real traffic rather than parked locally.',
      tags: ['React', 'Node.js', 'Express', 'PostgreSQL'],
    },
  ] as const,

  /**
   * Tools row beneath the capabilities heading. Keys map to TECH_MARKS in
   * ui/techMarks.tsx — logos rather than names, because recognition beats
   * reading for a list this long.
   */
  tools: [
    'kotlin',
    'android',
    'jetpackcompose',
    'firebase',
    'postgresql',
    'react',
    'nodedotjs',
    'git',
  ] as const,

  /**
   * Words that cycle in the closing headline. Verbs only, and all short — a
   * long one would reflow the line on every swap, which reads as a layout bug
   * rather than an effect.
   */
  closingVerbs: ['build', 'ship', 'scale'] as const,

  /** Shown in the hero's supporting rail. */
  focus: ['Native Android', 'Clean Architecture', 'Offline-first apps'] as const,
} as const

export type Profile = typeof profile
