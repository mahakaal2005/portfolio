import { useLenis } from 'lenis/react'
import { useMotion } from '../animations/MotionContext'
import { profile } from '../data/content'

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]

export default function Nav() {
  const lenis = useLenis()
  const { enabled, setEnabled } = useMotion()

  const goTo = (e, id) => {
    e.preventDefault()
    const target = document.getElementById(id)
    if (!target) return
    // Lenis owns the scroll position; native scrollIntoView fights it.
    if (lenis) lenis.scrollTo(target, { offset: 0 })
    else target.scrollIntoView({ behavior: 'auto' })
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 mix-blend-difference md:px-10">
      <a
        href="#top"
        onClick={(e) => goTo(e, 'top')}
        className="text-label text-bone transition-colors hover:text-accent"
      >
        {profile.name}
      </a>

      <nav className="flex items-center gap-5 md:gap-8">
        <ul className="hidden gap-5 md:flex md:gap-8">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={(e) => goTo(e, s.id)}
                className="text-label text-bone transition-colors hover:text-accent"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setEnabled(!enabled)}
          aria-pressed={!enabled}
          className="text-label rounded-full border border-line px-3 py-1.5 text-bone transition-colors hover:border-accent hover:text-accent"
        >
          Motion {enabled ? 'on' : 'off'}
        </button>
      </nav>
    </header>
  )
}
