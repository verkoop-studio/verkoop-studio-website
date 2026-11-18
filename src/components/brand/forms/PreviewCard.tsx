import { RefreshCw } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react'
import './preview.css'

const TILT_X = 6
const TILT_Y = 8
const FLIP_AFTER_MS = 280
const WIDE = '(min-width: 1024px)'

/** Tilts an element toward the pointer through --rx / --ry; the CSS owns the easing. Fine pointers only, never with reduced motion. */
function usePointerTilt(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--rx', `${(-((e.clientY - r.top) / r.height - 0.5) * TILT_X).toFixed(2)}deg`)
      el.style.setProperty('--ry', `${(((e.clientX - r.left) / r.width - 0.5) * TILT_Y).toFixed(2)}deg`)
    }
    const leave = () => { el.style.removeProperty('--rx'); el.style.removeProperty('--ry') }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave) }
  }, [ref])
}

export interface PreviewRow { label: string; value: string }

/**
 * The thing the visitor is making, filling in beside the form as they type: a band,
 * their name large (a placeholder until typed), a ring that fills per finished field
 * and the details they gave. When the form is complete it turns over to show what they
 * get. Tilts toward the pointer; settles with a small spring once sent.
 */
export default function PreviewCard({
  band,
  title,
  placeholder,
  rows,
  done,
  total,
  backTitle,
  backItems,
  showBack,
  settled = false,
  flipLabels,
  ringLabel,
}: {
  band: string
  title: string
  placeholder: string
  rows: PreviewRow[]
  done: number
  total: number
  backTitle: string
  backItems: string[]
  showBack: boolean
  settled?: boolean
  flipLabels: { toBack: string; toFront: string }
  ringLabel: string
}) {
  const tilt = useRef<HTMLDivElement>(null)
  const [side, setSide] = useState<'front' | 'back'>('front')
  usePointerTilt(tilt)
  // Arriving at a complete form: show the front a beat, then turn it over. Phones keep the front.
  useEffect(() => {
    const wide = window.matchMedia(WIDE).matches
    const timer = window.setTimeout(() => setSide(showBack && wide ? 'back' : 'front'), FLIP_AFTER_MS)
    return () => window.clearTimeout(timer)
  }, [showBack])
  const share = total ? Math.min(1, done / total) : 0
  const flip = (to: 'front' | 'back') => (
    <button type="button" className="vs-pv-flip" onClick={() => setSide(to)}>
      <RefreshCw size={14} aria-hidden="true" />{to === 'back' ? flipLabels.toBack : flipLabels.toFront}
    </button>
  )
  return (
    <div className="vs-pv-stage">
      <div ref={tilt} className="vs-pv-tilt">
        <div className="vs-pv-flipper" data-side={side} data-settled={settled || undefined}>
          <figure className="vs-pv-face" aria-label={band} aria-hidden={side === 'back'} inert={side === 'back'}>
            <div className="vs-pv-band">
              <span className="vs-pv-ring" role="progressbar" aria-label={ringLabel} aria-valuemin={0} aria-valuemax={total} aria-valuenow={done}>
                <svg viewBox="0 0 40 40" aria-hidden="true">
                  <circle cx="20" cy="20" r="16" className="vs-pv-ring-track" />
                  <circle cx="20" cy="20" r="16" className="vs-pv-ring-arc" pathLength={1} style={{ '--p': share } as CSSProperties} />
                </svg>
                <b>{done}/{total}</b>
              </span>
              <span className="vs-pv-band-label">{band}</span>
            </div>
            <div className="vs-pv-body">
              <p className="vs-pv-name" data-empty={title ? undefined : ''}>{title || placeholder}</p>
              <dl className="vs-pv-rows">
                {rows.map((row) => (
                  <div key={row.label} className="vs-pv-row" data-filled={row.value ? '' : undefined}>
                    <dt>{row.label}</dt>
                    <dd>{row.value || '—'}</dd>
                  </div>
                ))}
              </dl>
            </div>
            {flip('back')}
          </figure>
          <div className="vs-pv-face vs-pv-back" aria-hidden={side === 'front'} inert={side === 'front'}>
            <div className="vs-pv-band"><span className="vs-pv-band-label">{backTitle}</span></div>
            <ul className="vs-pv-list">
              {backItems.map((item, i) => (
                <li key={item} style={{ '--i': i } as CSSProperties}>
                  <span className="vs-pv-tick"><svg viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 7.5 6 10.5 11 4" /></svg></span>{item}
                </li>
              ))}
            </ul>
            {flip('front')}
          </div>
        </div>
      </div>
    </div>
  )
}
