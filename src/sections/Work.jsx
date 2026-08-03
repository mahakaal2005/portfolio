import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useMotionEnabled } from '../animations/MotionContext'
import { projects } from '../data/content'

gsap.registerPlugin(useGSAP, ScrollTrigger)

function PhoneFrame({ project }) {
  return (
    <div
      data-phone
      className="relative aspect-[9/19] w-[min(58vw,15rem)] shrink-0 rounded-[2rem] border border-line bg-void p-2 shadow-[0_0_80px_-20px] md:w-[min(22vw,17rem)]"
      style={{ color: project.accent }}
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-[1.6rem] bg-panel">
        <div className="flex items-center justify-between px-4 pt-3">
          <span className="font-mono text-[0.55rem] text-bone-dim">9:41</span>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: project.accent }} />
        </div>
        <div className="flex flex-1 flex-col justify-between p-4">
          <div className="space-y-2">
            <div className="h-1.5 w-2/3 rounded-full bg-raised" />
            <div className="h-1.5 w-1/2 rounded-full bg-raised" />
          </div>
          <div
            className="rounded-xl p-3"
            style={{ background: `color-mix(in srgb, ${project.accent} 14%, transparent)` }}
          >
            <span className="font-mono text-[0.6rem] uppercase tracking-widest" style={{ color: project.accent }}>
              {project.stack[0]}
            </span>
          </div>
          <div className="space-y-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-6 w-6 shrink-0 rounded-lg bg-raised" />
                <div className="h-1.5 flex-1 rounded-full bg-raised" />
              </div>
            ))}
          </div>
          <div
            className="h-9 rounded-full"
            style={{ background: project.accent, opacity: 0.9 }}
          />
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
