import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import LyteWork from '../components/LyteWork'
import Seo from '../components/Seo'
import Arrow from '../components/brand/Arrow'
import Cta from '../components/brand/Cta'
import { PAGES_STYLES, usePageStyles } from '../lib/deferredStyles'
import HandNote from '../components/brand/HandNote'
import Reveal from '../components/brand/Reveal'
import SplitHeadline from '../components/brand/SplitHeadline'
import TextLink from '../components/brand/TextLink'
import { EASE } from '../components/brand/motion'
import CasePoster from '../components/home/CasePoster'
import { cases } from '../data/cases'
import type { Bi, CaseSlug } from '../data/types'
import { trackEvent } from '../lib/analytics'
import { useLang } from '../i18n/LanguageContext'

/** Published results only. Cases without a validated figure show their sector. */
const RESULT: Partial<Record<CaseSlug, Bi<string>>> = {
  pinacello: { nl: '+120% online omzet', en: '+120% online revenue' },
  nooms: { nl: 'Pre-sale volledig uitverkocht', en: 'Pre-sale sold out' },
}

const COPY = {
  nl: {
    seoTitle: 'Cases',
    seoDescription:
      "Ecommerce, hospitality en consumer brands: cases van Pinacello, Healthfactor, E-Kart en Nooms.",
    label: 'Cases',
    title: [{ text: 'Ons werk,' }, { text: 'met cijfers.', tone: 'accent' as const }],
    body: 'Campagnes, webshops en websites. Bij elk project staat wie het maakte.',
    ongoing: 'Lopend project',
    view: 'Bekijk de case',
    note: 'kies er maar een :)',
    closingTitle: 'Jouw bedrijf hier?',
    closingBody: 'Vertel ons waar je naartoe wil. We komen terug met een plan.',
    cta: 'Plan een gesprek',
  },
  en: {
    seoTitle: 'Cases',
    seoDescription:
      "Ecommerce, hospitality and consumer brands: cases from Pinacello, Healthfactor, E-Kart and Nooms.",
    label: 'Cases',
    title: [{ text: 'Our work,' }, { text: 'with numbers.', tone: 'accent' as const }],
    body: 'Campaigns, shops and websites. Every project says who made it.',
    ongoing: 'Ongoing project',
    view: 'View the case',
    note: 'pick one :)',
    closingTitle: 'Your business here?',
    closingBody: 'Tell us where you want to go. We come back with a plan.',
    cta: 'Plan a call',
  },
}

const FAN = [
  { x: -150, y: 26, r: -9 },
  { x: -50, y: -6, r: -3 },
  { x: 50, y: 4, r: 3 },
  { x: 150, y: 30, r: 9 },
]

export default function CasesIndex() {
  usePageStyles(PAGES_STYLES)
  const { lang } = useLang()
  const t = COPY[lang]
  const reduce = useReducedMotion()
  const list = cases.filter((c) => !c.unavailable)

  return (
    <div className="vs-page">
      <Seo title={t.seoTitle} description={t.seoDescription} path="/cases" />

      <section className="vs-wrap vs-cases-hero" aria-labelledby="cases-title">
        <div className="vs-cases-hero-copy">
          <p className="vs-label">{t.label}</p>
          <SplitHeadline as="h1" id="cases-title" className="vs-h1" parts={t.title} onMount />
          <motion.p className="vs-lead" initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6, ease: EASE }}>{t.body}</motion.p>
        </div>
        {/* The four posters dealt onto a fan: the page's live object. */}
        <div className="vs-cases-fan" aria-hidden="true">
          {list.slice(0, 4).map((item, i) => (
            <motion.div
              key={item.slug}
              className="vs-cases-fan-card vs-case-live"
              initial={reduce ? false : { opacity: 0, y: 160, rotate: 0, x: 0 }}
              animate={{ opacity: 1, y: FAN[i].y, rotate: FAN[i].r, x: FAN[i].x }}
              transition={{ type: 'spring', stiffness: 90, damping: 15, delay: 0.3 + i * 0.12 }}
              style={{ zIndex: i + 1 }}
            >
              <CasePoster slug={item.slug} name={item.name} caption={RESULT[item.slug]?.[lang] ?? item.sector[lang]} lang={lang} />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="vs-wrap vs-section vs-cases-grid-wrap" aria-label={t.label}>
        <HandNote point="down-left" className="vs-cases-note">{t.note}</HandNote>
        <ul className="vs-cases-grid">
          {list.map((c, i) => (
            <Reveal as="li" key={c.slug} delay={(i % 2) * 0.1} y={40}>
              <Link
                to={`/cases/${c.slug}`}
                className="vs-case-card vs-case-live"
                onClick={() => trackEvent('case_viewed', { case: c.slug, placement: 'cases_index' })}
              >
                <div className="vs-case-card-frame">
                  <CasePoster slug={c.slug} name={c.name} caption={RESULT[c.slug]?.[lang] ?? c.sector[lang]} lang={lang} />
                </div>
                <div className="vs-case-card-meta">
                  <div>
                    <h2 className="vs-case-card-name">{c.name}</h2>
                    <p className="vs-case-card-result">{RESULT[c.slug]?.[lang] ?? c.sector[lang]}</p>
                  </div>
                  {c.status === 'ongoing' && <span className="vs-case-card-chip">{t.ongoing}</span>}
                </div>
                <p className="vs-case-card-summary">{c.summary[lang]}</p>
                <span className="vs-textlink vs-textlink--arrow vs-case-card-link">{t.view}<Arrow size={15} /></span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      <LyteWork />

      <section className="vs-wrap vs-section" aria-labelledby="cases-closing">
        <div className="vs-closing">
          <h2 id="cases-closing" className="vs-h2">{t.closingTitle}</h2>
          <p className="vs-lead">{t.closingBody}</p>
          <div className="vs-closing-actions">
            <Cta to="/contact" onClick={() => trackEvent('audit_cta_clicked', { placement: 'cases_index' })}>{t.cta}</Cta>
            <TextLink href="mailto:stef@verkoop.studio" arrow={false}>stef@verkoop.studio</TextLink>
          </div>
        </div>
      </section>
    </div>
  )
}
