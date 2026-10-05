import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface SplashProps {
  onComplete: () => void
}

export function Splash({ onComplete }: SplashProps) {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (progress < 100) {
      const timer = setTimeout(() => {
        setProgress((prev) => {
          const newProgress = Math.min(prev + Math.random() * 35 + 5, 99.9)
          return newProgress
        })
      }, 250)
      return () => clearTimeout(timer)
    }
  }, [progress])

  useEffect(() => {
    if (progress >= 99.9 && !isComplete) {
      setProgress(100)
      setIsComplete(true)
    }
  }, [progress, isComplete])

  return (
    <motion.div
      className="fixed inset-0 bg-black flex items-center justify-center z-50"
      initial={{ y: 0 }}
      animate={isComplete ? { y: '100vh' } : { y: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut', delay: isComplete ? 0.5 : 0 }}
      onAnimationComplete={() => {
        if (isComplete) onComplete()
      }}
    >
      <div className="text-center">
        {/* Large percentage */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-9xl font-bold text-white tracking-tighter">
            {Math.floor(progress)}
            <span className="text-7xl">%</span>
          </span>
        </motion.div>

        {/* Subtitle text */}
        <motion.p
          className="text-sm tracking-widest text-white/60 uppercase mt-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Building Your Portfolio
        </motion.p>
      </div>
    </motion.div>
  )
}
