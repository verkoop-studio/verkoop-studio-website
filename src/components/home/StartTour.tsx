import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { useRef, useState, type CSSProperties } from 'react'
import { processSteps } from '../../data/process'
import { useLang } from '../../i18n/LanguageContext'
import { trackEvent } from '../../lib/analytics'
import { useWide } from '../../lib/useWide'
import Cta from '../brand/Cta'
import Reveal from '../brand/Reveal'
import { SCREENS } from './TourScreens'

const UI = {
  nl: { title: 'Zo starten we.', cta: 'Plan een gesprek' },
  en: { title: 'How we start.', cta: 'Plan a call' },
}

/** Each step's screen arrives its own way. */
const ENTRIES = [
  { initial: { opacity: 0, x: 60 }, animate: { opacity: 1, x: 0 } },
  { initial: { opacity: 0, scale: 0.88 }, animate: { opacity: 1, scale: 1 } },
  { initial: { opacity: 0, y: 40, rotate: -5 }, animate: { opacity: 1, y: 0, rotate: 0 } },
  { initial: { opacity: 0, y: 70 }, animate: { opacity: 1, y: 0 } },
  { initial: { opacity: 0, filter: 'blur(12px)' }, animate: { opacity: 1, filter: 'blur(0px)' } },
]

/**
 * How a collaboration starts, as a tour: on wide screens the section pins and the five steps
 * from process.ts play one by one, each with its own sample screen; the tabs fill as you scroll
 * and jump on click. Phones and reduced motion get the steps stacked.
 */
export default function StartTour() {
  const { lang } = useLang()
  const t = UI[lang]
  const reduce = useReducedMotion()
  const wide = useWide()
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const count = processSteps.length
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    ref.current?.style.setProperty('--p', p.toFixed(4))
    setActive(Math.min(count - 1, Math.max(0, Math.floor(p * count * 0.999))))
  })
  const cta = <Cta to="/contact" onClick={() => trackEvent('audit_cta_clicked', { placement: 'home_start' })}>{t.cta}</Cta>

  if (reduce || !wide) {
    return (
      <section className="vs-wrap vs-section st-tour st-tour--stacked" aria-labelledby="start-title">
        <Reveal as="h2" className="vs-h2" id="start-title">{t.title}</Reveal>
        <ol className="st-stack">
          {processSteps.map((step, i) => {
            const Screen = SCREENS[i]
            return (
              <li key={step.number}>
                <p className="st-num">{step.number}</p>
                <h3 className="st-step-title">{step.title[lang]}</h3>
                <p className="st-step-body">{step.description[lang]}</p>
                <Screen lang={lang} on />
              </li>
            )
          })}
        </ol>
        <div className="st-cta">{cta}</div>
      </section>
    )
  }

  const jump = (i: number) => {
    const el = ref.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const run = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + ((i + 0.08) / count) * run, behavior: 'smooth' })
  }
  const step = processSteps[active]
  const Screen = SCREENS[active]

  return (
    <section ref={ref} className="st-tour st-tour--pinned" aria-labelledby="start-title" style={{ '--steps': count } as CSSProperties}>
      <div className="st-sticky">
        <div className="vs-wrap st-inner">
          <div className="st-head">
            <h2 className="vs-h2" id="start-title">{t.title}</h2>
            <div className="st-tabs" role="tablist" aria-label={t.title}>
              {processSteps.map((s, i) => (
                <button key={s.number} type="button" role="tab" aria-selected={active === i} className={`st-tab${active === i ? ' is-on' : ''}`} style={{ '--i': i } as CSSProperties} onClick={() => jump(i)}>
                  <span>{s.number}</span>{s.title[lang]}
                  <i className="st-tab-line" aria-hidden="true"><b /></i>
                </button>
              ))}
            </div>
          </div>
          <div className="st-body">
            <div className="st-copy" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={step.number} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
                  <p className="st-num">{step.number}</p>
                  <h3 className="st-step-title">{step.title[lang]}</h3>
                  <p className="st-step-body">{step.description[lang]}</p>
                </motion.div>
              </AnimatePresence>
              <div className="st-cta">{cta}</div>
            </div>
            <div className="st-stage">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={active} className="st-screen" {...ENTRIES[active]} exit={{ opacity: 0, transition: { duration: 0.2 } }} transition={{ type: 'spring', stiffness: 120, damping: 18 }}>
                  <Screen lang={lang} on />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
