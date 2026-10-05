import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { profile } from '@/content'
import { EASE_OUT_EXPO, useMotionSafe } from './motion'

/**
 * The hero.
 *
 * Two stacked words at poster scale with the avatar standing in front of them,
 * breaking the line of the letters. The occlusion is the entire effect — the
 * same layout with the figure beside the type is an ordinary two-column hero.
 *
 * It only works because the avatar is a genuine cut-out. An opaque rectangle
 * paints over whatever sits behind it, which is why the earlier photograph
 * could never be layered this way.
 *
 * The word behind is `aria-hidden`: it is a graphic, and the same words are in
 * the h1 immediately below where a screen reader will meet them once.
 */
export function Hero() {
  const figure = useRef<HTMLDivElement>(null)
  const animate = useMotionSafe()
  const [first, second] = profile.heroWords

  // Pointer parallax, written to a custom property so the compositor keeps
  // ownership of the interpolation. Fine pointers only, and never under
  // reduced-motion.
  useEffect(() => {
    const el = figure.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const onMove = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth - 0.5
      const y = event.clientY / window.innerHeight - 0.5
      el.style.setProperty('--px', `${x * -20}px`)
      el.style.setProperty('--py', `${y * -12}px`)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden pt-28 pb-16"
    >
      {/* ── Masthead, behind the figure ──────────────────────────────── */}
      <div aria-hidden="true" className="pointer-events-none relative z-0 select-none px-6 md:px-10">
        <motion.p
          className="t-hero text-center text-fg"
          initial={animate ? { opacity: 0, y: 40 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.75, ease: EASE_OUT_EXPO }}
        >
          {first}
        </motion.p>
        <motion.p
          className="t-hero -mt-[0.06em] text-center text-accent"
          initial={animate ? { opacity: 0, y: 40 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.83, ease: EASE_OUT_EXPO }}
        >
          {second}
        </motion.p>
      </div>

      {/* ── Avatar, in front ─────────────────────────────────────────── */}
      {profile.heroCutout && (
        <motion.div
          ref={figure}
          className="pointer-events-none absolute inset-x-0 top-[13%] z-10 mx-auto flex justify-center"
          initial={animate ? { opacity: 0, y: 24 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0, ease: EASE_OUT_EXPO }}
        >
          <img
            src={profile.heroCutout}
            alt=""
            fetchPriority="high"
            width={1100}
            height={1322}
            className="h-auto w-[min(44vw,21rem)] transition-transform duration-500 ease-out"
            style={{
              transform: 'translate3d(var(--px, 0), var(--py, 0), 0)',
              // The cut-out was trimmed to its content bounds and the jacket
              // ran to the edge of the source frame, so it ends on a hard
              // horizontal line. Fading the last fifth dissolves it into the
              // page instead of stopping dead.
              maskImage: 'linear-gradient(to bottom, black 78%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 78%, transparent 100%)',
            }}
          />
        </motion.div>
      )}

      {/* ── Identity, in front of both ───────────────────────────────── */}
      <div className="relative z-20 mx-auto mt-10 w-full max-w-6xl px-6 md:mt-16 md:px-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          {/* max-w keeps this out from under the figure at every width. */}
          <motion.div
            initial={animate ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE_OUT_EXPO }}
          >
            <p className="font-display text-sm font-medium tracking-wider uppercase mb-3 text-muted-2">{profile.greeting}</p>
            <h1 className="t-h2 mb-4 text-fg">
              {profile.name}
              <span className="ml-3 font-normal text-muted">{profile.role}</span>
            </h1>
            <p className="t-lead max-w-sm">{profile.tagline}</p>
          </motion.div>

          <motion.div
            className="flex flex-wrap items-center gap-3"
            initial={animate ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: EASE_OUT_EXPO }}
          >
            <a href="#contact" className="btn btn-accent">
              Get in touch
            </a>
            <a href={profile.links.resume} className="btn btn-ghost">
              Resume
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
