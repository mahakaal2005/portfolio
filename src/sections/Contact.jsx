import { useEffect, useRef, useState } from 'react'
import { useMagnetic } from '../animations/useMagnetic'
import { useReveal } from '../animations/useReveal'
import { profile } from '../data/content'

const LINKS = [
  { label: 'GitHub', href: profile.github },
  { label: 'LinkedIn', href: profile.linkedin },
  { label: 'Email', href: `mailto:${profile.email}` },
]

function useISTClock() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }).format(new Date()),
      )
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return time
}

export default function Contact() {
  const root = useRef(null)
  const time = useISTClock()
  const magnetic = useMagnetic(0.3)
  useReveal(root, '[data-reveal]')

  return (
    <section
      ref={root}
      id="contact"
      className="relative flex min-h-svh flex-col justify-between px-6 pb-8 pt-32 md:px-10 md:pb-10"
    >
      <div>
        <span className="text-label text-accent">[ 04 — Get in touch ]</span>

        <h2 data-reveal className="text-display mt-10 max-w-5xl">
          Let&apos;s build something worth shipping<span className="text-accent">.</span>
        </h2>

        <p data-reveal className="mt-8 max-w-lg text-lg text-bone-dim md:text-xl">
          Open to internships and freelance mobile work. Fastest way to reach me is
          email — I reply within a day.
        </p>

        <a
          {...magnetic}
          href={`mailto:${profile.email}`}
          className="mt-12 inline-flex items-center gap-4 rounded-full border border-accent px-8 py-4 font-mono text-sm text-accent transition-colors hover:bg-accent hover:text-void md:px-10 md:py-5 md:text-base"
        >
          {profile.email}
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      <footer className="mt-24 flex flex-col gap-8 border-t border-line pt-8">
        <nav className="flex flex-wrap gap-x-8 gap-y-3">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noreferrer"
              className="text-label text-bone transition-colors hover:text-accent"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="text-label text-bone-dim">
            {profile.location} — {time} IST
          </span>
          <span className="text-label text-bone-dim">
            © {new Date().getFullYear()} {profile.name}
          </span>
        </div>
      </footer>
    </section>
  )
}
