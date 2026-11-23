import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react'

/** Hairline at the top of the viewport that fills as the page is read. */
export default function ScrollProgress() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 })
  if (reduce) return null
  return <motion.div className="vs-progress" aria-hidden="true" style={{ scaleX }} />
}
