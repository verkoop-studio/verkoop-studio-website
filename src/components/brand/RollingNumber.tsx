import { motion, useInView, useReducedMotion } from 'motion/react'
import { useRef } from 'react'
import { VIEWPORT } from './motion'

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

/**
 * Each digit sits on its own drum of 0–9. At rest, and in the prerendered page, the
 * drums show the real value; when the number scrolls into view they roll up to it,
 * one after the other, out of a short blur. Screen readers get the plain value.
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
      {prefix && <span aria-hidden="true">{prefix}</span>}
      {digits.map((digit, i) => {
        const rest = `${-digit * 10}%`
        return (
          <span key={i} className="vs-roll-digit" aria-hidden="true">
            <motion.span
              className="vs-roll-drum"
              initial={false}
              animate={inView ? { y: ['10%', rest], filter: ['blur(8px)', 'blur(0px)'] } : { y: rest, filter: 'blur(0px)' }}
              transition={inView ? { duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.09 } : { duration: 0 }}
              style={{ y: rest }}
            >
              {DIGITS.map((d) => <span key={d}>{d}</span>)}
            </motion.span>
          </span>
        )
      })}
      {suffix && <span aria-hidden="true" className="vs-roll-suffix">{suffix}</span>}
    </span>
  )
}
