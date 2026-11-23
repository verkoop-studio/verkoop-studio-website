import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { ChevronRight, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLang } from '../../i18n/LanguageContext'
import { trackEvent } from '../../lib/analytics'
import { caseHeadline, cases } from '../../data/cases'
import HeroRequestForm from '../HeroRequestForm'
import Cta from '../brand/Cta'
import HandNote from '../brand/HandNote'
import RollingNumber from '../brand/RollingNumber'
import SplitHeadline, { type HeadlinePart } from '../brand/SplitHeadline'
import { EASE } from '../brand/motion'


const COPY = {
  nl: {
    headline: [
      { text: 'Wij helpen kmo’s' },
      { text: 'groeien', tone: 'accent' },
      { text: 'met advertenties, overtuigende websites en automatische opvolging', tone: 'mute', className: 'vs-h1-sub' },
    ] satisfies HeadlinePart[],
    primary: 'Plan een gesprek',
    watch: 'Bekijk de video',
    playLabel: 'Speel video af',
    close: 'Sluit video',
    work: 'Cases',
    proofTitle: 'Pinacello · online omzet',
    proofChip: 'Echte cijfers',
    proofRevenue: 'groei in online omzet',
    proofVideoLead: '20 verkopen',
    proofVideoRest: 'uit één organische video',
    proofLink: 'Lees de case',
    formNote: 'helemaal gratis :)',
    videoHeading: 'Zo helpen we kmo’s groeien',
    videoNote: 'kijk even mee :)',
  },
  en: {
    headline: [
      { text: 'We help small businesses' },
      { text: 'grow', tone: 'accent' },
      { text: 'with ads, persuasive websites and automated follow-up', tone: 'mute', className: 'vs-h1-sub' },
    ] satisfies HeadlinePart[],
    primary: 'Plan a call',
    watch: 'Watch the video',
    playLabel: 'Play video',
    close: 'Close video',
    work: 'Cases',
    proofTitle: 'Pinacello · online revenue',
    proofChip: 'Real figures',
    proofRevenue: 'growth in online revenue',
    proofVideoLead: '20 sales',
    proofVideoRest: 'from one organic video',
    proofLink: 'Read the case',
    formNote: 'completely free :)',
    videoHeading: 'How we help small businesses grow',
    videoNote: 'watch along :)',
  },
}

const VIDEO = 'VPaGW0vW-X0'

/**
 * The first screen is one frame: the still of Stef's video, graded dark, with the headline, the two
 * actions and the published Pinacello figures on it, and the cases along the bottom edge. Nothing
 * from YouTube loads until play is pressed; then the player opens inside the same frame.
 */
export default function HomeHero() {
  const { lang } = useLang()
  const t = COPY[lang]
  const reduce = useReducedMotion()
  const [playing, setPlaying] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const sink = useTransform(scrollYProgress, [0, 1], ['0%', '9%'])
  const lift = useTransform(scrollYProgress, [0, 1], [0, -40])
  // Depth: the picture and the cards drift a few pixels apart as the mouse crosses the frame.
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 60, damping: 18 })
  const sy = useSpring(py, { stiffness: 60, damping: 18 })
  const farX = useTransform(sx, (v) => v * -14)
  const farY = useTransform(sy, (v) => v * -10)
  const nearX = useTransform(sx, (v) => v * 18)
  const nearY = useTransform(sy, (v) => v * 14)
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduce || event.pointerType !== 'mouse') return
    const box = event.currentTarget.getBoundingClientRect()
    px.set((event.clientX - box.left) / box.width - 0.5)
    py.set((event.clientY - box.top) / box.height - 0.5)
  }
  const onPointerLeave = () => { px.set(0); py.set(0) }
  /* The two actions arrive after the headline: the first opens from its left edge, the second springs in with its disc a beat later. */
  const wipe = reduce ? {} : { initial: { opacity: 0, clipPath: 'inset(-30% 105% -30% -5% round 99px)' }, animate: { opacity: 1, clipPath: 'inset(-30% -5% -30% -5% round 99px)' }, transition: { duration: 0.85, delay: 0.75, ease: EASE } }
  const spring = (delay: number, from: Record<string, number>, stiffness = 180, damping = 17) =>
    reduce ? {} : { initial: { opacity: 0, ...from }, animate: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }, transition: { type: 'spring' as const, stiffness, damping, delay } }

  useEffect(() => {
    if (!playing) return
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setPlaying(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [playing])

  return (
    <>
      <section ref={ref} className="studio-hero vs-hero hc" aria-labelledby="hero-title">
        <motion.div
          className="hc-frame"
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          initial={reduce ? false : { clipPath: 'inset(7% 9% 7% 9% round 44px)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0% round 28px)' }}
          transition={{ duration: 1.3, ease: EASE }}
        >
          <motion.div className="hc-media" aria-hidden="true" style={reduce ? undefined : { y: sink, x: farX }}>
            <motion.div className="hc-zoom" style={reduce ? undefined : { y: farY }} initial={reduce ? false : { scale: 1.16 }} animate={{ scale: 1 }} transition={{ duration: 1.9, ease: EASE }}>
              <img src={`https://i.ytimg.com/vi/${VIDEO}/maxres3.jpg`} alt="" width="1280" height="720" decoding="async" fetchPriority="high" />
            </motion.div>
          </motion.div>
          <span className="hc-shade" aria-hidden="true" />

          <motion.div className="hc-copy" style={reduce ? undefined : { y: lift }}>
            <SplitHeadline as="h1" id="hero-title" className="vs-h1 hc-h1" parts={t.headline} onMount />
            <div className="hc-actions">
              <motion.span className="hc-act" {...wipe}>
                <Cta variant="paper" to="/contact" onClick={() => trackEvent('audit_cta_clicked', { placement: 'hero' })}>{t.primary}</Cta>
              </motion.span>
              <motion.button type="button" className="hero-video-play hc-play" aria-label={`${t.playLabel}: ${t.videoHeading}`} onClick={() => setPlaying(true)} {...spring(0.95, { x: -22, scale: 0.86 })}>
                <motion.span className="hc-play-disc" aria-hidden="true" {...spring(1.08, { scale: 0, rotate: -90 }, 320, 16)}>
                  <span className="hc-play-ring" />
                  <svg width="15" height="15" viewBox="0 0 14 14"><path d="M4.2 2.4v9.2L11.8 7Z" fill="currentColor" /></svg>
                </motion.span>
                <motion.span className="hc-play-text" {...spring(1.2, { x: -10 }, 200, 22)}><b>{t.watch}</b><small>Stef · 1:14</small></motion.span>
              </motion.button>
              <HandNote point="down-left" className="hc-hand">{t.videoNote}</HandNote>
            </div>
          </motion.div>

          <motion.div className="hc-proof" style={reduce ? undefined : { x: nearX, y: nearY }}>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 46, rotate: 7 }}
              animate={{ opacity: 1, y: 0, rotate: 2 }}
              transition={{ type: 'spring', stiffness: 90, damping: 15, delay: 0.75 }}
            >
              <Link to="/cases/pinacello" className="tx-win vs-proof-win hc-win">
                <span className="tx-win-bar"><i /><i /><i /><b>{t.proofTitle}</b><em>{t.proofChip}</em></span>
                <span className="vs-proof-body">
                  <span className="vs-proof-figure"><RollingNumber value={120} prefix="+" suffix="%" /></span>
                  <span className="vs-proof-caption">{t.proofRevenue}</span>
                  <span className="vs-proof-bars" aria-hidden="true">
                    {[28, 34, 31, 42, 48, 57, 63, 72].map((h, i) => <i key={i} style={{ height: `${h}%`, animationDelay: `${1.1 + i * 0.06}s` }} />)}
                  </span>
                  <span className="hc-more">{t.proofLink}<ChevronRight size={15} aria-hidden="true" /></span>
                </span>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div className="hc-ping" style={reduce ? undefined : { x: nearX, y: nearY }}>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 30, rotate: -9 }}
              animate={{ opacity: 1, y: 0, rotate: -3 }}
              transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 1.25 }}
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

          <motion.nav className="hc-strip" aria-label="Cases" initial={reduce ? false : { y: '100%' }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.85, ease: EASE }}>
            <span className="hc-strip-label">{t.work}</span>
            <ul>
              {cases.map((item, i) => (
                <motion.li key={item.slug} {...spring(1.2 + i * 0.08, { y: 18 }, 200, 22)}>
                  <Link to={`/cases/${item.slug}`}>
                    <b>{item.name}</b>
                    <span>{caseHeadline(item, lang)}</span>
                    <ChevronRight size={16} aria-hidden="true" />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>

          <AnimatePresence>
            {playing && (
              <motion.div key="player" className="hc-player" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${VIDEO}?autoplay=1&rel=0&playsinline=1&modestbranding=1&controls=1`}
                  title={t.videoHeading}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
                <button type="button" className="hc-close" onClick={() => setPlaying(false)} autoFocus><X size={17} aria-hidden="true" />{t.close}</button>
              </motion.div>
            )}
          </AnimatePresence>
          <noscript><a href={`https://www.youtube.com/watch?v=${VIDEO}`}>{t.videoHeading}</a></noscript>
        </motion.div>
      </section>

      <section id="groeiplan" className="vs-wrap vs-plan-form" aria-label={lang === 'nl' ? 'Gratis groeiplan' : 'Free growth plan'}>
        <div className="vs-hero-form">
          <HandNote point="down-left" className="vs-hero-form-note">{t.formNote}</HandNote>
          <HeroRequestForm kind="plan" />
        </div>
      </section>
    </>
  )
}
