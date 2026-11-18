import { ArrowLeft, ArrowRight } from 'lucide-react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { cases } from '../../data/cases'
import type { Bi, CaseSlug } from '../../data/types'
import { useLang } from '../../i18n/LanguageContext'
import { trackEvent } from '../../lib/analytics'
import Arrow from '../brand/Arrow'
import HandNote from '../brand/HandNote'
import TextLink from '../brand/TextLink'
import Reveal from '../brand/Reveal'
import CasePoster from './CasePoster'
import SplitHeadline from '../brand/SplitHeadline'

/** Published results only. Cases without a validated figure show their sector. */
const RESULT: Partial<Record<CaseSlug, Bi<string>>> = {
  pinacello: { nl: '+120% online omzet', en: '+120% online revenue' },
  nooms: { nl: 'pre-sale volledig uitverkocht', en: 'pre-sale sold out' },
}

const COPY = {
  nl: { title: [{ text: 'Geselecteerd' }, { text: 'werk', tone: 'accent' as const }], hint: 'Scroll of sleep opzij', prev: 'Vorige case', next: 'Volgende case', all: 'Alle cases', drag: 'Sleep', dragging: 'Loslaten', note: 'sleep maar :)' },
  en: { title: [{ text: 'Selected' }, { text: 'work', tone: 'accent' as const }], hint: 'Scroll or drag sideways', prev: 'Previous case', next: 'Next case', all: 'All cases', drag: 'Drag', dragging: 'Release', note: 'drag me :)' },
}

export default function WorkScroller() {
  const { lang } = useLang()
  const t = COPY[lang]
  const track = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null)
  const [active, setActive] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [cursor, setCursor] = useState(false)
  const reduce = useReducedMotion()
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const labelX = useSpring(cursorX, { stiffness: 420, damping: 32, mass: 0.4 })
  const labelY = useSpring(cursorY, { stiffness: 420, damping: 32, mass: 0.4 })
  const items = cases.filter((c) => c.image && !c.unavailable)

  const measure = useCallback(() => {
    const el = track.current
    if (!el) return
    const centre = el.scrollLeft + el.clientWidth / 2
    let best = 0
    let bestDistance = Infinity
    Array.from(el.children).forEach((child, i) => {
      const node = child as HTMLElement
      const distance = Math.abs(node.offsetLeft + node.offsetWidth / 2 - centre)
      if (distance < bestDistance) { bestDistance = distance; best = i }
    })
    setActive((prev) => (prev === best ? prev : best))
  }, [])

  useEffect(() => {
    const el = track.current
    if (!el) return
    let frame = 0
    const onScroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure) }
    measure()
    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { cancelAnimationFrame(frame); el.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [measure])

  const go = (index: number) => {
    const el = track.current
    const target = el?.children[Math.max(0, Math.min(items.length - 1, index))] as HTMLElement | undefined
    if (!el || !target) return
    el.scrollTo({ left: target.offsetLeft + target.offsetWidth / 2 - el.clientWidth / 2, behavior: 'smooth' })
  }

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || !track.current) return
    drag.current = { x: event.clientX, left: track.current.scrollLeft, moved: false }
  }
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') { cursorX.set(event.clientX); cursorY.set(event.clientY); setCursor(true) }
    const state = drag.current
    const el = track.current
    if (!state || !el) return
    const dx = event.clientX - state.x
    if (!state.moved && Math.abs(dx) > 6) { state.moved = true; setDragging(true); el.setPointerCapture(event.pointerId) }
    if (state.moved) el.scrollLeft = state.left - dx
  }
  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = drag.current
    drag.current = null
    if (!state?.moved) return
    track.current?.releasePointerCapture(event.pointerId)
    setDragging(false)
    go(active)
  }
  const onClickCapture = (event: React.MouseEvent) => {
    if (dragging) { event.preventDefault(); event.stopPropagation() }
  }
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); go(active + 1) }
    if (event.key === 'ArrowLeft') { event.preventDefault(); go(active - 1) }
  }

  return (
    <section id="resultaten" className="vs-section" aria-labelledby="work-title">
      <div className="vs-wrap vs-section-head">
        <SplitHeadline id="work-title" className="vs-h2" parts={t.title} />
        <Reveal className="vs-work-controls" y={12}>
          <HandNote point="down-right" className="vs-work-note">{t.note}</HandNote>
          <button type="button" className="vs-round-btn" aria-label={t.prev} onClick={() => go(active - 1)} disabled={active === 0}><Arrow direction="left" size={18} /></button>
          <button type="button" className="vs-round-btn" aria-label={t.next} onClick={() => go(active + 1)} disabled={active === items.length - 1}><Arrow size={18} /></button>
        </Reveal>
      </div>
      <div
        ref={track}
        className={`vs-work-track${dragging ? ' is-dragging' : ''}`}
        role="region"
        aria-roledescription="carousel"
        aria-label={lang === 'nl' ? 'Cases, horizontaal scrollen' : 'Case studies, scroll horizontally'}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={() => setCursor(false)}
        onClickCapture={onClickCapture}
      >
        {items.map((item, i) => {
          const label = RESULT[item.slug]?.[lang] ?? item.sector[lang]
          return (
            <figure key={item.slug} className={`vs-slide${i === active ? ' is-active' : ''}`} aria-roledescription="slide" aria-label={`${i + 1} / ${items.length}`}>
              <Link to={`/cases/${item.slug}`} draggable={false} aria-label={`${item.name}: ${item.summary[lang]}`} onClick={() => trackEvent('case_viewed', { case: item.slug, placement: 'home_scroller' })}>
                <div className="vs-slide-frame">
                  <CasePoster slug={item.slug} name={item.name} caption={label} lang={lang} />
                </div>
                <figcaption><span className="vs-slide-tag">{item.name} ({label})</span></figcaption>
              </Link>
            </figure>
          )
        })}
      </div>
      {!reduce && (
        <motion.span
          className="vs-cursor"
          aria-hidden="true"
          style={{ x: labelX, y: labelY }}
          initial={false}
          animate={{ opacity: cursor ? 1 : 0, scale: cursor ? (dragging ? 0.86 : 1) : 0.5 }}
          transition={{ duration: 0.25 }}
        >
          <ArrowLeft size={13} />{dragging ? t.dragging : t.drag}<ArrowRight size={13} />
        </motion.span>
      )}
      <div className="vs-wrap" style={{ marginTop: 28 }}>
        <TextLink to="/cases">{t.all}</TextLink>
      </div>
    </section>
  )
}
