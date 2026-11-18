import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useState, type MouseEventHandler, type PointerEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Arrow from './Arrow'

type Variant = 'ink' | 'paper' | 'line'

const MotionLink = motion.create(Link)
const PULL = 0.22

/**
 * Pill button with a sliding bed: the bed stops short of the icon circle and
 * grows to full width on hover while the circle slides back to meet it.
 * On a mouse it leans toward the cursor, and a press sends a ripple out from
 * the point that was clicked.
 */
export default function Cta({
  to,
  href,
  children,
  variant = 'ink',
  icon = true,
  external = false,
  onClick,
  className = '',
}: {
  to?: string
  href?: string
  children: ReactNode
  variant?: Variant
  icon?: boolean | ReactNode
  /** Leaves the site or opens an app: the arrow points up and to the right. */
  external?: boolean
  onClick?: MouseEventHandler<HTMLAnchorElement>
  className?: string
}) {
  const reduce = useReducedMotion()
  const hasIcon = variant !== 'line' && icon !== false
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 260, damping: 18, mass: 0.5 })
  const y = useSpring(my, { stiffness: 260, damping: 18, mass: 0.5 })

  const onPointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (reduce || event.pointerType !== 'mouse') return
    const box = event.currentTarget.getBoundingClientRect()
    mx.set((event.clientX - (box.left + box.width / 2)) * PULL)
    my.set((event.clientY - (box.top + box.height / 2)) * PULL)
  }
  const onPointerLeave = () => { mx.set(0); my.set(0) }
  const onPointerDown = (event: PointerEvent<HTMLAnchorElement>) => {
    if (reduce) return
    const box = event.currentTarget.getBoundingClientRect()
    setRipples((list) => [...list.slice(-2), { id: event.timeStamp, x: event.clientX - box.left, y: event.clientY - box.top }])
  }

  const inner = (
    <>
      {variant !== 'line' && <span className={`vs-cta-bed${hasIcon ? '' : ' vs-cta-bed--full'}`} aria-hidden="true" />}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="vs-ripple"
          aria-hidden="true"
          style={{ left: ripple.x, top: ripple.y }}
          onAnimationEnd={() => setRipples((list) => list.filter((item) => item.id !== ripple.id))}
        />
      ))}
      <span className="vs-cta-text">{children}</span>
      {hasIcon && (
        <span className="vs-cta-circle" aria-hidden="true">
          {icon === true ? <Arrow direction={external ? 'up-right' : 'right'} /> : icon}
        </span>
      )}
    </>
  )
  const classes = `vs-cta vs-cta--${variant} ${className}`.trim()
  const shared = {
    className: classes,
    onClick,
    onPointerMove,
    onPointerLeave,
    onPointerDown,
    style: { x, y },
    whileTap: reduce ? undefined : { scale: 0.95 },
    transition: { type: 'spring' as const, stiffness: 420, damping: 18, mass: 0.6 },
  }
  if (to) return <MotionLink to={to} {...shared}>{inner}</MotionLink>
  return <motion.a href={href} {...shared}>{inner}</motion.a>
}
