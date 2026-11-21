import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'

type Direction = 'right' | 'left' | 'up-right'

/* A chevron points the way inside the site; the up-and-right arrow is kept for links that leave it. */
const ICONS = { right: ChevronRight, left: ChevronLeft, 'up-right': ArrowUpRight }

/**
 * Arrow that leaves on hover while a copy arrives from the other side.
 * The hover comes from the nearest interactive parent (a, button, .vs-cta).
 */
export default function Arrow({ direction = 'right', size = 17 }: { direction?: Direction; size?: number }) {
  const Icon = ICONS[direction]
  return (
    <span className={`vs-arrow vs-arrow--${direction}`} style={{ width: size, height: size }} aria-hidden="true">
      <span><Icon size={size} strokeWidth={direction === 'up-right' ? 2 : 2.4} /></span>
      <span><Icon size={size} strokeWidth={direction === 'up-right' ? 2 : 2.4} /></span>
    </span>
  )
}

/**
 * The site's round arrow button: at rest a quiet ring, under the hovered or focused link it
 * fills with the accent, and the chevron swaps through and nudges forward.
 */
export function Go({ size = 15, className = '' }: { size?: number; className?: string }) {
  return <span className={`vs-go ${className}`.trim()} aria-hidden="true"><Arrow size={size} /></span>
}
