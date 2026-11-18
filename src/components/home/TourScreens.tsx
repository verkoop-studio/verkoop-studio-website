import { AnimatePresence, motion, useInView } from 'motion/react'
import { useRef, type CSSProperties, type ReactNode } from 'react'
import pinacelloPage from '../../assets/cases/pinacello-640.webp'
import { AUDIT_SCOPE } from '../../data/audit'
import { PAINS } from '../../data/pains'
import type { Lang } from '../../data/types'
import { Pointer, Ticker, Typed, useHoverPause, usePhase } from '../brand/demo'

/** Words inside the sample screens, taken from the teardown and the service pages. */
const UI = {
  nl: {
    sample: 'Voorbeeld', now: 'zojuist',
    audit: 'Groeianalyse', site: 'jouwsite.be', run: 'Analyseer', checked: 'bekeken',
    prio: 'Prioriteiten', sort: 'Sorteer', impact: 'Impact',
    funnel: 'Creative-ronde', flow: ['Advertentie', 'Landingspagina', 'Formulier', 'Sales CRM'], creative: 'Meer klanten uit je advertenties', platform: 'Instagram', waiting: 'Ter goedkeuring', live: 'Live', approve: 'Goedkeuren',
    url: 'promo.pinacello.com', publish: 'Publiceren', publishing: 'Publiceren…', draft: 'Concept', published: 'Gepubliceerd', order: '+1 bestelling',
    report: 'Maandrapport · oktober', revenue: 'Omzet uit advertenties', budget: 'Budget Google', feed: [['Aankoop', '€ 84', 'Google'], ['Formulier verstuurd', 'Sarah P.', 'Meta']],
  },
  en: {
    sample: 'Sample', now: 'just now',
    audit: 'Growth analysis', site: 'yoursite.com', run: 'Analyse', checked: 'reviewed',
    prio: 'Priorities', sort: 'Sort', impact: 'Impact',
    funnel: 'Creative round', flow: ['Ad', 'Landing page', 'Form', 'Sales CRM'], creative: 'More customers from your ads', platform: 'Instagram', waiting: 'Awaiting approval', live: 'Live', approve: 'Approve',
    url: 'promo.pinacello.com', publish: 'Publish', publishing: 'Publishing…', draft: 'Draft', published: 'Published', order: '+1 order',
    report: 'Monthly report · October', revenue: 'Revenue from ads', budget: 'Google budget', feed: [['Purchase', '€ 84', 'Google'], ['Form sent', 'Sarah P.', 'Meta']],
  },
}

type ScreenProps = { lang: Lang; on: boolean }

/**
 * The sample window. Its demo runs while it is on screen and the step is active, and
 * waits under the pointer so the words can be read.
 */
function useScreen(on: boolean, durations: number[]) {
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref, { amount: 0.4 })
  const { paused, bind } = useHoverPause()
  const phase = usePhase(on && seen, paused, durations)
  return { ref, phase, bind, live: on && seen }
}

function Win({ title, lang, children, win }: { title: string; lang: Lang; children: ReactNode; win: { ref: React.RefObject<HTMLDivElement | null>; bind: object } }) {
  return (
    <div ref={win.ref} className="st-win" aria-hidden="true" {...win.bind}>
      <p className="st-win-bar"><i /><i /><i /><b>{title}</b><em>{UI[lang].sample}</em></p>
      <div className="st-win-body">{children}</div>
    </div>
  )
}

/* 01 Analyse: the pointer types the site, presses Analyse, and the scope pops in ticked. */
const AUDIT_T = [700, 1500, 650, 2600, 2000]
export function AuditScreen({ lang, on }: ScreenProps) {
  const t = UI[lang]
  const win = useScreen(on, AUDIT_T)
  const p = win.phase
  const items = AUDIT_SCOPE[lang].slice(0, 6)
  const scanning = p >= 3
  return (
    <Win title={t.audit} lang={lang} win={win}>
      <p className="st-field"><span className={`st-input${p >= 1 && p < 3 ? ' is-focus' : ''}`}><Typed text={t.site} on={p >= 1} caret={p >= 1 && p < 3} /></span><span className={`st-btn${p === 2 ? ' is-press' : ''}`}>{t.run}</span></p>
      <ul className={`st-chips${scanning ? ' is-on' : ''}`}>
        {items.map((item, i) => <li key={item} style={{ '--i': i } as CSSProperties}><span className="st-check"><svg viewBox="0 0 14 14"><path d="M2.5 7.5 5.5 10.5 11.5 3.5" pathLength={1} /></svg></span>{item}</li>)}
      </ul>
      <p className="st-audit-foot"><span className="st-meter"><i style={{ width: scanning ? `${(items.length / AUDIT_SCOPE[lang].length) * 100}%` : '0%' }} /></span><b><Ticker to={scanning ? items.length : 0} on={scanning} ms={2200} /> / {AUDIT_SCOPE[lang].length}</b> {t.checked}</p>
      <Pointer x={p === 0 ? 70 : p === 1 ? 32 : p === 2 ? 84 : 92} y={p <= 1 ? 22 : p === 2 ? 22 : 88} click={p === 2 ? 'run' : p === 1 ? 'field' : false} hidden={p >= 4} />
    </Win>
  )
}

/* 02 Prioriteiten: the pointer picks "Sort: Impact" and the leaks reorder themselves. Sample weights. */
const WEIGHT = [3, 5, 2, 4]
const PRIO_T = [1100, 700, 2800, 1400]
export function PrioScreen({ lang, on }: ScreenProps) {
  const t = UI[lang]
  const win = useScreen(on, PRIO_T)
  const p = win.phase
  const rows = PAINS[lang].slice(0, 4).map(([title], i) => ({ title, weight: WEIGHT[i] }))
  const sorted = p >= 2
  const order = sorted ? [...rows].sort((a, b) => b.weight - a.weight) : rows
  return (
    <Win title={t.prio} lang={lang} win={win}>
      <p className="st-sortbar"><span className={`st-sort${p === 1 ? ' is-press' : ''}${sorted ? ' is-on' : ''}`}><em>{t.sort}:</em> {t.impact} <i>▾</i></span></p>
      <ul className="st-prio">
        {order.map((row, i) => (
          <motion.li key={row.title} layout transition={{ type: 'spring', stiffness: 260, damping: 26 }}>
            <span className="st-prio-n">{i + 1}</span>
            <b>{row.title}</b>
            <span className="st-prio-bar"><i style={{ width: sorted ? `${row.weight * 20}%` : '12%' }} /></span>
          </motion.li>
        ))}
      </ul>
      <Pointer x={p === 0 ? 60 : p === 1 ? 18 : 78} y={p === 0 ? 70 : p === 1 ? 14 : 40} click={p === 1 ? 'sort' : false} hidden={p === 3} />
    </Win>
  )
}

/* 03 Funnel design: the creative waits, the pointer presses Approve with a ripple, the flow lights up. */
const FUNNEL_T = [1000, 750, 900, 2200, 1200]
export function FunnelScreen({ lang, on }: ScreenProps) {
  const t = UI[lang]
  const win = useScreen(on, FUNNEL_T)
  const p = win.phase
  const live = p >= 2
  return (
    <Win title={t.funnel} lang={lang} win={win}>
      <p className={`st-flow${p >= 3 ? ' is-run' : ''}`}>{t.flow.map((step, i) => <span key={step} className={i === 0 ? 'is-on' : ''} style={{ '--i': i } as CSSProperties}>{step}</span>).flatMap((pill, i) => (i ? [<i key={`to-${i}`}>→</i>, pill] : [pill]))}</p>
      <div className="st-creative">
        <p className="st-creative-head"><span className="st-pill st-pill--blue">{t.platform}</span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={live ? 'live' : 'wait'} className={`st-pill ${live ? 'st-pill--green' : 'st-pill--grey'}`} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.22 }}>{live ? t.live : t.waiting}</motion.span>
          </AnimatePresence>
        </p>
        <div className="st-creative-art"><b>{t.creative}</b></div>
        <span className={`st-approve${p === 2 ? ' is-press' : ''}${live ? ' is-live' : ''}`}><svg viewBox="0 0 18 18"><path d="M3.5 9.5 7.5 13.5 14.5 5" pathLength={1} /></svg>{live ? t.live : t.approve}</span>
      </div>
      <Pointer x={p === 0 ? 80 : 50} y={p === 0 ? 40 : 90} click={p === 2 ? 'approve' : false} hidden={p >= 3} />
    </Win>
  )
}

/* 04 Implementatie: the Pinacello campaign page as a draft; the pointer presses Publish, the bar fills, it goes live and an order lands. */
const LAUNCH_T = [1400, 700, 1500, 2800]
export function LaunchScreen({ lang, on }: ScreenProps) {
  const t = UI[lang]
  const win = useScreen(on, LAUNCH_T)
  const p = win.phase
  const live = p >= 3
  return (
    <Win title={t.url} lang={lang} win={win}>
      <div className={`st-page${live ? ' is-live' : ''}`}>
        <img src={pinacelloPage} alt="" width={640} height={400} loading="lazy" decoding="async" />
        <span className={`st-pill ${live ? 'st-pill--green st-live' : 'st-pill--grey'} st-page-state`}>{live && <i />}{live ? t.live : t.draft}</span>
        <AnimatePresence>
          {live && <motion.span className="st-page-toast" initial={{ opacity: 0, y: 16, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.6, type: 'spring', stiffness: 260, damping: 18 }}><b>{t.order}</b><small>{t.now}</small></motion.span>}
        </AnimatePresence>
      </div>
      <p className="st-launch">
        {live ? <span className="st-launch-done">✓ {t.published}</span> : <span className={`st-btn${p === 1 ? ' is-press' : ''}`}>{p === 2 ? t.publishing : t.publish}</span>}
        <span className="st-meter"><i style={{ width: p >= 2 ? '100%' : '0%', transitionDuration: p === 2 ? '1.4s' : '0s' }} /></span>
      </p>
      <Pointer x={p === 0 ? 70 : 12} y={p === 0 ? 40 : 88} click={p === 1 ? 'publish' : false} hidden={p >= 2} />
    </Win>
  )
}

/* 05 Optimalisatie: revenue ticks up, the dots fill in, the pointer drags the budget and sales land. */
const GROW_T = [2200, 1700, 2600, 1300]
const HEIGHTS = [3, 4, 3, 5, 4, 6, 5, 7, 6, 8, 9]
export function GrowScreen({ lang, on }: ScreenProps) {
  const t = UI[lang]
  const win = useScreen(on, GROW_T)
  const p = win.phase
  const drag = p >= 1
  return (
    <Win title={t.report} lang={lang} win={win}>
      <p className="st-big"><span>{t.revenue}</span><b>+<Ticker to={18} on={win.live} ms={1800} />%</b></p>
      <div className={`st-dots${win.live ? ' is-on' : ''}`}>
        {HEIGHTS.map((h, col) => (
          <span key={col} style={{ '--c': col } as CSSProperties}>{Array.from({ length: 9 }, (_, row) => <i key={row} className={row < h ? 'is-lit' : ''} style={{ '--r': row } as CSSProperties} />)}</span>
        ))}
      </div>
      <div className="st-slider">
        <p><span>{t.budget}</span><b>+ € <Ticker to={drag ? 300 : 0} on={drag} ms={1400} /></b></p>
        <span className="st-track"><i style={{ width: drag ? '62%' : '8%' }} /><b style={{ left: drag ? '62%' : '8%' }} /></span>
      </div>
      <div className="st-feeds">
        <AnimatePresence initial={false}>
          {p >= 2 && t.feed.map(([what, detail, src], i) => (
            <motion.p key={what} className="st-feed" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.6, type: 'spring', stiffness: 220, damping: 22 }}>
              <span className="st-feed-dot" /><b>{what}</b><em>{detail}</em><i className={src === 'Meta' ? 'is-meta' : ''}>{src}</i><small>{t.now}</small>
            </motion.p>
          ))}
        </AnimatePresence>
      </div>
      <Pointer x={drag ? 62 : 8} y={64} click={p === 1 ? 'drag' : false} hidden={p === 0 || p >= 2} />
    </Win>
  )
}

export const SCREENS = [AuditScreen, PrioScreen, FunnelScreen, LaunchScreen, GrowScreen]
