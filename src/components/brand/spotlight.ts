import type { PointerEvent } from 'react'

/**
 * Pointer handler for `.vs-spot` surfaces: writes the cursor position into
 * CSS variables so a soft light follows it across the surface.
 */
export function trackSpotlight(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== 'mouse') return
  const el = event.currentTarget
  const box = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${event.clientX - box.left}px`)
  el.style.setProperty('--my', `${event.clientY - box.top}px`)
}
