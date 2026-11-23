import { motion, useReducedMotion } from 'motion/react'
import { Fragment, type ElementType } from 'react'
import { EASE_LETTER, EASE_WIPE, VIEWPORT } from './motion'

export interface HeadlinePart {
  text: string
  /** `accent` sets the words on a filled highlight; `mute` greys them. */
  tone?: 'accent' | 'mute'
  /** Start this part on a new line. */
  breakBefore?: boolean
  /** Extra class on this part's words, e.g. a smaller second line. */
  className?: string
}

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.02 } } }
const word = { hidden: { x: '80%' }, visible: { x: '0%', transition: { duration: 0.45, ease: EASE_LETTER } } }
const letter = { hidden: { x: '150%' }, visible: { x: '0%', transition: { duration: 0.45, ease: EASE_LETTER } } }
const highlight = { hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 0.6, ease: EASE_WIPE } } }

const muteStyle = { color: 'var(--vs-mute)' }

/**
 * Letter-slide headline. Each word sits in a clipped mask sliding in from 80%,
 * while its letters counter-slide from 150%. Accent words sit on a highlight
 * that wipes in from the left. Screen readers get the plain string.
 */
export default function SplitHeadline({
  parts,
  as = 'h2',
  className,
  id,
  onMount = false,
}: {
  parts: HeadlinePart[]
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  id?: string
  /** Animate on first paint (hero) instead of on scroll. */
  onMount?: boolean
}) {
  const reduce = useReducedMotion()
  const label = parts.map((p) => p.text).join(' ')
  const Tag = as as ElementType
  const MotionTag = motion[as]

  if (reduce) {
    return (
      <Tag id={id} className={className}>
        {parts.map((p, i) => (
          <Fragment key={i}>
            {p.breakBefore && <br />}
            {p.tone === 'accent'
              ? <span className="vs-mark"><span className="vs-mark-bg" aria-hidden="true" />{p.text}</span>
              : <span className={p.className} style={p.tone === 'mute' ? muteStyle : undefined}>{p.text}</span>}
            {i < parts.length - 1 && ' '}
          </Fragment>
        ))}
      </Tag>
    )
  }

  const trigger = onMount
    ? { initial: 'hidden', animate: 'visible' }
    : { initial: 'hidden', whileInView: 'visible', viewport: VIEWPORT }

  return (
    <MotionTag id={id} className={className} aria-label={label} variants={container} {...trigger}>
      {parts.map((part, p) => {
        const words = part.text.split(' ')
        const body = words.map((w, i) => (
          <Fragment key={i}>
            <span aria-hidden="true" className="vs-split-word" style={part.tone === 'mute' ? muteStyle : undefined}>
              <motion.span variants={word} className="vs-split-inner">
                {Array.from(w).map((ch, j) => (
                  <motion.span key={j} variants={letter} className="vs-split-letter">{ch}</motion.span>
                ))}
              </motion.span>
            </span>
            {i < words.length - 1 && <span aria-hidden="true"> </span>}
          </Fragment>
        ))
        return (
          <Fragment key={p}>
            {part.breakBefore && <br />}
            {part.tone === 'accent' ? (
              <span className="vs-mark" aria-hidden="true">
                <motion.span className="vs-mark-bg" variants={highlight} />
                {body}
              </span>
            ) : part.className ? <span className={part.className}>{body}</span> : body}
            {p < parts.length - 1 && <span aria-hidden="true"> </span>}
          </Fragment>
        )
      })}
    </MotionTag>
  )
}
