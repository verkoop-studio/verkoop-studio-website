import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { EASE, VIEWPORT } from './motion'

type Tag = 'div' | 'section' | 'li' | 'article' | 'p' | 'span' | 'h2' | 'h3'

/** Fades content up out of a soft blur as it enters the viewport; it starts readable, so a frame caught mid-reveal still reads. */
export default function Reveal({
  children,
  as = 'div',
  delay = 0,
  y = 24,
  className,
  id,
}: {
  children: ReactNode
  as?: Tag
  delay?: number
  y?: number
  className?: string
  id?: string
}) {
  const reduce = useReducedMotion()
  const Component = motion[as]
  if (reduce) {
    const Plain = as
    return <Plain className={className} id={id}>{children}</Plain>
  }
  return (
    <Component
      id={id}
      className={className}
      initial={{ opacity: 0.35, y: Math.min(y, 16), filter: 'blur(3px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={VIEWPORT}
      transition={{ duration: 0.5, delay: Math.min(delay, 0.2), ease: EASE }}
    >
      {children}
    </Component>
  )
}
