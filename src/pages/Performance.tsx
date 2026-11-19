import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import Seo from '../components/Seo'
import { useFooterInView } from '../lib/useFooterInView'
import { usePhoneScrollingDown } from '../lib/usePhoneScrollingDown'
import WorksWith from '../components/brand/WorksWith'
import PerformanceSignupForm from '../components/PerformanceSignupForm'
import AudienceRows from '../components/brand/AudienceRows'
import Cta from '../components/brand/Cta'
import TextLink from '../components/brand/TextLink'
import ShotViewer from '../components/product/ShotViewer'
import FaqList from '../components/brand/FaqList'
import { faqItems } from '../data/faq'
import SplitHeadline from '../components/brand/SplitHeadline'
import Tilted from '../components/product/Tilted'
import { performance as p } from '../data/performance'
import { trackEvent, trackLandingView } from '../lib/analytics'
import { useLang } from '../i18n/LanguageContext'
import adsShot from '../assets/performance/ads.webp'
import customersShot from '../assets/performance/customers.webp'
import adviceShot from '../assets/performance/advice.webp'
import { PRODUCT_STYLES, usePageStyles } from '../lib/deferredStyles'

const SHOTS = { ads: adsShot, customers: customersShot, advice: adviceShot } as const
/** Upper bound of monthly ad spend for each plan, in the order of performance.pricing.plans. */
const LIMITS = [5000, 15000, 50000, 150000, Infinity]

/** Words that are not in data/performance.ts: the sample table, the slider and small labels. Figures are invented samples. */
const T = {
  nl: {
    prices: 'Bekijk de prijzen', note: 'echte cijfers', sample: 'Voorbeeld', channel: 'Kanaal', says: 'Platform meldt', sold: 'Echt verkocht',
    total: 'Totaal', orders: 'bestellingen', spendTitle: 'Uitgaven en omzet per week', spend: 'Uitgaven', revenue: 'Omzet',
    claims: ['Meta telt 1 aankoop', 'Google telt dezelfde aankoop', 'Je webshop ziet 1 bestelling'],
    slider: 'Wat geef je per maand uit aan advertenties?', perMonth: 'per maand', yourPlan: 'Jouw plan', pill: 'Vanaf €49 per maand',
  },
  en: {
    prices: 'See the prices', note: 'real numbers', sample: 'Sample', channel: 'Channel', says: 'Platform reports', sold: 'Really sold',
    total: 'Total', orders: 'orders', spendTitle: 'Spend and revenue per week', spend: 'Spend', revenue: 'Revenue',
    claims: ['Meta counts 1 purchase', 'Google counts the same purchase', 'Your shop sees 1 order'],
    slider: 'What do you spend on ads each month?', perMonth: 'per month', yourPlan: 'Your plan', pill: 'From €49 a month',
  },
}

const ROWS = [
  { name: 'Meta', says: 61, sold: 38 },
  { name: 'Google', says: 47, sold: 31 },
  { name: 'TikTok', says: 23, sold: 15 },
]

/** Shows `to` at rest (so the page never reads 0), and counts up from 0 each time it comes into view. */
function Count({ to, on }: { to: number; on: boolean }) {
  const [n, setN] = useState(to)
  const reduce = useReducedMotion()
  useEffect(() => {
    if (!on || reduce) return setN(to)
    let frame = 0
    const start = performance.now()
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / 900)
      setN(Math.round(to * (1 - (1 - k) ** 3)))
      if (k < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [on, to, reduce])
  return <>{n}</>
}

/** What each platform reports, struck through by hand, beside what the shop really sold. Sample data. */
function TruthTable({ lang }: { lang: 'nl' | 'en' }) {
  const t = T[lang]
  const ref = useRef<HTMLDivElement>(null)
  const on = useInView(ref, { margin: '-80px' })
  return (
    <div ref={ref} className={`pp-live pp-truth${on ? ' is-on' : ''}`} aria-hidden="true">
      <div className="tx-win pp-win">
        <div className="tx-win-bar"><i /><i /><i /><b>Performance</b><em>{t.sample}</em></div>
        <div className="pp-table">
          <div className="pp-row pp-row--head"><span>{t.channel}</span><span>{t.says}</span><span>{t.sold}</span></div>
          {ROWS.map((row, i) => (
            <div key={row.name} className="pp-row" style={{ '--d': `${0.5 + i * 0.35}s` } as CSSProperties}>
              <span>{row.name}</span>
              <span className="pp-claim"><Count to={row.says} on={on} /><svg viewBox="0 0 60 16" preserveAspectRatio="none"><path d="M2 11C16 3 40 14 58 5" pathLength={1} /></svg></span>
              <strong><Count to={row.sold} on={on} /></strong>
            </div>
          ))}
          <div className="pp-row pp-row--total" style={{ '--d': '1.6s' } as CSSProperties}>
            <span>{t.total}</span>
            <span className="pp-claim"><Count to={131} on={on} /><svg viewBox="0 0 60 16" preserveAspectRatio="none"><path d="M2 11C16 3 40 14 58 5" pathLength={1} /></svg></span>
            <strong><Count to={84} on={on} /> {t.orders}</strong>
          </div>
        </div>
      </div>
    </div>
  )
}

function PlanSlider({ lang }: { lang: 'nl' | 'en' }) {
  const t = T[lang]
  const plans = p.pricing.plans
  const [step, setStep] = useState(12)
  /* a curved scale: fine steps at the low end, where most businesses are */
  const spend = Math.round(((step / 100) ** 2.4 * 200000) / 500) * 500
  const index = LIMITS.findIndex((limit) => spend <= limit)
  const money = spend.toString().replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'nl' ? '.' : ',')
  return (
    <div className="pp-price">
      <label className="pp-slider">
        <span>{t.slider}</span>
        <strong><span>€ <span key={step} className="pp-tick">{step >= 100 ? (lang === 'nl' ? '200.000+' : '200,000+') : money}</span></span><small>{lang === 'nl' ? 'jouw schatting' : 'your estimate'}</small></strong>
        <input type="range" min={0} max={100} value={step} onChange={(e) => setStep(Number(e.target.value))} style={{ '--p': `${step}%` } as CSSProperties} />
      </label>
      <ul className="pp-tiers pp-tiers--five">
        {plans.map((plan, i) => (
          <li key={plan.name} className={i === index ? 'is-on' : ''}>
            <p>{plan.name} · {plan.spend[lang]}</p>
            <strong>{plan.price[lang]}</strong>
            <span>{i < 4 ? p.pricing.head[lang].price : ''}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}


export default function Performance() {
  usePageStyles(PRODUCT_STYLES)
  const { lang } = useLang()
  const t = T[lang]
  const hero = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: hero, offset: ['end 60%', 'end 20%'] })
  const pill = useTransform(scrollYProgress, [0, 1], [90, 0])
  // The pill repeats the form's action, so it steps aside while the form is on screen.
  const final = useRef<HTMLElement>(null)
  const finalInView = useInView(final, { margin: '0px 0px -25% 0px' })
  const footerInView = useFooterInView()
  // It also steps aside over the screenshots and the FAQ, so it never covers a caption or an answer.
  const screens = useRef<HTMLElement>(null)
  const screensInView = useInView(screens, { margin: '-30% 0px -30% 0px' })
  const faq = useRef<HTMLDivElement>(null)
  const faqInView = useInView(faq, { margin: '0px 0px -10% 0px' })
  // On phones it only shows while scrolling back up, so it never sits over the text being read.
  const scrollingDown = usePhoneScrollingDown()
  const pillHidden = finalInView || footerInView || screensInView || faqInView || scrollingDown
  const accent = lang === 'nl' ? 'echt' : 'actually'

  useEffect(() => { trackLandingView('Verkoop Studio Performance') }, [])
  const start = (placement: string) => () => trackEvent('audit_cta_clicked', { placement })

  return (
    <div className="vs-page pp">
      <Seo title={p.seo.title[lang]} description={p.seo.description[lang]} path={p.path} />

      <section ref={hero} className="pp-hero performance-hero">
        <div className="vs-wrap pp-hero-grid">
          <div>
            <p className="vs-label">Verkoop Studio Performance</p>
            <SplitHeadline as="h1" className="vs-h1 pp-h1" onMount parts={p.hero.title[lang].split(' ').map((word) => ({ text: word, tone: word === accent ? 'accent' as const : undefined }))} />
            <p className="vs-lead pp-lead-text">{p.hero.lead[lang]}</p>
            <div className="vs-hero-actions">
              <Cta to="/performance#starten" onClick={start('performance_hero')}>{p.hero.cta[lang]}</Cta>
              <TextLink to="/performance#prijzen">{t.prices}</TextLink>
            </div>
          </div>
          <div className="pp-hero-stage">
            <TruthTable lang={lang} />
          </div>
        </div>
      </section>

      <section className="pp-pricing pp-problem" aria-labelledby="probleem-titel">
        <div className="vs-wrap pp-who">
          <div className="pp-who-copy">
            <SplitHeadline id="probleem-titel" className="vs-h2" parts={[{ text: p.problem.title[lang] }]} />
            <p className="vs-lead">{p.problem.body[lang]}</p>
          </div>
          <div className="pp-pains">
            {t.claims.map((claim, i) => (
              <Tilted key={claim} lean={[-3, 2.4, -1.2][i]} className="pp-pain" style={{ zIndex: i + 1 }}>
                <span>{i < 2 ? '+1' : '=1'}</span>
                <p>{claim}</p>
              </Tilted>
            ))}
          </div>
        </div>
      </section>

      <section ref={screens} id="schermen" className="pp-screens" aria-labelledby="schermen-titel">
        <div className="vs-wrap">
          <SplitHeadline id="schermen-titel" className="vs-h2" parts={[{ text: p.screens.title[lang] }]} />
          <ShotViewer product="Performance" chip={t.sample} label={p.screens.title[lang]} shots={p.screens.items[lang].map((item) => ({ ...item, src: SHOTS[item.key] }))} />
          <p className="pp-fine">{p.sampleNote[lang]}</p>
        </div>
      </section>

      <section className="vs-wrap vs-section" aria-labelledby="inhoud-titel">
        <SplitHeadline id="inhoud-titel" className="vs-h2" parts={[{ text: p.features.title[lang] }]} />
        <ul className="pp-more">
          {p.features.items[lang].map((item, i) => (
            <motion.li key={item} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, margin: '-60px' }} transition={{ duration: 0.5, delay: i * 0.05 }}>
              <svg width="18" height="18" viewBox="0 0 14 14" fill="none" aria-hidden="true"><motion.path d="M2 7.5 5.5 11 12 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: false }} transition={{ duration: 0.4, delay: 0.2 + i * 0.05 }} /></svg>
              {item}
            </motion.li>
          ))}
        </ul>
      </section>

      <section className="pp-screens pp-for" aria-labelledby="voorwie-titel">
        <div className="vs-wrap">
          <SplitHeadline id="voorwie-titel" className="vs-h2" parts={[{ text: p.audience.title[lang] }]} />
          <AudienceRows rows={p.audience.items[lang].map((item) => [item.title, item.body] as [string, string])} />
        </div>
      </section>

      <section id="prijzen" className="pp-pricing" aria-labelledby="prijzen-titel">
        <div className="vs-wrap">
          <SplitHeadline id="prijzen-titel" className="vs-h2" parts={[{ text: p.pricing.title[lang] }]} />
          <p className="vs-lead pp-narrow">{p.pricing.intro[lang]}</p>
          <PlanSlider lang={lang} />
          <ul className="pp-terms">{p.pricing.terms[lang].map((term) => <li key={term}>{term}</li>)}</ul>
        </div>
      </section>

      <WorksWith lang={lang} platforms={['meta', 'google', 'tiktok', 'chatgpt', 'shopify', 'wix', 'klaviyo', 'mailchimp', 'resend', 'perplexity']} />

      <div ref={faq}><FaqList id="performance-faq" title={lang === 'nl' ? 'Veelgestelde vragen' : 'Frequently asked questions'} items={[faqItems[12], faqItems[15], faqItems[4]]} lang={lang} /></div>

      <section ref={final} id="starten" className="pp-final pp-form" aria-labelledby="starten-titel">
        <div className="vs-wrap">
          <SplitHeadline id="starten-titel" className="pp-final-title" parts={[{ text: p.form.title[lang], tone: 'accent' }]} />
          <p className="vs-lead pp-narrow">{p.form.body[lang]}</p>
          <div className="pp-form-box"><PerformanceSignupForm preview /></div>
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
        <Cta to="/performance#starten" onClick={start('performance_pill')}>{p.hero.cta[lang]}</Cta>
      </motion.div>
    </div>
  )
}
