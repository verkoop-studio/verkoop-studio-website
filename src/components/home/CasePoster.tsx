import type { CSSProperties } from 'react'
import type { CaseSlug } from '../../data/types'

const W = 960
const H = 680
const INK = '#151514'

const circle = (cx: number, cy: number, r: number) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0Z`

/** Line doodles on a 100×100 box. Drawn for this site; each is a list of path strings. */
const DOODLES = {
  chart: ['M12 86V14', 'M12 86h76', 'M24 68l20-20 14 12 26-32', 'M68 28h16v16'],
  cart: ['M8 20h14l10 42h46l10-32H26', circle(38, 78, 6), circle(72, 78, 6)],
  phone: ['M38 8h24a8 8 0 0 1 8 8v68a8 8 0 0 1-8 8H38a8 8 0 0 1-8-8V16a8 8 0 0 1 8-8Z', 'M44 80h12'],
  megaphone: ['M14 42v18h16l36 20V22L30 42Z', 'M76 40c8 6 8 16 0 22', 'M30 60l6 24h10l-4-22'],
  bottle: ['M40 8h20v20c12 8 14 16 14 28v32H26V56c0-12 2-20 14-28Z', 'M26 60h48'],
  flag: ['M20 92V10', 'M20 14h60L68 32l12 18H20'],
  calendar: ['M20 18h60a8 8 0 0 1 8 8v52a8 8 0 0 1-8 8H20a8 8 0 0 1-8-8V26a8 8 0 0 1 8-8Z', 'M12 38h76', 'M32 10v16', 'M68 10v16', 'M36 60l10 10 20-20'],
  dumbbell: ['M12 38v24', 'M24 30v40', 'M24 50h52', 'M76 30v40', 'M88 38v24'],
  video: ['M18 24h42a8 8 0 0 1 8 8v36a8 8 0 0 1-8 8H18a8 8 0 0 1-8-8V32a8 8 0 0 1 8-8Z', 'M68 42l22-12v40L68 58Z'],
  capsule: ['M30 70a20 20 0 0 1 0-28l14-14a20 20 0 0 1 28 28L58 70a20 20 0 0 1-28 0Z', 'M36 36l28 28'],
  person: [circle(40, 24, 12), 'M35 26c3 4 7 4 10 0', 'M16 80c0-22 10-36 24-36 10 0 17 7 20 18', 'M52 60h34l-5 22H47Z', 'M38 86h52'],
  spark: ['M50 10c4 26 14 36 40 40-26 4-36 14-40 40-4-26-14-36-40-40 26-4 36-14 40-40Z'],
  sun: [circle(50, 50, 16), 'M50 10v12', 'M50 78v12', 'M10 50h12', 'M78 50h12', 'M22 22l8 8', 'M70 70l8 8', 'M78 22l-8 8', 'M30 70l-8 8'],
} satisfies Record<string, string[]>

type Doodle = keyof typeof DOODLES
type Sticker = { icon: Doodle } | { tag: string }

interface PosterSpec {
  accent: string
  skew?: number
  stickers: [Sticker, Sticker, Sticker, Sticker, Sticker, Sticker]
}

const POSTERS: Record<CaseSlug, PosterSpec> = {
  pinacello: { accent: '#ffd23f', stickers: [{ icon: 'person' }, { icon: 'sun' }, { tag: 'webshop' }, { icon: 'bottle' }, { icon: 'chart' }, { icon: 'cart' }] },
  'e-kart': { accent: '#ff7a59', skew: -8, stickers: [{ icon: 'person' }, { icon: 'spark' }, { tag: 'B2B' }, { icon: 'flag' }, { icon: 'megaphone' }, { icon: 'calendar' }] },
  nooms: { accent: '#ff9fd0', stickers: [{ icon: 'person' }, { icon: 'spark' }, { tag: 'pre-sale' }, { icon: 'capsule' }, { icon: 'phone' }, { icon: 'cart' }] },
  healthfactor: { accent: '#c9f26a', stickers: [{ icon: 'person' }, { icon: 'spark' }, { tag: 'video' }, { icon: 'dumbbell' }, { icon: 'megaphone' }, { icon: 'video' }] },
}

/** Where the six stickers sit: centre in % of the poster, width in % of its width, tilt, parallax depth. */
const SLOTS = [
  { x: 4, y: 30, size: 25, tilt: -12, depth: 1 },
  { x: 27, y: 20, size: 10, tilt: 15, depth: 0.45 },
  { x: 13, y: 87, size: 21, tilt: -14, depth: 0.8 },
  { x: 84, y: 23, size: 22, tilt: 11, depth: 0.9 },
  { x: 98, y: 54, size: 20, tilt: -9, depth: 0.55 },
  { x: 89, y: 93, size: 24, tilt: 16, depth: 1.1 },
]

function StickerArt({ sticker }: { sticker: Sticker }) {
  if ('tag' in sticker) {
    return (
      <svg viewBox="-14 -14 228 88" aria-hidden="true" focusable="false">
        <rect width="200" height="60" rx="30" fill="#fff" stroke="#fff" strokeWidth="22" />
        <text x="100" y="41" textAnchor="middle" fontSize="31" fontWeight="600" fill={INK} className="vs-p-text">{sticker.tag}</text>
      </svg>
    )
  }
  const paths = DOODLES[sticker.icon]
  return (
    <svg viewBox="-18 -18 136 136" aria-hidden="true" focusable="false">
      <g fill="#fff" stroke="#fff" strokeWidth="28" strokeLinejoin="round" strokeLinecap="round">
        {paths.map((d, i) => <path key={i} d={d} />)}
      </g>
      <g fill="none" stroke={INK} strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
        {paths.map((d, i) => <path key={i} d={d} />)}
      </g>
    </svg>
  )
}

/**
 * Designed cover for a case in the work scroller: crumpled graph paper, the client's
 * name, a brush stroke carrying the published result, and die-cut doodle stickers.
 * Decorative; the surrounding link carries the accessible label.
 */
export default function CasePoster({ slug, name, caption }: { slug: CaseSlug; name: string; caption: string }) {
  const spec = POSTERS[slug]
  const title = name.toUpperCase()
  const titleSize = Math.min(150, 640 / (title.length * 0.68))
  const brushWidth = Math.min(800, caption.length * 15.5 + 120)
  const brushX = (W - brushWidth) / 2

  return (
    <div className={`vs-poster vs-poster--${slug}`} aria-hidden="true">
      <svg className="vs-poster-paper" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" focusable="false">
        <defs>
          <pattern id={`${slug}-grid`} width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0v40" fill="none" stroke="#c4bfae" strokeWidth="1" opacity="0.8" />
          </pattern>
          <filter id={`${slug}-dry`} x="-5%" y="-40%" width="110%" height="180%">
            <feTurbulence type="fractalNoise" baseFrequency="0.02 0.35" numOctaves="2" seed={title.length} result="streaks" />
            <feDisplacementMap in="SourceGraphic" in2="streaks" scale="11" xChannelSelector="R" yChannelSelector="G" result="rough" />
            <feColorMatrix in="streaks" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -9 5.6" result="gaps" />
            <feComposite in="rough" in2="gaps" operator="in" />
          </filter>
          <filter id={`${slug}-crumple`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.011 0.016" numOctaves="4" seed={title.length * 7} result="noise" />
            <feDiffuseLighting in="noise" surfaceScale="7" diffuseConstant="1.05" lightingColor="#fff9ec">
              <feDistantLight azimuth="40" elevation="58" />
            </feDiffuseLighting>
          </filter>
        </defs>
        <rect width={W} height={H} fill="#f7f5ee" />
        <rect width={W} height={H} filter={`url(#${slug}-crumple)`} opacity="0.26" style={{ mixBlendMode: 'multiply' }} />
        <rect width={W} height={H} fill={`url(#${slug}-grid)`} />
      </svg>

      <svg className="vs-poster-centre" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" focusable="false">
        <text
          x={W / 2}
          y={H / 2 + titleSize * 0.2}
          textAnchor="middle"
          className="vs-p-display"
          fontSize={titleSize}
          fontWeight="800"
          letterSpacing={-titleSize * 0.02}
          fill={INK}
          transform={spec.skew ? `skewX(${spec.skew})` : undefined}
          style={{ transformOrigin: `${W / 2}px ${H / 2}px` }}
        >
          {title}
        </text>
        <g transform={`translate(${brushX} ${H / 2 + titleSize * 0.2 + 34})`}>
          <g className="vs-poster-brush">
            <path
              transform={`scale(${brushWidth / 400} 1)`}
              d="M5 13C42 3 118 9 201 5s132-4 193 5l5 6-4 26c-58 9-146 3-217 9S61 51 6 48l-5-7 6-10-5-8Z"
              fill={spec.accent}
              filter={`url(#${slug}-dry)`}
            />
          </g>
          <text x={brushWidth / 2} y="37" textAnchor="middle" fontSize="27" fontWeight="600" fill={INK} className="vs-p-text vs-poster-caption">{caption}</text>
        </g>
      </svg>

      {spec.stickers.map((sticker, i) => {
        const slot = SLOTS[i]
        const wide = 'tag' in sticker
        const style = {
          left: `${slot.x}%`,
          top: `${slot.y}%`,
          width: `${slot.size * (wide ? 1.5 : 1)}%`,
          rotate: `${slot.tilt}deg`,
          '--i': i,
          '--depth': slot.depth,
        } as CSSProperties
        return (
          <span key={i} className="vs-sticker" style={style}>
            <span className="vs-sticker-drop"><StickerArt sticker={sticker} /></span>
          </span>
        )
      })}
    </div>
  )
}
