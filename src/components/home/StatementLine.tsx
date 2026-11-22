import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { useLang } from '../../i18n/LanguageContext'
import { trackEvent } from '../../lib/analytics'
import Cta from '../brand/Cta'

type Item =
  | { kind: 'word'; text: string; mute?: boolean }
  | { kind: 'labels'; labels: { text: string; tone: string; tilt: number }[] }
  | { kind: 'orb'; shape: 'ball' | 'pill'; tone: string }

const word = (text: string, mute = false): Item => ({ kind: 'word', text, mute })
const labels = (...list: [string, string, number][]): Item => ({ kind: 'labels', labels: list.map(([text, tone, tilt]) => ({ text, tone, tilt })) })
const orb = (shape: 'ball' | 'pill', tone: string): Item => ({ kind: 'orb', shape, tone })

const YELLOW = '#ffd23f'
const PINK = '#ff9fd0'
const SKY = '#b9c8ff'
const PAPER = '#f5f3ee'

/** The headline of the site as one line, with what each part is made of pinned beside it as labels. */
const LINE: Record<'nl' | 'en', { full: string; cta: string; items: Item[] }> = {
  nl: {
    full: 'Wij helpen kmo’s groeien met advertenties, overtuigende websites en automatische opvolging.',
    cta: 'Plan een gesprek',
    items: [
      word('Wij', true), word('helpen'), labels(['kmo’s', YELLOW, -7]), word('groeien'), orb('ball', PINK),
      word('met', true), word('advertenties,'), labels(['Meta Ads', SKY, -6], ['Google Ads', PAPER, 5]),
      word('overtuigende'), word('websites'), labels(['landingspagina’s', PINK, 4]), orb('pill', YELLOW),
      word('en', true), word('automatische'), word('opvolging.'), labels(['CRM', YELLOW, -8], ['e-mail', SKY, 6]),
    ],
  },
  en: {
    full: 'We help small businesses grow with ads, persuasive websites and automated follow-up.',
    cta: 'Plan a call',
    items: [
      word('We', true), word('help'), labels(['small businesses', YELLOW, -7]), word('grow'), orb('ball', PINK),
      word('with', true), word('ads,'), labels(['Meta Ads', SKY, -6], ['Google Ads', PAPER, 5]),
      word('persuasive'), word('websites'), labels(['landing pages', PINK, 4]), orb('pill', YELLOW),
      word('and', true), word('automated'), word('follow-up.'), labels(['CRM', YELLOW, -8], ['email', SKY, 6]),
    ],
  },
}

/**
 * One large line that travels sideways while the page scrolls down. Each word drops in letter by letter
 * as it enters, and the labels and shapes beside it pop in with a spring. Without scripts, or with
 * reduced motion, the same line is set as a wrapped paragraph.
 */
export default function StatementLine() {
  const { lang } = useLang()
  const t = LINE[lang]
  const reduce = useReducedMotion()
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [live, setLive] = useState(false)
  const [travel, setTravel] = useState(0)
  const from = useMotionValue(0)
  const to = useMotionValue(0)
  const { scrollYProgress, scrollY } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const x = useTransform(() => from.get() + (to.get() - from.get()) * scrollYProgress.get())

  /** An item shows once its left edge has come in from the right, and only when the section is nearly on screen. */
  const reveal = useCallback(() => {
    const box = section.current?.getBoundingClientRect()
    if (!box || !track.current || box.top > window.innerHeight * 0.8) return
    const limit = window.innerWidth * (window.innerWidth < 760 ? 0.92 : 0.86)
    track.current.querySelectorAll<HTMLElement>('[data-item]:not([data-in])').forEach((el) => {
      if (el.getBoundingClientRect().left < limit) el.setAttribute('data-in', '')
    })
  }, [])

  useEffect(() => { setLive(!reduce) }, [reduce])

  useEffect(() => {
    if (!live) return
    const measure = () => {
      if (!track.current) return
      const width = window.innerWidth
      const start = width * (width < 760 ? 0.08 : 0.06)
      const end = Math.min(start, -(track.current.scrollWidth - width * 0.9))
      from.set(start)
      to.set(end)
      setTravel(Math.round((start - end) * 0.62))
      reveal()
    }
    const frame = requestAnimationFrame(measure)
    document.fonts?.ready.then(measure).catch(() => {})
    window.addEventListener('resize', measure)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', measure) }
  }, [live, lang, from, to, reveal])

  useMotionValueEvent(scrollY, 'change', () => { if (live) reveal() })

  return (
    <section ref={section} className="sl" data-live={live ? '' : undefined} style={live && travel ? ({ '--sl-travel': `${travel}px` } as CSSProperties) : undefined} aria-labelledby="statement-title">
      <h2 id="statement-title" className="sr-only">{t.full}</h2>
      <div className="sl-stage">
        <motion.div ref={track} className="sl-track" style={live ? { x } : undefined}>
          {t.items.map((item, i) => {
            if (item.kind === 'word') {
              return (
                <span key={i} data-item className={`sl-word${item.mute ? ' is-mute' : ''}`} aria-hidden="true">
                  {Array.from(item.text).map((char, c) => <span key={c} className="sl-ch" style={{ '--c': c } as CSSProperties}>{char}</span>)}
                </span>
              )
            }
            if (item.kind === 'labels') {
              return (
                <span key={i} data-item className={`sl-labels${item.labels.length > 1 ? ' sl-labels--stack' : ''}`} aria-hidden="true">
                  {item.labels.map((label, n) => <span key={label.text} className="sl-label" style={{ '--tone': label.tone, '--tilt': `${label.tilt}deg`, '--n': n } as CSSProperties}>{label.text}</span>)}
                </span>
              )
            }
            return <span key={i} data-item className={`sl-orb sl-orb--${item.shape}`} style={{ '--tone': item.tone } as CSSProperties} aria-hidden="true" />
          })}
          <span data-item className="sl-cta"><Cta variant="paper" to="/contact" onClick={() => trackEvent('audit_cta_clicked', { placement: 'home_statement' })}>{t.cta}</Cta></span>
          <span className="sl-end" aria-hidden="true" />
        </motion.div>
      </div>
    </section>
  )
}
