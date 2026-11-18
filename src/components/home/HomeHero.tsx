import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { caseHeadline, cases } from '../../data/cases'
import { useLang } from '../../i18n/LanguageContext'
import { trackEvent } from '../../lib/analytics'
import HeroVideo from '../HeroVideo'
import HeroRequestForm from '../HeroRequestForm'
import Cta from '../brand/Cta'
import HandNote from '../brand/HandNote'
import Watcher from '../brand/Watcher'
import RollingNumber from '../brand/RollingNumber'
import TextLink from '../brand/TextLink'
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
    primary: 'Plan een gesprek',
    secondary: 'Bekijk onze pakketten',
    proofTitle: 'Pinacello · online omzet',
    proofChip: 'Echte cijfers',
    proofRevenue: 'groei in online omzet',
    proofVideoLead: '20 verkopen',
    proofVideoRest: 'uit één organische video',
    proofLink: 'Lees de case',
    proofNote: 'echte cijfers :)',
    note: 'Maandelijkse pakketten vanaf €1.500',
    formNote: 'helemaal gratis :)',
    proof: 'Groei gebouwd voor',
    proofAll: 'Alle cases',
    scroll: 'Scroll',
    videoHeading: 'Zo helpen we kmo’s groeien',
    videoNote: 'kijk even mee :)',
  },
  en: {
    eyebrow: 'Performance marketing studio · Lochristi, Belgium',
    headline: [
      { text: 'We help small businesses' },
      { text: 'grow', tone: 'accent' },
      { text: 'with ads, persuasive websites and automated follow-up', tone: 'mute', className: 'vs-h1-sub' },
    ] satisfies HeadlinePart[],
    primary: 'Plan a call',
    secondary: 'See our plans',
    proofTitle: 'Pinacello · online revenue',
    proofChip: 'Real figures',
    proofRevenue: 'growth in online revenue',
    proofVideoLead: '20 sales',
    proofVideoRest: 'from one organic video',
    proofLink: 'Read the case',
    proofNote: 'real figures :)',
    note: 'Monthly plans from €1,500',
    formNote: 'completely free :)',
    proof: 'Growth built for',
    proofAll: 'All cases',
    scroll: 'Scroll',
    videoHeading: 'How we help small businesses grow',
    videoNote: 'watch along :)',
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
            <HeroVideo lang={lang} videoId="VPaGW0vW-X0" title="Verkoop Studio — VSL website" heading={COPY[lang].videoHeading} duration="1:14" frame="maxres3" playY="70%" story note={COPY[lang].videoNote} />
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
        <div className="vs-wrap vs-hero-inner vs-hero-split">
          <div className="vs-hero-copy">
          <motion.span className="vs-label" {...arrive(0)}>{t.eyebrow}</motion.span>
          <SplitHeadline as="h1" id="hero-title" className="vs-h1" parts={t.headline} onMount />
          <motion.div className="vs-hero-actions" {...arrive(0.7)}>
            <Cta to="/contact" onClick={() => trackEvent('audit_cta_clicked', { placement: 'hero' })}>{t.primary}</Cta>
            <TextLink to="/#groeipakketten">{t.secondary}</TextLink>
            <span className="vs-hero-note">{t.note}</span>
          </motion.div>
          <motion.div className="vs-proof" {...arrive(0.95)}>
            <span className="vs-label">{t.proof}</span>
            <ul className="vs-marks">
              {cases.filter((item) => !item.unavailable).map((item) => (
                <li key={item.slug}>
                  <Link to={`/cases/${item.slug}`} className="vs-mark-link">
                    <strong>{item.name}</strong>
                    <span>{caseHeadline(item, lang)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          </div>
          <motion.div
            className="vs-hero-proof"
            initial={reduce ? false : { opacity: 0, x: 60, rotate: 4 }}
            animate={{ opacity: 1, x: 0, rotate: 1.5 }}
            transition={{ type: 'spring', stiffness: 90, damping: 16, delay: 0.6 }}
          >
            <HandNote point="down-left" className="vs-hero-proof-note">{t.proofNote}</HandNote>
            <span className="vs-hero-watcher"><Watcher shape="Ball" size={64} within=".vs-hero" /></span>
            <div className="tx-win vs-proof-win">
              <div className="tx-win-bar"><i /><i /><i /><b>{t.proofTitle}</b><em>{t.proofChip}</em></div>
              <div className="vs-proof-body">
                <div className="vs-proof-figure"><RollingNumber value={120} prefix="+" suffix="%" /></div>
                <p className="vs-proof-caption">{t.proofRevenue}</p>
                <div className="vs-proof-bars" aria-hidden="true">
                  {[28, 34, 31, 42, 48, 57, 63, 72].map((h, i) => <i key={i} style={{ height: `${h}%`, animationDelay: `${0.9 + i * 0.07}s` }} />)}
                </div>
                <TextLink to="/cases/pinacello">{t.proofLink}</TextLink>
              </div>
            </div>
            <motion.div
              className="vs-proof-video"
              initial={reduce ? false : { opacity: 0, y: 24, rotate: -8 }}
              animate={{ opacity: 1, y: 0, rotate: -3.5 }}
              transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 1.1 }}
            >
              <Link to="/cases/pinacello" className="vs-proof-video-link">
                <span className="vs-proof-thumb">
                  <img src="/images/ads/pinacello-personal.jpg" alt="" width={120} height={150} loading="eager" decoding="async" />
                  <span className="vs-proof-play" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14"><path d="M4 2.5v9l7.5-4.5Z" fill="currentColor" /></svg></span>
                </span>
                <span className="vs-proof-video-text">
                  <strong>{t.proofVideoLead}</strong>
                  <span>{t.proofVideoRest}</span>
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        <motion.span className="vs-scroll-cue" aria-hidden="true" {...arrive(1.2)}>
          <span />{t.scroll}
        </motion.span>
      </section>

      <VideoStage lang={lang} />

      <section id="groeiplan" className="vs-wrap vs-plan-form" aria-label={lang === 'nl' ? 'Gratis groeiplan' : 'Free growth plan'}>
        <div className="vs-hero-form">
          <HandNote point="down-left" className="vs-hero-form-note">{t.formNote}</HandNote>
          <HeroRequestForm kind="plan" />
        </div>
      </section>
    </>
  )
}
