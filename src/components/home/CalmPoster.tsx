import type { ReactNode } from 'react'

const W = 960
const H = 680

/** The four quiet grounds for earlier and partner work: the case posters' family, without the stickers and the motion. */
export type CalmPattern = 'grid' | 'rows' | 'fall' | 'dots'

const THEME: Record<CalmPattern, { ground: string; ink: string }> = {
  grid: { ground: '#f4f2ea', ink: '#151514' },
  rows: { ground: '#0f1726', ink: '#f5f3ee' },
  fall: { ground: '#0c0b10', ink: '#f5f3ee' },
  dots: { ground: '#b7bda9', ink: '#20261d' },
}

function Ground({ pattern, id }: { pattern: CalmPattern; id: string }): ReactNode {
  const { ground, ink } = THEME[pattern]
  if (pattern === 'grid') {
    return (
      <>
        <defs>
          <pattern id={id} width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0v40" fill="none" stroke="#c9c4b4" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill={ground} />
        <rect width={W} height={H} fill={`url(#${id})`} />
      </>
    )
  }
  if (pattern === 'rows') {
    return (
      <>
        <rect width={W} height={H} fill={ground} />
        <g stroke={ink} strokeOpacity="0.1">
          {Array.from({ length: 13 }, (_, i) => <line key={i} x1="0" x2={W} y1={52 + i * 48} y2={52 + i * 48} />)}
        </g>
        <path d="M0 520C160 500 260 430 420 440s300 60 540-120" fill="none" stroke="#7d93ff" strokeOpacity="0.55" strokeWidth="3" />
      </>
    )
  }
  if (pattern === 'fall') {
    return (
      <>
        <defs>
          <radialGradient id={id} cx="0.85" cy="1.05" r="0.95">
            <stop offset="0" stopColor="#2b4bf2" />
            <stop offset="0.5" stopColor="#14205e" />
            <stop offset="1" stopColor={ground} />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill={ground} />
        <rect width={W} height={H} fill={`url(#${id})`} />
      </>
    )
  }
  return (
    <>
      <rect width={W} height={H} fill={ground} />
      <g fill={ink}>
        {Array.from({ length: 22 * 15 }, (_, i) => {
          const col = i % 22, row = Math.floor(i / 22)
          const r = 1 + 2.4 * Math.max(0, (col - 6) / 15) * (1 - Math.abs(row - 7) / 9)
          return r > 1.2 ? <circle key={i} cx={40 + col * 42} cy={50 + row * 42} r={Math.round(r * 10) / 10} opacity="0.8" /> : null
        })}
      </g>
    </>
  )
}

/** A calm cover: one quiet ground and the name set as type. Decorative; the surrounding link carries the label. */
export default function CalmPoster({ name, pattern, kicker }: { name: string; pattern: CalmPattern; kicker?: string }) {
  const { ink } = THEME[pattern]
  const size = Math.min(150, 760 / Math.max(4, name.length * 0.66))
  const id = `calm-${pattern}-${name.replace(/\W+/g, '').toLowerCase()}`
  return (
    <div className={`vs-poster vs-poster--calm vs-poster--calm-${pattern}`} aria-hidden="true">
      <svg className="vs-poster-art" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" focusable="false">
        <Ground pattern={pattern} id={id} />
        <text x="80" y={H / 2 + size * 0.32} className="vs-p-display" fontSize={size} fontWeight="600" letterSpacing={-size * 0.035} fill={ink}>{name}</text>
        {kicker && <text x="84" y={H / 2 + size * 0.32 + 58} className="vs-p-text" fontSize="26" fill={ink} opacity="0.7">{kicker}</text>}
      </svg>
    </div>
  )
}
