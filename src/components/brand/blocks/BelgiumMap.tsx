import { motion, useInView, useReducedMotion } from 'motion/react'
import { useRef } from 'react'
import type { Lang } from '../../../data/types'

const W = 240
const H = 196
const STEP = 5.2

/** A rough outline of Belgium in longitude and latitude, enough for a dotted map. */
const BORDER: [number, number][] = [
  [2.54, 51.09], [3.37, 51.37], [3.8, 51.21], [4.24, 51.37], [4.63, 51.43], [4.78, 51.5], [5.1, 51.43], [5.55, 51.27],
  [5.84, 51.16], [5.64, 50.83], [6.02, 50.73], [6.27, 50.62], [6.4, 50.33], [6.13, 50.13], [5.82, 49.55], [5.47, 49.5],
  [4.85, 49.79], [4.8, 50.15], [4.15, 49.98], [4.15, 50.25], [3.62, 50.49], [3.29, 50.53], [2.9, 50.7], [2.54, 51.09],
]
const project = ([lon, lat]: [number, number]): [number, number] => [((lon - 2.5) / 3.95) * W, ((51.55 - lat) / 2.1) * H]
const OUTLINE = BORDER.map(project)

function inside(x: number, y: number) {
  let hit = false
  for (let i = 0, j = OUTLINE.length - 1; i < OUTLINE.length; j = i++) {
    const [xi, yi] = OUTLINE[i]
    const [xj, yj] = OUTLINE[j]
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit
  }
  return hit
}

const DOTS: [number, number][] = []
for (let y = STEP / 2; y < H; y += STEP) for (let x = STEP / 2; x < W; x += STEP) if (inside(x, y)) DOTS.push([x, y])

/** Only places the site states: the studio, and the one case whose city is in the case data. */
const PLACES = (lang: Lang) => [
  { at: project([3.83, 51.1]), label: lang === 'nl' ? 'Studio · Lochristi' : 'Studio · Lochristi', home: true },
  { at: project([3.72, 51.05]), label: 'E-Kart · Gent', home: false },
]

/** Belgium in dots: the dots settle in, then the studio pulses and the known client city lights up. */
export default function BelgiumMap({ lang }: { lang: Lang }) {
  const ref = useRef<SVGSVGElement>(null)
  const seen = useInView(ref, { once: true, margin: '-60px' })
  const reduce = useReducedMotion()
  const on = seen || reduce
  return (
    <svg ref={ref} className="vs-map" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={lang === 'nl' ? 'Kaart van België met de studio in Lochristi en E-Kart in Gent' : 'Map of Belgium with the studio in Lochristi and E-Kart in Ghent'}>
      <g className="vs-map-dots" data-on={on || undefined}>
        {DOTS.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.35} style={{ transitionDelay: reduce ? '0s' : `${(x / W) * 0.6}s` }} />)}
      </g>
      {PLACES(lang).map((place, i) => (
        <g key={place.label} transform={`translate(${place.at[0]} ${place.at[1]})`}>
        <motion.g
          initial={reduce ? false : { opacity: 0, scale: 0.4 }}
          animate={on ? { opacity: 1, scale: 1 } : undefined}
          transition={{ type: 'spring', stiffness: 220, damping: 16, delay: reduce ? 0 : 0.9 + i * 0.45 }}
        >
          {place.home && <circle r={9} className="vs-map-pulse" />}
          <circle r={place.home ? 4.2 : 3.4} className={place.home ? 'vs-map-home' : 'vs-map-client'} />
          <text x={place.home ? 8 : -8} y={place.home ? -8 : 14} textAnchor={place.home ? 'start' : 'end'} className="vs-map-label">{place.label}</text>
        </motion.g>
        </g>
      ))}
    </svg>
  )
}
