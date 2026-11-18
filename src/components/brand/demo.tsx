import { useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

/*
 * Pieces for the scripted sample screens: a phase clock that loops while a screen is on
 * and stops under the pointer, a pointer that moves and clicks, typed text with a caret
 * and a number that ticks up. Reduced motion shows every screen at its end state.
 */

/**
 * Steps through `durations` (ms per phase) and starts over, while `on` and not `paused`.
 * Reduced motion parks on the last phase.
 */
export function usePhase(on: boolean, paused: boolean, durations: number[]) {
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState(0)
  const last = durations.length - 1
  useEffect(() => {
    if (reduce || !on || paused) return
    const id = window.setTimeout(() => setPhase((p) => (p + 1) % durations.length), durations[phase])
    return () => window.clearTimeout(id)
  }, [reduce, on, paused, phase, durations])
  useEffect(() => { if (!on) setPhase(0) }, [on])
  return reduce ? last : phase
}

/** Hover handlers that pause a demo, so people can read it. */
export function useHoverPause() {
  const [paused, setPaused] = useState(false)
  return { paused, bind: { onPointerEnter: () => setPaused(true), onPointerLeave: () => setPaused(false) } }
}

/** A pointer at (x, y) in % of its screen. `click` changes each time it should press. */
export function Pointer({ x, y, click, hidden = false }: { x: number; y: number; click?: number | string | false; hidden?: boolean }) {
  return (
    <span className={`dm-pointer${hidden ? ' is-hidden' : ''}`} style={{ left: `${x}%`, top: `${y}%` }} aria-hidden="true">
      <svg viewBox="0 0 24 24"><path d="M5 3.5 19 12l-6.4 1.4L9.3 20Z" /></svg>
      {click !== undefined && click !== false && <i key={String(click)} className="dm-tap" />}
    </span>
  )
}

/** Types `text` out while `on`, with a blinking caret; shows it whole with reduced motion. */
export function Typed({ text, on, speed = 55, caret = true }: { text: string; on: boolean; speed?: number; caret?: boolean }) {
  const reduce = useReducedMotion()
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!on) { setN(0); return }
    if (reduce) return
    if (n >= text.length) return
    const id = window.setTimeout(() => setN((x) => x + 1), speed)
    return () => window.clearTimeout(id)
  }, [on, n, text, speed, reduce])
  const shown = reduce ? text : text.slice(0, n)
  return <span className="dm-typed">{shown}{caret && on && <i className="dm-caret" aria-hidden="true" />}</span>
}

/** Counts from 0 to `to` over `ms` while `on`; formats with `format`. Reduced motion, and the prerendered page, show the end value. */
export function Ticker({ to, on, ms = 1400, format = (v: number) => String(Math.round(v)) }: { to: number; on: boolean; ms?: number; format?: (v: number) => string }) {
  const reduce = useReducedMotion()
  // Starts at the end value, so the prerendered page shows the real figure; the count runs after mount.
  const [v, setV] = useState(to)
  useEffect(() => {
    if (!on) { setV(0); return }
    if (reduce) { setV(to); return }
    setV(0)
    const start = performance.now()
    const id = window.setInterval(() => {
      const t = Math.min(1, (performance.now() - start) / ms)
      setV(to * (1 - (1 - t) ** 3))
      if (t >= 1) window.clearInterval(id)
    }, 32)
    return () => window.clearInterval(id)
  }, [on, to, ms, reduce])
  return <span className="tx-num">{format(reduce ? to : v)}</span>
}
