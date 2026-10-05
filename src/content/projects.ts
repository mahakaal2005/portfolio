/**
 * Selected work.
 *
 * `metric` is the highest-value field here — the thing a recruiter remembers
 * after they have forgotten the layout — so it should be a number with a unit,
 * not a category like "Serverless" that occupies the same space while saying
 * nothing measurable.
 *
 * It renders as an accent pill on the card image, so keep `label` to two or
 * three words: it sits on one line, and a sentence there overruns the card and
 * collides with the nav.
 *
 * Three or four entries suits the two-column grid. There is no longer a hard
 * ceiling: the 3D choreography that once required exactly three was removed
 * along with the WebGL layer.
 */

export interface Project {
  id: string
  /** Shown as the project heading. Keep it short. */
  title: string
  /** One line. Shown under the title. */
  pitch: string
  /** Two to three sentences: what it does, how it is built, what was hard. */
  description: string
  /** The headline number. Rendered large, in the accent. */
  metric: { value: string; label: string }
  /** Secondary numbers. Zero to three of them. */
  stats?: { value: string; label: string }[]
  /** Rendered as mono chips. Six maximum before it turns to noise. */
  stack: string[]
  links: { live?: string; repo?: string; caseStudy?: string }
  /**
   * Screenshot of the live deployment, shown at the top of the card. Omit it
   * and the card renders a "No preview" plate rather than a broken image.
   * Regenerate them all with `node scripts/shoot-projects.mjs`.
   */
  image?: string

  /**
   * Case study, shown in the slide-up detail view.
   *
   * Optional throughout: a project without one still renders its card and
   * links out, it just does not open. That is better than a detail view of
   * headings with nothing under them.
   */
  study?: {
    /** Long-form title for the detail header. */
    headline: string
    client: string
    /** What the project had to achieve. */
    objective: string
    /** The specific technical target. */
    goal: string
    /** Who it is for. */
    audience: string
    /** How it was approached — two or three paragraphs. */
    direction: string[]
    /** What was actually delivered. */
    scope: string[]
    /** Extra images. The card image is used as the lead. */
    gallery?: string[]
  }
  period?: string
}

export const projects: Project[] = [
  {
    id: 'innogeeks',
    title: 'Innogeeks',
    pitch: 'The official app for KIET’s largest technical club.',
    description:
      'A native Android app for InnoGeeks, the club that takes around 1,500 applicants a year, shipped to the Google Play Store. Twenty screens in 100% Jetpack Compose cover guest browsing, a full authentication suite and a recruitment tracker that shows live status across fee payment, aptitude test, interview and final decision. One session drives four different role experiences — Guest, Registered, Member and Coordinator — each with its own navigation.',
    metric: { value: '1,500', label: 'applicants a year' },
    stats: [
      { value: '20', label: 'screens in pure Compose' },
      { value: '111', label: 'Compose previews' },
    ],
    stack: ['Kotlin', 'Jetpack Compose', 'MVI', 'Clean Architecture', 'Koin', 'Ktor'],
    links: {
      live: 'https://play.google.com/store/apps/details?id=edu.kiet.innogeeks',
      repo: 'https://github.com/mahakaal2005/InnogeeksApp',
    },
    image: '/work/innogeeks.jpg',
    period: 'Jul 2026 — Present',
    study: {
      headline: 'One session, four roles, twenty screens of Compose',
      client: 'InnoGeeks · KIET’s largest technical club',
      objective:
        'A club running a 1,500-applicant recruitment cycle was tracking it through notices and group messages. Applicants had no way to tell where they stood, and the people running it had no single place that said so.',
      goal:
        'Put the whole cycle in one app — browse as a guest, sign up, and then watch your own status move through fee payment, aptitude test, interview and decision — without the app becoming four apps in a trench coat.',
      audience:
        'Students deciding whether to apply, applicants mid-cycle, existing members, and the coordinators running the process.',
      direction: [
        'Role is a property of the session, not a separate build. Guest, Registered, Member and Coordinator each render a distinct tab set from the same navigation graph, which is what keeps a single binary from splintering into four parallel flows that drift apart.',
        'The app is Feature-Driven Clean Architecture with formal MVI. The domain layer has zero Android imports, which is a constraint rather than a style: it means the recruitment logic can be reasoned about and tested without an emulator, and errors travel as typed values rather than as thrown exceptions nobody catches.',
        'Every repository is Koin-swappable between a live Ktor client and an in-memory implementation, so screens were built and reviewed long before the endpoints existed. Token persistence goes through DataStore, and the frosted-glass Haze surfaces are backed by 111 Compose previews so the UI could be checked without a full run.',
      ],
      scope: [
        '20 screens in 100% Jetpack Compose, shipped to Google Play',
        'Session-driven role-based navigation across four role types',
        'Full auth suite — self-serve signup, email-gated login, password reset, account deletion',
        'Recruitment tracker spanning fee payment, aptitude test, interview and decision',
        'Feature-Driven Clean Architecture, formal MVI, zero-Android-import domain layer',
        'Live REST over Ktor with Koin-swappable in-memory implementations',
        'DataStore token persistence and frosted-glass Haze UI, 111 Compose previews',
      ],
    },
  },

  {
    id: 'tradex',
    title: 'TradeX',
    pitch: 'AI trading signals with the reasoning attached.',
    description:
      'A full-stack trading platform built for the Frostbyte Hackathon Grand Finale, carrying real-time market data across crypto, stocks, forex and commodities. A Gemini Flash 1.5 signal engine computes RSI, MACD, Bollinger Bands, EMA and SMA, then returns BUY/SELL/HOLD with a confidence score, a price target and its full reasoning. TTL-based in-memory caching keeps it inside the API rate limit, and a rule-based fallback means a signal still arrives when the model does not.',
    metric: { value: '4', label: 'markets covered' },
    stats: [
      { value: '5', label: 'technical indicators' },
      { value: '0', label: 'signals lost to rate limits' },
    ],
    stack: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Gemini API', 'Vite'],
    links: {
      live: 'https://tradex.atul08.in/signin',
      repo: 'https://github.com/mahakaal2005/TradeX',
    },
    image: '/work/tradex.jpg',
    period: 'Nov 2025 — Apr 2026',
    study: {
      headline: 'A signal is only useful if it tells you why',
      client: 'TradeX · Frostbyte Hackathon Grand Finale',
      objective:
        'Most retail trading tools either dump raw indicators on you or hand down a verdict with nothing behind it. The first needs expertise the user does not have; the second asks for trust it has not earned.',
      goal:
        'Return a BUY/SELL/HOLD call across four asset classes with a confidence score, a price target and the reasoning that produced it — and never return nothing.',
      audience:
        'Retail traders who want a starting read on an instrument without having to interpret five indicators themselves.',
      direction: [
        'The indicators are computed deterministically — RSI, MACD, Bollinger Bands, EMA and SMA — and only then handed to Gemini Flash 1.5 for the reasoning step. Putting the arithmetic in code rather than in the prompt is what keeps the same inputs from producing two different numbers.',
        'Rate limiting was the real constraint, not latency. Market data refreshes far faster than a free-tier quota allows, so responses go through a TTL-based in-memory cache keyed by instrument and window, which collapses a burst of users watching the same ticker into one upstream call.',
        'Underneath that sits a rule-based fallback over the same indicators. It is deliberately worse than the model, and that is the point: a degraded signal with lower stated confidence is more useful than an empty panel when the API is down.',
      ],
      scope: [
        'Real-time data across crypto, stocks, forex and commodities',
        'React 18 and Vite frontend, Node.js/Express and PostgreSQL backend on Render',
        'Gemini Flash 1.5 signal engine over RSI, MACD, Bollinger Bands, EMA and SMA',
        'BUY/SELL/HOLD with confidence score, price target and full reasoning',
        'TTL-based in-memory caching against API rate-limit exhaustion',
        'Rule-based fallback guaranteeing signal availability',
      ],
    },
  },

  {
    id: 'pdfit',
    title: 'PDFit',
    pitch: 'A document scanner that never phones home.',
    description:
      'An offline-first Android document scanner on the Google Play Store, sitting at 4.5 stars. Google ML Kit handles edge detection and perspective correction on-device, and the PDF is generated locally — no ads, no account, no cloud. Documents live in a Room database with a Compose and MVVM front end, so scanning an ID or a bank statement never involves uploading it anywhere.',
    metric: { value: '4.5★', label: 'Play Store rating' },
    stats: [
      { value: '100%', label: 'processing on-device' },
      { value: '0', label: 'ads or accounts' },
    ],
    stack: ['Kotlin', 'Jetpack Compose', 'ML Kit', 'Room', 'MVVM'],
    links: {
      live: 'https://play.google.com/store/apps/details?id=com.pdfit.scanner',
      repo: 'https://github.com/mahakaal2005/PDFit',
    },
    image: '/work/pdfit.jpg',
    period: 'Jul — Sep 2025',
    study: {
      headline: 'The scanner you can use on a document you would not upload',
      client: 'PDFit · on the Google Play Store',
      objective:
        'The document scanners people actually have installed are ad-supported and cloud-backed. That is a poor trade for the documents most worth scanning — identity papers, bank statements, signed forms.',
      goal:
        'Scan, correct and export a PDF entirely on the device, at a quality that holds up against the cloud-backed apps, with no account and no ads.',
      audience:
        'Anyone scanning documents they would rather not hand to a third party, on a phone that may not have a connection anyway.',
      direction: [
        'Everything that touches the image runs locally through Google ML Kit — edge detection, perspective correction, then PDF generation. Offline-first here is a privacy guarantee first and a connectivity feature second; there is no upload path to disable because none was built.',
        'Storage is a Room database rather than loose files in shared storage, which is what makes the document list, rename and re-export work predictably instead of breaking the first time the user moves something in a file manager.',
        'The UI is Jetpack Compose over MVVM, kept deliberately thin. A scanner is used in a hurry, usually one-handed, so the path from opening the app to a shareable PDF is the thing that got the attention.',
      ],
      scope: [
        'Offline-first scanner shipped to Google Play at a 4.5-star rating',
        'On-device edge detection and perspective correction via Google ML Kit',
        'Local PDF generation and sharing, no account and no ads',
        'Room-backed document management with Jetpack Compose and MVVM',
      ],
    },
  },
]
