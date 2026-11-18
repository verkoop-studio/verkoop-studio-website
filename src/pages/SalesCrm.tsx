import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import { useFooterInView } from '../lib/useFooterInView'
import { usePhoneScrollingDown } from '../lib/usePhoneScrollingDown'
import { Go } from '../components/brand/Arrow'
import Cta from '../components/brand/Cta'
import FaqList from '../components/brand/FaqList'
import { faqItems } from '../data/faq'
import HandNote from '../components/brand/HandNote'
import Reveal from '../components/brand/Reveal'
import SplitHeadline from '../components/brand/SplitHeadline'
import CrmStepper from '../components/product/CrmStepper'
import ShotViewer from '../components/product/ShotViewer'
import { SamplePipeline } from '../components/brand/samples'
import Tilted from '../components/product/Tilted'
import { crmLanding, signupHref, type CrmScreenKey } from '../data/crmLanding'
import { trackCrmSignupClick } from '../lib/analytics'
import { useLang } from '../i18n/LanguageContext'
import crmDashboard from '../assets/crm/crm-dashboard.webp'
import crmProspectflow from '../assets/crm/crm-prospectflow.webp'
import crmLeads from '../assets/crm/crm-leads.webp'
import { PRODUCT_STYLES, usePageStyles } from '../lib/deferredStyles'

const SCREENS: Record<CrmScreenKey, string> = { dashboard: crmDashboard, prospectflow: crmProspectflow, leads: crmLeads }

/** Words that are not in crmLanding: the sample screen, the slider and the step to Performance. */
const T = {
  nl: {
    eyebrow: 'Sales CRM van Verkoop Studio', how: 'Bekijk hoe het werkt', note: 'gratis tot 500 leads :)', sample: 'Voorbeeld',
    stages: ['Nieuw', 'Gecontacteerd', 'Afspraak', 'Voorstel'], toast: 'Nieuwe lead via je website', meter: 'van 500 gratis leads',
    today: 'Vandaag opvolgen', todayRows: ['Bel Sarah terug', 'Stuur offerte naar Tom', 'Plan afspraak met Lien'],
    slider: 'Hoeveel leads heb je?', leads: 'leads', youPay: 'Jij betaalt',
    nextLabel: 'Volgende stap', nextTitle: 'Zie welke advertentie je klanten bracht.', nextBody: 'Performance legt je advertentiekosten naast je echte verkopen. Een gewonnen deal in het CRM telt daar meteen mee.', nextCta: 'Bekijk Performance',
    pill: 'Gratis tot 500 leads',
  },
  en: {
    eyebrow: 'The Verkoop Studio sales CRM', how: 'See how it works', note: 'free up to 500 leads :)', sample: 'Sample',
    stages: ['New', 'Contacted', 'Meeting', 'Proposal'], toast: 'New lead from your website', meter: 'of 500 free leads',
    today: 'Follow up today', todayRows: ['Call Sarah back', 'Send Tom the quote', 'Book a meeting with Lien'],
    slider: 'How many leads do you have?', leads: 'leads', youPay: 'You pay',
    nextLabel: 'Next step', nextTitle: 'See which ad brought your customers.', nextBody: 'Performance puts your ad spend next to your real sales. A deal you win in the CRM counts there straight away.', nextCta: 'See Performance',
    pill: 'Free up to 500 leads',
  },
}

/** The page's one action. Ad parameters are added at click time, so the prerendered and hydrated href match. */
function Signup({ placement, label, variant = 'ink' }: { placement: string; label: string; variant?: 'ink' | 'paper' }) {
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.href = signupHref(window.location.search)
    trackCrmSignupClick(placement)
  }
  return <Cta href={crmLanding.signupUrl} variant={variant} onClick={onClick}>{label}</Cta>
}

/** The pipeline, working: a lead arrives, moves through the stages and the free meter counts up. Sample data. */
function LivePipeline({ lang }: { lang: 'nl' | 'en' }) {
  const t = T[lang]
  const reduce = useReducedMotion()
  const [tick, setTick] = useState(0)
  useEffect(() => {
    if (reduce) return
    const id = window.setInterval(() => setTick((n) => n + 1), 1500)
    return () => window.clearInterval(id)
  }, [reduce])
  const stage = tick % 5
  const leads = 38 + Math.floor(tick / 5)
  return (
    <div className="pp-live" aria-hidden="true">
      <div className="tx-win pp-win">
        <div className="tx-win-bar"><i /><i /><i /><b>Sales CRM</b><em>{t.sample}</em></div>
        <div className="pp-board">
          <SamplePipeline lang={lang} layout="columns" id="crm-hero" ms={1500} />
          <div className="pp-meter"><b style={{ width: `${(leads / 500) * 100 + 4}%` }} /><span><strong>{leads}</strong> {t.meter}</span></div>
        </div>
      </div>
      <motion.p className="pp-toast" animate={stage === 0 ? { opacity: 1, y: 0, rotate: -3 } : { opacity: 0, y: -12, rotate: -3 }} transition={{ duration: 0.4 }}>
        <span />{t.toast}
      </motion.p>
      <div className="pp-today">
        <p>{t.today}</p>
        <ul>{t.todayRows.map((row, i) => <li key={row} className={stage > i ? 'is-done' : ''}><i />{row}</li>)}</ul>
      </div>
    </div>
  )
}

function PriceSlider({ lang }: { lang: 'nl' | 'en' }) {
  const t = T[lang]
  const tiers = crmLanding.pricing.tiers[lang]
  const [leads, setLeads] = useState(300)
  const index = leads <= 500 ? 0 : leads <= 5000 ? 1 : 2
  return (
    <div className="pp-price">
      <label className="pp-slider">
        <span>{t.slider}</span>
        <strong><span><span key={leads} className="pp-tick">{leads >= 10000 ? (lang === 'nl' ? '10.000+' : '10,000+') : leads.toString().replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'nl' ? '.' : ',')}</span> {t.leads}</span><small>{lang === 'nl' ? 'jouw schatting' : 'your estimate'}</small></strong>
        <input type="range" min={0} max={10000} step={100} value={leads} onChange={(e) => setLeads(Number(e.target.value))} style={{ '--p': `${leads / 100}%` } as CSSProperties} />
      </label>
      <ul className="pp-tiers">
        {tiers.map((tier, i) => (
          <li key={tier.leads} className={i === index ? 'is-on' : ''}>
            <p>{tier.leads}</p>
            <strong>{tier.price}</strong>
            <span>{tier.note}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function SalesCrm() {
  usePageStyles(PRODUCT_STYLES)
  const { lang } = useLang()
  const c = crmLanding
  const t = T[lang]
  const hero = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: hero, offset: ['end 60%', 'end 20%'] })
  const pill = useTransform(scrollYProgress, [0, 1], [90, 0])
  // The pill repeats the final call to action, so it steps aside once that section is on screen.
  const final = useRef<HTMLElement>(null)
  const finalInView = useInView(final, { margin: '0px 0px -25% 0px' })
  const footerInView = useFooterInView()
  // It also steps aside while the stepper's sticky window is on screen, so it never covers it.
  const screens = useRef<HTMLElement>(null)
  const screensInView = useInView(screens, { margin: '-30% 0px -30% 0px' })
  const faq = useRef<HTMLDivElement>(null)
  const faqInView = useInView(faq, { margin: '0px 0px -10% 0px' })
  // On phones it only shows while scrolling back up, so it never sits over the text being read.
  const scrollingDown = usePhoneScrollingDown()
  const pillHidden = finalInView || footerInView || screensInView || faqInView || scrollingDown
  const [first, ...rest] = c.hero.title[lang].split(' ')
  const words = [first, ...rest]
  const accent = lang === 'nl' ? 'vandaag' : 'today.'

  return (
    <div className="vs-page pp">
      <Seo title={c.seo.title[lang]} description={c.seo.description[lang]} path={c.path} />

      <section ref={hero} className="pp-hero">
        <div className="vs-wrap pp-hero-grid">
          <div>
            <p className="vs-label">{t.eyebrow}</p>
            <SplitHeadline as="h1" className="vs-h1 pp-h1" onMount parts={words.map((word) => ({ text: word, tone: word === accent ? 'accent' as const : undefined }))} />
            <p className="vs-lead pp-lead-text">{c.hero.lead[lang]}</p>
            <div className="vs-hero-actions">
              <Signup placement="crm_hero" label={c.cta[lang]} />
              <Cta to="/crm#schermen" variant="line">{t.how}</Cta>
            </div>
          </div>
          <div className="pp-hero-stage">
            <LivePipeline lang={lang} />
            <HandNote point="up-left" className="pp-hero-note">{t.note}</HandNote>
          </div>
        </div>
      </section>

      <section className="vs-wrap vs-section pp-who" aria-labelledby="voor-wie-titel">
        <div className="pp-who-copy">
          <SplitHeadline id="voor-wie-titel" className="vs-h2" parts={[{ text: c.audience.title[lang] }]} />
          <p className="vs-lead">{c.audience.body[lang]}</p>
        </div>
        <div className="pp-pains">
          {c.audience.items[lang].map((item, i) => (
            <Tilted key={item} lean={[-3, 2.2, -1.6][i]} className="pp-pain" style={{ zIndex: 3 - i }}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <p>{item}</p>
            </Tilted>
          ))}
        </div>
      </section>

      <section ref={screens} id="schermen" className="pp-screens" aria-labelledby="schermen-titel">
        <div className="vs-wrap">
          <SplitHeadline id="schermen-titel" className="vs-h2" parts={[{ text: c.screens.title[lang] }]} />
          <CrmStepper lang={lang} />
          <ShotViewer product="Sales CRM" label={c.demoNote[lang]} shots={c.screens.items[lang].map((item) => ({ ...item, src: SCREENS[item.key] }))} />
          <p className="pp-fine">{c.demoNote[lang]}</p>
        </div>
      </section>

      <section className="vs-wrap vs-section" aria-labelledby="meer-titel">
        <SplitHeadline id="meer-titel" className="vs-h2" parts={[{ text: c.more.title[lang] }]} />
        <ul className="pp-more">
          {c.more.items[lang].map((item, i) => (
            <motion.li key={item} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, margin: '-60px' }} transition={{ duration: 0.5, delay: i * 0.06 }}>
              <svg width="18" height="18" viewBox="0 0 14 14" fill="none" aria-hidden="true"><motion.path d="M2 7.5 5.5 11 12 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: false }} transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }} /></svg>
              {item}
            </motion.li>
          ))}
        </ul>
      </section>

      <section className="pp-pricing" aria-labelledby="prijs-titel">
        <div className="vs-wrap">
          <SplitHeadline id="prijs-titel" className="vs-h2" parts={[{ text: c.pricing.title[lang] }]} />
          <p className="vs-lead pp-narrow">{c.pricing.body[lang]}</p>
          <PriceSlider lang={lang} />
          <p className="pp-fine">{c.pricing.clients[lang]}</p>
        </div>
      </section>

      <section className="vs-wrap vs-section">
        <Reveal>
          <Link to="/performance" className="pp-next">
            <div>
              <p className="vs-label">{t.nextLabel}</p>
              <h2 className="pp-next-title">{t.nextTitle}</h2>
              <p>{t.nextBody}</p>
            </div>
            <span className="pp-next-go">{t.nextCta}<Go /></span>
          </Link>
        </Reveal>
      </section>

      <div ref={faq}><FaqList id="crm-faq" title={lang === 'nl' ? 'Veelgestelde vragen' : 'Frequently asked questions'} items={[faqItems[15], faqItems[14], faqItems[12]]} lang={lang} /></div>

      <section ref={final} className="pp-final" aria-labelledby="start-titel">
        <div className="vs-wrap">
          <SplitHeadline id="start-titel" className="pp-final-title" parts={[{ text: c.final.title[lang], tone: 'accent' }]} />
          <p className="vs-lead pp-narrow">{c.final.body[lang]}</p>
          <Signup placement="crm_final" label={c.cta[lang]} variant="paper" />
        </div>
      </section>

      <motion.div
        className="pp-pill"
        style={{ y: pill, pointerEvents: pillHidden ? 'none' : undefined }}
        animate={{ opacity: pillHidden ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        aria-hidden={pillHidden || undefined}
        inert={pillHidden || undefined}
      >
        <span>{t.pill}</span>
        <Signup placement="crm_pill" label={c.cta[lang]} />
      </motion.div>
    </div>
  )
}
