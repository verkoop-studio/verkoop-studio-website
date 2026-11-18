import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import Cta from '../components/brand/Cta'
import { useArrive } from '../components/brand/useArrive'
import FaqList from '../components/brand/FaqList'
import HandNote from '../components/brand/HandNote'
import Reveal from '../components/brand/Reveal'
import SplitHeadline from '../components/brand/SplitHeadline'
import TextLink from '../components/brand/TextLink'
import { EASE } from '../components/brand/motion'
import PlansSection from '../components/home/PlansSection'
import { crmLanding } from '../data/crmLanding'
import { faqItems } from '../data/faq'
import { performance } from '../data/performance'
import { pricingTiers } from '../data/pricing'
import { trackEvent } from '../lib/analytics'
import { PAGES_STYLES, usePageStyles } from '../lib/deferredStyles'
import { useLang } from '../i18n/LanguageContext'

const COPY = {
  nl: {
    seoTitle: 'Prijzen',
    seoDescription: 'De prijzen van Verkoop Studio: drie maandelijkse groeipakketten, de Sales CRM en Performance. Alles excl. btw.',
    label: 'Prijzen',
    title: [{ text: 'Wat het' }, { text: 'kost.', tone: 'accent' as const }],
    cta: 'Plan een gesprek',
    builder: 'Stel je pakket samen',
    builderBody: 'Twee vragen. Het pakket dat past, verschijnt eronder.',
    q1: 'Wil je dat wij ook videoshoots doen?',
    q2: 'Wil je je social media volledig uit handen geven?',
    yes: 'Ja',
    no: 'Nee',
    fits: 'Dit pakket past',
    seePlan: 'Bekijk wat erin zit',
    software: 'Onze software, apart',
    crm: 'Sales CRM',
    perf: 'Performance',
    faq: 'Vragen over prijzen',
    note: 'alles excl. btw :)',
    promise: 'Drie pakketten. Eén volledige aanpak.',
  },
  en: {
    seoTitle: 'Pricing',
    seoDescription: 'Verkoop Studio pricing: three monthly growth plans, the Sales CRM and Performance. All excl. VAT.',
    label: 'Pricing',
    title: [{ text: 'What it' }, { text: 'costs.', tone: 'accent' as const }],
    cta: 'Plan a call',
    builder: 'Build your plan',
    builderBody: 'Two questions. The plan that fits appears below.',
    q1: 'Do you want us to do video shoots too?',
    q2: 'Do you want your social media handled end to end?',
    yes: 'Yes',
    no: 'No',
    fits: 'This plan fits',
    seePlan: 'See what is in it',
    software: 'Our software, on its own',
    crm: 'Sales CRM',
    perf: 'Performance',
    faq: 'Questions about pricing',
    note: 'all excl. VAT :)',
    promise: 'Three plans. One full approach.',
  },
}

/** The pricing questions from faq.ts: cost, tools, project or monthly, documentation, a single website. */
const PRICING_FAQ = [14, 15, 10, 16, 1]

/** Two yes-or-no questions that point to a plan, following the plan differences in pricing.ts. */
function Builder({ lang }: { lang: 'nl' | 'en' }) {
  const t = COPY[lang]
  const reduce = useReducedMotion()
  const [video, setVideo] = useState(false)
  const [social, setSocial] = useState(false)
  const tier = pricingTiers[social ? 2 : video ? 1 : 0]
  const toggle = (label: string, value: boolean, set: (v: boolean) => void, id: string) => (
    <fieldset className="pr-q">
      <legend id={id}>{label}</legend>
      <div className="pr-switch" role="radiogroup" aria-labelledby={id}>
        {[false, true].map((option) => (
          <button key={String(option)} type="button" role="radio" aria-checked={value === option} onClick={() => set(option)}>
            {value === option && <motion.span layoutId={`${id}-pill`} className="pr-switch-pill" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
            <span>{option ? t.yes : t.no}</span>
          </button>
        ))}
      </div>
    </fieldset>
  )
  return (
    <section className="vs-wrap vs-section pr-builder" aria-labelledby="builder-title">
      <div>
        <Reveal as="h2" className="vs-h2" id="builder-title">{t.builder}</Reveal>
        <p className="vs-lead">{t.builderBody}</p>
        {toggle(t.q1, video || social, (v) => { setVideo(v); if (!v) setSocial(false) }, 'pr-video')}
        {toggle(t.q2, social, (v) => { setSocial(v); if (v) setVideo(true) }, 'pr-social')}
      </div>
      <div className="pr-result" aria-live="polite">
        <p className="pr-result-label">{t.fits}</p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={tier.key} className="pr-result-card" initial={reduce ? false : { opacity: 0, y: 16, rotate: -1.5 }} animate={{ opacity: 1, y: 0, rotate: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35, ease: EASE }}>
            <h3>{tier.name[lang]}</h3>
            <p className="pr-aud">{tier.audience[lang]}</p>
            <TextLink href={`#plan-${tier.key}`}>{t.seePlan}</TextLink>
            <Cta to={`/contact?pakket=${tier.key}`} onClick={() => trackEvent('audit_cta_clicked', { placement: 'pricing_builder', tier: tier.key })}>{t.cta}</Cta>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}


export default function Pricing() {
  usePageStyles(PAGES_STYLES)
  const { lang } = useLang()
  const t = COPY[lang]
  const arrive = useArrive()
  const crm = crmLanding.pricing
  const perf = performance.pricing

  return (
    <div className="vs-page pr-page">
      <Seo title={t.seoTitle} description={t.seoDescription} path="/prijzen" />

      <section className="vs-wrap pr-hero" aria-labelledby="pricing-page-title">
        <div className="pr-hero-copy">
          <motion.p className="vs-label" {...arrive(0)}>{t.label}</motion.p>
          <SplitHeadline as="h1" id="pricing-page-title" className="vs-h1 pr-h1" parts={t.title} onMount />
          <motion.p className="pr-promise" {...arrive(0.55)}>{t.promise}</motion.p>
          <motion.div className="sv-hero-actions" {...arrive(0.7)}>
            <Cta to="/contact" onClick={() => trackEvent('audit_cta_clicked', { placement: 'pricing_hero' })}>{t.cta}</Cta>
            <TextLink href="#builder-title">{t.builder}</TextLink>
            <HandNote point="up-left" className="pr-note">{t.note}</HandNote>
          </motion.div>
        </div>
        <motion.ul className="pr-tiles" {...arrive(0.85)}>
          {pricingTiers.map((tier, i) => {
            const [figure, per] = tier.price[lang].split(' / ')
            return (
              <li key={tier.key}>
                <Link to={`/contact?pakket=${tier.key}`} className={`pr-tile pr-tile--${i}`} onClick={() => trackEvent('audit_cta_clicked', { placement: 'pricing_hero_tile', tier: tier.key })}>
                  <b>{tier.name[lang]}</b>
                  <span><strong>{figure}</strong><small>{per ? `/ ${per}` : ''}</small></span>
                </Link>
              </li>
            )
          })}
        </motion.ul>
      </section>

      <Builder lang={lang} />
      <PlansSection />

      <section className="vs-wrap vs-section pr-software" aria-labelledby="software-prices">
        <Reveal as="h2" className="vs-h2" id="software-prices">{t.software}</Reveal>
        <div className="pr-software-grid">
          <article className="pr-soft">
            <h3>{t.crm}</h3>
            <p>{crm.body[lang]}</p>
            <table className="sv-table"><tbody>{crm.tiers[lang].map((row) => <tr key={row.leads}><th scope="row">{row.leads}</th><td>{row.price}</td><td className="pr-soft-note">{row.note}</td></tr>)}</tbody></table>
            <TextLink to={crmLanding.path}>{t.crm}</TextLink>
          </article>
          <article className="pr-soft">
            <h3>{t.perf}</h3>
            <p>{perf.intro[lang]}</p>
            <table className="sv-table"><tbody>{perf.plans.map((plan) => <tr key={plan.name}><th scope="row">{plan.name}</th><td>{plan.spend[lang]}</td><td>{plan.price[lang]}</td></tr>)}</tbody></table>
            <TextLink to={performance.path}>{t.perf}</TextLink>
          </article>
        </div>
      </section>

      <FaqList id="pricing-faq" title={t.faq} items={PRICING_FAQ.map((i) => faqItems[i])} lang={lang} />
    </div>
  )
}
