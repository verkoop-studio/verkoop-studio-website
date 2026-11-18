import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import { cases } from '../../data/cases'
import { useLang } from '../../i18n/LanguageContext'
import { trackEvent } from '../../lib/analytics'
import HeroVideo from '../HeroVideo'
import HeroRequestForm from '../HeroRequestForm'
import Cta from '../brand/Cta'
import HandNote from '../brand/HandNote'
import SplitHeadline, { type HeadlinePart } from '../brand/SplitHeadline'
import { EASE } from '../brand/motion'

const COPY = {
  nl: {
    eyebrow: 'Marketingbureau · Lochristi',
    headline: [
      { text: 'Wij helpen kmo’s' },
      { text: 'groeien', tone: 'accent' },
      { text: 'met advertenties, overtuigende websites en automatische opvolging', tone: 'mute', breakBefore: true },
    ] satisfies HeadlinePart[],
    primary: 'Bekijk ons werk',
    secondary: 'Onze pakketten',
    note: 'Maandelijkse pakketten vanaf €1.500',
    formNote: 'helemaal gratis :)',
    proof: 'Groei gebouwd voor',
    proofAll: 'Alle cases',
  },
  en: {
    eyebrow: 'Performance marketing studio · Lochristi, Belgium',
    headline: [
      { text: 'We help small businesses' },
      { text: 'grow', tone: 'accent' },
      { text: 'with ads, persuasive websites and automated follow-up', tone: 'mute', breakBefore: true },
    ] satisfies HeadlinePart[],
    primary: 'See the work',
    secondary: 'Our plans',
    note: 'Monthly plans from €1,500',
    formNote: 'completely free :)',
    proof: 'Growth built for',
    proofAll: 'All cases',
  },
}

export default function HomeHero() {
  const { lang } = useLang()
  const t = COPY[lang]
  const reduce = useReducedMotion()
  const arrive = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 18, filter: 'blur(10px)' }, animate: { opacity: 1, y: 0, filter: 'blur(0px)' }, transition: { duration: 0.9, delay, ease: EASE } }

  return (
    <section className="studio-hero vs-hero" aria-labelledby="hero-title">
      <div className="vs-wrap">
        <motion.span className="vs-label" {...arrive(0)}>{t.eyebrow}</motion.span>
        <SplitHeadline as="h1" id="hero-title" className="vs-h1" parts={t.headline} onMount />
        <motion.div className="vs-hero-actions" {...arrive(0.7)}>
          <Cta to="/#resultaten" onClick={() => trackEvent('audit_cta_clicked', { placement: 'hero_work' })}>{t.primary}</Cta>
          <Cta to="/#groeipakketten" variant="line">{t.secondary}</Cta>
          <span className="vs-hero-note">{t.note}</span>
        </motion.div>
        <motion.div className="vs-hero-media" {...arrive(0.9)}>
          <div className="vs-hero-video">
            <HeroVideo lang={lang} videoId="VPaGW0vW-X0" title="Verkoop Studio — VSL website" autoPlay />
          </div>
          <div className="vs-hero-form">
            <HandNote point="down-left" className="vs-hero-form-note">{t.formNote}</HandNote>
            <HeroRequestForm kind="plan" />
          </div>
        </motion.div>
        <motion.div className="vs-proof" {...arrive(1.05)}>
          <span className="vs-label">{t.proof}</span>
          <ul>
            {cases.filter((item) => !item.unavailable).map((item) => (
              <li key={item.slug}><Link to={`/cases/${item.slug}`} className="vs-pill">{item.name}</Link></li>
            ))}
            <li><Link to="/cases" className="vs-pill vs-pill--accent">{t.proofAll}</Link></li>
          </ul>
        </motion.div>
      </div>
    </section>
  )
}
