import { useRef } from 'react'
import { useWordScrub } from '../animations/useReveal'
import { manifesto } from '../data/content'

export default function Manifesto() {
  const root = useRef(null)
  useWordScrub(root, '[data-manifesto]')

  return (
    <section
      ref={root}
      id="about"
      className="relative flex min-h-svh items-center px-6 py-32 md:px-10 md:py-48"
    >
      <div className="w-full max-w-6xl">
        <span className="text-label mb-12 block text-accent">[ 01 — What I do ]</span>
        <p
          data-manifesto
          className="text-[clamp(1.75rem,4.5vw,4rem)] font-medium leading-[1.08] tracking-[-0.03em]"
        >
          {manifesto}
        </p>
      </div>
    </section>
  )
}
