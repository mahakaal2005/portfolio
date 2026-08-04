import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import { useMotionEnabled } from '../animations/MotionContext'
import { profile } from '../data/content'
import portrait from '../assets/portrait.webp'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

const NAME_LINES = ['ATUL', 'KUMAR', 'SINGH']

export default function Hero({ ready }) {
  const root = useRef(null)
  const motionEnabled = useMotionEnabled()

  useGSAP(
    () => {
      if (!motionEnabled) {
        gsap.set('[data-hero-fade], [data-hero-word]', { autoAlpha: 1, yPercent: 0 })
        gsap.set('[data-hero-portrait]', { autoAlpha: 1, clearProps: 'transform' })
        return
      }

      gsap.set('[data-hero-word]', { yPercent: 115 })
      gsap.set('[data-hero-fade]', { autoAlpha: 0, y: 24 })
      gsap.set('[data-hero-portrait]', { autoAlpha: 0, yPercent: 8, scale: 1.06 })

      if (!ready) return

      const intro = gsap.timeline({ delay: 0.15 })
      intro
        .to('[data-hero-word]', {
          yPercent: 0,
          duration: 1.3,
          ease: 'expo.out',
          stagger: 0.09,
        })
        // Lands behind the name rather than with it — the type reads first.
        .to(
          '[data-hero-portrait]',
          { autoAlpha: 1, yPercent: 0, scale: 1, duration: 1.6, ease: 'expo.out' },
          '-=1.05',
        )
        .to(
          '[data-hero-fade]',
          { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08 },
          '-=1.25',
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
        // Drifts down as the name lifts, so the pin has counter-motion instead of
        // everything sliding the same direction at once. Held past the halfway point
        // — fading it on the same curve as the name empties the pin too early.
        .to('[data-hero-portrait]', { yPercent: 10, ease: 'none' }, 0)
        .to('[data-hero-portrait]', { autoAlpha: 0, ease: 'none' }, 0.55)
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
      <div
        data-hero-portrait
        className="pointer-events-none absolute bottom-0 right-0 hidden h-[82%] w-[46vw] max-w-[34rem] md:block lg:w-[40vw]"
      >
        <img
          src={portrait}
          alt={`${profile.name}, portrait`}
          width="672"
          height="1280"
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover object-[50%_top]"
        />
        {/* Fades live here rather than baked into the asset: object-cover crops the
            source, so a baked edge would be cut off before it ever reaches the frame. */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/55 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink to-transparent" />
        <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-ink to-transparent" />
      </div>

      <div className="relative flex items-start justify-between gap-8">
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

      <h1 data-hero-name className="text-display relative z-10 -mx-1 origin-center">
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

      <div className="relative z-10 flex flex-wrap items-end justify-between gap-6">
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
