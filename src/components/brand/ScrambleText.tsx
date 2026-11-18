import { useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

const GLYPHS = 'abcdefghijklmnopqrstuvwxyz0123456789'
const FRAME_MS = 32
/** The whole line settles within this many frames (about 450 ms). */
const FRAMES = 14

/**
 * Text that resolves out of random letters once it is fully in view, left to right, within half a second.
 * Screen readers get the plain text; reduced motion shows it straight away.
 */
export default function ScrambleText({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 1 })
  const reduce = useReducedMotion()
  const [shown, setShown] = useState(text)

  useEffect(() => {
    if (!inView || reduce) { setShown(text); return }
    let frame = 0
    const id = window.setInterval(() => {
      frame++
      const settled = Math.ceil((frame / FRAMES) * text.length)
      setShown(text.split('').map((ch, i) => (ch === ' ' || i < settled ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])).join(''))
      if (settled >= text.length) { window.clearInterval(id); setShown(text) }
    }, FRAME_MS)
    return () => window.clearInterval(id)
  }, [inView, reduce, text])

  return (
    <span ref={ref} className={`vs-scramble ${className}`.trim()} aria-label={text}>
      <span aria-hidden="true">{shown}</span>
    </span>
  )
}
