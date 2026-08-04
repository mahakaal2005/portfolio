import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useMotionEnabled } from '../animations/MotionContext'
import { milestones } from '../data/content'

gsap.registerPlugin(useGSAP, ScrollTrigger)

function Card({ m }) {
  return (
    <>
      <div className="flex items-start justify-between gap-6">
        <span className="text-label text-bone-dim">{m.label}</span>
        <span className="text-label text-accent">{m.org}</span>
      </div>

      <div>
        <span className="block text-[clamp(3.5rem,11vw,9rem)] font-medium leading-[0.85] tracking-[-0.05em] text-accent">
          {m.metric}
        </span>
        <span className="text-label mt-3 block text-bone-dim">{m.metricLabel}</span>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <h3 className="text-[clamp(1.35rem,2.6vw,2.25rem)] font-medium leading-tight tracking-[-0.03em]">
          {m.title}
        </h3>
        <ul className="max-w-md space-y-1.5">
          {m.points.map((p) => (
            <li key={p} className="flex gap-3 text-sm text-bone-dim">
              <span className="text-accent">—</span>
              {p}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default function Experience() {
  const root = useRef(null)
  const stack = useRef(null)
  const motionEnabled = useMotionEnabled()

  useGSAP(
    () => {
      if (!motionEnabled) return

      const cards = gsap.utils.toArray('[data-stack-card]', stack.current)
      if (!cards.length) return

      // Waiting cards must be hidden, not just offset — the stack box is shorter
      // than the section, so an offset-only card still shows below the active one.
      cards.forEach((card, i) => gsap.set(card, { zIndex: i }))
      gsap.set(cards, { y: '100%', autoAlpha: 0, scale: 1, rotation: 0 })
      gsap.set(cards[0], { y: '0%', autoAlpha: 1 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => '+=' + window.innerHeight * (cards.length - 1),
          pin: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
          // Last pin on the page, so it measures after Hero and Work.
          refreshPriority: 1,
        },
      })

      cards.forEach((card, i) => {
        if (i === cards.length - 1) return
        // 0.18, not 0.45: the outgoing card only needs to hint at depth. Any
        // more and its headline stays legible through the incoming card, which
        // reads as two cards colliding rather than one stack advancing.
        tl.to(card, { scale: 0.86, rotation: -3, autoAlpha: 0.18, ease: 'none' }, i)
        tl.to(cards[i + 1], { y: '0%', ease: 'none', duration: 1 }, i)
        // Opaque within the first third of the travel. Fading across the whole
        // slide leaves the incoming card translucent while it moves, so the
        // outgoing card reads straight through it.
        tl.to(cards[i + 1], { autoAlpha: 1, ease: 'none', duration: 0.3 }, i)
        // Retire the card two deep so the stack never reads as more than a pair.
        if (i > 0) tl.to(cards[i - 1], { autoAlpha: 0, ease: 'none', duration: 0.3 }, i)
      })

      return () => {
        tl.scrollTrigger?.kill()
        tl.kill()
        gsap.set(cards, { clearProps: 'all' })
      }
    },
    { scope: root, dependencies: [motionEnabled], revertOnUpdate: true },
  )

  if (!motionEnabled) {
    return (
      <section
        id="experience"
        className="surface-lift relative flex min-h-svh flex-col justify-center px-6 py-24 md:px-10"
      >
        <span className="text-label mb-8 shrink-0 text-accent">[ 03 — Track record ]</span>
        <div className="flex flex-col gap-6">
          {milestones.map((m) => (
            <article
              key={m.id}
              className="flex flex-col justify-between gap-6 rounded-3xl border border-line bg-panel p-8 md:p-14"
            >
              <Card m={m} />
            </article>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section
      ref={root}
      id="experience"
      className="surface-lift relative flex h-svh flex-col justify-center overflow-hidden px-6 py-24 md:px-10"
    >
      <span className="text-label mb-8 shrink-0 text-accent">[ 03 — Track record ]</span>

      <div ref={stack} className="relative h-[min(60vh,32rem)] w-full overflow-hidden">
        {milestones.map((m) => (
          <article
            key={m.id}
            data-stack-card
            className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-3xl border border-line bg-panel p-8 md:p-14"
          >
            <Card m={m} />
          </article>
        ))}
      </div>
    </section>
  )
}