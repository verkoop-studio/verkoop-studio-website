import { useReducedMotion } from 'motion/react'
import { useState, type PointerEvent } from 'react'
import ResponsiveImage from '../ResponsiveImage'

export interface Shot { key: string; title: string; body: string; alt: string; src: string }

/**
 * Real product screens, one large at a time: tabs pick the screen and the pointer zooms in
 * where it rests. The whole screen always shows; nothing is cropped.
 */
export default function ShotViewer({ shots, product, chip, label }: { shots: Shot[]; product: string; chip?: string; label: string }) {
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null)
  const reduce = useReducedMotion()
  const shot = shots[active]
  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduce || event.pointerType !== 'mouse') return
    const box = event.currentTarget.getBoundingClientRect()
    setZoom({ x: ((event.clientX - box.left) / box.width) * 100, y: ((event.clientY - box.top) / box.height) * 100 })
  }
  return (
    <div className="pp-viewer">
      <div className="pp-viewer-tabs" role="tablist" aria-label={label}>
        {shots.map((item, i) => (
          <button key={item.key} type="button" role="tab" aria-selected={active === i} className={active === i ? 'is-on' : ''} onClick={() => { setActive(i); setZoom(null) }}>
            <span>{String(i + 1).padStart(2, '0')}</span>{item.title}
          </button>
        ))}
      </div>
      <div className="tx-win pp-viewer-win">
        <div className="tx-win-bar"><i /><i /><i /><b>{product}</b>{chip && <em>{chip}</em>}</div>
        <div className={`pp-viewer-stage${zoom ? ' is-zoom' : ''}`} onPointerMove={onMove} onPointerLeave={() => setZoom(null)}>
          <ResponsiveImage key={shot.key} src={shot.src} alt={shot.alt} sizes="(max-width: 1024px) 100vw, 1200px" loading="lazy" className="pp-viewer-shot" style={zoom ? { transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined} />
        </div>
      </div>
      <p className="pp-viewer-body">{shot.body}</p>
    </div>
  )
}
