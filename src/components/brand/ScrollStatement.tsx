import { useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { Fragment, useRef, type CSSProperties } from 'react'
import ResponsiveImage from '../ResponsiveImage'

/** A run of words, or a person dropped into the sentence as a small photo pill. */
export type StatementPart = string | { name: string; photo: string }

/**
 * A statement that inks in word by word as it scrolls past: each word goes from a quarter to
 * full strength. People appear inline as a pill with their photo. Reduced motion shows it
 * fully inked. Written to hold a real client quote later in the same slot.
 */
export default function ScrollStatement({ parts, label }: { parts: StatementPart[]; label?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] })
  useMotionValueEvent(scrollYProgress, 'change', (p) => ref.current?.style.setProperty('--p', p.toFixed(4)))
  const total = parts.reduce((n, part) => n + (typeof part === 'string' ? part.split(/\s+/).filter(Boolean).length : 1), 0)
  let index = 0
  return (
    <p ref={ref} className={`vs-statement${reduce ? ' is-still' : ''}`} style={{ '--n': total } as CSSProperties} aria-label={label}>
      {parts.map((part, i) => {
        if (typeof part !== 'string') {
          const at = index++
          return (
            <Fragment key={i}>
              <span className="vs-statement-pill" style={{ '--i': at } as CSSProperties}><ResponsiveImage src={part.photo} alt="" sizes="48px" />{part.name}</span>{' '}
            </Fragment>
          )
        }
        return part.split(/\s+/).filter(Boolean).map((word, j) => {
          const at = index++
          return <Fragment key={`${i}-${j}`}><span className="vs-statement-word" style={{ '--i': at } as CSSProperties}>{word}</span>{' '}</Fragment>
        })
      })}
    </p>
  )
}
