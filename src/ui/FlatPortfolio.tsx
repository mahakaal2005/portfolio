import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { profile } from '@/content'
import { Hero } from './Hero'
import { Mark } from './Mark'
import { Work } from './Work'
import { Cursor } from './Cursor'
import { Splash } from './Splash'
import { EASE_OUT_EXPO } from './motion'
import {
  About,
  Achievements,
  Capabilities,
  ClosingCTA,
  ProblemSolving,
  ProofStrip,
} from './Sections'
import { SkillsCards } from './SkillsCards'

/**
 * The page.
 *
 * Section order follows the reference's logic — establish, prove, show work,
 * explain capability, introduce yourself, close — because that order is doing
 * real work: it answers "can you build?" before "who are you?", which is the
 * order a recruiter actually asks.
 *
 * What it does not follow is the reference's *content*. That site sells
 * freelance design and leans on client logos, testimonials and an FAQ. None of
 * those exist here, so those slots carry measured results, capabilities and
 * competitive record instead.
 */

/**
 * Transparent over the hero, backed once you leave it.
 *
 * A permanently transparent bar is only legible against the hero's dark
 * ground; scroll it over body copy and the two collide.
 */
function useScrolled(threshold = 80) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return scrolled
}

/**
 * The nav.
 *
 * Open across the hero, collapsed to a compact pill once you scroll past it,
 * and re-opening on hover. The collapse is what keeps a fixed bar from
 * competing with the page under it; the hover is what stops the collapse from
 * costing anything.
 *
 * `pinned` exists for touch: hover is not available there, so tapping the menu
 * button holds it open until it is tapped again. Without it the links would be
 * unreachable on a phone after the first scroll.
 */
function Nav() {
  const scrolled = useScrolled()
  const [hovered, setHovered] = useState(false)
  const [pinned, setPinned] = useState(false)

  const open = !scrolled || hovered || pinned

  // Collapsing under the pointer would trap it open; closing on scroll is the
  // expected behaviour once the user has moved on.
  useEffect(() => {
    if (!scrolled) setPinned(false)
  }, [scrolled])

  const links = [
    { label: 'Work', href: '#work' },
    { label: 'Stack', href: '#skills' },
    { label: 'About', href: '#about' },
  ]

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 md:top-6">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`flex items-center gap-1 rounded-[var(--radius-pill)] border backdrop-blur-2xl p-1.5 transition-all duration-500 md:gap-2 md:pl-4 ${
          scrolled
            ? 'border-white/20 bg-white/10 shadow-lg shadow-black/20'
            : 'border-white/15 bg-white/5 shadow-lg shadow-black/20'
        }`}
      >
        <a href="#top" className="flex items-center gap-2.5 px-2 no-underline md:px-0">
          <Mark size={40} className="text-accent" />
          <span className="hidden font-display text-sm font-medium text-fg sm:inline">
            {profile.name}
          </span>
        </a>

        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.nav
              key="links"
              aria-label="Sections"
              className="flex items-center gap-0.5 overflow-hidden"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              /* Slower than the default. At 0.4s the pill snapped open, which
                 read as a jump rather than a reveal. */
              transition={{ duration: 0.62, ease: EASE_OUT_EXPO }}
            >
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setPinned(false)}
                  className="whitespace-nowrap rounded-[var(--radius-pill)] px-3.5 py-2 font-display text-sm text-muted no-underline transition-colors hover:bg-white/5 hover:text-fg"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setPinned(false)}
                className="btn btn-accent"
              >
                Contact
              </a>
            </motion.nav>
          ) : (
            <motion.button
              key="menu"
              type="button"
              aria-label="Open menu"
              aria-expanded={false}
              onClick={() => setPinned(true)}
              className="flex h-9 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-pill)] text-fg transition-colors hover:bg-white/5"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '2.25rem' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
            >
              <span className="sr-only">Menu</span>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

export function FlatPortfolio() {
  const [showSplash, setShowSplash] = useState(true)

  return (
    <div className="min-h-screen bg-ink text-fg">
      <a href="#work" className="sr-only focus:not-sr-only">
        Skip to work
      </a>

      {showSplash && <Splash onComplete={() => setShowSplash(false)} />}

      {!showSplash && <Cursor />}
      {!showSplash && <Nav />}

      {/* Softens the bottom edge of the viewport so content dissolves into the
          page rather than being cut off by it. Fixed, so it applies wherever
          the reader happens to be. */}
      <div className="edge-blur-bottom" aria-hidden="true" />

      <main>
        <Hero />
        <ProofStrip />

        <Work />

        <Capabilities />
        <About />
        <SkillsCards />
        <ProblemSolving />
        <Achievements />
        <ClosingCTA />
      </main>

    </div>
  )
}
