import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useMotionEnabled } from '../animations/MotionContext'
import { projects } from '../data/content'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const tint = (accent, pct) => `color-mix(in srgb, ${accent} ${pct}%, transparent)`

function StatusBar({ label, accent }) {
  return (
    <div className="flex items-center justify-between px-4 pt-2.5">
      <span className="font-mono text-[0.5rem] uppercase tracking-wider text-bone-dim">
        {label}
      </span>
      <div className="flex items-center gap-1">
        <span className="h-1 w-2.5 rounded-[1px] bg-bone-dim/60" />
        <span className="h-1.5 w-3 rounded-[2px] border border-bone-dim/50" />
        <span className="h-1 w-1 rounded-full" style={{ background: accent }} />
      </div>
    </div>
  )
}

function AppBar({ title, accent }) {
  return (
    <div className="flex items-center justify-between px-4 pb-1 pt-3">
      <span className="text-[0.68rem] font-medium text-bone">{title}</span>
      <span
        className="grid h-5 w-5 place-items-center rounded-full text-[0.5rem] font-semibold"
        style={{ background: tint(accent, 18), color: accent }}
      >
        A
      </span>
    </div>
  )
}

function Row({ row, accent }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="h-6 w-6 shrink-0 rounded-lg"
        style={{ background: tint(accent, 14) }}
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[0.55rem] text-bone">{row.name}</span>
        <span className="block truncate text-[0.48rem] text-bone-dim">{row.meta}</span>
      </span>
      <span className="shrink-0 font-mono text-[0.5rem] text-bone-dim">{row.amount}</span>
    </div>
  )
}

function WalletScreen({ s, accent }) {
  return (
    <>
      <div className="rounded-xl p-3" style={{ background: tint(accent, 12) }}>
        <span className="block text-[0.5rem] uppercase tracking-widest text-bone-dim">
          {s.balanceLabel}
        </span>
        <span className="mt-1 block text-[1.05rem] font-medium tracking-tight text-bone">
          {s.balance}
        </span>
        <span className="mt-0.5 block font-mono text-[0.5rem]" style={{ color: accent }}>
          {s.delta}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {s.stats.map((st) => (
          <div key={st.label} className="rounded-lg border border-line px-2 py-1.5">
            <span className="block text-[0.45rem] uppercase tracking-wider text-bone-dim">
              {st.label}
            </span>
            <span className="block text-[0.62rem] text-bone">{st.value}</span>
          </div>
        ))}
      </div>

      <div className="space-y-1.5">
        <span className="block text-[0.45rem] uppercase tracking-wider text-bone-dim">
          {s.listLabel}
        </span>
        {s.rows.map((r) => (
          <Row key={r.name} row={r} accent={accent} />
        ))}
      </div>
    </>
  )
}

function JobsScreen({ s, accent }) {
  return (
    <>
      <div className="flex items-center gap-2 rounded-full border border-line px-3 py-1.5">
        <span className="h-2 w-2 rounded-full border border-bone-dim/60" />
        <span className="text-[0.5rem] text-bone-dim">{s.searchLabel}</span>
      </div>

      <div className="flex gap-1.5">
        {s.chips.map((c, i) => (
          <span
            key={c}
            className="rounded-full px-2 py-1 text-[0.45rem]"
            style={
              i === 0
                ? { background: accent, color: '#0f0f0f' }
                : { background: tint(accent, 10), color: '#8a8a84' }
            }
          >
            {c}
          </span>
        ))}
      </div>

      <div className="space-y-1.5">
        {s.jobs.map((j) => (
          <div key={j.role} className="rounded-lg border border-line p-2">
            <span className="block text-[0.55rem] text-bone">{j.role}</span>
            <span className="mt-0.5 flex items-center justify-between">
              <span className="text-[0.45rem] text-bone-dim">{j.org}</span>
              <span className="font-mono text-[0.45rem]" style={{ color: accent }}>
                {j.pay}
              </span>
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {s.stats.map((st) => (
          <div key={st.label} className="rounded-lg border border-line px-2 py-1.5">
            <span className="block text-[0.45rem] uppercase tracking-wider text-bone-dim">
              {st.label}
            </span>
            <span className="block text-[0.62rem] text-bone">{st.value}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 rounded-lg p-2" style={{ background: tint(accent, 12) }}>
        <span className="h-5 w-5 shrink-0 rounded-full" style={{ background: tint(accent, 30) }} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[0.5rem] text-bone">{s.chat.name}</span>
          <span className="block truncate text-[0.45rem] text-bone-dim">{s.chat.text}</span>
        </span>
        <span className="shrink-0 font-mono text-[0.4rem]" style={{ color: accent }}>
          {s.chat.time}
        </span>
      </div>
    </>
  )
}

function HealthScreen({ s, accent }) {
  return (
    <>
      <div className="flex items-center gap-3">
        <div
          className="grid h-16 w-16 shrink-0 place-items-center rounded-full"
          style={{
            background: `conic-gradient(${accent} ${s.ringPercent}%, color-mix(in srgb, ${accent} 12%, transparent) 0)`,
          }}
        >
          <div className="grid h-[3.1rem] w-[3.1rem] place-items-center rounded-full bg-panel">
            <span className="text-[0.6rem] font-medium text-bone">{s.ringValue}</span>
          </div>
        </div>
        <span className="text-[0.5rem] leading-relaxed text-bone-dim">{s.ringLabel}</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {s.stats.map((st) => (
          <div key={st.label} className="rounded-lg border border-line px-2 py-1.5">
            <span className="block text-[0.45rem] uppercase tracking-wider text-bone-dim">
              {st.label}
            </span>
            <span className="block text-[0.62rem] text-bone">{st.value}</span>
          </div>
        ))}
      </div>

      <div className="space-y-1.5">
        <span className="block text-[0.45rem] uppercase tracking-wider text-bone-dim">
          {s.listLabel}
        </span>
        {s.rows.map((r) => (
          <Row key={r.name} row={r} accent={accent} />
        ))}
      </div>

      <div className="rounded-lg p-2" style={{ background: tint(accent, 12) }}>
        <span className="block font-mono text-[0.4rem] uppercase tracking-widest" style={{ color: accent }}>
          AI summary
        </span>
        <span className="mt-1 block text-[0.45rem] leading-relaxed text-bone-dim">{s.summary}</span>
      </div>
    </>
  )
}

const SCREENS = { wallet: WalletScreen, jobs: JobsScreen, health: HealthScreen }

function PhoneFrame({ project }) {
  const { accent, screen, screenshot, title } = project
  const Screen = SCREENS[screen.kind]

  return (
    <div
      data-phone
      className="relative aspect-[9/19] w-[min(58vw,15rem)] shrink-0 rounded-[2.2rem] bg-gradient-to-b from-raised to-void p-[3px] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] md:w-[min(22vw,17rem)]"
    >
      {/* Inner ring reads as the bezel edge; a single border looks like a sticker. */}
      <div className="h-full w-full rounded-[2.05rem] border border-line/80 bg-void p-[5px]">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[1.7rem] bg-panel">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-1/3"
            style={{ background: `linear-gradient(${tint(accent, 8)}, transparent)` }}
          />
          {/* Pill cutout — the frame reads as a phone before any content loads. */}
          <div className="absolute left-1/2 top-1.5 z-10 h-[0.3rem] w-10 -translate-x-1/2 rounded-full bg-void" />

          {screenshot ? (
            <img
              src={screenshot}
              alt={`${title} app screen`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div aria-hidden="true" className="relative flex h-full flex-col">
              <StatusBar label={screen.app} accent={accent} />
              <AppBar title={screen.appBar} accent={accent} />
              {/* justify-between spreads the slack between blocks; pooling it above
                  the CTA leaves a dead band that reads as an unfinished screen. */}
              <div className="flex flex-1 flex-col justify-between gap-2.5 overflow-hidden px-3 pb-3 pt-1">
                <Screen s={screen} accent={accent} />
                <div className="grid place-items-center rounded-full py-2" style={{ background: accent }}>
                  <span className="text-[0.5rem] font-semibold text-void">{screen.action}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Card({ project }) {
  return (
    <article
      data-card
      className="flex h-full w-screen shrink-0 flex-col items-start justify-center gap-10 px-6 md:w-[85vw] md:flex-row md:items-center md:gap-16 md:px-16"
    >
      <PhoneFrame project={project} />

      <div className="max-w-xl">
        <div data-card-el className="mb-6 flex items-center gap-4">
          <span className="font-mono text-sm" style={{ color: project.accent }}>
            {project.index}
          </span>
          <span className="h-px w-12 bg-line" />
          <span className="text-label text-bone-dim">{project.date}</span>
        </div>

        <h3 data-card-el className="text-[clamp(2rem,4.5vw,4rem)] font-medium leading-[0.95] tracking-[-0.035em]">
          {project.title}
        </h3>

        <p data-card-el className="text-label mt-3 text-bone-dim">
          {project.client}
        </p>

        <p data-card-el className="mt-6 text-lg leading-relaxed text-bone-dim md:text-xl">
          {project.summary}
        </p>

        <ul data-card-el className="mt-6 space-y-2">
          {project.highlights.map((h) => (
            <li key={h} className="flex gap-3 text-sm text-bone-dim md:text-base">
              <span style={{ color: project.accent }}>—</span>
              {h}
            </li>
          ))}
        </ul>

        <div data-card-el className="mt-8 flex flex-wrap items-center gap-2">
          {project.stack.map((t) => (
            <span
              key={t}
              className="rounded-full border border-line px-3 py-1 font-mono text-[0.7rem] text-bone-dim"
            >
              {t}
            </span>
          ))}
        </div>

        {project.href && (
          <a
            data-card-el
            href={project.href}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 font-mono text-sm underline-offset-4 hover:underline"
            style={{ color: project.accent }}
          >
            View source ↗
          </a>
        )}
      </div>
    </article>
  )
}

export default function Work() {
  const root = useRef(null)
  const track = useRef(null)
  const motionEnabled = useMotionEnabled()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(
        {
          isDesktop: '(min-width: 768px)',
          isMobile: '(max-width: 767px)',
          motionOk: '(prefers-reduced-motion: no-preference)',
        },
        (ctx) => {
          const { isDesktop, motionOk } = ctx.conditions
          const cards = gsap.utils.toArray('[data-card]', track.current)

          // WCAG 2.1: horizontal scroll must not be the only way to reach content.
          // Mobile and reduced-motion both get the plain vertical stack.
          if (!isDesktop || !motionOk || !motionEnabled) {
            gsap.set('[data-card-el], [data-phone]', { autoAlpha: 1, y: 0, scale: 1 })
            return
          }

          const scroll = gsap.to(track.current, {
            x: () => -(track.current.scrollWidth - window.innerWidth),
            ease: 'none', // required: containerAnimation needs a linear tween
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: () => '+=' + (track.current.scrollWidth - window.innerWidth),
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          })

          cards.forEach((card) => {
            gsap.from(card.querySelectorAll('[data-card-el]'), {
              y: 40,
              autoAlpha: 0,
              duration: 0.6,
              stagger: 0.06,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                containerAnimation: scroll,
                start: 'left 75%', // horizontal triggers use left/right, not top
              },
            })

            gsap.from(card.querySelector('[data-phone]'), {
              yPercent: 18,
              rotate: -4,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                containerAnimation: scroll,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            })
          })
        },
      )

      return () => mm.revert()
    },
    { scope: root, dependencies: [motionEnabled], revertOnUpdate: true },
  )

  return (
    <section ref={root} id="work" className="relative md:h-svh md:overflow-hidden">
      <div className="px-6 pt-32 md:absolute md:left-10 md:top-10 md:z-10 md:px-0 md:pt-0">
        <span className="text-label text-accent">[ 02 — Selected work ]</span>
      </div>

      <div
        ref={track}
        className="flex flex-col gap-32 py-20 md:h-full md:w-max md:flex-row md:gap-0 md:py-0"
      >
        {projects.map((p) => (
          <Card key={p.id} project={p} />
        ))}
      </div>
    </section>
  )
}
