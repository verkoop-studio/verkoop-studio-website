import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import type { Bi } from '../../data/types'
import { useLang } from '../../i18n/LanguageContext'
import { trackEvent } from '../../lib/analytics'
import Cta from '../brand/Cta'
import { EASE } from '../brand/motion'

type Layer = {
  key: string
  tint: string
  title: Bi<string>
  body: Bi<string>
  specs: Bi<string[]>
}

/** Every spec comes from the products and the site: verkoop-knowledge/knowledge/{crm,dashboard}.md, services and pricing data. */
const LAYERS: Layer[] = [
  {
    key: 'ad', tint: '#2b4bf2',
    title: { nl: 'Advertentie', en: 'Ad' },
    body: { nl: 'Campagnes die mensen in een commerciële route sturen, afgestemd op wat ze zoeken.', en: 'Campaigns that send people into a commercial route, matched to what they search for.' },
    specs: { nl: ['Meta Ads en Google Ads', 'Resultaten van Meta, Google, TikTok en OpenAI in één overzicht', 'Budget naar wat verkoopt'], en: ['Meta Ads and Google Ads', 'Results from Meta, Google, TikTok and OpenAI in one view', 'Budget follows what sells'] },
  },
  {
    key: 'page', tint: '#ffd23f',
    title: { nl: 'Landingspagina', en: 'Landing page' },
    body: { nl: 'Eén doelgroep, één campagne, één volgende stap.', en: 'One audience, one campaign, one next step.' },
    specs: { nl: ['Gebouwd en opgeleverd door de studio', 'Afgestemd op één conversiedoel', 'Gemeten met de eigen pixel'], en: ['Built and handed over by the studio', 'Matched to one conversion goal', 'Measured with the own pixel'] },
  },
  {
    key: 'form', tint: '#ff9fd0',
    title: { nl: 'Formulier', en: 'Form' },
    body: { nl: 'Wie interesse toont, laat zijn gegevens achter en komt meteen in het CRM.', en: 'Whoever shows interest leaves their details and lands in the CRM straight away.' },
    specs: { nl: ['Websiteformulier stuurt leads rechtstreeks naar het CRM', 'Bevestiging per e-mail', 'De bron van elke lead blijft bewaard'], en: ['The website form sends leads straight to the CRM', 'Confirmation by email', 'Every lead keeps its source'] },
  },
  {
    key: 'crm', tint: '#c9f26a',
    title: { nl: 'Sales CRM', en: 'Sales CRM' },
    body: { nl: 'Elke lead in één pipeline, met wie je als volgende moet contacteren.', en: 'Every lead in one pipeline, with who to contact next.' },
    specs: { nl: ['Gratis tot 500 leads', 'Nieuw, Gecontacteerd, Interesse, Afspraak, Voorstel', 'Offertes en contracten bij de lead', 'Koppeling met ChatGPT'], en: ['Free up to 500 leads', 'New, Contacted, Engaged, Meeting, Closing', 'Quotes and contracts on the lead', 'Connects to ChatGPT'] },
  },
  {
    key: 'pixel', tint: '#7d93ff',
    title: { nl: 'Pixel', en: 'Pixel' },
    body: { nl: 'Een eigen pixel op je site die bijhoudt wat bezoekers doen, met respect voor toestemming.', en: 'An own pixel on your site that records what visitors do, respecting consent.' },
    specs: { nl: ['Eigen first-party pixel', 'Leest Google Consent Mode v2-signalen', 'Shopify-bestellingen server-side via webhook'], en: ['Own first-party pixel', 'Reads Google Consent Mode v2 signals', 'Shopify orders server-side via webhook'] },
  },
  {
    key: 'dashboard', tint: '#ff7a59',
    title: { nl: 'Performance-dashboard', en: 'Performance dashboard' },
    body: { nl: 'Uitgaven, omzet en rendement per kanaal, en de weg van eerste klik tot aankoop.', en: 'Spend, revenue and return per channel, and the path from first click to purchase.' },
    specs: { nl: ['First click, last click, lineair en time decay', 'Terugkijkperiode van 7 tot 365 dagen', 'Meta, Google, TikTok, Shopify, Wix en je e-mailtool'], en: ['First click, last click, linear and time decay', 'Lookback from 7 to 365 days', 'Meta, Google, TikTok, Shopify, Wix and your email tool'] },
  },
  {
    key: 'report', tint: '#f5f3ee',
    title: { nl: 'Rapport', en: 'Report' },
    body: { nl: 'Elke maand zwart op wit wat werkte, en wat we daarna doen.', en: 'Every month, in black and white, what worked and what we do next.' },
    specs: { nl: ['Maandelijkse rapportage', 'Advies: wat fixen, waar het budget naartoe', 'Resultaten delen met je team'], en: ['Monthly reporting', 'Advice: what to fix, where the budget goes', 'Share results with your team'] },
  },
]

const COPY = {
  nl: { label: 'Het systeem, uit elkaar gehaald', intro: 'Zeven onderdelen, één route van klik tot klant.', end: 'Het hele systeem, weer samen.', endBody: 'Zo bouwen we het voor jou: elk onderdeel meet wat het volgende doet.', cta: 'Plan een gesprek', cases: 'Bekijk resultaten' },
  en: { label: 'The system, taken apart', intro: 'Seven parts, one route from click to customer.', end: 'The whole system, back together.', endBody: 'This is how we build it for you: every part measures what the next one does.', cta: 'Plan a call', cases: 'See results' },
}

/** One layer drawn as a flat panel; the stage tilts it into isometric space. */
function Panel({ layer, lang }: { layer: Layer; lang: 'nl' | 'en' }) {
  const ink = layer.key === 'report' ? '#111110' : '#111110'
  return (
    <svg viewBox="0 0 320 200" className="vs-td-panel-art" aria-hidden="true" focusable="false">
      <rect x="1" y="1" width="318" height="198" rx="16" fill={layer.tint} stroke="#111110" strokeOpacity="0.18" />
      <rect x="1" y="1" width="318" height="34" rx="16" fill="#111110" fillOpacity="0.08" />
      <circle cx="20" cy="18" r="4" fill={ink} opacity="0.4" />
      <circle cx="34" cy="18" r="4" fill={ink} opacity="0.4" />
      <text x="300" y="23" textAnchor="end" fontSize="13" fontWeight="600" fill={ink} className="vs-p-text">{layer.title[lang]}</text>
      {layer.key === 'ad' && <><rect x="22" y="52" width="130" height="122" rx="10" fill="#fff" opacity="0.92" /><rect x="34" y="64" width="106" height="62" rx="6" fill={ink} opacity="0.12" /><rect x="34" y="136" width="80" height="9" rx="4" fill={ink} opacity="0.5" /><rect x="34" y="152" width="56" height="9" rx="4" fill={ink} opacity="0.3" /><rect x="168" y="62" width="130" height="10" rx="5" fill="#fff" opacity="0.7" /><rect x="168" y="82" width="96" height="10" rx="5" fill="#fff" opacity="0.5" /><rect x="168" y="136" width="98" height="28" rx="14" fill="#fff" /></>}
      {layer.key === 'page' && <><rect x="22" y="52" width="200" height="16" rx="6" fill={ink} opacity="0.75" /><rect x="22" y="76" width="160" height="10" rx="5" fill={ink} opacity="0.35" /><rect x="22" y="94" width="120" height="10" rx="5" fill={ink} opacity="0.35" /><rect x="22" y="124" width="112" height="32" rx="16" fill={ink} /><rect x="232" y="52" width="66" height="104" rx="10" fill="#fff" opacity="0.8" /></>}
      {layer.key === 'form' && <><rect x="40" y="52" width="240" height="26" rx="8" fill="#fff" /><rect x="40" y="86" width="240" height="26" rx="8" fill="#fff" /><rect x="40" y="120" width="240" height="26" rx="8" fill="#fff" /><rect x="40" y="156" width="240" height="28" rx="14" fill={ink} /></>}
      {layer.key === 'crm' && [0, 1, 2, 3].map((col) => (
        <g key={col}>
          <rect x={18 + col * 74} y="48" width="66" height="138" rx="9" fill="#fff" opacity="0.55" />
          {Array.from({ length: 3 - (col % 2) }, (_, row) => <rect key={row} x={24 + col * 74} y={58 + row * 40} width="54" height="32" rx="6" fill="#fff" />)}
        </g>
      ))}
      {layer.key === 'pixel' && <><circle cx="160" cy="114" r="52" fill="#fff" opacity="0.35" /><circle cx="160" cy="114" r="30" fill="#fff" opacity="0.6" /><circle cx="160" cy="114" r="10" fill={ink} /><path d="M40 170c40-30 80-30 120 0s80 30 120 0" fill="none" stroke={ink} strokeOpacity="0.35" strokeWidth="3" /></>}
      {layer.key === 'dashboard' && <>{[64, 96, 52, 120, 84, 140].map((h, i) => <rect key={i} x={30 + i * 44} y={186 - h} width="26" height={h} rx="5" fill="#fff" opacity={0.55 + i * 0.07} />)}<path d="M30 120l44-24 44 14 44-40 44 18 44-50" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></>}
      {layer.key === 'report' && <><rect x="24" y="52" width="170" height="14" rx="6" fill={ink} opacity="0.75" />{[78, 96, 114, 132].map((y, i) => <rect key={y} x="24" y={y} width={150 - i * 18} height="8" rx="4" fill={ink} opacity="0.3" />)}<circle cx="248" cy="112" r="44" fill="#2b4bf2" /><path d="M248 112V68a44 44 0 0 1 40 26Z" fill="#c9f26a" /></>}
    </svg>
  )
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

/**
 * The growth system as a pinned isometric stack. Scrolling separates it layer by
 * layer, each with its number, what it does and real specs, then puts it back
 * together into the call to action. Phones and reduced motion get a plain sequence.
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
          <p className="vs-label vs-td-label">{t.intro}</p>
          <h2 id="td-title" className="vs-h2">{t.label}</h2>
          <ol className="vs-td-list">
            {LAYERS.map((layer, i) => (
              <li key={layer.key} className="vs-td-item">
                <Panel layer={layer} lang={lang} />
                <div>
                  <span className="vs-td-count">{String(i + 1).padStart(2, '0')} / {String(LAYERS.length).padStart(2, '0')}</span>
                  <h3 className="vs-td-title">{layer.title[lang]}</h3>
                  <p className="vs-td-body">{layer.body[lang]}</p>
                  <ul className="vs-td-specs">{layer.specs[lang].map((spec) => <li key={spec}>{spec}</li>)}</ul>
                </div>
              </li>
            ))}
          </ol>
          <div className="vs-td-end">
            <p className="vs-td-end-title">{t.end}</p>
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
                  <ul className="vs-td-specs">
                    {layer.specs[lang].map((spec, i) => (
                      <motion.li key={spec} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.08, duration: 0.4, ease: EASE }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><motion.path d="M2 7.5 5.5 11 12 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 + i * 0.08, duration: 0.35 }} /></svg>
                        {spec}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="vs-td-stage" aria-hidden="true">
            <div className="vs-td-stack">
              {LAYERS.map((item, i) => {
                const active = phase === 'open' && i === step
                const z = (LAYERS.length - 1 - i) * gap + (active ? 34 : 0)
                return (
                  <motion.div
                    key={item.key}
                    className="vs-td-layer"
                    style={{ zIndex: LAYERS.length - i } as CSSProperties}
                    initial={false}
                    animate={{ z, opacity: phase === 'open' && !active ? 0.42 : 1 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9 }}
                  >
                    <Panel layer={item} lang={lang} />
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="vs-td-progress" aria-hidden="true">
          {LAYERS.map((item, i) => <span key={item.key} className={phase !== 'closed' && i <= step ? 'is-on' : ''} />)}
        </div>
      </div>
    </section>
  )
}
