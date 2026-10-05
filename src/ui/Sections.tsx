import { useEffect, useState, useRef, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { profile, skillGroups, dsa, experience, achievements } from '@/content'
import { EASE_OUT_EXPO, Reveal, Stagger, StaggerItem, useMotionSafe } from './motion'
import { TECH_MARKS, TechMark } from './techMarks'
import { TechPattern } from './TechPattern'

/**
 * Page sections.
 *
 * Every section shares one shell — same max width, same vertical rhythm, same
 * heading treatment — so the page reads as one document rather than a stack of
 * separately designed blocks. That consistency is most of what separates a
 * premium-feeling site from a competent one.
 *
 * Section content is adapted rather than borrowed. The reference is a
 * freelance designer's site and leans on client logos, testimonials and an
 * FAQ; none of those exist here, so the equivalent slots carry measured
 * results, capabilities and real work instead. Empty sections or invented
 * social proof would both cost more than they earn.
 */

const WRAP = 'mx-auto w-full max-w-6xl px-6 md:px-10'

function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
}: {
  id?: string
  eyebrow?: string
  /** ReactNode, not string — several callers accent a word inside the heading. */
  title?: ReactNode
  lead?: string
  children: ReactNode
}) {
  return (
    <section id={id} className="py-24 md:py-32">
      <div className={WRAP}>
        {(eyebrow || title) && (
          <Reveal className="mb-12 md:mb-16">
            {eyebrow && <p className="t-label mb-4 text-accent-text">{eyebrow}</p>}
            {title && <h2 className="t-display max-w-3xl text-fg">{title}</h2>}
            {lead && <p className="t-lead mt-5 max-w-2xl">{lead}</p>}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * Proof — the reference's client-logo strip, carrying real numbers
 * ------------------------------------------------------------------ */

export function ProofStrip() {
  return (
    <section className="border-y border-line bg-surface/40">
      <div className={WRAP}>
        <Stagger as="ul" className="grid grid-cols-2 gap-x-6 gap-y-10 py-14 md:grid-cols-4 md:py-16">
          {profile.proof.map((item) => (
            <StaggerItem as="li" key={item.label}>
              <p className="font-display text-3xl font-bold tracking-tight text-fg md:text-4xl">
                {item.value}
              </p>
              <p className="font-sans text-xs font-medium tracking-wider uppercase mt-2 text-muted-2">{item.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * Capabilities — the reference's "Services", reframed
 * ------------------------------------------------------------------ */

/**
 * Capabilities.
 *
 * Sticky left column, scrolling stack of cards on the right. Each card arrives
 * rotated and slightly small, then straightens and settles as it reaches its
 * resting position — the slant is what makes the stack read as physical cards
 * rather than a list of boxes.
 *
 * The cards are `sticky` at staggered offsets, so an incoming card slides up
 * and covers the one before it instead of pushing it away. That is the whole
 * trick: the pile builds as you scroll rather than scrolling past.
 *
 * Alternating accent and surface fills come straight from the reference, and
 * they earn their place — four identical dark cards would give the eye nothing
 * to track as the stack advances.
 */
function CapabilityCard({
  item,
  index,
}: {
  item: (typeof profile.capabilities)[number]
  index: number
}) {
  const animate = useMotionSafe()
  const accent = index % 2 === 1
  const ref = useRef<HTMLElement>(null)
  const [isSticky, setIsSticky] = useState(false)
  const tiltAngle = index % 2 === 0 ? -4 : 4

  useEffect(() => {
    if (!animate) return
    const stickyThreshold = 112 + index * 32
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        setIsSticky(rect.top <= stickyThreshold + 20)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [animate, index])

  return (
    <motion.article
      ref={ref}
      className="sticky"
      style={{
        top: `calc(7rem + ${index * 2}rem)`,
        zIndex: index + 1,
      }}
      initial={animate ? { opacity: 0, y: 60, rotate: tiltAngle, scale: 0.94 } : false}
      whileInView={{ opacity: 1, y: 0, rotate: tiltAngle, scale: 1 }}
      animate={{ rotate: isSticky ? 0 : tiltAngle }}
      viewport={{ once: true, margin: '0px 0px -18% 0px' }}
      transition={{ duration: 0.85, ease: EASE_OUT_EXPO }}
    >
      <div
        className={`rounded-[var(--radius-lg)] border p-7 md:p-9 ${
          accent ? 'border-transparent bg-accent' : 'border-line bg-surface'
        }`}
      >
        <h3 className={`t-h2 mb-3 ${accent ? 'text-white' : 'text-fg'}`}>{item.title}</h3>
        <p className={accent ? 'leading-relaxed text-white/85' : 't-body'}>{item.body}</p>

        <ul className="mt-7 flex flex-wrap items-center gap-2">
          {item.tags.map((tag) => (
            <li
              key={tag}
              className={`text-sm ${
                accent ? 'text-white' : 'text-muted'
              }`}
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  )
}

export function Capabilities() {
  const line1 = 'What I help'

  return (
    <section id="capabilities" className="py-24 md:py-32">
      <div className={WRAP}>
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
          {/* ---- Sticky left column ---------------------------------- */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <h2 className="t-display text-fg">
                <span className="block">{line1}</span>
                <span className="block">
                  you to <span className="text-accent">build</span><span className="text-accent">...</span>
                </span>
              </h2>

              <p className="t-body mt-12 mb-5">Tools I work with</p>
              <ul className="flex flex-wrap gap-3">
                {profile.tools.map((tool) => (
                  <li key={tool} className="group relative">
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] border border-line bg-surface text-muted transition-colors group-hover:border-accent group-hover:text-fg"
                    >
                      <TechMark name={tool} />
                    </span>
                    <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[var(--radius-sm)] bg-fg px-2 py-1 text-xs font-medium text-surface opacity-0 transition-opacity group-hover:opacity-100">
                      {TECH_MARKS[tool]?.label}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* ---- Scrolling card stack -------------------------------- */}
          <div className="flex flex-col gap-6">
            {profile.capabilities.map((item, i) => (
              <CapabilityCard key={item.title} item={item} index={i} />
            ))}
            {/* Tail space so the last card can reach its sticky position
                before the section ends. */}
            <div className="h-[20vh]" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * About + experience
 * ------------------------------------------------------------------ */

/**
 * Platform marks, as single paths on a 24-unit grid so they inherit
 * `currentColor`. One map, used by both the About card and the problem-solving
 * links — the alternative is the same path data living in two files and
 * drifting.
 */
const ICON_PATHS = {
  github:
    'M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.1 5.1 18.1 5.4 18.1 5.4c.6 1.6.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3',
  linkedin:
    'M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.86-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z',
  leetcode:
    'M13.48 0a1.37 1.37 0 0 0-.96.44L7.12 6.23l-3.86 4.12a5.27 5.27 0 0 0-1.2 2.11 5.53 5.53 0 0 0-.07 2.87 5.94 5.94 0 0 0 1.62 2.84l4.28 4.19.04.04a5.9 5.9 0 0 0 8.06-.08l2.4-2.39a1.38 1.38 0 0 0-1.95-1.96l-2.4 2.4a3.02 3.02 0 0 1-4.2.04l-.02-.02-4.28-4.2a2.6 2.6 0 0 1-.88-2.78 2.55 2.55 0 0 1 .62-1.17l3.86-4.12c1.06-1.14 3.2-1.27 4.43-.28l3.5 2.83a1.38 1.38 0 0 0 1.73-2.15l-3.5-2.83a6.5 6.5 0 0 0-2.78-1.2l2.02-2.16A1.38 1.38 0 0 0 13.48 0Zm-2.87 12.82a1.38 1.38 0 1 0 0 2.76h10.18a1.38 1.38 0 0 0 0-2.76Z',
} as const

type Platform = keyof typeof ICON_PATHS

function Icon({ name, size = 15 }: { name: Platform; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d={ICON_PATHS[name]} />
    </svg>
  )
}

const SOCIALS: { label: string; key: Platform }[] = [
  { label: 'GitHub', key: 'github' },
  { label: 'LinkedIn', key: 'linkedin' },
  { label: 'LeetCode', key: 'leetcode' },
]

/**
 * About.
 *
 * Portrait card on the left, story on the right, work history beneath it —
 * the reference's arrangement, which works because the face anchors a column
 * of prose that would otherwise be a wall.
 *
 * The portrait is the avatar on an accent-lit card rather than a photograph.
 * That is deliberate rather than a substitution: the same figure appears in
 * the hero, so repeating it here reads as a through-line instead of two
 * different representations of one person.
 */
export function About() {
  const [line1, line2] = profile.aboutHeading

  return (
    <section id="about" className="py-24 md:py-32 relative overflow-hidden">
      <TechPattern />
      <div className={`${WRAP} relative z-10`}>
        <Reveal className="mb-14 md:mb-20">
          <h2 className="t-display text-fg">
            <span className="block">{line1}</span>
            <span className="block text-accent">{line2}</span>
          </h2>
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16 lg:items-start">
          {/* ---- Portrait card ---------------------------------------- */}
          <Reveal>
            <div className="sticky top-8 self-start">
              <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-line">
              {/* Accent-lit ground, echoing the reference's red-lit studio
                  portrait without needing a lighting setup. */}
              <div
                className="relative flex aspect-[4/5] items-end justify-center"
                style={{
                  background:
                    'radial-gradient(120% 90% at 50% 15%, color-mix(in srgb, var(--color-accent) 55%, #2a0512) 0%, #17060c 70%, #110407 100%)',
                }}
              >
                <img
                  src={profile.aboutPortrait}
                  alt={profile.name}
                  loading="lazy"
                  className="h-full w-full object-cover object-center"
                />

                {/* Socials, sitting on the image as in the reference. */}
                <ul className="absolute bottom-4 right-4 flex gap-2">
                  {SOCIALS.map((s) => (
                    <li key={s.key}>
                      <a
                        href={profile.links[s.key]}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={s.label}
                        className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] bg-ink/70 text-fg no-underline backdrop-blur-md transition-colors hover:bg-ink hover:text-accent-text"
                      >
                        <Icon name={s.key} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

              <h3 className="t-h2 mt-6 text-fg">{profile.name}</h3>
              <p className="t-body mt-1.5 text-sm">{profile.roleLine}</p>

              {/* Signature, under the portrait it belongs to.
                  The asset carries its own alpha rather than relying on
                  mix-blend-mode: lighten. The blend only drops the black when
                  the element composites against the page, and the animated
                  ancestors here form an isolated stacking context — which
                  rendered the source's black background as a visible box.
                  Width-constrained so it tracks the portrait column. */}
              {profile.signature && (
                <img
                  src={profile.signature}
                  alt={`${profile.name}'s signature`}
                  loading="lazy"
                  className="mx-auto mt-6 block h-auto w-full max-w-[19rem]"
                />
              )}
            </div>
          </Reveal>

          {/* ---- Story + work history --------------------------------- */}
          <div>
            <Reveal delay={0.08}>
              <div className="space-y-5">
                {profile.aboutParagraphs.map((para) => (
                  <p key={para.slice(0, 24)} className="t-lead">
                    {para}
                  </p>
                ))}
              </div>
            </Reveal>

          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * Skills
 * ------------------------------------------------------------------ */

export function Skills() {
  const allSkills = skillGroups
    .flatMap(g => g.skills)
    .sort((a, b) => b.level - a.level)

  const getRandomPosition = (skillName: string, index: number) => {
    const hash = skillName.split('').reduce((h, c) => ((h << 5) - h) + c.charCodeAt(0), 0)
    const seed = Math.abs(hash) + index
    const angle = ((seed * 137.508) % 360) * (Math.PI / 180)
    const distance = 120 + ((seed % 180))
    return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance }
  }

  return (
    <Section
      id="skills"
      title="What I reach for."
      lead="Ordered by how much I actually use them. No percentages — a self-assigned number has no shared scale and tells you nothing."
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative w-screen"
        style={{ minHeight: '850px', marginLeft: 'calc(-50vw + 50%)' }}
      >
        {/* Central content */}
        <div className="absolute top-1/2 left-1/2 z-20" style={{ transform: 'translate(-50%, -50%)' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="font-display text-xs font-medium tracking-wider uppercase mb-4 text-accent">
              My Skillset
            </p>
            <h3 className="t-display text-fg mb-4">
              <span className="block">Skills at</span>
              <span className="block text-accent">Random, Ideas in</span>
              <span className="block">Motion.</span>
            </h3>
            <p className="t-body max-w-xs text-muted mx-auto">
              I work across the stack and beyond. Here are some technologies and tools I love to build with.
            </p>
          </motion.div>
        </div>

        {/* Skills scattered with floating animation */}
        {allSkills.map((skill, index) => {
          const pos = getRandomPosition(skill.name, index)
          const isPrimary = skill.level >= 0.85
          const yOffset = Math.sin(index * 0.5) * 10

          return (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: '100px 0px' }}
              transition={{ delay: index * 0.03, duration: 0.5, ease: EASE_OUT_EXPO }}
              animate={{ y: yOffset }}
              className="absolute top-1/2 left-1/2"
              style={{
                transform: `translate(calc(-50% + ${pos.x * 3.5}px), calc(-50% + ${pos.y * 3.5}px))`,
              }}
            >
              <motion.div
                whileHover={{ scale: 1.1, y: -8 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border backdrop-blur-sm transition-all cursor-pointer ${
                  isPrimary
                    ? 'bg-accent/10 border-accent/40 text-fg hover:border-accent/80'
                    : 'bg-white/5 border-white/10 text-muted hover:border-white/30 hover:text-fg'
                }`}
              >
                <span className="text-sm font-medium">{skill.name}</span>
              </motion.div>
            </motion.div>
          )
        })}

        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-accent rounded-full opacity-20"
            animate={{
              x: Math.cos((i / 12) * Math.PI * 2) * 300,
              y: Math.sin((i / 12) * Math.PI * 2) * 300,
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 8 + i,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              top: '50%',
              left: '50%',
              marginTop: '-2px',
              marginLeft: '-2px',
            }}
          />
        ))}
      </motion.div>
    </Section>
  )
}

/* ------------------------------------------------------------------ *
 * Problem solving
 * ------------------------------------------------------------------ */

export function ProblemSolving() {
  // One profile, not a row of half-used ones. An empty Codeforces page beside
  // a real LeetCode record reads worse than LeetCode standing alone.
  const links: { label: string; key: Platform; handle: string; href: string }[] = [
    {
      label: 'LeetCode',
      key: 'leetcode',
      handle: profile.handles.leetcode,
      href: profile.links.leetcode,
    },
    {
      label: 'GitHub',
      key: 'github',
      handle: profile.handles.github,
      href: profile.links.github,
    },
  ]

  return (
    <Section
      id="dsa"
      title={
        <>
          Graphs, DP, and a lot of <span className="text-accent">practice</span><span className="text-accent">...</span>
        </>
      }
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <Reveal>
          <dl className="mb-10 grid grid-cols-2 gap-8">
            {dsa.stats.map((stat) => (
              <div key={stat.label}>
                <dd className="font-display text-3xl font-bold tracking-tight text-fg">
                  {stat.value}
                </dd>
                <dt className="t-label mt-2 text-muted-2">{stat.label}</dt>
              </div>
            ))}
          </dl>

          <ul className="mb-10 flex flex-wrap gap-2">
            {dsa.topics.map((topic) => (
              <li
                key={topic}
                className="text-sm text-accent"
              >
                {topic}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-ghost"
              >
                <Icon name={l.key} size={16} />
                {l.label}
                <span className="text-muted-2">{l.handle}</span>
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <pre className="card overflow-x-auto p-6 text-xs leading-relaxed text-muted">
            <code>{dsa.wallCode}</code>
          </pre>
        </Reveal>
      </div>
    </Section>
  )
}

/* ------------------------------------------------------------------ *
 * Work History
 * ------------------------------------------------------------------ */

export function WorkHistory() {
  return (
    <Section id="work-history" title="Work history.">
      <div className="relative space-y-8 md:space-y-12">
        {/* Vertical timeline line on the right */}
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-accent to-transparent" />

        {experience.map((role) => (
          <motion.div
            key={role.org}
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            className="flex gap-8 items-start md:pr-12"
          >
            <div className="flex-1">
              <motion.div
                whileHover={{ x: -12 }}
                className="group relative rounded-[var(--radius-lg)] border border-line bg-surface p-6 md:p-8 transition-colors duration-300 hover:border-accent hover:bg-accent"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-fg font-display font-semibold group-hover:text-white transition-colors">{role.org}</h3>
                    <p className="text-sm text-accent mt-1">{role.title}</p>
                  </div>
                  <span className="text-xs text-muted whitespace-nowrap group-hover:text-white/75 transition-colors">{role.period}</span>
                </div>
                <p className="t-body text-sm text-muted group-hover:text-white/85 transition-colors mb-3">{role.summary}</p>
                {role.stack && (
                  <div className="flex flex-wrap gap-2">
                    {role.stack.map((tech) => (
                      <span key={tech} className="text-xs px-2 py-1 rounded bg-white/5 text-muted-2 group-hover:bg-white/10">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
            <div className="hidden md:flex w-8 h-8 items-center justify-center flex-shrink-0 relative z-10 mt-1">
              <div className="w-3 h-3 rounded-full bg-accent" />
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

/* ------------------------------------------------------------------ *
 * Achievements
 * ------------------------------------------------------------------ */

export function Achievements() {
  if (!achievements.length) return null

  return (
    <Section id="achievements" title="Things worth mentioning.">
      <div className="space-y-8 md:space-y-12">
        {achievements.map((item) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          >
            <motion.div
              whileHover={{ x: -12 }}
              className="group relative rounded-[var(--radius-lg)] border border-line bg-surface p-6 md:p-8 transition-colors duration-300 hover:border-accent hover:bg-accent"
            >
              <p className="text-fg font-display font-semibold group-hover:text-white transition-colors">{item.label}</p>
              {item.detail && (
                <p className="t-body mt-2 text-sm text-muted group-hover:text-white/85 transition-colors">
                  {item.detail}
                </p>
              )}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

/* ------------------------------------------------------------------ *
 * Closing call to action
 * ------------------------------------------------------------------ */

/**
 * The rotating verb in the closing headline.
 *
 * Words are cycled rather than typed out: a typing effect makes the reader
 * wait for the sentence to finish, and this line has to be legible the instant
 * it comes into view.
 *
 * Two details keep it from reading as a glitch. The slot is sized to the
 * longest word and centred, so the rest of the line never reflows when a
 * shorter word is showing. And under `prefers-reduced-motion` it holds the
 * first word permanently — a word swapping every second and a half is exactly
 * the kind of motion that setting exists to stop.
 */
function RotatingVerb() {
  const words = profile.closingVerbs
  const animate = useMotionSafe()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!animate) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % words.length), 1500)
    return () => window.clearInterval(id)
  }, [animate, words.length])

  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), '')

  return (
    <span
      className="relative inline-grid place-items-center align-baseline text-accent"
      style={{ fontFamily: 'var(--font-marker)', fontWeight: 600 }}
    >
      {/* Invisible spacer holding the widest word, so the line never reflows. */}
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {longest}
      </span>

      <span className="sr-only">{words.join(', ')}</span>

      {/* `wait` rather than `popLayout`: the two words share one grid cell, so
          overlapping them during the crossfade renders both on top of each
          other. Waiting for the outgoing word to leave costs a beat and reads
          clean. */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[index]}
          aria-hidden="true"
          className="col-start-1 row-start-1 whitespace-nowrap"
          initial={animate ? { opacity: 0, y: '0.35em' } : false}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '-0.35em' }}
          transition={{ duration: 0.26, ease: EASE_OUT_EXPO }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

/**
 * Closing section and footer.
 *
 * The reference's arrangement: oversized invitation, a row of contact details,
 * a rule, a menu and copyright line, then the name at poster scale bleeding off
 * the bottom edge.
 *
 * Its "Call Me → Book Now" slot is a freelancer's booking link. That has no
 * equivalent here, so the slot carries availability instead — the thing a
 * recruiter actually needs to know at this point in the page.
 */
export function ClosingCTA() {
  const socials: { label: string; key: Platform; href: string }[] = [
    { label: 'GitHub', key: 'github', href: profile.links.github },
    { label: 'LinkedIn', key: 'linkedin', href: profile.links.linkedin },
    { label: 'LeetCode', key: 'leetcode', href: profile.links.leetcode },
  ]

  const menu = [
    { label: 'Work', href: '#work' },
    { label: 'Stack', href: '#skills' },
    { label: 'About', href: '#about' },
  ]

  return (
    <section id="contact" className="overflow-hidden pt-24 md:pt-32">
      <div className={WRAP}>
        <Reveal>
          <div className="relative">
            <h2 className="t-display max-w-4xl text-fg">
              Let’s <RotatingVerb />
              <br />
              incredible software together.
            </h2>
          </div>
        </Reveal>

        {/* ---- Details row ------------------------------------------- */}
        <Reveal delay={0.08}>
          <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {/* Email and phone share a column rather than taking one each: a
                fourth column would squeeze the address onto two lines, and
                these two are the same kind of thing anyway. */}
            <div className="space-y-6">
              <div>
                <p className="t-body mb-2 text-sm">Email</p>
                <a
                  href={`mailto:${profile.links.email}`}
                  className="text-lg text-fg no-underline transition-colors hover:text-accent-text md:text-xl"
                >
                  {profile.links.email}
                </a>
              </div>

              <div>
                <p className="t-body mb-2 text-sm">Phone</p>
                {/* tel: on the raw E.164 so it dials; the spaced form is for reading. */}
                <a
                  href={`tel:${profile.links.phone}`}
                  className="text-lg text-fg no-underline transition-colors hover:text-accent-text md:text-xl"
                >
                  {profile.handles.phone}
                </a>
              </div>
            </div>

            <div>
              <p className="t-body mb-2 text-sm">Available</p>
              <p className="text-lg text-fg md:text-xl">{profile.availabilityShort}</p>
            </div>

            <div>
              <p className="t-body mb-3 text-sm">Social</p>
              <ul className="flex gap-3">
                {socials.map((s) => (
                  <li key={s.key}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={s.label}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white no-underline transition-colors hover:bg-accent-hover"
                    >
                      <Icon name={s.key} size={17} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <div className="mt-14 h-px bg-line" />

        {/* ---- Menu and copyright ------------------------------------ */}
        <div className="mt-10 flex flex-wrap items-start justify-between gap-8">
          <div>
            <p className="t-body mb-3 text-sm">Menu</p>
            <nav className="flex flex-wrap gap-7" aria-label="Footer">
              {menu.map((m) => (
                <a
                  key={m.label}
                  href={m.href}
                  className="text-fg no-underline transition-colors hover:text-accent-text"
                >
                  {m.label}
                </a>
              ))}
              <a
                href={profile.links.resume}
                className="text-fg no-underline transition-colors hover:text-accent-text"
              >
                Resume
              </a>
            </nav>
          </div>

          <p className="t-body text-sm">
            © {new Date().getFullYear()} {profile.name}
          </p>
        </div>
      </div>

      {/* ---- Name at poster scale, bleeding off the bottom -----------
              First name only, uppercase. The reference's mark is ten
              characters; the full name is sixteen and ran off both sides at
              any size large enough to read as a poster. Cropping the bottom is
              the effect — cropping the sides is just an overflow. */}
      <p
        aria-hidden="true"
        className="mt-16 select-none whitespace-nowrap text-center leading-[0.78] text-accent md:mt-24"
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 'clamp(3rem, 16vw, 15rem)',
          letterSpacing: '-0.05em',
          marginBottom: '-0.18em',
        }}
      >
        {profile.name.split(' ')[0].toUpperCase()}
      </p>
    </section>
  )
}

export { WRAP }
