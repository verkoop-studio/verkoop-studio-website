import { motion, useReducedMotion } from 'motion/react'
import { EASE_WIPE, VIEWPORT } from './motion'

type Point = 'up-left' | 'up-right' | 'down-left' | 'down-right'

const FLIP: Record<Point, string> = {
  'up-left': 'none',
  'up-right': 'scaleX(-1)',
  'down-left': 'scaleY(-1)',
  'down-right': 'scale(-1, -1)',
}

/**
 * Hand-written aside with an arrow. The arrow draws itself when the note
 * scrolls into view, then the words settle in at a slight tilt.
 */
export default function HandNote({ children, point = 'up-left', className = '' }: { children: string; point?: Point; className?: string }) {
  const reduce = useReducedMotion()
  const left = point.endsWith('left')
  const draw = (delay: number, duration: number) =>
    reduce
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          whileInView: { pathLength: 1, opacity: 1 },
          viewport: VIEWPORT,
          transition: { pathLength: { duration, delay, ease: EASE_WIPE }, opacity: { duration: 0.01, delay } },
        }
  const arrow = (
    <svg width="46" height="34" viewBox="0 0 46 34" fill="none" aria-hidden="true" style={{ transform: FLIP[point] }}>
      <motion.path d="M43 29C29 31 13 25 8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...draw(0.3, 0.45)} />
      <motion.path d="M2 16 8 7l9 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...draw(0.7, 0.2)} />
    </svg>
  )
  const text = (
    <motion.span
      className="vs-note-text"
      initial={reduce ? false : { opacity: 0, y: 6, rotate: -4 }}
      whileInView={{ opacity: 1, y: 0, rotate: -4 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.35, delay: 0.85 }}
    >
      {children}
    </motion.span>
  )
  return (
    <span className={`vs-note vs-note--${point} ${className}`.trim()}>
      {left ? <>{arrow}{text}</> : <>{text}{arrow}</>}
    </span>
  )
}
