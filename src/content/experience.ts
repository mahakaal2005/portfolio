/**
 * Experience, education and achievements.
 *
 * `achievements` renders in the "Things worth mentioning" section and self-hides
 * when empty.
 *
 * `experience` is **not currently rendered anywhere on the page** — the Work
 * Experience section was removed, matching the resume, which leads with projects
 * instead. The data is kept because it is true and the section is one line to
 * restore: re-add a timeline component and render it from FlatPortfolio.
 */

export interface Role {
  org: string
  title: string
  period: string
  /** One or two lines. Outcome first, responsibility second. */
  summary: string
  stack?: string[]
}

export const experience: Role[] = [
  {
    org: 'InnoGeeks Club, KIET',
    title: 'Android Domain Coordinator',
    period: 'Sep 2024 — Present',
    summary:
      'Teaches Kotlin and Jetpack Compose to 200+ students through structured classes, code ' +
      'reviews and architectural guidance, and shipped the club’s official Android app to the ' +
      'Google Play Store.',
    stack: ['Kotlin', 'Jetpack Compose', 'Clean Architecture', 'Code review'],
  },
  {
    org: 'NASA Space Apps Challenge 2025, KIET',
    title: 'Organizing Team Member',
    period: '2025',
    summary:
      'Co-coordinated the campus 48-hour hackathon, covering mentor scheduling and event logistics.',
  },
]

export interface Education {
  institution: string
  qualification: string
  period: string
  detail?: string
}

export const education: Education[] = [
  {
    institution: 'Krishna Institute of Engineering & Technology (KIET)',
    qualification: 'B.Tech, Computer Science & Engineering',
    period: '2024 — 2028',
    detail: 'CGPA 8.89 / 10',
  },
  {
    institution: 'Elpis Global School, Biswan, Sitapur',
    qualification: 'Senior Secondary (CBSE)',
    period: '2021 — 2023',
    detail: '89.2%',
  },
]

export interface Achievement {
  label: string
  /** Optional supporting detail — the number, where it applies. */
  detail?: string
}

/**
 * Ordered by what an engineering recruiter weighs, not chronologically.
 */
export const achievements: Achievement[] = [
  {
    label: 'Two apps shipped to the Google Play Store',
    detail: 'PDFit at 4.5 stars, and Innogeeks, KIET’s official club app',
  },
  {
    label: 'Android Domain Coordinator, InnoGeeks Club, KIET',
    detail: 'Sep 2024 — Present · instructing 200+ students in Kotlin & Jetpack Compose',
  },
  {
    label: 'Frostbyte Hackathon — Grand Finale',
    detail: 'TradeX, an AI-powered trading platform across four markets',
  },
  {
    label: 'NASA Space Apps Challenge 2025, KIET — Organizing Team',
    detail: 'co-coordinated the campus 48-hour hackathon',
  },
  { label: 'AWS Certified Developer — Associate', detail: '2026' },
  { label: 'AWS Certified AI Practitioner', detail: '2026' },
  { label: 'AWS Certified Cloud Practitioner', detail: '2026' },
  { label: 'CGPA 8.89 / 10', detail: 'top 5% of class · B.Tech CSE, KIET · 2024–2028' },
]
