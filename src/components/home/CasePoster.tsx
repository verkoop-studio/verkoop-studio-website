import type { CSSProperties, ReactNode } from 'react'
import type { CaseSlug, Lang } from '../../data/types'

const W = 960
const H = 680
const INK = '#151514'

interface PosterProps {
  name: string
  caption: string
  lang: Lang
}

const circle = (cx: number, cy: number, r: number) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0Z`

function Art({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <svg className={`vs-poster-art ${className}`.trim()} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" focusable="false">
      {children}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Paper: crumpled graph paper, brush stroke, die-cut doodle stickers. */
/* ------------------------------------------------------------------ */

/** Line doodles on a 100×100 box. Drawn for this site; each is a list of path strings. */
const DOODLES = {
  chart: ['M12 86V14', 'M12 86h76', 'M24 68l20-20 14 12 26-32', 'M68 28h16v16'],
  cart: ['M8 20h14l10 42h46l10-32H26', circle(38, 78, 6), circle(72, 78, 6)],
  bottle: ['M40 8h20v20c12 8 14 16 14 28v32H26V56c0-12 2-20 14-28Z', 'M26 60h48'],
  person: [circle(40, 24, 12), 'M35 26c3 4 7 4 10 0', 'M16 80c0-22 10-36 24-36 10 0 17 7 20 18', 'M52 60h34l-5 22H47Z', 'M38 86h52'],
  sun: [circle(50, 50, 16), 'M50 10v12', 'M50 78v12', 'M10 50h12', 'M78 50h12', 'M22 22l8 8', 'M70 70l8 8', 'M78 22l-8 8', 'M30 70l-8 8'],
} satisfies Record<string, string[]>

type Sticker = { icon: keyof typeof DOODLES } | { tag: string }

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
      <svg viewBox="-14 -14 228 88" focusable="false">
        <rect width="200" height="60" rx="30" fill="#fff" stroke="#fff" strokeWidth="22" />
        <text x="100" y="41" textAnchor="middle" fontSize="31" fontWeight="600" fill={INK} className="vs-p-text">{sticker.tag}</text>
      </svg>
    )
  }
  const paths = DOODLES[sticker.icon]
  return (
    <svg viewBox="-18 -18 136 136" focusable="false">
      <g fill="#fff" stroke="#fff" strokeWidth="28" strokeLinejoin="round" strokeLinecap="round">
        {paths.map((d, i) => <path key={i} d={d} />)}
      </g>
      <g fill="none" stroke={INK} strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
        {paths.map((d, i) => <path key={i} d={d} />)}
      </g>
    </svg>
  )
}

function PaperPoster({ name, caption }: PosterProps) {
  const title = name.toUpperCase()
  const titleSize = Math.min(150, 640 / (title.length * 0.68))
  const brushWidth = Math.min(800, caption.length * 15.5 + 120)
  const stickers: Sticker[] = [{ icon: 'person' }, { icon: 'sun' }, { tag: 'webshop' }, { icon: 'bottle' }, { icon: 'chart' }, { icon: 'cart' }]
  return (
    <>
      <Art>
        <defs>
          <pattern id="paper-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0v40" fill="none" stroke="#c4bfae" strokeWidth="1" opacity="0.8" />
          </pattern>
          <filter id="paper-dry" x="-5%" y="-40%" width="110%" height="180%">
            <feTurbulence type="fractalNoise" baseFrequency="0.02 0.35" numOctaves="2" seed="9" result="streaks" />
            <feDisplacementMap in="SourceGraphic" in2="streaks" scale="11" xChannelSelector="R" yChannelSelector="G" result="rough" />
            <feColorMatrix in="streaks" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -9 5.6" result="gaps" />
            <feComposite in="rough" in2="gaps" operator="in" />
          </filter>
          <filter id="paper-crumple" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.011 0.016" numOctaves="4" seed="63" result="noise" />
            <feDiffuseLighting in="noise" surfaceScale="7" diffuseConstant="1.05" lightingColor="#fff9ec">
              <feDistantLight azimuth="40" elevation="58" />
            </feDiffuseLighting>
          </filter>
        </defs>
        <rect width={W} height={H} fill="#f7f5ee" />
        <rect width={W} height={H} filter="url(#paper-crumple)" opacity="0.26" style={{ mixBlendMode: 'multiply' }} />
        <rect width={W} height={H} fill="url(#paper-grid)" />
        <text x={W / 2} y={H / 2 + titleSize * 0.2} textAnchor="middle" className="vs-p-display" fontSize={titleSize} fontWeight="800" letterSpacing={-titleSize * 0.02} fill={INK}>{title}</text>
        <g transform={`translate(${(W - brushWidth) / 2} ${H / 2 + titleSize * 0.2 + 34})`}>
          <g className="vs-poster-brush">
            <path transform={`scale(${brushWidth / 400} 1)`} d="M5 13C42 3 118 9 201 5s132-4 193 5l5 6-4 26c-58 9-146 3-217 9S61 51 6 48l-5-7 6-10-5-8Z" fill="#ffd23f" filter="url(#paper-dry)" />
          </g>
          <text x={brushWidth / 2} y="37" textAnchor="middle" fontSize="27" fontWeight="600" fill={INK} className="vs-p-text vs-poster-caption">{caption}</text>
        </g>
      </Art>
      {stickers.map((sticker, i) => {
        const slot = SLOTS[i]
        const style = {
          left: `${slot.x}%`,
          top: `${slot.y}%`,
          width: `${slot.size * ('tag' in sticker ? 1.5 : 1)}%`,
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
    </>
  )
}

/* ------------------------------------------------------------- */
/* Night track: asphalt, kerbs, a neon racing line, a lap timer.  */
/* ------------------------------------------------------------- */

const RACING_LINE = 'M-40 560C140 560 210 150 430 150s250 330 470 330 160-120 160-120'
const NEON = '#d7ff3e'

function TrackPoster({ name, caption }: PosterProps) {
  return (
    <>
      <Art>
        <defs>
          <filter id="track-grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <filter id="track-glow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
          <linearGradient id="track-streak" x1="0" x2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="#0b0b0d" />
        <rect width={W} height={H} filter="url(#track-grain)" opacity="0.2" style={{ mixBlendMode: 'screen' }} />
        <path d={RACING_LINE} fill="none" stroke="#17171b" strokeWidth="150" strokeLinecap="round" />
        <path d={RACING_LINE} fill="none" stroke="#f5f3ee" strokeWidth="2" strokeDasharray="16 22" opacity="0.28" />
        <path d={RACING_LINE} fill="none" stroke={NEON} strokeWidth="10" opacity="0.5" filter="url(#track-glow)" pathLength={1} className="vs-track-line" />
        <path d={RACING_LINE} fill="none" stroke={NEON} strokeWidth="3" pathLength={1} className="vs-track-line" />
        <g>
          {Array.from({ length: 16 }, (_, i) => (
            <path key={i} d={`M${i * 64 - 20} 680l26-44h64l-26 44Z`} fill={i % 2 ? '#f5f3ee' : '#e5342b'} />
          ))}
        </g>
        <g className="vs-track-name">
          <g transform="skewX(-14)" style={{ transformOrigin: `${W / 2}px ${H / 2}px` }}>
            {[292, 322, 352, 382].map((y, i) => (
              <rect key={y} x={40 + i * 26} y={y} width={230 - i * 30} height="5" rx="2.5" fill="url(#track-streak)" opacity={0.75 - i * 0.12} />
            ))}
            <text x={W / 2 + 60} y={H / 2 + 44} textAnchor="middle" className="vs-p-display" fontSize="150" fontWeight="800" fontStyle="italic" letterSpacing="-4" fill="#f5f3ee">{name.toUpperCase()}</text>
          </g>
        </g>
        <text x={W / 2 + 40} y={H / 2 + 108} textAnchor="middle" fontSize="27" fontWeight="500" fill={NEON} className="vs-p-text vs-poster-caption">{caption}</text>
      </Art>
      <span className="vs-lap">
        <span className="vs-lap-label">Lap</span>
        <span className="vs-lap-time" />
      </span>
    </>
  )
}

/* ------------------------------------------------------- */
/* Pop: candy ground, soft blobs, a stamp, confetti dots.   */
/* ------------------------------------------------------- */

const CONFETTI = [
  [118, 96, 13, '#2447f5'], [236, 560, 10, '#ff7a59'], [352, 86, 9, '#12b886'], [704, 100, 14, '#ff7a59'], [842, 250, 10, '#2447f5'],
  [70, 392, 9, '#12b886'], [884, 470, 13, '#ffd23f'], [612, 596, 10, '#2447f5'], [432, 610, 12, '#ffd23f'], [156, 250, 8, '#ff7a59'],
  [786, 590, 8, '#12b886'], [548, 60, 8, '#ffd23f'],
] as const

function PopPoster({ name, caption, lang }: PosterProps) {
  return (
    <Art>
      <defs>
        <filter id="pop-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="46" />
        </filter>
      </defs>
      <rect width={W} height={H} fill="#ffd3e6" />
      <g filter="url(#pop-soft)">
        <circle cx="160" cy="150" r="210" fill="#bfe1ff" />
        <circle cx="820" cy="560" r="240" fill="#fff0a3" />
        <circle cx="760" cy="90" r="150" fill="#c9f5d6" />
        <circle cx="220" cy="640" r="170" fill="#ffb1d3" />
      </g>
      {CONFETTI.map(([cx, cy, r, fill], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={fill} className="vs-pop-dot" style={{ '--i': i } as CSSProperties} />
      ))}
      <text
        x={W / 2}
        y={H / 2 + 58}
        textAnchor="middle"
        className="vs-p-display"
        fontSize="212"
        fontWeight="800"
        letterSpacing="-6"
        fill="#2447f5"
        stroke="#2447f5"
        strokeWidth="16"
        strokeLinejoin="round"
        paintOrder="stroke"
      >
        {name.toLowerCase()}
      </text>
      <text x={W / 2} y={H / 2 + 132} textAnchor="middle" fontSize="27" fontWeight="600" fill="#1b2a7a" className="vs-p-text vs-poster-caption">{caption}</text>
      <g transform="translate(700 196) rotate(-11)">
        <g className="vs-pop-stamp">
          <rect x="-150" y="-44" width="300" height="88" rx="12" fill="#ffd3e6" fillOpacity="0.55" stroke="#e5342b" strokeWidth="7" />
          <rect x="-138" y="-32" width="276" height="64" rx="7" fill="none" stroke="#e5342b" strokeWidth="2.5" />
          <text x="0" y="14" textAnchor="middle" className="vs-p-display" fontSize="40" fontWeight="800" letterSpacing="3" fill="#e5342b">{lang === 'nl' ? 'UITVERKOCHT' : 'SOLD OUT'}</text>
        </g>
      </g>
    </Art>
  )
}

/* ---------------------------------------------------------------- */
/* Editorial: a halftone field, a condensed name, a heartbeat line.  */
/* ---------------------------------------------------------------- */

const LIME = '#c9f26a'
const HALFTONE = (() => {
  const dots: { x: number; y: number; r: number }[] = []
  const step = 26
  for (let row = 0; row * step <= H + step; row++) {
    for (let col = 0; col * step <= W + step; col++) {
      const x = col * step + (row % 2 ? step / 2 : 0)
      const y = row * step
      const distance = Math.hypot(x - 720, y - 250) / 520
      const r = Math.max(0, 11 * (1 - distance))
      if (r > 0.9) dots.push({ x, y, r: Math.round(r * 10) / 10 })
    }
  }
  return dots
})()
const PULSE = 'M0 470h250l26-12 22 24 30-150 34 232 30-118 20 24h110l22-40 26 66 24-26h366'

function EditorialPoster({ name, caption }: PosterProps) {
  const title = name.toUpperCase()
  return (
    <Art>
      <rect width={W} height={H} fill="#10140f" />
      <g fill={LIME} className="vs-halftone">
        {HALFTONE.map((dot, i) => <circle key={i} cx={dot.x} cy={dot.y} r={dot.r} />)}
      </g>
      <rect width={W} height={H} fill="url(#editorial-fade)" />
      <defs>
        <linearGradient id="editorial-fade" x1="0" x2="1">
          <stop offset="0" stopColor="#10140f" stopOpacity="0.92" />
          <stop offset="0.55" stopColor="#10140f" stopOpacity="0.35" />
          <stop offset="1" stopColor="#10140f" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M60 96h220" stroke="#f5f3ee" strokeWidth="2" />
      <text x="60" y="140" fontSize="27" fontWeight="500" fill="#f5f3ee" className="vs-p-text vs-poster-caption">{caption}</text>
      <g transform={`translate(60 ${H / 2 + 62}) scale(0.72 1)`}>
        <text className="vs-p-display" fontSize="168" fontWeight="800" letterSpacing="-5" fill="#f5f3ee">{title}</text>
      </g>
      <path d={PULSE} fill="none" stroke={LIME} strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" pathLength={1} className="vs-pulse" />
    </Art>
  )
}

const THEMES: Record<CaseSlug, { theme: string; Poster: (props: PosterProps) => ReactNode }> = {
  pinacello: { theme: 'paper', Poster: PaperPoster },
  'e-kart': { theme: 'track', Poster: TrackPoster },
  nooms: { theme: 'pop', Poster: PopPoster },
  healthfactor: { theme: 'editorial', Poster: EditorialPoster },
}

/**
 * Designed cover for a case in the work scroller. Each client gets its own world
 * (ground, type, palette, illustration and entrance); the frame, focus ring and
 * label are shared. Decorative: the surrounding link carries the accessible label.
 */
export default function CasePoster({ slug, name, caption, lang }: PosterProps & { slug: CaseSlug }) {
  const { theme, Poster } = THEMES[slug]
  return (
    <div className={`vs-poster vs-poster--${theme}`} aria-hidden="true">
      <Poster name={name} caption={caption} lang={lang} />
    </div>
  )
}
