import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { projects, type Project } from '@/content'
import { EASE_OUT_EXPO, Reveal, Stagger, StaggerItem, useMotionSafe } from './motion'
import { TechPattern } from './TechPattern'

/**
 * Selected work.
 *
 * A grid of project cards; clicking one slides a full case study up from the
 * bottom of the screen.
 *
 * The detail is an overlay rather than a route. There is nothing else on this
 * site to route to, and an overlay keeps the reader's scroll position in the
 * grid — so closing one project puts them back where they were rather than at
 * the top of the page hunting for their place.
 */

const WRAP = 'mx-auto w-full max-w-6xl px-6 md:px-10'

/* ------------------------------------------------------------------ *
 * Detail view
 * ------------------------------------------------------------------ */

function StudySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-14 md:mt-20">
      <h3 className="t-display mb-5 text-fg">{title}</h3>
      {children}
    </section>
  )
}

function ProjectDetail({ project, onClose }: { project: Project; onClose: () => void }) {
  const animate = useMotionSafe()
  const study = project.study

  /*
    Three things a full-screen overlay has to get right, none of which come
    free: the page behind it must not scroll, Escape must close it, and focus
    must not be left behind in the grid underneath.
  */
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} case study`}
      className="fixed inset-0 z-[60] overflow-y-auto overscroll-contain bg-ink"
      initial={animate ? { y: '100%' } : false}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
    >
      {/* Close control travels with the overlay rather than the content, so it
          is reachable at any scroll depth in a long case study. */}
      <div className="sticky top-0 z-10 flex justify-end bg-gradient-to-b from-ink via-ink/85 to-transparent px-6 pb-10 pt-5 md:px-10">
        <button
          type="button"
          onClick={onClose}
          autoFocus
          className="flex items-center gap-2 rounded-[var(--radius-pill)] border border-line bg-surface/90 px-4 py-2.5 text-sm text-fg backdrop-blur-xl transition-colors hover:border-accent hover:text-accent-text"
        >
          Close
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <div className={`${WRAP} pb-32`}>
        <h2 className="t-display max-w-4xl text-fg">{study?.headline ?? project.title}</h2>

        <dl className="mt-10 flex flex-wrap gap-x-14 gap-y-4">
          <div className="flex items-baseline gap-3">
            <dt className="t-body text-sm">Client</dt>
            <dd className="text-fg">{study?.client ?? project.title}</dd>
          </div>
          {project.period && (
            <div className="flex items-baseline gap-3">
              <dt className="t-body text-sm">Year</dt>
              <dd className="text-fg">{project.period}</dd>
            </div>
          )}
          <div className="flex items-baseline gap-3">
            <dt className="t-body text-sm">Result</dt>
            <dd className="text-accent-text">
              {project.metric.value} {project.metric.label}
            </dd>
          </div>
        </dl>

        <p className="t-lead mt-10 max-w-3xl">{project.description}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noreferrer noopener"
              className="btn btn-accent"
            >
              {/* Two of these ship to Google Play rather than to a URL someone
                  visits, and "the live site" is simply wrong for an app
                  listing. The destination decides the verb. */}
              {project.links.live.includes('play.google.com')
                ? 'Get it on Google Play'
                : 'Visit the live site'}
            </a>
          )}
          {project.links.repo && (
            <a
              href={project.links.repo}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] px-4 py-3 font-display text-sm font-medium text-fg bg-surface hover:bg-surface-2 transition-colors no-underline"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              View source
            </a>
          )}
        </div>

        {project.image && (
          <img
            src={project.image}
            alt={`${project.title} — a screenshot of the shipped project`}
            loading="lazy"
            className="mt-14 w-full rounded-[var(--radius-lg)] border border-line"
          />
        )}

        {study && (
          <>
            <StudySection title="Objective">
              <p className="t-lead max-w-3xl">{study.objective}</p>
            </StudySection>

            <StudySection title="The goal">
              <p className="t-lead max-w-3xl">{study.goal}</p>
            </StudySection>

            <StudySection title="Target audience">
              <p className="t-lead max-w-3xl">{study.audience}</p>
            </StudySection>

            <StudySection title="Design direction">
              <div className="max-w-3xl space-y-5">
                {study.direction.map((para) => (
                  <p key={para.slice(0, 24)} className="t-lead">
                    {para}
                  </p>
                ))}
              </div>
            </StudySection>

            <StudySection title="Scope of work">
              <ul className="flex flex-wrap gap-2.5">
                {study.scope.map((item) => (
                  <li
                    key={item}
                    className="rounded-[var(--radius-pill)] border border-line px-4 py-2 text-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </StudySection>

            {study.gallery && study.gallery.length > 0 && (
              <div className="mt-14 grid gap-5 sm:grid-cols-2">
                {study.gallery.map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    loading="lazy"
                    className="w-full rounded-[var(--radius-lg)] border border-line"
                  />
                ))}
              </div>
            )}
          </>
        )}

        <div className="mt-20 flex flex-wrap gap-3">
          <button type="button" onClick={onClose} className="btn btn-ghost">
            Back to work
          </button>
        </div>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ *
 * Grid
 * ------------------------------------------------------------------ */

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const openable = Boolean(project.study)

  return (
    <StaggerItem as="article" className="group">
      <button
        type="button"
        onClick={openable ? onOpen : undefined}
        aria-label={openable ? `Open the ${project.title} case study` : undefined}
        disabled={!openable}
        className="block w-full overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface text-left transition-colors enabled:hover:border-accent/60 disabled:cursor-default"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-white">
          {project.image ? (
            <img
              src={project.image}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover object-top transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
              style={{ filter: 'brightness(0.92) saturate(0.94)' }}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-surface-2">
              <span className="t-label text-muted-2">No preview</span>
            </div>
          )}

          {/* The headline number, on every card rather than one hardcoded id.
              It is the field most likely to be read and least likely to be
              reached — putting it on the image means it survives a scroll that
              never opens the case study. */}
          <div
            className="absolute max-w-[calc(100%-30px)] rounded-full bg-accent/90 px-3 py-2 backdrop-blur-sm"
            style={{ top: '15px', right: '15px' }}
          >
            {/* Clipped rather than wrapped: a two-line pill stops reading as a
                badge, and the value is the half that matters anyway. */}
            <p className="truncate text-sm font-medium text-white">
              {project.metric.value} {project.metric.label}
            </p>
          </div>
        </div>
      </button>

      <div className="mt-5 flex items-start justify-between gap-6">
        <div>
          <h3 className="t-h2 text-fg">{project.title}</h3>
          <p className="t-body mt-1 text-sm">{project.pitch}</p>
        </div>

        {openable && (
          <button
            type="button"
            onClick={onOpen}
            className="flex shrink-0 items-center gap-2 whitespace-nowrap text-sm text-muted transition-colors hover:text-accent-text"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17L17 7M9 7h8v8" />
            </svg>
            View Project
          </button>
        )}
      </div>
    </StaggerItem>
  )
}

export function Work() {
  const [openId, setOpenId] = useState<string | null>(null)
  const open = projects.find((p) => p.id === openId) ?? null

  return (
    <section id="work" className="py-24 md:py-32 relative overflow-hidden">
      <TechPattern />
      <div className={`${WRAP} relative z-10`}>
        <Reveal className="mb-12 md:mb-16">
          <h2 className="t-display max-w-3xl text-fg">
            Latest <span className="text-accent">Projects</span>
          </h2>
        </Reveal>

        <Stagger className="grid gap-x-6 gap-y-14 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpen={() => setOpenId(project.id)}
            />
          ))}
        </Stagger>
      </div>

      <AnimatePresence>
        {open && <ProjectDetail key={open.id} project={open} onClose={() => setOpenId(null)} />}
      </AnimatePresence>
    </section>
  )
}
