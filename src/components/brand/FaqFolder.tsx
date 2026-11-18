import { useInView, useReducedMotion } from 'motion/react'
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import type { Lang } from '../../data/types'

export interface FaqRow { question: string; answer: string; extra?: boolean }

/** How long an open answer stays before the next one opens by itself. */
const AUTO_MS = 6000

/** "Ja.", "Nee.", "Beide.": an answer's own opening word or two, shown bold. Longer openings stay plain. */
function lead(answer: string): [string, string] {
  const match = answer.match(/^([^.!?]{1,22}[.!?])\s+(.*)$/s)
  if (!match || match[1].split(/\s+/).length > 3) return ['', answer]
  return [match[1], match[2]]
}

/**
 * The site's FAQ: an accent folder with numbered rows, one open at a time. While it is on
 * screen and untouched it opens the next answer every few seconds; any click, hover or
 * focus stops that for good. Every answer stays in the HTML. Reduced motion: no stagger,
 * no auto-advance.
 */
export default function FaqFolder({ id, title, items, lang, lede, group, titleId }: {
  id: string
  title: string
  items: FaqRow[]
  lang: Lang
  lede?: ReactNode
  /** Groups the rows in the HTML, e.g. for the homepage's structured data check. */
  group?: string
  titleId?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.35 })
  const seen = useInView(ref, { once: true, amount: 0.15 })
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(0)
  const [touched, setTouched] = useState(false)
  const [all, setAll] = useState(false)
  const nl = lang === 'nl'
  // Hidden extras stay in the HTML, so every answer can be read without a click.
  const visible = useMemo(() => items.map((item, i) => ({ item, i })).filter(({ item }) => all || !item.extra), [items, all])
  const number = new Map(visible.map(({ i }, n) => [i, n]))
  const hasExtra = items.some((item) => item.extra)
  const auto = inView && !touched && !reduce && visible.length > 1
  const headId = titleId ?? `${id}-title`

  useEffect(() => {
    if (!auto) return
    const timer = window.setTimeout(() => {
      const at = visible.findIndex(({ i }) => i === open)
      setOpen(visible[(at + 1) % visible.length].i)
    }, AUTO_MS)
    return () => window.clearTimeout(timer)
  }, [auto, open, visible])

  const stop = () => setTouched(true)

  return (
    <div ref={ref} className={`vs-faq${seen || reduce ? ' is-seen' : ''}`} onPointerEnter={stop} onFocus={stop}>
      <p className="vs-faq-tab" aria-hidden="true">
        <span className="vs-faq-sheet" />
        <span className="vs-faq-sheet vs-faq-sheet--2" />
        <span className="vs-faq-tab-face"><i>?</i>FAQ · {visible.length} {nl ? 'vragen' : 'questions'}</span>
      </p>
      <div className="vs-faq-card">
        <div className="vs-faq-head">
          <h2 id={headId} className="vs-h2">{title}</h2>
          {lede && <p className="vs-faq-lede">{lede}</p>}
        </div>
        <div className="vs-faq-rows">
          {items.map((item, i) => {
            const n = number.get(i)
            const isOpen = open === i && n !== undefined
            const [bold, rest] = lead(item.answer)
            return (
              <div key={item.question} className={`vs-faq-row${isOpen ? ' is-open' : ''}${n === undefined ? ' is-extra' : ''}`} data-faq={group} style={{ '--i': n ?? 0 } as CSSProperties}>
                <h3 className="vs-faq-q">
                  <button type="button" id={`${id}-q-${i}`} aria-expanded={isOpen} aria-controls={`${id}-a-${i}`} onClick={() => { stop(); setOpen(isOpen ? -1 : i) }}>
                    <span className="vs-faq-num">{String((n ?? i) + 1).padStart(2, '0')}</span>
                    <span className="vs-faq-text">{item.question}</span>
                    <span className="vs-faq-mark" aria-hidden="true"><i /><i /></span>
                  </button>
                </h3>
                <div id={`${id}-a-${i}`} role="region" aria-labelledby={`${id}-q-${i}`} className="vs-faq-a">
                  <div className="vs-faq-a-inner">
                    <p className="vs-faq-slip">{bold && <strong>{bold}</strong>}{bold && ' '}{rest}</p>
                  </div>
                </div>
                {auto && isOpen && <span key={open} className="vs-faq-progress" aria-hidden="true" />}
              </div>
            )
          })}
        </div>
        {hasExtra && (
          <button type="button" className="vs-faq-more" aria-expanded={all} onClick={() => { stop(); setAll((v) => !v) }}>
            {all ? (nl ? 'Toon minder vragen' : 'Show fewer questions') : (nl ? `Toon alle ${items.length} vragen` : `Show all ${items.length} questions`)}
          </button>
        )}
      </div>
    </div>
  )
}
