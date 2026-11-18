import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { AUDIT_SCOPE } from '../../data/audit'
import { PAINS } from '../../data/pains'
import { processSteps } from '../../data/process'
import type { Lang } from '../../data/types'
import { useLang } from '../../i18n/LanguageContext'
import { trackEvent } from '../../lib/analytics'
import { useWide } from '../../lib/useWide'
import Cta from '../brand/Cta'
import Reveal from '../brand/Reveal'
import RollingNumber from '../brand/RollingNumber'

/** Words inside the sample screens, taken from the teardown and the service pages. */
const UI = {
  nl: {
    title: 'Zo starten we.', cta: 'Plan een gesprek', sample: 'Voorbeeld',
    audit: 'Groeianalyse', checked: 'bekeken',
    prio: 'Prioriteiten', impact: 'Impact',
    funnel: 'Creative-ronde', flow: ['Advertentie', 'Landingspagina', 'Formulier', 'Sales CRM'], creative: 'Meer klanten uit je advertenties', platform: 'Instagram', waiting: 'Ter goedkeuring', live: 'Live', approve: 'Goedkeuren',
    url: 'jouwsite.be/actie', publishing: 'Publiceren', watching: '3 mensen bekijken dit nu',
    report: 'Maandrapport · oktober', revenue: 'Omzet uit advertenties', feed: ['Aankoop', '€ 84', 'Google', '14:09'],
  },
  en: {
    title: 'How we start.', cta: 'Plan a call', sample: 'Sample',
    audit: 'Growth analysis', checked: 'reviewed',
    prio: 'Priorities', impact: 'Impact',
    funnel: 'Creative round', flow: ['Ad', 'Landing page', 'Form', 'Sales CRM'], creative: 'More customers from your ads', platform: 'Instagram', waiting: 'Awaiting approval', live: 'Live', approve: 'Approve',
    url: 'yoursite.com/offer', publishing: 'Publishing', watching: '3 people are looking now',
    report: 'Monthly report · October', revenue: 'Revenue from ads', feed: ['Purchase', '€ 84', 'Google', '14:09'],
  },
}

function Win({ title, lang, children }: { title: string; lang: Lang; children: ReactNode }) {
  return (
    <div className="st-win" aria-hidden="true">
      <p className="st-win-bar"><i /><i /><i /><b>{title}</b><em>{UI[lang].sample}</em></p>
      <div className="st-win-body">{children}</div>
    </div>
  )
}

/** After `ms`, while `on`, flips to true; reduced motion starts at the end state. */
function useAfter(on: boolean, ms: number) {
  const reduce = useReducedMotion()
  const [done, setDone] = useState(false)
  useEffect(() => {
    if (!on) { setDone(false); return }
    const id = window.setTimeout(() => setDone(true), reduce ? 0 : ms)
    return () => window.clearTimeout(id)
  }, [on, ms, reduce])
  return done
}

/** 01: the analysis window ticks off what it looks at. */
function AuditScreen({ lang, on }: { lang: Lang; on: boolean }) {
  const items = AUDIT_SCOPE[lang].slice(0, 6)
  return (
    <Win title={UI[lang].audit} lang={lang}>
      <ul className={`st-audit${on ? ' is-on' : ''}`}>
        {items.map((item, i) => <li key={item} style={{ '--i': i } as CSSProperties}><span className="st-check"><svg viewBox="0 0 14 14"><path d="M2.5 7.5 5.5 10.5 11.5 3.5" pathLength={1} /></svg></span>{item}</li>)}
      </ul>
      <p className="st-audit-foot"><span className="st-meter"><i className={on ? 'is-on' : ''} /></span><b>{items.length} / {AUDIT_SCOPE[lang].length}</b> {UI[lang].checked}</p>
    </Win>
  )
}

/** 02: the leaks sort themselves by impact. Sample weights. */
const WEIGHT = [3, 5, 2, 4]
function PrioScreen({ lang, on }: { lang: Lang; on: boolean }) {
  const sorted = useAfter(on, 700)
  const rows = PAINS[lang].slice(0, 4).map(([title], i) => ({ title, weight: WEIGHT[i] }))
  const order = sorted ? [...rows].sort((a, b) => b.weight - a.weight) : rows
  return (
    <Win title={UI[lang].prio} lang={lang}>
      <p className="st-prio-head"><span>#</span><span /><span>{UI[lang].impact}</span></p>
      <ul className="st-prio">
        {order.map((row, i) => (
          <motion.li key={row.title} layout transition={{ type: 'spring', stiffness: 260, damping: 26 }}>
            <span className="st-prio-n">{i + 1}</span>
            <b>{row.title}</b>
            <span className="st-prio-bar"><i style={{ width: `${row.weight * 20}%` }} /></span>
          </motion.li>
        ))}
      </ul>
    </Win>
  )
}

/** 03: one creative waiting for approval, inside the funnel it feeds. Press Approve. */
function FunnelScreen({ lang, on }: { lang: Lang; on: boolean }) {
  const t = UI[lang]
  const auto = useAfter(on, 1800)
  const [pressed, setPressed] = useState<boolean | null>(null)
  const live = pressed ?? auto
  return (
    <Win title={t.funnel} lang={lang}>
      <p className="st-flow">{t.flow.map((step, i) => <span key={step} className={i === 0 ? 'is-on' : ''}>{step}</span>).flatMap((pill, i) => (i ? [<i key={`to-${i}`}>→</i>, pill] : [pill]))}</p>
      <div className="st-creative">
        <p className="st-creative-head"><span className="st-pill st-pill--blue">{t.platform}</span><span className={`st-pill ${live ? 'st-pill--green' : 'st-pill--grey'}`}>{live ? t.live : t.waiting}</span></p>
        <div className="st-creative-art"><b>{t.creative}</b></div>
        <button type="button" tabIndex={-1} className={`st-approve${live ? ' is-live' : ''}`} onClick={() => setPressed(!live)}>
          <svg viewBox="0 0 18 18"><path d="M3.5 9.5 7.5 13.5 14.5 5" pathLength={1} /></svg>{live ? t.live : t.approve}
        </button>
      </div>
    </Win>
  )
}

/** 04: the page builds, publishes and goes live. */
function LaunchScreen({ lang, on }: { lang: Lang; on: boolean }) {
  const t = UI[lang]
  const live = useAfter(on, 1900)
  return (
    <Win title={t.url} lang={lang}>
      <div className={`st-page${on ? ' is-on' : ''}`}>
        <span className="st-page-hero" /><span className="st-page-line" /><span className="st-page-line st-page-line--short" />
        <span className="st-page-cards"><i /><i /><i /></span>
        <span className="st-page-btn" />
      </div>
      <p className="st-launch">
        {live ? <span className="st-pill st-pill--green st-live"><i />{t.live}</span> : <span className="st-pill st-pill--grey">{t.publishing}…</span>}
        <span className="st-meter"><i className={on ? 'is-on is-slow' : ''} /></span>
        {live && <em>{t.watching}</em>}
      </p>
    </Win>
  )
}

/** 05: the month's revenue counts up, the dots fill in, a sale lands in the feed. */
function GrowScreen({ lang, on }: { lang: Lang; on: boolean }) {
  const t = UI[lang]
  const sale = useAfter(on, 1600)
  const heights = [3, 4, 3, 5, 4, 6, 5, 7, 6, 8, 9]
  return (
    <Win title={t.report} lang={lang}>
      <p className="st-big"><span>{t.revenue}</span><b>{on ? <RollingNumber value={18} prefix="+" suffix="%" /> : '+18%'}</b></p>
      <div className={`st-dots${on ? ' is-on' : ''}`}>
        {heights.map((h, col) => (
          <span key={col} style={{ '--c': col } as CSSProperties}>{Array.from({ length: 9 }, (_, row) => <i key={row} className={row < h ? 'is-lit' : ''} style={{ '--r': row } as CSSProperties} />)}</span>
        ))}
      </div>
      <AnimatePresence>
        {sale && (
          <motion.p className="st-feed" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <span className="st-feed-dot" /><b>{t.feed[0]}</b><em>{t.feed[1]}</em><i>{t.feed[2]}</i><small>{t.feed[3]}</small>
          </motion.p>
        )}
      </AnimatePresence>
    </Win>
  )
}

const SCREENS = [AuditScreen, PrioScreen, FunnelScreen, LaunchScreen, GrowScreen]
/** Each step's screen arrives its own way. */
const ENTRIES = [
  { initial: { opacity: 0, x: 60 }, animate: { opacity: 1, x: 0 } },
  { initial: { opacity: 0, scale: 0.88 }, animate: { opacity: 1, scale: 1 } },
  { initial: { opacity: 0, y: 40, rotate: -5 }, animate: { opacity: 1, y: 0, rotate: 0 } },
  { initial: { opacity: 0, y: 70 }, animate: { opacity: 1, y: 0 } },
  { initial: { opacity: 0, filter: 'blur(12px)' }, animate: { opacity: 1, filter: 'blur(0px)' } },
]

/**
 * How a collaboration starts, as a tour: on wide screens the section pins and the five steps
 * from process.ts play one by one, each with its own sample screen; the tabs fill as you scroll
 * and jump on click. Phones and reduced motion get the steps stacked.
 */
export default function StartTour() {
  const { lang } = useLang()
  const t = UI[lang]
  const reduce = useReducedMotion()
  const wide = useWide()
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const count = processSteps.length
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    ref.current?.style.setProperty('--p', p.toFixed(4))
    setActive(Math.min(count - 1, Math.max(0, Math.floor(p * count * 0.999))))
  })
  const cta = <Cta to="/contact" onClick={() => trackEvent('audit_cta_clicked', { placement: 'home_start' })}>{t.cta}</Cta>

  if (reduce || !wide) {
    return (
      <section className="vs-wrap vs-section st-tour st-tour--stacked" aria-labelledby="start-title">
        <Reveal as="h2" className="vs-h2" id="start-title">{t.title}</Reveal>
        <ol className="st-stack">
          {processSteps.map((step, i) => {
            const Screen = SCREENS[i]
            return (
              <li key={step.number}>
                <p className="st-num">{step.number}</p>
                <h3 className="st-step-title">{step.title[lang]}</h3>
                <p className="st-step-body">{step.description[lang]}</p>
                <Screen lang={lang} on />
              </li>
            )
          })}
        </ol>
        <div className="st-cta">{cta}</div>
      </section>
    )
  }

  const jump = (i: number) => {
    const el = ref.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const run = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + ((i + 0.08) / count) * run, behavior: 'smooth' })
  }
  const step = processSteps[active]
  const Screen = SCREENS[active]

  return (
    <section ref={ref} className="st-tour st-tour--pinned" aria-labelledby="start-title" style={{ '--steps': count } as CSSProperties}>
      <div className="st-sticky">
        <div className="vs-wrap st-inner">
          <div className="st-head">
            <h2 className="vs-h2" id="start-title">{t.title}</h2>
            <div className="st-tabs" role="tablist" aria-label={t.title}>
              {processSteps.map((s, i) => (
                <button key={s.number} type="button" role="tab" aria-selected={active === i} className={`st-tab${active === i ? ' is-on' : ''}`} style={{ '--i': i } as CSSProperties} onClick={() => jump(i)}>
                  <span>{s.number}</span>{s.title[lang]}
                  <i className="st-tab-line" aria-hidden="true"><b /></i>
                </button>
              ))}
            </div>
          </div>
          <div className="st-body">
            <div className="st-copy" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={step.number} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
                  <p className="st-num">{step.number}</p>
                  <h3 className="st-step-title">{step.title[lang]}</h3>
                  <p className="st-step-body">{step.description[lang]}</p>
                </motion.div>
              </AnimatePresence>
              <div className="st-cta">{cta}</div>
            </div>
            <div className="st-stage">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={active} className="st-screen" {...ENTRIES[active]} exit={{ opacity: 0, transition: { duration: 0.2 } }} transition={{ type: 'spring', stiffness: 120, damping: 18 }}>
                  <Screen lang={lang} on />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
