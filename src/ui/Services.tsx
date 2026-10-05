import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { EASE_OUT_EXPO } from './motion'

interface ServiceCard {
  id: string
  title: string
  description: string
  skills: string[]
}

const services: ServiceCard[] = [
  {
    id: 'research',
    title: 'Idea & Research',
    description: 'Understanding the problem, gathering requirements, planning architecture.',
    skills: ['Requirement Analysis', 'Research', 'Architecture', 'Wireframing', 'Planning'],
  },
  {
    id: 'frontend',
    title: 'Frontend Development',
    description: 'Building responsive, accessible interfaces with modern React patterns and performance optimization.',
    skills: ['React', 'Next.js', 'Tailwind', 'TypeScript', 'Framer Motion', 'Accessibility'],
  },
  {
    id: 'backend',
    title: 'Backend Engineering',
    description: 'Designing scalable APIs, database schemas, and server architecture for production systems.',
    skills: ['Node.js', 'Express', 'REST APIs', 'Authentication', 'Prisma', 'PostgreSQL'],
  },
  {
    id: 'ai',
    title: 'AI Engineering',
    description: 'Integrating LLMs, building AI agents, and creating intelligent features that add real value.',
    skills: ['OpenAI', 'Claude', 'Gemini', 'LangChain', 'RAG', 'Embeddings', 'AI Agents'],
  },
  {
    id: 'cloud',
    title: 'Cloud & Deployment',
    description: 'Infrastructure as code, containerization, and CI/CD pipelines for reliable deployments.',
    skills: ['AWS', 'Docker', 'S3', 'Lambda', 'CloudFront', 'CI/CD', 'Vercel'],
  },
  {
    id: 'optimization',
    title: 'Optimization',
    description: 'Performance tuning, SEO, monitoring, and security hardening for production resilience.',
    skills: ['Performance', 'SEO', 'Caching', 'Analytics', 'Monitoring', 'Security'],
  },
]

const springConfig = {
  type: 'spring',
  stiffness: 120,
  damping: 18,
  mass: 0.8,
} as const

function ServiceCardComponent({
  card,
  index,
  activeIndex,
  scrollProgress,
}: {
  card: ServiceCard
  index: number
  activeIndex: number
  scrollProgress: number
}) {
  const isActive = activeIndex === index
  const isBefore = index < activeIndex
  const isAfter = index > activeIndex

  let yOffset = 0
  let scale = 0.95
  let rotationZ = 0
  let opacity = 0.5
  let blur = 4

  if (isActive) {
    yOffset = 0
    scale = 1
    rotationZ = 0
    opacity = 1
    blur = 0
  } else if (isBefore) {
    const offset = activeIndex - index
    yOffset = -40 * offset
    scale = 0.95 - offset * 0.01
    rotationZ = 0
    opacity = Math.max(0.3, 1 - offset * 0.2)
    blur = 4 * offset
  } else if (isAfter) {
    const offset = index - activeIndex
    yOffset = 40 * offset + scrollProgress * 40
    scale = 0.95 - offset * 0.01
    rotationZ = 0
    opacity = Math.max(0.3, 1 - offset * 0.2)
    blur = 4 * offset
  }

  return (
    <motion.div
      className="absolute inset-x-0 mx-auto w-full max-w-2xl"
      animate={{
        y: yOffset,
        scale,
        rotateZ: rotationZ,
        opacity,
      }}
      transition={springConfig}
      style={{
        zIndex: isActive ? 50 : 40 - Math.abs(index - activeIndex),
        filter: `blur(${blur}px)`,
      }}
    >
      <motion.div
        className="group rounded-3xl border border-white/10 bg-surface/40 backdrop-blur-xl p-8 md:p-12 cursor-pointer transition-all duration-300 hover:border-white/20"
        whileHover={isActive ? { y: -8 } : {}}
        animate={{
          boxShadow: isActive
            ? '0 25px 50px -12px rgba(234, 0, 68, 0.3)'
            : '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
        }}
        transition={springConfig}
      >
        {/* Icon/Number */}
        <motion.div
          className="mb-6 inline-flex items-center justify-center h-12 w-12 rounded-xl bg-accent/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ delay: isActive ? 0.1 : 0, duration: 0.6 }}
        >
          <span className="text-lg font-bold text-accent">{String(index + 1).padStart(2, '0')}</span>
        </motion.div>

        {/* Title */}
        <motion.h3
          className="text-3xl md:text-4xl font-bold text-fg mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isActive ? 1 : 0.7, y: 0 }}
          transition={{
            delay: isActive ? 0.15 : 0,
            duration: 0.6,
            ease: EASE_OUT_EXPO,
          }}
        >
          {card.title}
        </motion.h3>

        {/* Description */}
        <motion.p
          className="text-lg text-muted mb-8 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0.5 }}
          transition={{ delay: isActive ? 0.2 : 0, duration: 0.6 }}
        >
          {card.description}
        </motion.p>

        {/* Skills */}
        <motion.ul className="flex flex-wrap gap-3">
          {card.skills.map((skill, i) => (
            <motion.li
              key={skill}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isActive ? 1 : 0.6, scale: 1 }}
              transition={{
                delay: isActive ? 0.25 + i * 0.06 : 0,
                duration: 0.5,
              }}
              whileHover={isActive ? { scale: 1.04 } : {}}
              className="px-4 py-2 rounded-full border border-white/20 text-sm text-fg group-hover:border-accent/50 transition-colors"
            >
              {skill}
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </motion.div>
  )
}

export function Services() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const rect = container.getBoundingClientRect()
      const containerTop = rect.top
      const viewportCenter = window.innerHeight / 2

      // Calculate which card should be active based on scroll
      const scrollIntoView = Math.max(0, viewportCenter - containerTop)
      const cardHeight = window.innerHeight * 0.6 // approximate card height in viewport
      const index = Math.min(
        services.length - 1,
        Math.max(0, Math.floor(scrollIntoView / cardHeight))
      )

      setActiveIndex(index)

      // Calculate scroll progress within current card (0 to 1)
      const progress = (scrollIntoView % cardHeight) / cardHeight
      setScrollProgress(Math.min(1, Math.max(0, progress)))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section ref={containerRef} className="relative bg-ink py-24">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-accent/5 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        {/* Header */}
        <motion.div
          className="mb-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
        >
          <h2 className="t-display text-fg mb-4">
            My <span className="text-accent">Engineering Workflow</span>
          </h2>
          <p className="t-lead max-w-2xl mx-auto">
            From ideation to production, here's how I approach building software that scales.
          </p>
        </motion.div>

        {/* Sticky Cards Container */}
        <div className="sticky top-1/2 -translate-y-1/2 h-screen flex items-center justify-center overflow-hidden">
          <div className="relative w-full max-w-2xl mx-auto" style={{ height: '500px' }}>
            {services.map((card, index) => (
              <ServiceCardComponent
                key={card.id}
                card={card}
                index={index}
                activeIndex={activeIndex}
                scrollProgress={scrollProgress}
              />
            ))}
          </div>
        </div>

        {/* Scroll Spacer */}
        <div className="h-[200vh] pointer-events-none" />
      </div>
    </section>
  )
}
