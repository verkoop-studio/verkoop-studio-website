import { motion, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'motion/react'
import { useRef } from 'react'
import BotAvatar from './BotAvatar'
import { EASE } from './motion'

/*
 * The playful pieces, each used sparingly: a wavy section edge, faint drifting line
 * doodles for one dark section, a hand-drawn ribbon with two characters on it, and a
 * handwritten note card. All of them stand still with reduced motion.
 */

/** A wavy edge between two sections. `fill` is the colour of the section it belongs to. */
export function WaveEdge({ flip = false, className = '' }: { flip?: boolean; className?: string }) {
  return (
    <svg className={`vs-wave ${flip ? 'vs-wave--flip' : ''} ${className}`.trim()} viewBox="0 0 1440 64" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d="M0 66V30C120 6 260 4 400 22s300 40 460 22 280-44 420-30 120 14 160 18V66Z" />
    </svg>
  )
}

/** Line doodles on a 40×40 grid: a cart, a chart, a cursor, an envelope and a megaphone. */
const DOODLES = [
  'M4 8h5l4 16h16l4-12H11M15 30a2 2 0 1 0 4 0 2 2 0 1 0-4 0M27 30a2 2 0 1 0 4 0 2 2 0 1 0-4 0',
  'M6 34V6M6 34h28M11 26l7-7 5 4 9-11M27 12h5v5',
  'M8 6l20 12-9 2-4 9Z',
  'M5 10h30v20H5ZM5 10l15 11 15-11',
  'M6 16v8h5l12 7V9l-12 7ZM27 15a6 6 0 0 1 0 10M30 11a11 11 0 0 1 0 18',
]

/** Faint doodles drifting slowly behind a dark section. */
export function DoodleField() {
  const cells = Array.from({ length: 40 }, (_, i) => i)
  return (
    <svg className="vs-doodles" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="vs-doodle-tile" width="480" height="320" patternUnits="userSpaceOnUse">
          {cells.slice(0, 10).map((i) => (
            <path key={i} d={DOODLES[i % DOODLES.length]} transform={`translate(${(i % 5) * 96 + (i > 4 ? 48 : 8)} ${i > 4 ? 190 : 40}) rotate(${(i * 37) % 30 - 15} 20 20) scale(1.2)`} />
          ))}
        </pattern>
      </defs>
      <rect className="vs-doodles-rect" width="200%" height="200%" fill="url(#vs-doodle-tile)" />
    </svg>
  )
}

/**
 * A thick hand-drawn ribbon that draws itself across a section edge as you scroll, with
 * one character sitting on it and another hanging from it. The hanging one swings
 * harder when the page is scrolled fast.
 */
export function Ribbon({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollY, scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const draw = useTransform(scrollYProgress, [0, 1], [0, 1])
  const speed = useVelocity(scrollY)
  const swing = useSpring(useTransform(speed, [-2500, 0, 2500], [-26, 0, 26]), { stiffness: 60, damping: 6 })
  return (
    <div ref={ref} className={`vs-ribbon ${className}`.trim()} aria-hidden="true">
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="vs-ribbon-svg">
        <motion.path d="M-20 80C140 20 260 110 420 70s260-70 420-20 260 50 380-10" style={reduce ? undefined : { pathLength: draw }} />
      </svg>
      <span className="vs-ribbon-sit"><BotAvatar shape="cat" size={56} color="#ffd23f" live /></span>
      <motion.span className="vs-ribbon-hang" style={reduce ? undefined : { rotate: swing }}>
        <i className="vs-ribbon-string" />
        <BotAvatar shape="star" size={48} color="#ff9fd0" live />
      </motion.span>
    </div>
  )
}

/** A note from Stef: paper, slightly turned, a strip of tape, the words written in line by line, then his name. */
export function NoteCard({ lines, sign, className = '' }: { lines: string[]; sign: string; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.figure
      className={`vs-notecard ${className}`.trim()}
      initial={reduce ? false : { opacity: 0, y: 40, rotate: -6 }}
      whileInView={{ opacity: 1, y: 0, rotate: -2 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ type: 'spring', stiffness: 90, damping: 14 }}
    >
      <span className="vs-notecard-tape" aria-hidden="true" />
      <blockquote>
        {lines.map((line, i) => (
          <motion.span
            key={line}
            className="vs-notecard-line"
            initial={reduce ? false : { clipPath: 'inset(0 100% 0 0)' }}
            whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.4 + i * 0.75, ease: EASE }}
          >
            {line}
          </motion.span>
        ))}
      </blockquote>
      <figcaption>
        <svg viewBox="0 0 120 40" className="vs-notecard-sign" aria-hidden="true">
          <motion.path d="M6 28c8-14 14-20 18-14s-10 16-4 16 12-18 18-14-6 14 0 12 10-10 14-8 2 8 8 6 14-8 22-10" initial={reduce ? false : { pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.1, delay: 0.5 + lines.length * 0.75, ease: EASE }} />
        </svg>
        <span>{sign}</span>
      </figcaption>
    </motion.figure>
  )
}
