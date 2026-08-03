import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import { useMotionEnabled } from '../animations/MotionContext'
import { profile } from '../data/content'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

const NAME_LINES = ['ATUL', 'KUMAR', 'SINGH']

export default function Hero({ ready }) {
  const root = useRef(null)
  const motionEnabled = useMotionEnabled()

  useGSAP(
    () => {
      if (!motionEnabled) {
        gsap.set('[data-hero-fade], [data-hero-word]', { autoAlpha: 1, yPercent: 0 })
        return
      }

      gsap.set('[data-hero-word]', { yPercent: 115 })
      gsap.set('[data-hero-fade]', { autoAlpha: 0, y: 24 })

      if (!ready) return

      const intro = gsap.timeline({ delay: 0.15 })
      intro
        .to('[data-hero-word]', {
          yPercent: 0,
          duration: 1.3,
          ease: 'expo.out',
          stagger: 0.09,
        })
        .to(
          '[data-hero-fade]',
          { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08 },
          '-=0.8',
        )

      // Scroll-out: the name recedes and dims while the section stays pinned,
      // so the next section arrives over a still-present hero rather than a cut.
      const outro = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      })

      outro
        .to('[data-hero-name]', { scale: 0.72, yPercent: -14, autoAlpha: 0.06, ease: 'none' }, 0)
        .to('[data-hero-fade]', { autoAlpha: 0, y: -40, ease: 'none' }, 0)
        .to('[data-hero-scrim]', { autoAlpha: 1, ease: 'none' }, 0)
    },
    { scope: root, dependencies: [motionEnabled, ready], revertOnUpdate: true },
  )

  return (
    <section
      ref={root}
      id="top"
      className="relative flex h-svh flex-col justify-between overflow-hidden px-6 pb-8 pt-24 md:px-10 md:pb-10"
    >
      <div className="flex items-start justify-between gap-8">
        <p data-hero-fade className="text-label max-w-[16rem] text-bone-dim">
          Building production mobile apps in Kotlin and Flutter — shipped for real clients,
          on real deadlines.
        </p>
        <p data-hero-fade className="text-label hidden text-right text-bone-dim md:block">
          {profile.location}
          <br />
          Available for internships
        </p>
      </div>

      <h1 data-hero-name className="text-display -mx-1 origin-center">
        {NAME_LINES.map((line, i) => (
          <span key={line} className="block overflow-hidden">
            <span data-hero-word className="block px-1">
              {i === 2 ? (
                <>
                  {line}
                  <span className="text-accent">.</span>
                </>
              ) : (
                line
              )}
            </span>
          </span>
        ))}
      </h1>

      <div className="flex flex-wrap items-end justify-between gap-6">
        <div data-hero-fade className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="text-label text-bone">Open to work</span>
        </div>
        <span data-hero-fade className="text-label text-bone-dim">
          Scroll <span className="text-accent">↓</span>
        </span>
      </div>

      <div
        data-hero-scrim
        className="pointer-events-none absolute inset-0 bg-ink opacity-0"
        aria-hidden="true"
      />
    </section>
  )
}
