import { useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'

type RGB = [number, number, number]

const fract = (x: number) => x - Math.floor(x)
const hash = (i: number, j: number, k: number) => fract(Math.sin(i * 127.1 + j * 311.7 + k * 74.7) * 43758.5453)
/** Blue to sky to paper: for a blue ground. */
const ON_BLUE: [RGB, RGB, RGB] = [[110, 138, 255], [185, 200, 255], [245, 243, 238]]
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]

/**
 * A field of soft dots that thickens toward the bottom of its box: sparse and ragged where it
 * starts, dense below. Each dot breathes at its own pace, and dots near the pointer swell.
 * It only draws while on screen; with reduced motion it is one still frame.
 */
export default function DotField({
  className = '',
  colors = ON_BLUE,
  from = 0.3,
  dense = 0.85,
  alpha = 0.5,
  step = 18,
}: {
  className?: string
  /** Colours from the sparse edge to the dense bottom. */
  colors?: [RGB, RGB, RGB]
  /** Where the field begins and where it is fully dense, as parts of the height. */
  from?: number
  dense?: number
  alpha?: number
  step?: number
}) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const el = canvas.current
    const host = el?.parentElement
    const ctx = el?.getContext('2d')
    if (!el || !host || !ctx) return
    let W = 0
    let H = 0
    let frame = 0
    let visible = false
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999 }

    const size = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      W = host.clientWidth
      H = host.clientHeight
      el.width = Math.round(W * dpr)
      el.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H)
      ctx.globalAlpha = alpha
      pointer.x += (pointer.tx - pointer.x) * 0.12
      pointer.y += (pointer.ty - pointer.y) * 0.12
      const top = H * from
      const full = H * dense
      const cols = Math.ceil(W / step) + 1
      const rows = Math.ceil(H / step) + 1
      for (let j = 0; j < rows; j++) {
        const y = j * step + step / 2
        if (y < top - step * 2) continue
        const v = Math.min(1, Math.max(0, (y - top) / (full - top)))
        const c = v < 0.55 ? mix(colors[0], colors[1], v / 0.55) : mix(colors[1], colors[2], (v - 0.55) / 0.45)
        ctx.fillStyle = `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`
        for (let i = 0; i < cols; i++) {
          const a = hash(i, j, 0)
          const b = hash(i, j, 1)
          const s = hash(i, j, 2)
          const keep = Math.min(1, v * 1.6 + 0.12) - a * 0.6
          if (keep <= 0 && s > 0.08) continue
          const x = i * step + step / 2
          const wave = reduce ? 0.7 : 0.5 + 0.5 * Math.sin(t * (1.6 + b * 2.6) + a * Math.PI * 2 + Math.sin(t * 0.7 + i * 0.21 + j * 0.13) * 1.4)
          let r = (0.42 + 0.58 * Math.pow(wave, 1.3)) * Math.min(1, 0.5 + v * 0.6) * (keep > 0 ? 1 : 0.8)
          const dx = x - pointer.x
          const dy = y - pointer.y
          r = Math.min(1.05, r + 0.7 * Math.exp(-(dx * dx + dy * dy) / (step * step * 22)))
          ctx.beginPath()
          ctx.arc(x, y, r * step * 0.37, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    const loop = (ms: number) => {
      draw(ms / 1000)
      frame = visible && !reduce ? requestAnimationFrame(loop) : 0
    }
    const start = () => { if (!frame) frame = requestAnimationFrame(loop) }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const box = host.getBoundingClientRect()
      pointer.tx = event.clientX - box.left
      pointer.ty = event.clientY - box.top
      if (pointer.x < -999) { pointer.x = pointer.tx; pointer.y = pointer.ty }
    }
    const onLeave = () => { pointer.tx = -9999; pointer.ty = -9999 }

    size()
    draw(0)
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && !document.hidden
      if (visible) start()
    })
    seen.observe(host)
    const resized = new ResizeObserver(() => { size(); draw(performance.now() / 1000) })
    resized.observe(host)
    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      seen.disconnect()
      resized.disconnect()
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
    }
  }, [reduce, colors, from, dense, alpha, step])

  return <canvas ref={canvas} className={`vs-dotfield ${className}`.trim()} aria-hidden="true" />
}
