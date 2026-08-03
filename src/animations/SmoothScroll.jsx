import { useRef } from 'react'
import { ReactLenis } from 'lenis/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useMotionEnabled } from './MotionContext'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null)
  const motionEnabled = useMotionEnabled()

  useGSAP(
    () => {
      if (!motionEnabled) return

      // GSAP's ticker reports seconds; Lenis wants milliseconds.
      const update = (time) => lenisRef.current?.lenis?.raf(time * 1000)

      lenisRef.current?.lenis?.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(update)
      // Without this GSAP "catches up" after a dropped frame and desyncs.
      gsap.ticker.lagSmoothing(0)
      // Mobile URL-bar collapse changes svh, and all three pinned sections are
      // sized in svh — without this every such resize recomputes pins mid-scroll.
      ScrollTrigger.config({ ignoreMobileResize: true })
      ScrollTrigger.refresh()

      return () => {
        gsap.ticker.remove(update)
        gsap.ticker.lagSmoothing(500, 33)
      }
    },
    { dependencies: [motionEnabled], revertOnUpdate: true },
  )

  // A CSS media query can't stop JS-driven smoothing, so bypass the wrapper.
  if (!motionEnabled) return children

  return (
    <ReactLenis root ref={lenisRef} options={{ autoRaf: false, duration: 1.1 }}>
      {children}
    </ReactLenis>
  )
}
