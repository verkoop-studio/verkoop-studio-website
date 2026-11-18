import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import { menuTabs } from '../../data/nav'
import { useLang } from '../../i18n/LanguageContext'
import { trackEvent } from '../../lib/analytics'
import { Go } from '../brand/Arrow'
import SplitHeadline from '../brand/SplitHeadline'
import { DoodleField, WaveEdge } from '../brand/Playful'
import { EASE, VIEWPORT } from '../brand/motion'

const COPY = {
  nl: { title: [{ text: 'Wat we' }, { text: 'doen', tone: 'accent' as const }] },
  en: { title: [{ text: 'What we' }, { text: 'do', tone: 'accent' as const }] },
}

/** One dotted line drawing per group: a signal going out, a path to the till, a loop that runs itself. */
const ART = [
  <svg key="attract" viewBox="0 0 160 90" aria-hidden="true"><path className="vs-group-dots" d="M18 62h26l30-26v62L44 72H18Z" /><path className="vs-group-dots vs-group-dots--run" d="M92 30c14 10 14 30 0 40M106 18c24 18 24 46 0 64M120 6c34 26 34 62 0 88" /></svg>,
  <svg key="buy" viewBox="0 0 160 90" aria-hidden="true"><path className="vs-group-dots vs-group-dots--run" d="M8 70C40 70 44 24 78 24s40 40 74 40" /><path className="vs-group-dots" d="M112 20h10l8 30h22l6-20h-32M130 62a4 4 0 1 0 0.1 0M148 62a4 4 0 1 0 0.1 0" /></svg>,
  <svg key="smarter" viewBox="0 0 160 90" aria-hidden="true"><path className="vs-group-dots vs-group-dots--run" d="M44 45a26 26 0 1 1 52 0a26 26 0 1 1-52 0" /><path className="vs-group-dots" d="M96 45h40M126 35l10 10-10 10M70 19v-12M70 83v-12" /></svg>,
]

/** What we do, in the three groups of the services menu: a tile per group, its services listed below. */
export default function ServicesList() {
  const { lang } = useLang()
  const t = COPY[lang]
  const reduce = useReducedMotion()
  const groups = menuTabs.find((tab) => tab.id === 'diensten')?.groups ?? []

  return (
    <div className="vs-dark">
      <WaveEdge />
      <DoodleField />
      <section id="expertise" className="vs-section vs-wrap" aria-labelledby="services-title">
        <div className="vs-section-head">
          <SplitHeadline id="services-title" className="vs-h2" parts={t.title} />
        </div>
        <div className="vs-groups">
          {groups.map((group, g) => (
            <motion.div
              key={group.label.en}
              className={`vs-group vs-group--${g}`}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.7, delay: g * 0.08, ease: EASE }}
            >
              <div className="vs-group-tile">
                <span className="vs-group-art">{ART[g]}</span>
                <h3>{group.label[lang]}</h3>
              </div>
              <ul className="vs-group-list">
                {group.links.map((link) => {
                  const slug = link.href.slice(1)
                  return (
                    <li key={link.href}>
                      <Link to={link.href} className="vs-group-link" onClick={() => trackEvent('service_viewed', { service: slug, placement: 'home_list' })}>
                        <span><b>{link.title[lang]}</b><em>{link.note[lang]}</em></span>
                        <Go />
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>
      <WaveEdge flip />
    </div>
  )
}
