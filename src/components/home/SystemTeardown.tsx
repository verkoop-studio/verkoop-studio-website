import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
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

/** One layer drawn as a flat panel; the stage tilts it into isometric space. */
function Panel({ layer }: { layer: Layer }) {
  const ink = '#111110'
  return (
    <svg viewBox="0 0 320 200" className="vs-td-panel-art" aria-hidden="true" focusable="false">
      <rect x="1" y="1" width="318" height="198" rx="16" fill={layer.tint} stroke={ink} strokeOpacity="0.18" />
      <rect x="1" y="1" width="318" height="34" rx="16" fill={ink} fillOpacity="0.08" />
      <circle cx="20" cy="18" r="4" fill={ink} opacity="0.4" />
      <circle cx="34" cy="18" r="4" fill={ink} opacity="0.4" />
      {layer.key === 'ad' && <><rect x="22" y="52" width="130" height="122" rx="10" fill="#fff" opacity="0.92" /><rect x="34" y="64" width="106" height="62" rx="6" fill={ink} opacity="0.12" /><rect x="168" y="62" width="130" height="10" rx="5" fill="#fff" opacity="0.7" /><rect x="168" y="136" width="98" height="28" rx="14" fill="#fff" /></>}
      {layer.key === 'page' && <><rect x="22" y="52" width="200" height="16" rx="6" fill={ink} opacity="0.75" /><rect x="22" y="76" width="160" height="10" rx="5" fill={ink} opacity="0.35" /><rect x="22" y="124" width="112" height="32" rx="16" fill={ink} /><rect x="232" y="52" width="66" height="104" rx="10" fill="#fff" opacity="0.8" /></>}
      {layer.key === 'form' && <><rect x="40" y="52" width="240" height="26" rx="8" fill="#fff" /><rect x="40" y="86" width="240" height="26" rx="8" fill="#fff" /><rect x="40" y="120" width="240" height="26" rx="8" fill="#fff" /><rect x="40" y="156" width="240" height="28" rx="14" fill={ink} /></>}
      {layer.key === 'crm' && [0, 1, 2, 3].map((col) => (
        <g key={col}>
          <rect x={18 + col * 74} y="48" width="66" height="138" rx="9" fill="#fff" opacity="0.55" />
          {Array.from({ length: 3 - (col % 2) }, (_, row) => <rect key={row} x={24 + col * 74} y={58 + row * 40} width="54" height="32" rx="6" fill="#fff" />)}
        </g>
      ))}
      {layer.key === 'pixel' && <><circle cx="160" cy="114" r="52" fill="#fff" opacity="0.35" /><circle cx="160" cy="114" r="30" fill="#fff" opacity="0.6" /><circle cx="160" cy="114" r="10" fill={ink} /></>}
      {layer.key === 'dashboard' && <>{[64, 96, 52, 120, 84, 140].map((h, i) => <rect key={i} x={30 + i * 44} y={186 - h} width="26" height={h} rx="5" fill="#fff" opacity={0.55 + i * 0.07} />)}</>}
      {layer.key === 'report' && <><rect x="24" y="52" width="170" height="14" rx="6" fill={ink} opacity="0.75" />{[78, 96, 114, 132].map((y, i) => <rect key={y} x="24" y={y} width={150 - i * 18} height="8" rx="4" fill={ink} opacity="0.3" />)}<circle cx="248" cy="112" r="44" fill="#2b4bf2" /></>}
    </svg>
  )
}

/** A small, readable app window for the active layer. All figures are sample data. */
function Window({ title, sample, children }: { title: string; sample: string; children: ReactNode }) {
  return (
    <div className="vs-win">
      <div className="vs-win-bar">
        <span className="vs-win-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="vs-win-title">{title}</span>
        <span className="vs-win-sample">{sample}</span>
      </div>
      <div className="vs-win-body">{children}</div>
    </div>
  )
}

const UI_COPY = {
  nl: {
    ad: { title: 'Advertentie', sponsored: 'Gesponsord', head: 'Gratis groeiplan voor je webshop', button: 'Meer info' },
    page: { title: 'verkoop.studio/groeiplan', head: 'Meer klanten uit je advertenties', button: 'Vraag je plan aan' },
    form: { title: 'Formulier', name: 'Naam', email: 'E-mail', button: 'Verstuur', toast: 'Lead ontvangen' },
    crm: { title: 'Sales CRM', stages: ['Nieuw', 'Gecontacteerd', 'Afspraak', 'Voorstel'], leads: 'leads' },
    pixel: { title: 'Pixel', events: [['Pagina bekeken', '14:02'], ['Formulier verstuurd', '14:04'], ['Aankoop € 84', '14:09']] },
    dashboard: { title: 'Performance', spend: 'Uitgaven', revenue: 'Omzet', roas: 'Opbrengst per €' },
    report: { title: 'Maandrapport', lines: ['Meeste omzet via Google', 'Facebook: duurdere leads', 'Advies: meer budget naar Google'] },
  },
  en: {
    ad: { title: 'Ad', sponsored: 'Sponsored', head: 'A free growth plan for your shop', button: 'Learn more' },
    page: { title: 'verkoop.studio/growth-plan', head: 'More customers from your ads', button: 'Get your plan' },
    form: { title: 'Form', name: 'Name', email: 'Email', button: 'Send', toast: 'Lead received' },
    crm: { title: 'Sales CRM', stages: ['New', 'Contacted', 'Meeting', 'Closing'], leads: 'leads' },
    pixel: { title: 'Pixel', events: [['Page viewed', '14:02'], ['Form sent', '14:04'], ['Purchase € 84', '14:09']] },
    dashboard: { title: 'Performance', spend: 'Spend', revenue: 'Revenue', roas: 'Return per €' },
    report: { title: 'Monthly report', lines: ['Most revenue via Google', 'Facebook: pricier leads', 'Advice: more budget to Google'] },
  },
}

function LayerUI({ layer, lang }: { layer: LayerKey; lang: Lang }) {
  const u = UI_COPY[lang]
  const sample = COPY[lang].sample
  switch (layer) {
    case 'ad':
      return (
        <Window title={u.ad.title} sample={sample}>
          <span className="vs-win-muted">Verkoop Studio · {u.ad.sponsored}</span>
          <div className="vs-win-image" />
          <strong className="vs-win-head">{u.ad.head}</strong>
          <span className="vs-win-button">{u.ad.button}</span>
        </Window>
      )
    case 'page':
      return (
        <Window title={u.page.title} sample={sample}>
          <strong className="vs-win-head vs-win-head--big">{u.page.head}</strong>
          <span className="vs-win-line" /><span className="vs-win-line vs-win-line--short" />
          <span className="vs-win-button vs-win-button--ink">{u.page.button}</span>
        </Window>
      )
    case 'form':
      return (
        <Window title={u.form.title} sample={sample}>
          <span className="vs-win-field"><em>{u.form.name}</em>Sarah</span>
          <span className="vs-win-field"><em>{u.form.email}</em>sarah@bedrijf.be</span>
          <span className="vs-win-button vs-win-button--ink">{u.form.button}</span>
          <span className="vs-win-toast">✓ {u.form.toast}</span>
        </Window>
      )
    case 'crm':
      return (
        <Window title={u.crm.title} sample={sample}>
          <div className="vs-win-kanban">
            {u.crm.stages.map((stage, i) => (
              <div key={stage}><em>{stage}</em>{Array.from({ length: 3 - (i % 2) - (i > 2 ? 1 : 0) }, (_, j) => <span key={j} />)}</div>
            ))}
          </div>
          <span className="vs-win-meter"><b className="vs-dots">38</b> / 500 {u.crm.leads}<i style={{ '--fill': '7.6%' } as CSSProperties} /></span>
        </Window>
      )
    case 'pixel':
      return (
        <Window title={u.pixel.title} sample={sample}>
          <ul className="vs-win-feed">
            {u.pixel.events.map(([event, time]) => <li key={event}><span>{event}</span><b className="vs-dots">{time}</b></li>)}
          </ul>
        </Window>
      )
    case 'dashboard':
      return (
        <Window title={u.dashboard.title} sample={sample}>
          <div className="vs-win-stats">
            <span><em>{u.dashboard.spend}</em><b className="vs-dots">€1.240</b></span>
            <span><em>{u.dashboard.revenue}</em><b className="vs-dots">€5.890</b></span>
            <span><em>{u.dashboard.roas}</em><b className="vs-dots">4,7</b></span>
          </div>
          <div className="vs-win-bars">{[38, 62, 46, 80, 58, 92].map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div>
        </Window>
      )
    case 'report':
      return (
        <Window title={u.report.title} sample={sample}>
          <ul className="vs-win-report">{u.report.lines.map((line) => <li key={line}>{line}</li>)}</ul>
        </Window>
      )
  }
}

const PHASE_START = 0.08
const PHASE_END = 0.88

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

function Specs({ items, animate }: { items: string[]; animate: boolean }) {
  return (
    <ul className="vs-td-specs">
      {items.map((spec, i) => (
        <motion.li key={spec} initial={animate ? { opacity: 0, x: -10 } : false} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.08, duration: 0.4, ease: EASE }}>
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true"><motion.path d="M2 7.5 5.5 11 12 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" initial={animate ? { pathLength: 0 } : false} animate={{ pathLength: 1 }} transition={{ delay: 0.2 + i * 0.08, duration: 0.35 }} /></svg>
          {spec}
        </motion.li>
      ))}
    </ul>
  )
}

/**
 * The growth system as a pinned isometric stack. Scrolling separates it layer by
 * layer; the active layer pops out as a small readable app window. At the end the
 * stack goes back together into the call to action. Phones and reduced motion get
 * the same content as a plain sequence.
 */
export default function SystemTeardown() {
  const { lang } = useLang()
  const t = COPY[lang]
  const reduce = useReducedMotion()
  const wide = useWide()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [phase, setPhase] = useState<'closed' | 'open' | 'done'>('closed')
  const [step, setStep] = useState(0)

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (p < PHASE_START) { setPhase('closed'); setStep(0); return }
    if (p > PHASE_END) { setPhase('done'); setStep(LAYERS.length - 1); return }
    setPhase('open')
    setStep(Math.min(LAYERS.length - 1, Math.floor(((p - PHASE_START) / (PHASE_END - PHASE_START)) * LAYERS.length)))
  })

  if (reduce || !wide) {
    return (
      <section className="vs-td vs-td--list" aria-labelledby="td-title">
        <div className="vs-wrap">
          <p className="vs-label vs-td-label">{t.label}</p>
          <h2 id="td-title" className="vs-td-end-title">{t.intro}</h2>
          <ol className="vs-td-list">
            {LAYERS.map((layer, i) => (
              <li key={layer.key} className="vs-td-item">
                <LayerUI layer={layer.key} lang={lang} />
                <div>
                  <span className="vs-td-count">{String(i + 1).padStart(2, '0')} / {String(LAYERS.length).padStart(2, '0')}</span>
                  <h3 className="vs-td-title">{layer.title[lang]}</h3>
                  <p className="vs-td-body">{layer.body[lang]}</p>
                  <Specs items={layer.specs[lang]} animate={false} />
                </div>
              </li>
            ))}
          </ol>
          <div className="vs-td-end">
            <p className="vs-td-end-title">{t.end}</p>
            <p className="vs-td-body">{t.endBody}</p>
            <Cta to="/contact" variant="paper" onClick={() => trackEvent('audit_cta_clicked', { placement: 'home_teardown' })}>{t.cta}</Cta>
          </div>
        </div>
      </section>
    )
  }

  const layer = LAYERS[step]
  const gap = phase === 'open' ? 46 : 12

  return (
    <section ref={ref} className="vs-td" aria-labelledby="td-title" style={{ height: `${LAYERS.length * 70 + 160}vh` }}>
      <div className="vs-td-sticky">
        <div className="vs-wrap vs-td-grid">
          <div className="vs-td-copy">
            <p className="vs-label vs-td-label">{t.label}</p>
            <h2 id="td-title" className="vs-visually-hidden">{t.label}</h2>
            <AnimatePresence mode="wait">
              {phase === 'done' ? (
                <motion.div key="end" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.5, ease: EASE }}>
                  <p className="vs-td-end-title">{t.end}</p>
                  <p className="vs-td-body">{t.endBody}</p>
                  <div className="vs-td-actions">
                    <Cta to="/contact" variant="paper" onClick={() => trackEvent('audit_cta_clicked', { placement: 'home_teardown' })}>{t.cta}</Cta>
                    <Link to="/#resultaten" className="vs-textlink vs-td-link">{t.cases} →</Link>
                  </div>
                </motion.div>
              ) : phase === 'closed' ? (
                <motion.div key="intro" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.5, ease: EASE }}>
                  <p className="vs-td-end-title">{t.intro}</p>
                </motion.div>
              ) : (
                <motion.div key={layer.key} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.45, ease: EASE }}>
                  <span className="vs-td-count">{String(step + 1).padStart(2, '0')} / {String(LAYERS.length).padStart(2, '0')}</span>
                  <h3 className="vs-td-title">{layer.title[lang]}</h3>
                  <p className="vs-td-body">{layer.body[lang]}</p>
                  <Specs items={layer.specs[lang]} animate />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="vs-td-stage">
            <div className="vs-td-stack" aria-hidden="true">
              {LAYERS.map((item, i) => {
                const active = phase === 'open' && i === step
                const z = (LAYERS.length - 1 - i) * gap + (active ? 34 : 0)
                return (
                  <motion.div
                    key={item.key}
                    className="vs-td-layer"
                    style={{ zIndex: LAYERS.length - i } as CSSProperties}
                    initial={false}
                    animate={{ z, opacity: phase === 'open' && !active ? 0.4 : 1 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9 }}
                  >
                    <Panel layer={item} />
                  </motion.div>
                )
              })}
            </div>
            <AnimatePresence mode="wait">
              {phase === 'open' && (
                <motion.div
                  key={layer.key}
                  className="vs-td-pop"
                  initial={{ opacity: 0, y: 30, scale: 0.92, rotate: -2 }}
                  animate={{ opacity: 1, y: 0, scale: 1, rotate: 1.5 }}
                  exit={{ opacity: 0, y: -14, scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                >
                  <LayerUI layer={layer.key} lang={lang} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="vs-td-progress" aria-hidden="true">
          {LAYERS.map((item, i) => <span key={item.key} className={phase !== 'closed' && i <= step ? 'is-on' : ''} />)}
        </div>
      </div>
    </section>
  )
}
