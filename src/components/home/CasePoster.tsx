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
  { x: 13, y: 84, size: 21, tilt: -14, depth: 0.8 },
  { x: 84, y: 23, size: 22, tilt: 11, depth: 0.9 },
  { x: 98, y: 54, size: 20, tilt: -9, depth: 0.55 },
  { x: 89, y: 89, size: 24, tilt: 16, depth: 1.1 },
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

/* ----------------------------------------------------------------------- */
/* Ticker: flat night ground, faint rows of booking data, a sweeping clock. */
/* ----------------------------------------------------------------------- */

const TICKER_ROWS = [
  'Baan 1 · ronde 04 · 0:41.8 · karts 1–8 · groep 12 pers. · bevestigd',
  'Teambuilding · vrijdag 19:30 · 24 pers. · offerte verstuurd · B2B',
  'Baan 2 · ronde 11 · 0:43.2 · karts 9–16 · verjaardag · bevestigd',
  'Online boeking · zaterdag 14:00 · 6 pers. · betaald · B2C',
  'Bedrijfsevent · donderdag 18:00 · 40 pers. · aanvraag · B2B',
  'Baan 1 · ronde 07 · 0:40.9 · karts 3–10 · vrijgezellen · bevestigd',
  'Online boeking · zondag 11:30 · 4 pers. · betaald · B2C',
]

function TickerPoster({ name }: PosterProps) {
  return (
    <Art>
      <rect width={W} height={H} fill="#0d1424" />
      <g className="vs-p-text" fontSize="17" fill="#f5f3ee">
        {TICKER_ROWS.map((row, i) => (
          <text key={i} x="-40" y={92 + i * 52} opacity={i === 3 ? 0.2 : 0.07} className={i === 3 ? 'vs-ticker-live' : undefined}>
            {`${row}   ·   ${row}`}
          </text>
        ))}
      </g>
      <g transform={`translate(${W / 2} ${H / 2 - 18})`}>
        <g transform="translate(-178 -40)">
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={(i % 2) * 14} y={Math.floor(i / 2) * 14} width="14" height="14" fill="#f5f3ee" opacity={i === 0 || i === 3 ? 1 : 0.25} />
          ))}
        </g>
        <text x="18" y="0" textAnchor="middle" className="vs-p-display" fontSize="104" fontWeight="600" letterSpacing="-3" fill="#f5f3ee">{name}</text>
      </g>
      <g transform="translate(120 560)">
        <line x1="0" x2="720" y1="0" y2="0" stroke="#f5f3ee" strokeOpacity="0.22" />
        {Array.from({ length: 25 }, (_, i) => (
          <line key={i} x1={i * 30} x2={i * 30} y1={i % 4 === 0 ? -12 : -6} y2="0" stroke="#f5f3ee" strokeOpacity={i % 4 === 0 ? 0.45 : 0.22} />
        ))}
        <rect x="270" y="-4" width="240" height="8" rx="4" fill="#7d93ff" opacity="0.35" />
        <g className="vs-ticker-head">
          <line x1="270" x2="270" y1="-34" y2="10" stroke="#f5f3ee" strokeWidth="1.5" />
          <text x="276" y="-22" fontSize="14" fill="#f5f3ee" opacity="0.8" className="vs-p-text">19:30</text>
        </g>
      </g>
    </Art>
  )
}

/* ------------------------------------------------------------------ */
/* Glow: dark ground falling into one colour, a sticker-outlined name. */
/* ------------------------------------------------------------------ */

const GUMMY = 'M-46 -30c0-20 12-32 30-32h32c18 0 30 12 30 32v52c0 22-12 34-30 34h-32c-18 0-30-12-30-34Z'

function GlowPoster({ name }: PosterProps) {
  return (
    <Art>
      <defs>
        <radialGradient id="glow-fall" cx="0.82" cy="1.05" r="0.95">
          <stop offset="0" stopColor="#ff5fa2" />
          <stop offset="0.45" stopColor="#6d1d4a" />
          <stop offset="1" stopColor="#0c0b10" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="#0c0b10" />
      <rect width={W} height={H} fill="url(#glow-fall)" className="vs-glow-breathe" />
      <g fill="none" stroke="#fff" strokeOpacity="0.07" strokeWidth="3" className="vs-glow-ghosts">
        <path d={GUMMY} transform="translate(120 170) scale(3.4) rotate(-14)" />
        <path d={GUMMY} transform="translate(860 520) scale(4.2) rotate(12)" />
        <path d={GUMMY} transform="translate(780 40) scale(2.2) rotate(26)" />
      </g>
      <g transform={`translate(${W / 2} ${H / 2})`}>
        <text y="44" textAnchor="middle" className="vs-p-display" fontSize="168" fontWeight="800" letterSpacing="-5" fill="#ff5fa2" stroke="#fff" strokeWidth="18" strokeLinejoin="round" paintOrder="stroke">{name.toLowerCase()}</text>
        <g transform="translate(0 -96) scale(0.42)">
          <path d={GUMMY} fill="#fff" stroke="#fff" strokeWidth="20" strokeLinejoin="round" />
          <path d={GUMMY} fill="#ff5fa2" />
          <circle cx="-16" cy="-6" r="6" fill="#0c0b10" />
          <circle cx="16" cy="-6" r="6" fill="#0c0b10" />
          <path d="M-14 16c8 8 20 8 28 0" fill="none" stroke="#0c0b10" strokeWidth="6" strokeLinecap="round" />
        </g>
      </g>
    </Art>
  )
}

/* -------------------------------------------------------------------- */
/* Stipple: muted ground with fine noise, a left lockup, a dotted object. */
/* -------------------------------------------------------------------- */

/** A kettlebell drawn as stipple dots that thin out towards the floor. */
const STIPPLE = (() => {
  const dots: { x: number; y: number; r: number; row: number }[] = []
  const cx = 720
  for (let y = 120; y <= 640; y += 11) {
    for (let x = 520; x <= 920; x += 11) {
      const jx = x + ((y * 7) % 5) - 2
      const handle = Math.abs(Math.hypot(jx - cx, y - 230) - 92) < 20 && y < 300
      const body = Math.hypot(jx - cx, y - 430) < 170
      if (!handle && !body) continue
      const shade = body ? 0.55 + 0.45 * ((jx - cx) / 170) : 0.6
      const fade = Math.max(0, 1 - Math.max(0, y - 470) / 170)
      const r = Math.max(0, 3.4 * fade * (0.55 + shade * 0.45))
      if (r < 0.6 || ((x + y) % 3 === 0 && fade < 0.7)) continue
      dots.push({ x: jx, y, r: Math.round(r * 10) / 10, row: Math.floor((y - 120) / 52) })
    }
  }
  return dots
})()

function StipplePoster({ name, lang }: PosterProps) {
  const words = lang === 'nl' ? ['Fitness', 'Persoonlijke videoadvertenties'] : ['Fitness', 'Personal video ads']
  const title = name.toUpperCase()
  return (
    <Art>
      <defs>
        <filter id="stipple-noise" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <rect width={W} height={H} fill="#a9b29c" />
      <rect width={W} height={H} filter="url(#stipple-noise)" opacity="0.18" style={{ mixBlendMode: 'multiply' }} />
      <g fill="#20261d">
        {STIPPLE.map((dot, i) => (
          <circle key={i} cx={dot.x} cy={dot.y} r={dot.r} className="vs-stipple-dot" style={{ '--r': dot.row } as CSSProperties} />
        ))}
      </g>
      <g transform="translate(70 352)">
        <g transform="translate(14 -66)" fill="#20261d">
          {[0, 45, 90, 135].map((angle) => <rect key={angle} x="-4" y="-16" width="8" height="32" rx="4" transform={`rotate(${angle})`} />)}
        </g>
        <text x="0" y="0" className="vs-p-display" fontSize="64" fontWeight="700" letterSpacing="3" fill="#20261d" transform="skewX(-10)" textLength="440" lengthAdjust="spacingAndGlyphs">{title}</text>
        <g className="vs-p-text" fontSize="15" fill="#20261d">
          <text x="0" y="44">{words[0]}</text>
          <text x="0" y="66" opacity="0.7">{words[1]}</text>
        </g>
      </g>
    </Art>
  )
}

const THEMES: Record<CaseSlug, { theme: string; Poster: (props: PosterProps) => ReactNode }> = {
  pinacello: { theme: 'paper', Poster: PaperPoster },
  'e-kart': { theme: 'ticker', Poster: TickerPoster },
  nooms: { theme: 'glow', Poster: GlowPoster },
  healthfactor: { theme: 'stipple', Poster: StipplePoster },
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
