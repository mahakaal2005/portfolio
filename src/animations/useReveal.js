import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import { useMotionEnabled } from './MotionContext'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

let refreshQueued = 0

/**
 * Splits are created asynchronously after fonts settle, so several hooks each
 * want a refresh at roughly the same moment. Coalesce them — a refresh landing
 * mid-scroll recalculates every pin and shows up as a jump.
 */
function queueRefresh() {
  clearTimeout(refreshQueued)
  refreshQueued = setTimeout(() => ScrollTrigger.refresh(), 120)
}

/**
 * Scroll-triggered line reveal. Targets `selector` within `scope`.
 * `scrub` ties progress to the scrollbar instead of firing once.
 */
export function useReveal(scope, selector = '[data-reveal]', options = {}) {
  const motionEnabled = useMotionEnabled()
  const { stagger = 0.08, scrub = false, start = 'top 85%', y = 110 } = options

  useGSAP(
    (context) => {
      const targets = gsap.utils.toArray(selector, scope.current)
      if (!targets.length) return

      if (!motionEnabled) {
        gsap.set(targets, { autoAlpha: 1, clearProps: 'transform' })
        return
      }

      const splits = []
      let cancelled = false

      // Fonts must be settled before measuring lines, or the split is wrong.
      document.fonts.ready.then(() => {
        if (cancelled) return

        // context.add registers everything created inside with the gsap context,
        // so these triggers die with the hook. Without it they outlive it and a
        // motion toggle leaves two tweens fighting over the same nodes.
        context.add(() => {
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
        })
        queueRefresh()
      })

      return () => {
        cancelled = true
        splits.forEach((s) => s.revert())
      }
    },
    { scope, dependencies: [motionEnabled], revertOnUpdate: true },
  )
}

/** Word-by-word scrubbed reveal — for the manifesto statement. */
export function useWordScrub(scope, selector, options = {}) {
  const motionEnabled = useMotionEnabled()
  const { start = 'top 80%', end = 'bottom 55%', stagger = 0.12 } = options

  useGSAP(
    (context) => {
      const el = scope.current?.querySelector(selector)
      if (!el) return

      if (!motionEnabled) {
        gsap.set(el, { autoAlpha: 1 })
        return
      }

      let split
      let cancelled = false

      document.fonts.ready.then(() => {
        if (cancelled) return

        context.add(() => {
          split = SplitText.create(el, {
            type: 'words',
            autoSplit: true,
            onSplit(self) {
              return gsap.from(self.words, {
                autoAlpha: 0.12,
                stagger,
                ease: 'none',
                scrollTrigger: { trigger: el, start, end, scrub: true },
              })
            },
          })
        })
        queueRefresh()
      })

      return () => {
        cancelled = true
        split?.revert()
      }
    },
    { scope, dependencies: [motionEnabled], revertOnUpdate: true },
  )
}
