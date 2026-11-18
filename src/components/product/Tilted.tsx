import { motion, useReducedMotion } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'

/** A card that is dealt in, rests at a small tilt and straightens and lifts under the pointer. */
export default function Tilted({ children, lean, className = '', style }: { children: ReactNode; lean: number; className?: string; style?: CSSProperties }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={`pp-tilt ${className}`.trim()}
      style={style}
      initial={reduce ? false : { opacity: 0, y: 70, rotate: lean * 4 }}
      whileInView={{ opacity: 1, y: 0, rotate: lean }}
      whileHover={reduce ? undefined : { rotate: 0, y: -8, scale: 1.02 }}
      viewport={{ once: false, margin: '-80px' }}
      transition={{ type: 'spring', stiffness: 170, damping: 16, mass: 0.9 }}
    >
      {children}
    </motion.div>
  )
}
