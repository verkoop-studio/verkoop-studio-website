import type { CSSProperties } from 'react'

const PARTICLES = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * Math.PI * 2
  const distance = 46 + (i % 3) * 14
  return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance, tint: ['#2b4bf2', '#c9f26a', '#ff9fd0'][i % 3] }
})

/** A short burst of dots behind the success tick. Hidden under reduced motion. */
export default function Burst() {
  return (
    <span className="vs-burst" aria-hidden="true">
      {PARTICLES.map((p, i) => <i key={i} style={{ '--x': `${p.x}px`, '--y': `${p.y}px`, background: p.tint } as CSSProperties} />)}
    </span>
  )
}
