import { useReducedMotion } from 'motion/react'
import { EASE } from './motion'

/** The page-hero entrance: fade up `y` px after `delay` seconds. Returns motion props, or nothing with reduced motion. */
export function useArrive(y = 14) {
  const reduce = useReducedMotion()
  return (delay: number) => (reduce ? {} : { initial: { opacity: 0, y }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease: EASE } })
}
