import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { crmLanding } from '../../data/crmLanding'
import type { Lang } from '../../data/types'
import { Pointer, Ticker, useHoverPause, usePhase } from '../brand/demo'
import { COMPANY, DEALS, Num, Person, SamplePipeline, SOURCE } from '../brand/samples'

/** Screen words that are not in crmLanding; the people and amounts are the shared sample deals. */
const UI = {
  nl: {
    sample: 'Voorbeeld', now: 'zojuist', leads: 'Leads', flow: 'Prospectflow', quote: 'Offerte', today: 'Vandaag', pipeline: 'Open pipeline',
    send: 'Verstuur offerte', sent: 'Verstuurd', signed: 'Gewonnen', stage: 'Voorstel', total: 'Totaal', lines: ['Strategie en opstart', 'Landingspagina', 'Campagnes'],
    rows: ['Bel Sarah terug', 'Stuur offerte naar Tom', 'Plan afspraak met Lien'], call: 'Vandaag opvolgen',
  },
  en: {
    sample: 'Sample', now: 'just now', leads: 'Leads', flow: 'Prospectflow', quote: 'Quote', today: 'Today', pipeline: 'Open pipeline',
    send: 'Send quote', sent: 'Sent', signed: 'Won', stage: 'Proposal', total: 'Total', lines: ['Strategy and setup', 'Landing page', 'Campaigns'],
    rows: ['Call Sarah back', 'Send Tom the quote', 'Book a meeting with Lien'], call: 'Follow up today',
  },
}

/** The four steps, all from crmLanding: the lead list, the flow, the quotes, and today's view. */
function steps(lang: Lang) {
  const [dashboard, flow, list] = crmLanding.screens.items[lang]
  const more = crmLanding.more.items[lang]
  return [
    { title: list.title, body: `${list.body} ${more[1]}.` },
    { title: flow.title, body: flow.body },
    { title: `${more[0]}.`, body: `${more[4]}.` },
    { title: dashboard.title, body: dashboard.body },
  ]
}

function useScreen(on: boolean, durations: number[]) {
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref, { amount: 0.4 })
  const { paused, bind } = useHoverPause()
  return { ref, bind, live: on && seen, phase: usePhase(on && seen, paused, durations) }
}

/* 01: sources pile up as tabs in the title bar while the leads come in. */
const LEAD_T = [900, 900, 900, 900, 2200]
function LeadsScreen({ lang, on }: { lang: Lang; on: boolean }) {
  const t = UI[lang]
  const s = useScreen(on, LEAD_T)
  const arrived = DEALS[lang].slice(0, Math.min(4, s.phase + 1))
  const shown = [...arrived].reverse()
  const sources = [...new Set(arrived.map((d) => d[3]))]
  return (
    <div ref={s.ref} className="st-win cx-win" {...s.bind}>
      <p className="st-win-bar"><i /><i /><i /><b>{t.leads}</b>
        <span className="cx-tabs">
          <AnimatePresence initial={false}>
            {sources.map((src) => <motion.span key={src} className="cx-tab" layout initial={{ opacity: 0, y: -8, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} style={{ '--src': SOURCE[src] } as CSSProperties}>{src}<small>{shown.filter((d) => d[3] === src).length}</small></motion.span>)}
          </AnimatePresence>
        </span>
        <em>{t.sample}</em></p>
      <ul className="cx-rows">
        <AnimatePresence initial={false}>
          {shown.map((deal, i) => {
            const [ini, who, value, src] = deal
            return (
              <motion.li key={ini} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 24 }}>
                <Person ini={ini} size={24} /><span><b>{who}</b><em>{COMPANY[lang][ini]}</em></span>
                <Num v={value} /><i className="cx-src" style={{ '--src': SOURCE[src] } as CSSProperties}>{src}</i>
                <small>{i === 0 ? t.now : ''}</small>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </ul>
    </div>
  )
}

/* 02: the shared pipeline, one deal moving a stage per beat. */
function FlowScreen({ lang, on }: { lang: Lang; on: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref, { amount: 0.4 })
  const { paused, bind } = useHoverPause()
  return (
    <div ref={ref} className="st-win cx-win" {...bind}>
      <p className="st-win-bar"><i /><i /><i /><b>{UI[lang].flow}</b><em>{UI[lang].sample}</em></p>
      <div className="st-win-body"><SamplePipeline lang={lang} id="crm-step" on={on && seen && !paused} ms={2200} /></div>
    </div>
  )
}

/* 03: a quote on the deal it belongs to; the pointer sends it and the deal is won. */
const QUOTE_T = [1100, 700, 1500, 2200]
function QuoteScreen({ lang, on }: { lang: Lang; on: boolean }) {
  const t = UI[lang]
  const s = useScreen(on, QUOTE_T)
  const p = s.phase
  const [ini, who, value] = DEALS[lang][4]
  return (
    <div ref={s.ref} className="st-win cx-win" {...s.bind}>
      <p className="st-win-bar"><i /><i /><i /><b>{t.quote}</b><em>{t.sample}</em></p>
      <div className="st-win-body">
        <p className="cx-deal"><Person ini={ini} size={30} /><span><b>{who}</b><em>{COMPANY[lang][ini]}</em></span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={p} className={`st-pill ${p >= 3 ? 'st-pill--green' : p >= 2 ? 'st-pill--blue' : 'st-pill--grey'}`} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }}>{p >= 3 ? t.signed : p >= 2 ? t.sent : t.stage}</motion.span>
          </AnimatePresence>
        </p>
        <div className="cx-doc">
          {t.lines.map((line) => <p key={line}><span>{line}</span><i /></p>)}
          <p className="cx-total"><span>{t.total}</span><Num v={value} /></p>
        </div>
        <span className={`st-btn cx-send${p === 1 ? ' is-press' : ''}`}>{p >= 2 ? `✓ ${t.sent}` : t.send}</span>
      </div>
      <Pointer x={p === 0 ? 70 : 22} y={p === 0 ? 30 : 88} click={p === 1 ? 'send' : false} hidden={p >= 2} />
    </div>
  )
}

/* 04: today's list ticks off and the open pipeline counts up. */
const TODAY_T = [1200, 900, 900, 900, 2000]
function TodayScreen({ lang, on }: { lang: Lang; on: boolean }) {
  const t = UI[lang]
  const s = useScreen(on, TODAY_T)
  const p = s.phase
  const people = ['SP', 'TD', 'LV']
  const open = DEALS[lang].reduce((sum, d) => sum + Number(d[2].replace(/[^\d]/g, '')), 0)
  const fmt = (v: number) => `€ ${Math.round(v).toLocaleString(lang === 'nl' ? 'nl-BE' : 'en-GB')}`
  return (
    <div ref={s.ref} className="st-win cx-win" {...s.bind}>
      <p className="st-win-bar"><i /><i /><i /><b>{t.today}</b><em>{t.sample}</em></p>
      <div className="st-win-body">
        <p className="st-big"><span>{t.pipeline}</span><b><Ticker to={open} on={s.live} ms={1600} format={fmt} /></b></p>
        <p className="cx-call-head">{t.call}</p>
        <ul className="cx-today">
          {t.rows.map((row, i) => <li key={row} className={p > i ? 'is-done' : ''}><span className="st-check"><svg viewBox="0 0 14 14"><path d="M2.5 7.5 5.5 10.5 11.5 3.5" pathLength={1} /></svg></span><Person ini={people[i]} size={22} />{row}</li>)}
        </ul>
      </div>
      <Pointer x={12} y={p === 0 ? 50 : 50 + Math.min(p, 3) * 12} click={p >= 1 && p <= 3 ? `tick-${p}` : false} hidden={p === 0 || p >= 4} />
    </div>
  )
}

const SCREENS = [LeadsScreen, FlowScreen, QuoteScreen, TodayScreen]

/**
 * "What you do with it" as a stepper: the steps scroll on the left while one CRM window on
 * the right shows the step in front. Phones get each step with its own window.
 */
export default function CrmStepper({ lang }: { lang: Lang }) {
  const list = steps(lang)
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLLIElement | null)[]>([])
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step))
    }, { rootMargin: '-45% 0px -45% 0px' })
    refs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])
  const Screen = SCREENS[active]
  return (
    <div className="cx-stepper">
      <ol className="cx-steps">
        {list.map((step, i) => {
          const Own = SCREENS[i]
          return (
            <li key={step.title} ref={(el) => { refs.current[i] = el }} data-step={i} className={active === i ? 'is-on' : ''}>
              <p className="cx-num">{String(i + 1).padStart(2, '0')}</p>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              <div className="cx-own" aria-hidden="true"><Own lang={lang} on /></div>
            </li>
          )
        })}
      </ol>
      <div className="cx-stage" aria-hidden="true">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={active} initial={reduce ? false : { opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -16 }} transition={{ type: 'spring', stiffness: 160, damping: 20 }}>
            <Screen lang={lang} on />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
