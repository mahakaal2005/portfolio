import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useMotionEnabled } from '../animations/MotionContext'
import { stack } from '../data/content'

gsap.registerPlugin(useGSAP, ScrollTrigger)

function Row({ items, reverse }) {
  return (
    <div
      data-marquee-track
      data-reverse={reverse ? 'true' : 'false'}
      className="flex w-max shrink-0 items-center gap-8 md:gap-14"
    >
      {[0, 1].map((copy) => (
        <div key={copy} className="flex shrink-0 items-center gap-8 md:gap-14" aria-hidden={copy === 1}>
          {items.map((item) => (
            <span key={item} className="flex shrink-0 items-center gap-8 md:gap-14">
              <span className="whitespace-nowrap text-[clamp(1.5rem,3.5vw,3rem)] font-medium tracking-[-0.02em]">
                {item}
              </span>
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

export default function Marquee() {
  const root = useRef(null)
  const motionEnabled = useMotionEnabled()

  const half = Math.ceil(stack.length / 2)
  const rows = [stack.slice(0, half), stack.slice(half)]

  useGSAP(
    () => {
      if (!motionEnabled) return

      const tracks = gsap.utils.toArray('[data-marquee-track]', root.current)

      const loops = tracks.map((track) => {
        const reverse = track.dataset.reverse === 'true'
        // Each track holds two identical copies, so -50% is exactly one loop.
        gsap.set(track, { xPercent: reverse ? -50 : 0 })
        return gsap.to(track, {
          xPercent: reverse ? 0 : -50,
          duration: 28,
          ease: 'none',
          repeat: -1,
        })
      })

      let target = 1

      const settle = () => {
        loops.forEach((loop) => {
          loop.timeScale(loop.timeScale() + (target - loop.timeScale()) * 0.08)
        })
        // Velocity only decays while onUpdate fires, so an abrupt stop would
        // otherwise strand the speed. Pull the target home every frame instead.
        target += (1 - target) * 0.04
      }
      gsap.ticker.add(settle)

      const trigger = ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          // Scroll velocity bends the ticker speed so the marquee reads as
          // reacting to you. Clamped above 0 — crossing zero flips direction
          // mid-frame, and Lenis's easing tail keeps it oscillating for a second.
          target = gsap.utils.clamp(0.35, 3.4, 1 + self.getVelocity() / 900)
        },
      })

      return () => {
        gsap.ticker.remove(settle)
        trigger.kill()
      }
    },
    { scope: root, dependencies: [motionEnabled], revertOnUpdate: true },
  )

  return (
    <section
      ref={root}
      className="relative overflow-hidden border-y border-line bg-panel/40 py-10 md:py-16"
      aria-label="Technology stack"
    >
      <div className="flex flex-col gap-6 md:gap-10">
        {rows.map((items, i) => (
          <div key={i} className="flex overflow-hidden">
            <Row items={items} reverse={i === 1} />
          </div>
        ))}
      </div>
    </section>
  )
}
