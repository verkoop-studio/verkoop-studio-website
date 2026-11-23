import { motion, useReducedMotion } from 'motion/react'
import { useState, type PointerEvent } from 'react'
import ResponsiveImage from '../ResponsiveImage'
import HandNote from './HandNote'

interface Photo { src: string; name: string }

const TILT = [-6, 5]
const SPRING = { type: 'spring' as const, stiffness: 220, damping: 20 }

/**
 * Two taped polaroids, fanned apart. Hovering or focusing one brings it to the front,
 * lifts and straightens it while the other is pushed aside; a tap swaps the front card.
 * The photo follows the pointer inside its frame and the name redraws when its card
 * comes forward. Reduced motion keeps only the swap.
 */
export default function Polaroids({ photos, note }: { photos: [Photo, Photo]; note?: string }) {
  const reduce = useReducedMotion()
  const [front, setFront] = useState(0)
  const [hover, setHover] = useState<number | null>(null)
  const [group, setGroup] = useState(false)
  const active = hover ?? front

  const parallax = (e: PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--px', `${(((e.clientX - r.left) / r.width) - 0.5) * -10}px`)
    e.currentTarget.style.setProperty('--py', `${(((e.clientY - r.top) / r.height) - 0.5) * -10}px`)
  }

  return (
    <div className="ag-polaroids" onMouseEnter={() => setGroup(true)} onMouseLeave={() => { setGroup(false); setHover(null) }}>
      {photos.map((photo, i) => {
        const isFront = active === i
        const pushed = hover !== null && hover !== i
        const spread = group ? (i === 0 ? -16 : 16) : 0
        return (
          <motion.figure
            key={photo.name}
            className={`ag-polaroid ag-polaroid--${i ? 'b' : 'a'}${isFront ? ' is-front' : ''}`}
            tabIndex={0}
            aria-label={photo.name}
            style={{ zIndex: isFront ? 3 : 1 }}
            initial={reduce ? false : { opacity: 0, y: 90, rotate: TILT[i] * 3 }}
            animate={reduce
              ? { opacity: 1, y: 0, rotate: TILT[i], scale: 1, x: 0 }
              : isFront && hover !== null
                ? { opacity: 1, y: -12, x: spread, rotate: 0, scale: 1.04 }
                : { opacity: 1, y: 0, x: spread + (pushed ? (i === 0 ? -40 : 40) : 0), rotate: TILT[i] * (pushed ? 1.4 : 1), scale: 1 }}
            transition={{ ...SPRING, opacity: { duration: 0.4, delay: 0.35 + i * 0.2 }, y: { ...SPRING, delay: hover === null && !group ? 0.35 + i * 0.2 : 0 } }}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
            onClick={() => setFront(i)}
            onPointerMove={parallax}
          >
            <span className="ag-polaroid-photo"><ResponsiveImage src={photo.src} alt="" sizes="(max-width: 900px) 60vw, 320px" /></span>
            <span className="ag-tape" aria-hidden="true" />
            <motion.figcaption
              key={isFront ? 'front' : 'back'}
              initial={reduce || !isFront ? false : { clipPath: 'inset(0 100% 0 0)' }}
              animate={{ clipPath: 'inset(0 0% 0 0)' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {photo.name}
            </motion.figcaption>
          </motion.figure>
        )
      })}
      {note && <HandNote point="down-right" className="ag-note">{note}</HandNote>}
    </div>
  )
}
