import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useMotionEnabled } from '../animations/MotionContext'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export default function ProgressBar() {
  const bar = useRef(null)
  const motionEnabled = useMotionEnabled()

  useGSAP(
    () => {
      if (!motionEnabled) return

      const trigger = ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => gsap.set(bar.current, { scaleX: self.progress }),
      })

      return () => trigger.kill()
    },
    { dependencies: [motionEnabled], revertOnUpdate: true },
  )

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent" aria-hidden="true">
      <div ref={bar} className="h-full origin-left scale-x-0 bg-accent" />
    </div>
  )
}
