import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const MotionContext = createContext({ enabled: true, setEnabled: () => {} })

export const useMotion = () => useContext(MotionContext)
export const useMotionEnabled = () => useContext(MotionContext).enabled

export function MotionProvider({ children }) {
  const [enabled, setEnabled] = useState(
    () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setEnabled(!mq.matches)
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.motion = enabled ? 'on' : 'off'
  }, [enabled])

  const value = useMemo(() => ({ enabled, setEnabled }), [enabled])

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
}
