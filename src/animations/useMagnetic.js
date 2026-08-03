import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useMotionEnabled } from './MotionContext'

gsap.registerPlugin(useGSAP)

/**
 * Magnetic pointer attraction. Spread the returned props onto the element.
 * Desktop pointers only — on touch there's no hover to attract toward.
 */
export function useMagnetic(strength = 0.35) {
  const ref = useRef(null)
  const motionEnabled = useMotionEnabled()

  const { contextSafe } = useGSAP({ scope: ref })

  const onMove = contextSafe((e) => {
    if (!motionEnabled || !ref.current) return
    if (!window.matchMedia('(hover: hover)').matches) return

    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - (rect.left + rect.width / 2)
    const y = e.clientY - (rect.top + rect.height / 2)

    gsap.to(ref.current, {
      x: x * strength,
      y: y * strength,
      duration: 0.7,
      ease: 'power3.out',
    })
  })

  const onLeave = contextSafe(() => {
    if (!ref.current) return
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.9,
      ease: 'elastic.out(1, 0.4)',
    })
  })

  return { ref, onPointerMove: onMove, onPointerLeave: onLeave }
}
