import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useMotionEnabled } from '../animations/MotionContext'

gsap.registerPlugin(useGSAP)

export default function Preloader({ onComplete }) {
  const root = useRef(null)
  const counter = useRef({ value: 0 })
  const [count, setCount] = useState(0)
  const motionEnabled = useMotionEnabled()

  useGSAP(
    () => {
      if (!motionEnabled) {
        onComplete()
        gsap.set(root.current, { display: 'none' })
        return
      }

      const tl = gsap.timeline({ onComplete })

      tl.to(counter.current, {
        value: 100,
        duration: 2.2,
        ease: 'power2.inOut',
        onUpdate: () => setCount(Math.round(counter.current.value)),
      })
        .to('[data-preloader-bar]', { scaleX: 1, duration: 2.2, ease: 'power2.inOut' }, 0)
        .to('[data-preloader-meta]', { autoAlpha: 0, duration: 0.4 }, '-=0.2')
        // Curtain splits upward, revealing the hero already settled beneath it.
        .to('[data-preloader-panel]', {
          yPercent: -100,
          duration: 1.1,
          ease: 'expo.inOut',
          stagger: 0.08,
        })
        .set(root.current, { display: 'none' })
    },
    { scope: root, dependencies: [motionEnabled] },
  )

  return (
    <div ref={root} className="fixed inset-0 z-[100]" aria-hidden="true">
      <div className="absolute inset-0 flex">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} data-preloader-panel className="h-full flex-1 bg-void" />
        ))}
      </div>

      <div
        data-preloader-meta
        className="relative flex h-full flex-col justify-between p-6 md:p-10"
      >
        <span className="text-label text-bone-dim">Atul Kumar Singh</span>

        <div className="flex items-end justify-between gap-8">
          <span className="text-display text-bone tabular-nums">{count}</span>
          <span className="text-label mb-3 text-accent">Android · Flutter</span>
        </div>

        <div className="h-px w-full origin-left bg-line">
          <div data-preloader-bar className="h-full w-full origin-left scale-x-0 bg-accent" />
        </div>
      </div>
    </div>
  )
}
