import { motion, useInView, useReducedMotion } from 'motion/react'
import { useRef } from 'react'
import { VIEWPORT } from './motion'

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

/**
 * Each digit sits on its own drum of 0–9 and rolls to its value when the number
 * scrolls into view, one after the other, settling out of a short blur.
 * Screen readers get the plain value.
 */
export default function RollingNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, VIEWPORT)
  const reduce = useReducedMotion()
  const digits = Array.from(String(value)).map(Number)
  const label = `${prefix}${value}${suffix}`

  if (reduce) return <span>{label}</span>

  return (
    <span ref={ref} className="vs-roll-number" role="img" aria-label={label}>
      {prefix && (
        <motion.span aria-hidden="true" initial={false} animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : 12 }} transition={{ duration: 0.5 }}>
          {prefix}
        </motion.span>
      )}
      {digits.map((digit, i) => (
        <span key={i} className="vs-roll-digit" aria-hidden="true">
          <motion.span
            className="vs-roll-drum"
            initial={false}
            animate={{
              y: inView ? `${-digit * 10}%` : '10%',
              opacity: inView ? 1 : 0,
              filter: inView ? 'blur(0px)' : 'blur(8px)',
            }}
            transition={{ type: 'spring', stiffness: 60, damping: 14, mass: 1, delay: inView ? 0.1 + i * 0.09 : 0 }}
          >
            {DIGITS.map((d) => <span key={d}>{d}</span>)}
          </motion.span>
        </span>
      ))}
      {suffix && <span aria-hidden="true" className="vs-roll-suffix">{suffix}</span>}
    </span>
  )
}
