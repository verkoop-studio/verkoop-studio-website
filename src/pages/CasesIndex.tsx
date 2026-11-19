import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import LyteWork from '../components/LyteWork'
import Wordmarks from '../components/cases/Wordmarks'
import Seo from '../components/Seo'
import Arrow from '../components/brand/Arrow'
import { PAGES_STYLES, usePageStyles } from '../lib/deferredStyles'
import HandNote from '../components/brand/HandNote'
import Reveal from '../components/brand/Reveal'
import SplitHeadline from '../components/brand/SplitHeadline'
import { EASE } from '../components/brand/motion'
import CasePoster from '../components/home/CasePoster'
import { caseHeadline, cases } from '../data/cases'
import { trackEvent } from '../lib/analytics'
import { useLang } from '../i18n/LanguageContext'

const COPY = {
  nl: {
    seoTitle: 'Cases',
    seoDescription:
      "Ecommerce, hospitality en consumer brands: cases van Pinacello, Healthfactor, E-Kart en Nooms.",
    label: 'Cases',
    title: [{ text: 'Werk uit' }, { text: 'de praktijk.', tone: 'accent' as const }],
    body: 'Campagnes, webshops en websites. Bij elk project staat wie het maakte.',
    ongoing: 'Lopend project',
    view: 'Bekijk de case',
    note: 'kies er maar een :)',
  },
  en: {
    seoTitle: 'Cases',
    seoDescription:
      "Ecommerce, hospitality and consumer brands: cases from Pinacello, Healthfactor, E-Kart and Nooms.",
    label: 'Cases',
    title: [{ text: 'Selected' }, { text: 'work.', tone: 'accent' as const }],
    body: 'Campaigns, shops and websites. Every project says who made it.',
    ongoing: 'Ongoing project',
    view: 'View the case',
    note: 'pick one :)',
  },
}

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
                  <CasePoster slug={c.slug} name={c.name} caption={caseHeadline(c, lang)} lang={lang} />
                </div>
                <div className="vs-case-card-meta">
                  <div>
                    <h2 className="vs-case-card-name">{c.name}</h2>
                    <p className="vs-case-card-result">{caseHeadline(c, lang)}</p>
                  </div>
                  {c.status === 'ongoing' && <span className="vs-case-card-chip">{t.ongoing}</span>}
                </div>
                <span className="vs-textlink vs-textlink--arrow vs-case-card-link">{t.view}<Arrow size={15} /></span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      <Wordmarks lang={lang} />

      <LyteWork />

    </div>
  )
}
