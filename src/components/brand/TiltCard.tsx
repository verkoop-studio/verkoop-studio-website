import { motion, useReducedMotion, useSpring } from 'motion/react'
import type { PointerEvent, ReactNode } from 'react'

/**
 * Leans toward the cursor in 3D and carries a soft glare that follows it.
 * Mouse only; touch and reduced-motion visitors get the flat card.
 */
export default function TiltCard({ children, className = '', max = 5 }: { children: ReactNode; className?: string; max?: number }) {
  const reduce = useReducedMotion()
  const rotateX = useSpring(0, { stiffness: 180, damping: 18 })
  const rotateY = useSpring(0, { stiffness: 180, damping: 18 })

  if (reduce) return <div className={className}>{children}</div>

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return
    const el = event.currentTarget
    const box = el.getBoundingClientRect()
    const px = (event.clientX - box.left) / box.width
    const py = (event.clientY - box.top) / box.height
    rotateY.set((px - 0.5) * max * 2)
    rotateX.set((0.5 - py) * max * 2)
    el.style.setProperty('--gx', `${px * 100}%`)
    el.style.setProperty('--gy', `${py * 100}%`)
  }
  const onPointerLeave = () => { rotateX.set(0); rotateY.set(0) }

  return (
    <motion.div
      className={`vs-tilt ${className}`.trim()}
      style={{ rotateX, rotateY, transformPerspective: 1100 }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </motion.div>
  )
}
