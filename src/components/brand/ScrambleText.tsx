import { useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

const GLYPHS = 'abcdefghijklmnopqrstuvwxyz0123456789'
const FRAME_MS = 32

/**
 * Text that resolves out of random letters when it scrolls into view, left to right.
 * Screen readers get the plain text; reduced motion shows it straight away.
 */
export default function ScrambleText({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()
  const [shown, setShown] = useState(text)

  useEffect(() => {
    if (!inView || reduce) { setShown(text); return }
    let frame = 0
    const total = text.length * 2 + 8
    const id = window.setInterval(() => {
      frame++
      const settled = Math.floor((frame / total) * text.length * 1.2)
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
