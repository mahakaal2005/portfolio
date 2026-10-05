import { useState } from 'react'
import { motion } from 'framer-motion'
import { EASE_OUT_EXPO } from './motion'

interface SkillNode {
  id: string
  name: string
  level: 'core' | 'secondary' | 'supporting'
  connected: string[]
}

const skillNodes: SkillNode[] = [
  {
    id: 'react',
    name: 'React',
    level: 'core',
    connected: ['nextjs', 'framer', 'typescript'],
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    level: 'core',
    connected: ['react', 'tailwind', 'typescript'],
  },
  {
    id: 'tailwind',
    name: 'Tailwind',
    level: 'core',
    connected: ['nextjs', 'react'],
  },
  {
    id: 'framer',
    name: 'Framer Motion',
    level: 'secondary',
    connected: ['react', 'typescript'],
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    level: 'secondary',
    connected: ['react', 'nextjs', 'nodejs', 'framer'],
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    level: 'core',
    connected: ['express', 'typescript', 'postgresql'],
  },
  {
    id: 'express',
    name: 'Express',
    level: 'secondary',
    connected: ['nodejs', 'postgresql'],
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    level: 'core',
    connected: ['nodejs', 'express', 'aws'],
  },
  {
    id: 'aws',
    name: 'AWS',
    level: 'secondary',
    connected: ['postgresql', 'docker'],
  },
  {
    id: 'docker',
    name: 'Docker',
    level: 'secondary',
    connected: ['aws', 'nodejs'],
  },
]

interface Position {
  x: number
  y: number
}

function getNodePosition(index: number, total: number): Position {
  const angle = (index / total) * Math.PI * 2
  const radius = 200
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  }
}

export function SkillsNetwork() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  const isConnected = (nodeId: string) => {
    if (!hoveredNode) return true
    if (nodeId === hoveredNode) return true
    const hoveredNodeData = skillNodes.find(n => n.id === hoveredNode)
    return hoveredNodeData?.connected.includes(nodeId) ?? false
  }

  return (
    <section id="skills" className="py-24 md:py-32 bg-ink">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        {/* Heading */}
        <motion.div
          className="mb-16 text-left"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
        >
          <h2 className="t-display text-fg mb-4">
            What I <span className="text-accent">reach for.</span>
          </h2>
          <p className="t-lead text-muted mb-8">Each technology is a node</p>
          <p className="text-sm text-muted-2">Hovering a node highlights all connected technologies.</p>
        </motion.div>

        {/* Network Visualization */}
        <motion.div
          className="relative mx-auto flex items-center justify-center"
          style={{ width: '100%', height: '600px', maxWidth: '600px' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="-300 -300 600 600"
            style={{ zIndex: 0 }}
          >
            <defs>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff1a5c" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#ff1a5c" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Connection Lines */}
            {skillNodes.map(node => {
              const fromPos = getNodePosition(skillNodes.indexOf(node), skillNodes.length)
              return node.connected.map(connectedId => {
                const toNodeIndex = skillNodes.findIndex(n => n.id === connectedId)
                if (toNodeIndex <= skillNodes.indexOf(node)) return null

                const toPos = getNodePosition(toNodeIndex, skillNodes.length)
                const isActive = hoveredNode && (node.id === hoveredNode || connectedId === hoveredNode)

                return (
                  <motion.line
                    key={`${node.id}-${connectedId}`}
                    x1={fromPos.x}
                    y1={fromPos.y}
                    x2={toPos.x}
                    y2={toPos.y}
                    stroke={isActive ? '#ff1a5c' : '#2e2e32'}
                    strokeWidth={isActive ? 2 : 1}
                    animate={{
                      stroke: isActive ? '#ff1a5c' : '#2e2e32',
                      strokeWidth: isActive ? 2 : 1,
                      opacity: hoveredNode && !isActive ? 0.1 : 0.3,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                )
              })
            })}
          </svg>

          {/* Nodes */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 1 }}>
            {skillNodes.map((node, index) => {
              const pos = getNodePosition(index, skillNodes.length)
              const opacity = hoveredNode ? (isConnected(node.id) ? 1 : 0.3) : 1

              return (
                <motion.div
                  key={node.id}
                  className="absolute"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
                  }}
                >
                  <motion.button
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    animate={{
                      opacity,
                      scale: hoveredNode === node.id ? 1.15 : 1,
                    }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all ${
                      node.level === 'core'
                        ? 'bg-accent/20 border-accent text-fg'
                        : 'bg-white/5 border-white/10 text-muted hover:border-accent/50 hover:text-fg'
                    }`}
                  >
                    {node.name}
                  </motion.button>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
