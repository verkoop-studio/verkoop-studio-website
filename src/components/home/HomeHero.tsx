import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
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
      { text: 'met advertenties, overtuigende websites en automatische opvolging', tone: 'mute', className: 'vs-h1-sub' },
    ] satisfies HeadlinePart[],
    primary: 'Bekijk ons werk',
    secondary: 'Onze pakketten',
    note: 'Maandelijkse pakketten vanaf €1.500',
    formNote: 'helemaal gratis :)',
    proof: 'Groei gebouwd voor',
    proofAll: 'Alle cases',
    scroll: 'Scroll',
  },
  en: {
    eyebrow: 'Performance marketing studio · Lochristi, Belgium',
    headline: [
      { text: 'We help small businesses' },
      { text: 'grow', tone: 'accent' },
      { text: 'with ads, persuasive websites and automated follow-up', tone: 'mute', className: 'vs-h1-sub' },
    ] satisfies HeadlinePart[],
    primary: 'See the work',
    secondary: 'Our plans',
    note: 'Monthly plans from €1,500',
    formNote: 'completely free :)',
    proof: 'Growth built for',
    proofAll: 'All cases',
    scroll: 'Scroll',
  },
}

/** The video starts as a small inset window and opens to the full frame as the visitor scrolls. */
function VideoStage({ lang }: { lang: 'nl' | 'en' }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const inset = useTransform(scrollYProgress, [0.15, 0.85], [18, 0])
  const radius = useTransform(scrollYProgress, [0.15, 0.85], [32, 22])
  const clipPath = useTransform([inset, radius], ([i, r]: number[]) => `inset(${i}% ${i * 1.4}% ${i}% ${i * 1.4}% round ${r}px)`)
  const scale = useTransform(scrollYProgress, [0.15, 0.85], [1.12, 1])

  return (
    <div ref={ref} className="vs-video-stage">
      <div className="vs-video-sticky">
        <motion.div className="vs-video-frame" style={reduce ? undefined : { clipPath }}>
          <motion.div className="vs-video-zoom" style={reduce ? undefined : { scale }}>
            <HeroVideo lang={lang} videoId="VPaGW0vW-X0" title="Verkoop Studio — VSL website" autoPlay />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default function HomeHero() {
  const { lang } = useLang()
  const t = COPY[lang]
  const reduce = useReducedMotion()
  const arrive = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 18, filter: 'blur(10px)' }, animate: { opacity: 1, y: 0, filter: 'blur(0px)' }, transition: { duration: 0.9, delay, ease: EASE } }

  return (
    <>
      <section className="studio-hero vs-hero" aria-labelledby="hero-title">
        <motion.span
          className="vs-hero-line"
          aria-hidden="true"
          initial={reduce ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, ease: EASE }}
        />
        <div className="vs-wrap vs-hero-inner">
          <motion.span className="vs-label" {...arrive(0)}>{t.eyebrow}</motion.span>
          <SplitHeadline as="h1" id="hero-title" className="vs-h1" parts={t.headline} onMount />
          <motion.div className="vs-hero-actions" {...arrive(0.7)}>
            <Cta to="/#resultaten" onClick={() => trackEvent('audit_cta_clicked', { placement: 'hero_work' })}>{t.primary}</Cta>
            <Cta to="/#groeipakketten" variant="line">{t.secondary}</Cta>
            <span className="vs-hero-note">{t.note}</span>
          </motion.div>
          <motion.div className="vs-proof" {...arrive(0.95)}>
            <span className="vs-label">{t.proof}</span>
            <ul>
              {cases.filter((item) => !item.unavailable).map((item) => (
                <li key={item.slug}><Link to={`/cases/${item.slug}`} className="vs-pill">{item.name}</Link></li>
              ))}
              <li><Link to="/cases" className="vs-pill vs-pill--accent">{t.proofAll}</Link></li>
            </ul>
          </motion.div>
        </div>
        <motion.span className="vs-scroll-cue" aria-hidden="true" {...arrive(1.2)}>
          <span />{t.scroll}
        </motion.span>
      </section>

      <VideoStage lang={lang} />

      <section className="vs-wrap vs-plan-form" aria-label={lang === 'nl' ? 'Gratis groeiplan' : 'Free growth plan'}>
        <div className="vs-hero-form">
          <HandNote point="down-left" className="vs-hero-form-note">{t.formNote}</HandNote>
          <HeroRequestForm kind="plan" />
        </div>
      </section>
    </>
  )
}
