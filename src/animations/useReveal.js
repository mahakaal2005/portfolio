import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import { useMotionEnabled } from './MotionContext'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

/**
 * Scroll-triggered line reveal. Targets `selector` within `scope`.
 * `scrub` ties progress to the scrollbar instead of firing once.
 */
export function useReveal(scope, selector = '[data-reveal]', options = {}) {
  const motionEnabled = useMotionEnabled()
  const { stagger = 0.08, scrub = false, start = 'top 85%', y = 110 } = options

  useGSAP(
    () => {
      const targets = gsap.utils.toArray(selector, scope.current)
      if (!targets.length) return

      if (!motionEnabled) {
        gsap.set(targets, { autoAlpha: 1, clearProps: 'transform' })
        return
      }

      const splits = []

      // Fonts must be settled before measuring lines, or the split is wrong.
      document.fonts.ready.then(() => {
        targets.forEach((el) => {
          splits.push(
            SplitText.create(el, {
              type: 'lines',
              mask: 'lines',
              autoSplit: true,
              linesClass: 'split-line',
              // Build the tween in here and RETURN it — animations created
              // outside onSplit target elements that autoSplit later discards.
              onSplit(self) {
                return gsap.from(self.lines, {
                  yPercent: y,
                  autoAlpha: 0,
                  duration: 1,
                  stagger,
                  ease: 'expo.out',
                  scrollTrigger: {
                    trigger: el,
                    start,
                    end: scrub ? 'bottom 60%' : undefined,
                    scrub: scrub ? 1 : false,
                  },
                })
              },
            }),
          )
        })
        ScrollTrigger.refresh()
      })

      return () => splits.forEach((s) => s.revert())
    },
    { scope, dependencies: [motionEnabled], revertOnUpdate: true },
  )
}

/** Word-by-word scrubbed reveal — for the manifesto statement. */
export function useWordScrub(scope, selector, options = {}) {
  const motionEnabled = useMotionEnabled()
  const { start = 'top 75%', end = 'bottom 65%' } = options

  useGSAP(
    () => {
      const el = scope.current?.querySelector(selector)
      if (!el) return

      if (!motionEnabled) {
        gsap.set(el, { autoAlpha: 1 })
        return
      }

      let split
      document.fonts.ready.then(() => {
        split = SplitText.create(el, {
          type: 'words',
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.words, {
              autoAlpha: 0.12,
              stagger: 0.5,
              ease: 'none',
              scrollTrigger: { trigger: el, start, end, scrub: true },
            })
          },
        })
        ScrollTrigger.refresh()
      })

      return () => split?.revert()
    },
    { scope, dependencies: [motionEnabled], revertOnUpdate: true },
  )
}
