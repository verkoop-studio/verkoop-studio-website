import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import TextLink from '../brand/TextLink'
import type { Bi, Lang } from '../../data/types'
import { useLang } from '../../i18n/LanguageContext'
import { trackEvent } from '../../lib/analytics'
import Cta from '../brand/Cta'
import { EASE } from '../brand/motion'

type LayerKey = 'ad' | 'page' | 'form' | 'crm' | 'pixel' | 'dashboard' | 'report'

type Layer = {
  key: LayerKey
  tint: string
  title: Bi<string>
  body: Bi<string>
  specs: Bi<string[]>
}

/**
 * Every claim comes from the products and the site (verkoop-knowledge/knowledge/{crm,dashboard}.md,
 * the services and pricing data). Written for someone without marketing knowledge.
 */
const LAYERS: Layer[] = [
  {
    key: 'ad', tint: '#2b4bf2',
    title: { nl: 'Advertentie', en: 'Ad' },
    body: { nl: 'We zetten je aanbod voor de juiste mensen.', en: 'We put your offer in front of the right people.' },
    specs: { nl: ['Op Facebook, Instagram en Google', 'Alle resultaten op één plek', 'Budget gaat naar wat verkoopt'], en: ['On Facebook, Instagram and Google', 'All results in one place', 'Budget goes to what sells'] },
  },
  {
    key: 'page', tint: '#ffd23f',
    title: { nl: 'Landingspagina', en: 'Landing page' },
    body: { nl: 'Eén pagina, één boodschap, één knop.', en: 'One page, one message, one button.' },
    specs: { nl: ['Wij bouwen hem voor je', 'Gemaakt om aanvragen te krijgen', 'We zien wat bezoekers doen'], en: ['We build it for you', 'Made to get enquiries', 'We see what visitors do'] },
  },
  {
    key: 'form', tint: '#ff9fd0',
    title: { nl: 'Formulier', en: 'Form' },
    body: { nl: 'Wie interesse heeft, laat zijn gegevens achter.', en: 'Whoever is interested leaves their details.' },
    specs: { nl: ['Komt meteen in je CRM', 'Bevestiging per e-mail', 'Je ziet via welke advertentie de lead kwam'], en: ['Lands in your CRM straight away', 'Confirmation by email', 'You see which ad the lead came from'] },
  },
  {
    key: 'crm', tint: '#c9f26a',
    title: { nl: 'Sales CRM', en: 'Sales CRM' },
    body: { nl: 'Al je leads in één overzicht.', en: 'All your leads in one view.' },
    specs: { nl: ['Gratis tot 500 leads', 'Je ziet wie je vandaag moet bellen', 'Offertes en contracten bij elke klant', 'Werkt samen met ChatGPT'], en: ['Free up to 500 leads', 'See who to call today', 'Quotes and contracts on every client', 'Works with ChatGPT'] },
  },
  {
    key: 'pixel', tint: '#7d93ff',
    title: { nl: 'Pixel', en: 'Pixel' },
    body: { nl: 'Een stukje code dat meet wat bezoekers doen.', en: 'A small piece of code that measures what visitors do.' },
    specs: { nl: ['Je eigen meting, niet die van Facebook', 'Respecteert de cookiekeuze van je bezoeker', 'Ziet elke Shopify-bestelling, ook als de browser trackers blokkeert'], en: ['Your own measurement, not Facebook’s', 'Respects your visitor’s cookie choice', 'Sees every Shopify order, even when the browser blocks trackers'] },
  },
  {
    key: 'dashboard', tint: '#ff7a59',
    title: { nl: 'Dashboard', en: 'Dashboard' },
    body: { nl: 'Zie welke advertentie echt verkoopt.', en: 'See which ad really sells.' },
    specs: { nl: ['Uitgaven en omzet per kanaal', 'De weg van eerste klik tot aankoop', 'Facebook, Google, TikTok, Shopify en meer'], en: ['Spend and revenue per channel', 'The path from first click to purchase', 'Facebook, Google, TikTok, Shopify and more'] },
  },
  {
    key: 'report', tint: '#f5f3ee',
    title: { nl: 'Rapport', en: 'Report' },
    body: { nl: 'Elke maand: wat werkte, en wat nu.', en: 'Every month: what worked, and what next.' },
    specs: { nl: ['Een helder maandrapport', 'Concreet advies voor je budget', 'Deel het met je team'], en: ['A clear monthly report', 'Concrete advice on your budget', 'Share it with your team'] },
  },
]

const COPY = {
  nl: { label: 'Het systeem, uit elkaar gehaald', intro: 'Zeven onderdelen. Eén weg van klik tot klant.', end: 'Alles weer samen.', endBody: 'Wij bouwen het voor jou. Elk onderdeel meet wat het volgende doet.', cta: 'Plan een gesprek', cases: 'Bekijk de resultaten', sample: 'Voorbeeld' },
  en: { label: 'The system, taken apart', intro: 'Seven parts. One path from click to customer.', end: 'All back together.', endBody: 'We build it for you. Every part measures what the next one does.', cta: 'Plan a call', cases: 'See the results', sample: 'Sample' },
}

/** The words inside each sample screen. Every figure here is invented and labelled as a sample. */
const UI: Record<Lang, Record<LayerKey, { win: string; note: string; rows: string[] }>> = {
  nl: {
    ad: { win: 'Facebook', note: 'Budget volgt wat verkoopt', rows: ['Verkoop Studio · Gesponsord', 'Gratis groeiplan voor je webshop', 'Meer info'] },
    page: { win: 'jouwsite.be/actie', note: 'Eén pagina, één actie', rows: ['Meer klanten uit je advertenties', 'Vraag je gratis plan aan'] },
    form: { win: 'Aanvraag', note: 'Lead ontvangen', rows: ['Naam', 'Sarah', 'E-mail', 'sarah@bedrijf.be', 'Verstuur'] },
    crm: { win: 'Sales CRM', note: '38 van 500 gratis leads', rows: ['Nieuw', 'Gecontacteerd', 'Afspraak', 'Voorstel'] },
    pixel: { win: 'Metingen', note: 'Cookiekeuze gerespecteerd', rows: ['Pagina bekeken', 'Formulier verstuurd', 'Aankoop € 84'] },
    dashboard: { win: 'Performance', note: 'Beste advertentie: video 2', rows: ['Uitgaven', '€ 1.240', 'Omzet', '€ 5.890', 'Per euro', '4,7×'] },
    report: { win: 'Maandrapport', note: 'Elke maand in je mailbox', rows: ['Meeste omzet via Google', 'Facebook: duurdere leads', 'Advies: meer budget naar Google'] },
  },
  en: {
    ad: { win: 'Facebook', note: 'Budget follows what sells', rows: ['Verkoop Studio · Sponsored', 'A free growth plan for your shop', 'Learn more'] },
    page: { win: 'yoursite.com/offer', note: 'One page, one action', rows: ['More customers from your ads', 'Ask for your free plan'] },
    form: { win: 'Enquiry', note: 'Lead received', rows: ['Name', 'Sarah', 'Email', 'sarah@company.com', 'Send'] },
    crm: { win: 'Sales CRM', note: '38 of 500 free leads', rows: ['New', 'Contacted', 'Meeting', 'Proposal'] },
    pixel: { win: 'Events', note: 'Cookie choice respected', rows: ['Page viewed', 'Form sent', 'Purchase € 84'] },
    dashboard: { win: 'Performance', note: 'Best ad: video 2', rows: ['Spend', '€ 1,240', 'Revenue', '€ 5,890', 'Per euro', '4.7×'] },
    report: { win: 'Monthly report', note: 'In your inbox every month', rows: ['Most revenue through Google', 'Facebook: dearer leads', 'Advice: more budget to Google'] },
  },
}

/** What sits inside the app window for one layer. Flat HTML, so every word stays readable. */
function Screen({ k, rows }: { k: LayerKey; rows: string[] }) {
  if (k === 'ad') return (
    <div className="tx-ad">
      <p className="tx-dim">{rows[0]}</p>
      <div className="tx-ad-img" />
      <p className="tx-strong">{rows[1]}</p>
      <span className="tx-btn">{rows[2]}</span>
    </div>
  )
  if (k === 'page') return (
    <div className="tx-page">
      <p className="tx-page-h">{rows[0]}</p>
      <i /><i style={{ width: '62%' }} />
      <span className="tx-btn tx-btn--ink">{rows[1]}</span>
    </div>
  )
  if (k === 'form') return (
    <div className="tx-form">
      <label><span>{rows[0]}</span><b className="tx-type">{rows[1]}</b></label>
      <label><span>{rows[2]}</span><b className="tx-type tx-type--2">{rows[3]}</b></label>
      <span className="tx-btn tx-btn--ink">{rows[4]}</span>
    </div>
  )
  if (k === 'crm') return (
    <div className="tx-crm">
      {rows.map((name, col) => (
        <div key={name}>
          <p className="tx-dim">{name}</p>
          {Array.from({ length: col === 0 ? 2 : col === 3 ? 1 : 2 }, (_, i) => <i key={i} />)}
        </div>
      ))}
      <b className="tx-crm-live" />
    </div>
  )
  if (k === 'pixel') return (
    <ul className="tx-feed">
      {rows.map((row, i) => <li key={row} style={{ animationDelay: `${0.3 + i * 0.5}s` }}><span />{row}</li>)}
    </ul>
  )
  if (k === 'dashboard') return (
    <div className="tx-dash">
      <dl>{[0, 2, 4].map((i) => <div key={i}><dt>{rows[i]}</dt><dd>{rows[i + 1]}</dd></div>)}</dl>
      <div className="tx-bars">{[42, 64, 38, 80, 56, 96].map((h, i) => <i key={i} style={{ height: `${h}%`, animationDelay: `${0.2 + i * 0.07}s` }} />)}</div>
    </div>
  )
  return (
    <ul className="tx-report">
      {rows.map((row, i) => <li key={row} className={i === 2 ? 'tx-strong' : ''}><Tick delay={0.3 + i * 0.25} />{row}</li>)}
    </ul>
  )
}

function Tick({ delay = 0 }: { delay?: number }) {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path className="tx-tick" style={{ animationDelay: `${delay}s` }} d="M2 7.5 5.5 11 12 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" pathLength={1} /></svg>
}

/** One part of the system as a card: its screen on top, what it does for you underneath. */
function Card({ layer, index, lang, active }: { layer: Layer; index: number; lang: Lang; active: boolean }) {
  const ui = UI[lang][layer.key]
  return (
    <article className={`tx-card${active ? ' is-on' : ''}`} style={{ '--t': layer.tint } as CSSProperties}>
      <div className="tx-stage" aria-hidden="true">
        <div className="tx-win">
          <div className="tx-win-bar"><i /><i /><i /><b>{ui.win}</b><em>{COPY[lang].sample}</em></div>
          <Screen k={layer.key} rows={ui.rows} />
        </div>
        <p className="tx-note"><Tick delay={0.9} />{ui.note}</p>
      </div>
      <div className="tx-info">
        <p className="tx-step">{String(index + 1).padStart(2, '0')} / {String(LAYERS.length).padStart(2, '0')}</p>
        <h3 className="tx-title">{layer.title[lang]}</h3>
        <p className="tx-body">{layer.body[lang]}</p>
        <ul className="tx-specs">{layer.specs[lang].map((spec) => <li key={spec}><Tick />{spec}</li>)}</ul>
      </div>
    </article>
  )
}

/** Dot shapes for the mark beside the cards: one set of dots, a new home for each on every step. */
const SHAPES = [
  (x: number, y: number) => x * x + y * y < 0.72,
  (x: number, y: number) => Math.abs(x) < 0.74 && Math.abs(y) < 0.74,
  (x: number, y: number) => y > -0.8 && y < 0.8 && Math.abs(x) < 0.16 + (0.8 - y) * 0.42,
  (x: number, y: number) => { const r = x * x + y * y; return r < 0.76 && r > 0.3 },
]
const DOTS = 220

function homes(shape: number, size: number) {
  const inside = SHAPES[shape % SHAPES.length]
  const pts: number[][] = []
  for (let gap = 0.2; pts.length < DOTS && gap > 0.04; gap -= 0.01) {
    pts.length = 0
    for (let y = -1, row = 0; y <= 1; y += gap * 0.87, row++) for (let x = -1 + (row % 2) * gap * 0.5; x <= 1; x += gap) if (inside(x, y)) pts.push([x, y])
  }
  return Array.from({ length: DOTS }, (_, i) => { const p = pts[Math.floor((i * pts.length) / DOTS)]; return [(p[0] + 1) * size / 2, (p[1] + 1) * size / 2] })
}

/** A shape made of dots that re-forms for each step and parts round the pointer. */
function DotMark({ step }: { step: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const state = useRef<{ dots: number[][]; hand: number[] | null; raf: number }>({ dots: [], hand: null, raf: 0 })
  const SIZE = 180
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const s = state.current
    const ratio = Math.min(2, window.devicePixelRatio || 1)
    canvas.width = canvas.height = SIZE * ratio
    const next = homes(Math.max(0, step), SIZE)
    if (!s.dots.length) s.dots = next.map(([x, y]) => [x, y, 0, 0, x, y])
    else {
      const byAngle = (list: number[][], a: number, b: number) => list.map((d, i) => [Math.atan2(d[b] - SIZE / 2, d[a] - SIZE / 2), i]).sort((p, q) => p[0] - q[0])
      const from = byAngle(s.dots, 0, 1), to = byAngle(next, 0, 1)
      from.forEach(([, di], k) => { s.dots[di][4] = next[to[k][1]][0]; s.dots[di][5] = next[to[k][1]][1] })
    }
    const g = canvas.getContext('2d')!
    const tick = () => {
      let busy = !!s.hand
      g.setTransform(ratio, 0, 0, ratio, 0, 0); g.clearRect(0, 0, SIZE, SIZE); g.fillStyle = getComputedStyle(canvas).color; g.beginPath()
      for (const d of s.dots) {
        if (s.hand) { const dx = d[0] - s.hand[0], dy = d[1] - s.hand[1], dist = Math.hypot(dx, dy); if (dist < 46 && dist > 0.01) { const f = (1 - dist / 46) ** 2 * 5; d[2] += (dx / dist) * f; d[3] += (dy / dist) * f } }
        d[2] = (d[2] + (d[4] - d[0]) * 0.06) * 0.82; d[3] = (d[3] + (d[5] - d[1]) * 0.06) * 0.82
        d[0] += d[2]; d[1] += d[3]
        if (Math.abs(d[2]) + Math.abs(d[3]) + Math.abs(d[4] - d[0]) + Math.abs(d[5] - d[1]) > 0.08) busy = true
        g.moveTo(d[0] + 1.7, d[1]); g.arc(d[0], d[1], 1.7, 0, Math.PI * 2)
      }
      g.fill()
      s.raf = busy ? requestAnimationFrame(tick) : 0
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { s.dots.forEach((d) => { d[0] = d[4]; d[1] = d[5] }) }
    cancelAnimationFrame(s.raf); s.raf = requestAnimationFrame(tick)
    const move = (e: PointerEvent) => { const box = canvas.getBoundingClientRect(); s.hand = [e.clientX - box.left, e.clientY - box.top]; if (!s.raf) s.raf = requestAnimationFrame(tick) }
    const leave = () => { s.hand = null; if (!s.raf) s.raf = requestAnimationFrame(tick) }
    canvas.addEventListener('pointermove', move); canvas.addEventListener('pointerleave', leave)
    return () => { cancelAnimationFrame(s.raf); s.raf = 0; canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerleave', leave) }
  }, [step])
  return <canvas ref={ref} className="tx-dots" style={{ width: SIZE, height: SIZE }} aria-hidden="true" />
}

const PHASE_START = 0.06
const PHASE_END = 0.9

function useWide() {
  const [wide, setWide] = useState(true)
  useEffect(() => {
    const query = window.matchMedia('(min-width: 900px)')
    const update = () => setWide(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return wide
}

/**
 * The growth system, one part at a time. On a wide screen the section pins and each
 * part arrives as a card dealt onto a small pile, with its own sample screen; the
 * index on the left jumps between them. Phones and reduced motion get the same
 * cards as a plain list.
 */
export default function SystemTeardown() {
  const { lang } = useLang()
  const t = COPY[lang]
  const reduce = useReducedMotion()
  const wide = useWide()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [step, setStep] = useState(-1)

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (p < PHASE_START) return setStep(-1)
    if (p > PHASE_END) return setStep(LAYERS.length)
    setStep(Math.min(LAYERS.length - 1, Math.floor(((p - PHASE_START) / (PHASE_END - PHASE_START)) * LAYERS.length)))
  })

  const cta = <Cta to="/contact" onClick={() => trackEvent('audit_cta_clicked', { placement: 'home_teardown' })}>{t.cta}</Cta>

  if (reduce || !wide) {
    return (
      <section className="tx tx--list" aria-labelledby="td-title">
        <div className="vs-wrap">
          <p className="vs-label">{t.label}</p>
          <h2 id="td-title" className="vs-h2">{t.intro}</h2>
          <div className="tx-list">{LAYERS.map((layer, i) => <Card key={layer.key} layer={layer} index={i} lang={lang} active />)}</div>
          <p className="tx-end">{t.end}</p>
          {cta}
        </div>
      </section>
    )
  }

  const jump = (i: number) => {
    const el = ref.current
    if (!el) return
    const span = el.offsetHeight - window.innerHeight
    const at = PHASE_START + ((i + 0.5) / LAYERS.length) * (PHASE_END - PHASE_START)
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + span * at, behavior: 'smooth' })
  }
  const done = step >= LAYERS.length
  const shown = Math.min(step, LAYERS.length - 1)

  return (
    <section ref={ref} className="tx" aria-labelledby="td-title" style={{ height: `${LAYERS.length * 62 + 150}vh` }}>
      <div className="tx-sticky">
        <div className="vs-wrap tx-grid">
          <div className="tx-side">
            <p className="vs-label">{t.label}</p>
            <AnimatePresence mode="wait">
              <motion.h2 key={done ? 'end' : 'intro'} id="td-title" className="tx-head" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.45, ease: EASE }}>
                {done ? t.end : t.intro}
              </motion.h2>
            </AnimatePresence>
            <ol className="tx-index">
              {LAYERS.map((layer, i) => (
                <li key={layer.key}>
                  <button type="button" className={i === shown ? 'is-on' : i < shown ? 'is-past' : ''} onClick={() => jump(i)} aria-current={i === shown ? 'step' : undefined}>
                    <span>{String(i + 1).padStart(2, '0')}</span>{layer.title[lang]}
                  </button>
                </li>
              ))}
            </ol>
            <div className="tx-foot">
              <DotMark step={shown} />
              {done && (
                <motion.div className="tx-actions" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE }}>
                  <p>{t.endBody}</p>
                  {cta}
                  <TextLink to="/#resultaten">{t.cases}</TextLink>
                </motion.div>
              )}
            </div>
          </div>
          <div className="tx-deck">
            {LAYERS.map((layer, i) => {
              const depth = shown - i
              const waiting = depth < 0
              const lean = (i % 2 ? 1 : -1)
              return (
                <motion.div
                  key={layer.key}
                  className="tx-slot"
                  style={{ zIndex: i + 1, pointerEvents: depth === 0 ? 'auto' : 'none' }}
                  initial={false}
                  animate={
                    waiting ? { y: step < 0 && i === 0 ? '64%' : '118%', rotate: lean * 5, scale: 1, opacity: 1 }
                    : done ? { y: (i - 3) * 7, x: (i - 3) * 16, rotate: (i - 3) * 2.4, scale: 0.9, opacity: 1 }
                    : { y: -depth * 18, x: 0, rotate: depth === 0 ? lean * 0.7 : lean * (1.4 + depth), scale: 1 - depth * 0.045, opacity: depth > 2 ? 0 : 1 }
                  }
                  transition={{ type: 'spring', stiffness: 150, damping: 21, mass: 0.9 }}
                >
                  <Card layer={layer} index={i} lang={lang} active={depth === 0 && !done} />
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
