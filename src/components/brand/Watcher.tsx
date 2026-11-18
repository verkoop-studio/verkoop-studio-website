import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { useLang } from '../../i18n/LanguageContext'

/*
 * The Verkoop dot: a shape with two eyes that sit on a sphere. Looking at the pointer
 * turns the sphere, so the eye heading for the rim moves less and narrows (that
 * foreshortening is what makes a flat shape read as round). One sprung turn drives
 * both eyes; it blinks on its own, morphs between shapes, and types a short line
 * when poked. The loop only runs while the dot is on screen, and it writes straight
 * to the DOM every frame instead of through React state.
 */

const R = 50
const GAP = 0.19
const TILT = 64
const KEY_MS = 38
const HOLD_MS = 1500
const RAYS = 120
const EYE = { w: 9, h: 15, r: 4.5 }

const LINES = {
  nl: ['Hoi!', 'Ik zie je wel.', 'Boop.', 'Vraagje? Klik maar.', 'Kijk eens naar onze cases.'],
  en: ['Hi!', 'I can see you.', 'Boop.', 'A question? Just click.', 'Have a look at our cases.'],
}

const WATCHER_SHAPES = {
  Ball: 'M50 0 A50 50 0 1 1 49.99 0 Z',
  Circle: 'M50 7 A43 43 0 1 1 49.99 7 Z',
  Cube: 'M30 6 H70 A24 24 0 0 1 94 30 V70 A24 24 0 0 1 70 94 H30 A24 24 0 0 1 6 70 V30 A24 24 0 0 1 30 6 Z',
  Pill: 'M34 17 H66 A33 33 0 0 1 66 83 H34 A33 33 0 0 1 34 17 Z',
  Hexagon: 'M59.53 8.50 L81.18 21.00 Q90.70 26.50 90.70 37.50 L90.70 62.50 Q90.70 73.50 81.18 79.00 L59.53 91.50 Q50.00 97.00 40.47 91.50 L18.82 79.00 Q9.30 73.50 9.30 62.50 L9.30 37.50 Q9.30 26.50 18.82 21.00 L40.47 8.50 Q50.00 3.00 59.53 8.50 Z',
}
export type WatcherShape = keyof typeof WATCHER_SHAPES

/** The areas a dot watches inside: it looks at the pointer only while the pointer is in its own area. */
const AREAS = '[data-watch-area], .vs-hero, .vs-footer, .vs-dock, .vs-404'

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const stillness = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/* Shapes are different kinds of path, so a morph reads each as its distance from the centre at evenly spaced angles and eases those. */
const radii = new Map<WatcherShape, number[]>()
function measure(shape: WatcherShape): number[] {
  const hit = radii.get(shape)
  if (hit) return hit
  const ns = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(ns, 'svg')
  svg.setAttribute('viewBox', '0 0 100 100')
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden'
  const path = document.createElementNS(ns, 'path')
  path.setAttribute('d', WATCHER_SHAPES[shape])
  svg.appendChild(path)
  document.body.appendChild(svg)
  const pt = svg.createSVGPoint()
  const out: number[] = []
  for (let i = 0; i < RAYS; i++) {
    const a = (i / RAYS) * Math.PI * 2 - Math.PI / 2
    let lo = 0
    let hi = 60
    for (let k = 0; k < 16; k++) {
      const mid = (lo + hi) / 2
      pt.x = 50 + Math.cos(a) * mid
      pt.y = 50 + Math.sin(a) * mid
      if (path.isPointInFill(pt)) lo = mid
      else hi = mid
    }
    out.push(lo)
  }
  svg.remove()
  radii.set(shape, out)
  return out
}
const outline = (r: number[]) => r.map((v, i) => {
  const a = (i / r.length) * Math.PI * 2 - Math.PI / 2
  return `${i ? 'L' : 'M'}${(50 + Math.cos(a) * v).toFixed(2)} ${(50 + Math.sin(a) * v).toFixed(2)}`
}).join('') + 'Z'

export default function Watcher({
  size = 64,
  shape = 'Ball',
  follow = 60,
  bounce = 30,
  eyeScale = 1,
  within,
  poke: pokable = true,
  label,
  className = '',
}: {
  size?: number
  shape?: WatcherShape
  /** How far it turns toward the pointer, 0–100. */
  follow?: number
  /** How much the turn overshoots, 0–100. */
  bounce?: number
  eyeScale?: number
  /** The area it watches inside, as a selector. Defaults to the nearest known area. */
  within?: string
  /** false when it sits inside another control and must not be a button itself. */
  poke?: boolean
  label?: string
  className?: string
}) {
  const { lang } = useLang()
  const still = stillness()
  const box = useRef<HTMLSpanElement>(null)
  const eyes = useRef<(SVGGElement | null)[]>([])
  const [typed, setTyped] = useState('')
  const [talking, setTalking] = useState(false)
  const turn = useRef(0)
  const lastLine = useRef(-1)
  const knobs = useRef({ follow, bounce, eyeScale })
  knobs.current = { follow, bounce, eyeScale }
  const eye = { w: EYE.w * eyeScale, h: EYE.h * eyeScale, r: EYE.r * eyeScale }
  const eyeNow = useRef(eye)
  eyeNow.current = eye
  useEffect(() => () => { turn.current++ }, [])

  // One short line, typed a letter at a time, never the same twice running.
  const poke = async () => {
    const mine = ++turn.current
    const lines = LINES[lang]
    const pool = lines.map((_, i) => i).filter((i) => i !== lastLine.current)
    const i = pool[Math.floor(Math.random() * pool.length)]
    lastLine.current = i
    const wait = (ms: number) => new Promise((done) => setTimeout(done, ms))
    setTyped('')
    setTalking(true)
    for (let k = 1; k <= lines[i].length; k++) {
      await wait(KEY_MS + Math.random() * 30)
      if (mine !== turn.current) return
      setTyped(lines[i].slice(0, k))
    }
    await wait(HOLD_MS)
    if (mine === turn.current) setTalking(false)
  }

  useEffect(() => {
    const el = box.current
    if (!el) return
    const t = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 }
    let raf = 0
    let prev = 0
    let blink = 0
    let nextBlink = performance.now() + 2200

    const draw = (now: number) => {
      let lid = 1
      if (!still && now > nextBlink) { blink = now; nextBlink = now + 2600 + Math.random() * 3200 }
      const since = now - blink
      if (since < 160) lid = 1 - 0.9 * Math.sin((since / 160) * Math.PI)
      const as = (val: number) => Math.asin(clamp(val, -0.92, 0.92))
      const yaw = as(t.x)
      const pitch = -as(t.y)
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch)
      const tilt = TILT * t.x * t.y
      const g0 = GAP * Math.max(1, knobs.current.eyeScale * 0.8)
      ;[-g0, g0].forEach((x0, i) => {
        const g = eyes.current[i]
        const rect = g?.firstElementChild as SVGRectElement | null
        if (!g || !rect) return
        const z0 = Math.sqrt(1 - x0 * x0)
        const x1 = x0 * cy + z0 * sy
        const z1 = -x0 * sy + z0 * cy
        const y2 = -z1 * sp
        const z2 = z1 * cp
        const near = clamp(z2, 0, 1)
        const k = 0.45 + 0.55 * near
        // Width and height are written directly (never a scale), so the corners keep one radius.
        const w = eyeNow.current.w * k * (0.7 + 0.3 * near)
        const h = Math.max(0.6, eyeNow.current.h * k * lid)
        rect.setAttribute('x', (-w / 2).toFixed(2))
        rect.setAttribute('y', (-h / 2).toFixed(2))
        rect.setAttribute('width', w.toFixed(2))
        rect.setAttribute('height', h.toFixed(2))
        rect.setAttribute('rx', Math.min(eyeNow.current.r, w / 2, h / 2).toFixed(2))
        g.setAttribute('transform', `translate(${(50 + x1 * R).toFixed(2)} ${(50 + y2 * R).toFixed(2)}) rotate(${tilt.toFixed(2)})`)
        g.style.opacity = z2 < 0.05 ? '0' : '1'
      })
    }

    let seen = true
    const tick = (now: number) => {
      if (!seen || document.hidden) { raf = 0; prev = 0; return }
      const dt = prev ? Math.min(2.5, (now - prev) / 16.67) : 1
      prev = now
      const d = 0.34 - (clamp(knobs.current.bounce, 0, 100) / 100) * 0.22
      t.vx += ((t.tx - t.x) * 0.06 - t.vx * d) * dt
      t.vy += ((t.ty - t.y) * 0.06 - t.vy * d) * dt
      t.x += t.vx * dt
      t.y += t.vy * dt
      draw(now)
      raf = requestAnimationFrame(tick)
    }
    // Reduced motion: drawn once, facing straight ahead, and never moved.
    if (still) { draw(performance.now()); return }
    raf = requestAnimationFrame(tick)
    const resume = () => { if (!raf && seen && !document.hidden) raf = requestAnimationFrame(tick) }
    const io = new IntersectionObserver(([entry]) => { seen = entry.isIntersecting; resume() })
    io.observe(el)
    document.addEventListener('visibilitychange', resume)

    const frame = el.closest<HTMLElement>(within ?? AREAS) ?? el
    const aim = (e: PointerEvent) => {
      const f = frame.getBoundingClientRect()
      if (e.clientX < f.left || e.clientX > f.right || e.clientY < f.top || e.clientY > f.bottom) { t.tx = 0; t.ty = 0; return }
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      const dist = Math.hypot(dx, dy) || 1
      const reach = Math.max(60, Math.min(f.width, f.height) * 0.28)
      const far = Math.min(0.85, Math.tanh(dist / reach) * (clamp(knobs.current.follow, 0, 100) / 100) * 1.5)
      t.tx = (dx / dist) * far
      t.ty = (dy / dist) * far
    }
    const rest = () => { t.tx = 0; t.ty = 0 }
    window.addEventListener('pointermove', aim, { passive: true })
    document.documentElement.addEventListener('pointerleave', rest)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      document.removeEventListener('visibilitychange', resume)
      window.removeEventListener('pointermove', aim)
      document.documentElement.removeEventListener('pointerleave', rest)
    }
  }, [still, within])

  // A change of shape eases the outline across with a small overshoot.
  const bodyEl = useRef<SVGPathElement>(null)
  const clipEl = useRef<SVGPathElement>(null)
  const shown = useRef<number[] | null>(null)
  const from = useRef(shape)
  useLayoutEffect(() => {
    if (from.current === shape) return
    const start = shown.current ?? measure(from.current)
    const end = measure(shape)
    from.current = shape
    const paint = (r: number[]) => { shown.current = r; const d = outline(r); bodyEl.current?.setAttribute('d', d); clipEl.current?.setAttribute('d', d) }
    if (still) { paint(end); return }
    const t0 = performance.now()
    let raf = 0
    const step = (now: number) => {
      const u = Math.min(1, (now - t0) / 520)
      const e = 1 + 2.3 * Math.pow(u - 1, 3) + 1.3 * Math.pow(u - 1, 2)
      paint(start.map((a, i) => a + (end[i] - a) * e))
      if (u < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [shape, still])

  const body = WATCHER_SHAPES[shape]
  const clip = `eyt-clip-${useId().replace(/:/g, '')}`
  const art = (
    <svg className="eyt-ball" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <defs><clipPath id={clip}><path ref={clipEl} d={body} /></clipPath></defs>
      <path ref={bodyEl} className="eyt-body" d={body} />
      <g clipPath={`url(#${clip})`}>
        {[0, 1].map((i) => (
          <g key={i} ref={(n) => { eyes.current[i] = n }} transform={`translate(${50 + (i ? 1 : -1) * GAP * R} 50)`}>
            <rect className="eyt-eye" x={-eye.w / 2} y={-eye.h / 2} width={eye.w} height={eye.h} rx={eye.r} />
          </g>
        ))}
      </g>
    </svg>
  )
  return (
    <span ref={box} className={`eyt ${className}`.trim()} style={{ '--eyt-size': `${size}px` } as CSSProperties}>
      {pokable ? (
        <button type="button" className="eyt-poke" onClick={poke} aria-label={label ?? (lang === 'nl' ? 'Zeg hallo tegen de Verkoop-stip' : 'Say hello to the Verkoop dot')}>{art}</button>
      ) : art}
      {pokable && (
        <span className="eyt-say" data-on={talking || undefined} aria-live="polite">
          <span>{typed}</span><span className="eyt-caret" />
        </span>
      )}
    </span>
  )
}
