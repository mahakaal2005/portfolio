import { useEffect, useRef, useState } from 'react'

/**
 * The trailing cursor dot.
 *
 * A small accent disc that follows the pointer with a little lag, so it drifts
 * into place rather than being welded to the tip. The lag is the entire effect
 * — a dot pinned exactly to the cursor position just looks like a broken
 * cursor.
 *
 * Deliberately additive: the real cursor is left alone. Hiding it in favour of
 * a custom one means text no longer shows an I-beam and links no longer show a
 * pointer, which trades a working affordance for decoration.
 *
 * Mounted only for fine pointers with motion enabled. On touch there is no
 * pointer to follow, and under reduced-motion a lagging element chasing the
 * cursor is exactly what the setting is asking to be spared.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)')
    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    const decide = () => setEnabled(fine.matches && !still.matches)
    decide()
    fine.addEventListener('change', decide)
    still.addEventListener('change', decide)
    return () => {
      fine.removeEventListener('change', decide)
      still.removeEventListener('change', decide)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return
    const el = dot.current
    if (!el) return

    // Target is written by the pointer event; current is eased toward it on a
    // rAF loop. Animating transform directly on every pointermove would run at
    // the input's rate rather than the display's and would skip the easing.
    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight / 2
    let x = targetX
    let y = targetY
    let raf = 0
    let seen = false

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX
      targetY = event.clientY
      if (!seen) {
        seen = true
        // Jump to the first known position rather than gliding in from the
        // middle of the screen.
        x = targetX
        y = targetY
        el.style.opacity = '1'
      }
    }

    const onLeave = () => {
      el.style.opacity = '0'
    }
    const onEnter = () => {
      if (seen) el.style.opacity = '1'
    }

    const tick = () => {
      // Exponential smoothing. 0.18 trails visibly without feeling sluggish.
      x += (targetX - x) * 0.18
      y += (targetY - y) * 0.18
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('pointerenter', onEnter)
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('pointerenter', onEnter)
      cancelAnimationFrame(raf)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[70] h-4 w-4 rounded-full bg-accent opacity-0 transition-opacity duration-300 mix-blend-normal"
    />
  )
}
