import { motion, useReducedMotion } from 'motion/react'
import { Flag, Leaf, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cases } from '../../data/cases'
import { RESULTS, type Figure } from '../../data/workResults'
import { useLang } from '../../i18n/LanguageContext'
import { trackEvent } from '../../lib/analytics'
import Cta from '../brand/Cta'
import RollingNumber from '../brand/RollingNumber'
import SplitHeadline from '../brand/SplitHeadline'
import { EASE, VIEWPORT } from '../brand/motion'

const COPY = {
  nl: {
    title: [{ text: 'Wat onze klanten' }, { text: 'bereikten', tone: 'accent' as const }],
    lead: 'Alleen cijfers die de cases zelf publiceren. Waar nog geen gevalideerd cijfer is, tonen we er geen.',
    all: 'Bekijk alle cases',
    read: 'Lees de case',
  },
  en: {
    title: [{ text: 'What our clients' }, { text: 'achieved', tone: 'accent' as const }],
    lead: 'Only figures the cases publish themselves. Where there is no validated figure yet, we show none.',
    all: 'View all cases',
    read: 'Read the case',
  },
}

/**
 * The three cards. Figures come from workResults.ts, the same ones the case pages state. E-Kart has no
 * validated figure yet, so its card names the two audiences of the work instead of a number.
 */
const CARDS: { slug: string; icon: typeof Flag; line: Record<'nl' | 'en', string>; figures: Figure[] }[] = [
  { slug: 'pinacello', icon: ShoppingBag, line: { nl: 'Online omzet meer dan verdubbeld', en: 'Online revenue more than doubled' }, figures: RESULTS.pinacello },
  { slug: 'nooms', icon: Leaf, line: { nl: 'Pre-sale volledig uitverkocht', en: 'Pre-sale sold out completely' }, figures: RESULTS.nooms },
  {
    slug: 'e-kart',
    icon: Flag,
    line: { nl: 'Van zin in een race naar een boeking', en: 'From the thrill of racing to a booking' },
    figures: [{ text: { nl: 'B2C + B2B', en: 'B2C + B2B' }, label: { nl: 'rijders en bedrijfsgroepen, elk met een eigen route', en: 'drivers and company groups, each with their own route' } }],
  },
]

/** The published results as three tall cards: the client, the outcome in one line, the figures, and the client's site on a stack of paper. */
export default function ResultCards() {
  const { lang } = useLang()
  const t = COPY[lang]
  const reduce = useReducedMotion()
  const rise = (delay: number, y = 26) =>
    reduce ? {} : { initial: { opacity: 0, y }, whileInView: { opacity: 1, y: 0 }, viewport: VIEWPORT, transition: { duration: 0.8, delay, ease: EASE } }

  return (
    <section className="vs-wrap vs-section rc" aria-labelledby="results-title">
      <div className="rc-head">
        <SplitHeadline id="results-title" className="vs-h2" parts={t.title} />
        <motion.p className="rc-lead" {...rise(0.15, 12)}>{t.lead}</motion.p>
        <motion.span className="rc-rule" aria-hidden="true" initial={reduce ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={VIEWPORT} transition={{ duration: 0.9, delay: 0.25, ease: EASE }} />
      </div>
      <ul className="rc-cards">
        {CARDS.map((card, i) => {
          const study = cases.find((item) => item.slug === card.slug)
          if (!study) return null
          const Icon = card.icon
          return (
            <motion.li key={card.slug} {...rise(0.3 + i * 0.12)}>
              <Link to={`/cases/${card.slug}`} className={`rc-card rc-card--${i}`} onClick={() => trackEvent('case_viewed', { case: card.slug, placement: 'home_bento' })}>
                <span className="rc-top">
                  <span className="rc-name"><b>{study.name}</b><span>{card.line[lang]}</span></span>
                  <span className="rc-mark" aria-hidden="true"><Icon size={20} strokeWidth={1.6} /></span>
                </span>
                <span className={`rc-stats${card.figures.length === 1 ? ' rc-stats--one' : ''}`}>
                  {card.figures.map((figure) => (
                    <span className="rc-stat" key={figure.label.en}>
                      <b>{figure.text ? figure.text[lang] : <RollingNumber value={figure.value ?? 0} prefix={figure.prefix} suffix={figure.suffix} />}</b>
                      <span>{figure.label[lang]}</span>
                    </span>
                  ))}
                </span>
                <span className="rc-photo">
                  <i aria-hidden="true" /><i aria-hidden="true" />
                  <img src={study.image} alt="" width={640} height={427} loading="lazy" decoding="async" />
                  <span className="rc-read">{t.read}</span>
                </span>
              </Link>
            </motion.li>
          )
        })}
      </ul>
      <motion.p className="rc-more" {...rise(0.7, 14)}><Cta to="/cases">{t.all}</Cta></motion.p>
    </section>
  )
}
