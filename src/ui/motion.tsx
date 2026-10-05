import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

/**
 * Shared motion primitives.
 *
 * Every animated thing on the site goes through these, so the whole page moves
 * on one curve and one set of durations. Per-component easing is the fastest
 * way to make a site feel assembled from parts rather than designed.
 *
 * Timings, chosen to match the reference's feel:
 *   entrance  0.7s on expo-out — long enough to read as deliberate, short
 *             enough that a fast scroller never waits for it
 *   stagger   0.08s between siblings
 *   hover     0.22s, the shortest interval that still reads as a transition
 *
 * `useReducedMotion` is honoured here rather than in each caller: when it is
 * set, elements render at their final state with no transform at all. The CSS
 * fallback in index.css covers anything not driven by Framer.
 */

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

/** How far things travel on entrance. Small — this is a settle, not a slide. */
const RISE = 22

export function useMotionSafe() {
  return !useReducedMotion()
}

/* ------------------------------------------------------------------ *
 * Reveal — fade and rise once, when scrolled into view
 * ------------------------------------------------------------------ */

export function Reveal({
  children,
  delay = 0,
  className = '',
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'article' | 'header'
}) {
  const animate = useMotionSafe()
  const Tag = motion[as]

  return (
    <Tag
      className={className}
      initial={animate ? { opacity: 0, y: RISE } : false}
      whileInView={{ opacity: 1, y: 0 }}
      // `once` matters: re-animating on every pass makes a long page feel
      // twitchy when someone scrolls back up.
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.7, delay, ease: EASE_OUT_EXPO }}
    >
      {children}
    </Tag>
  )
}

/* ------------------------------------------------------------------ *
 * Stagger — a list whose children arrive in sequence
 * ------------------------------------------------------------------ */

const containerVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: RISE },
  shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT_EXPO } },
}

export function Stagger({
  children,
  className = '',
  as = 'div',
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'ul' | 'ol'
}) {
  const animate = useMotionSafe()
  const Tag = motion[as]

  return (
    <Tag
      className={className}
      variants={containerVariants}
      initial={animate ? 'hidden' : false}
      whileInView="shown"
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
    >
      {children}
    </Tag>
  )
}

export function StaggerItem({
  children,
  className = '',
  as = 'div',
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'li' | 'article'
}) {
  const Tag = motion[as]
  return (
    <Tag className={className} variants={itemVariants}>
      {children}
    </Tag>
  )
}

/* ------------------------------------------------------------------ *
 * Hover lift — the one interactive gesture, used on every card
 * ------------------------------------------------------------------ */

export const hoverLift = {
  whileHover: { y: -6, transition: { duration: 0.22, ease: EASE_OUT_EXPO } },
  whileTap: { y: -2, transition: { duration: 0.1 } },
}
