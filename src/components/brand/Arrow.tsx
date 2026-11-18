import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'

type Direction = 'right' | 'left' | 'up-right'

const ICONS = { right: ArrowRight, left: ArrowLeft, 'up-right': ArrowUpRight }

/**
 * Arrow that leaves on hover while a copy arrives from the other side.
 * The hover comes from the nearest interactive parent (a, button, .vs-cta).
 */
export default function Arrow({ direction = 'right', size = 17 }: { direction?: Direction; size?: number }) {
  const Icon = ICONS[direction]
  return (
    <span className={`vs-arrow vs-arrow--${direction}`} style={{ width: size, height: size }} aria-hidden="true">
      <span><Icon size={size} strokeWidth={2} /></span>
      <span><Icon size={size} strokeWidth={2} /></span>
    </span>
  )
}

/**
 * The site's round arrow button: at rest a quiet ring, under the hovered or focused link it
 * fills with the accent, the arrow swaps through and then turns to point up and right.
 */
export function Go({ size = 15, className = '' }: { size?: number; className?: string }) {
  return <span className={`vs-go ${className}`.trim()} aria-hidden="true"><Arrow size={size} /></span>
}
