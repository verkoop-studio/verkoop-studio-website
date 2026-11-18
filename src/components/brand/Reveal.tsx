import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { EASE, VIEWPORT } from './motion'

type Tag = 'div' | 'section' | 'li' | 'article' | 'p' | 'span' | 'h2' | 'h3'

/** Fades content up out of a soft blur as it enters the viewport. */
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
      initial={{ opacity: 0, y, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={VIEWPORT}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </Component>
  )
}
