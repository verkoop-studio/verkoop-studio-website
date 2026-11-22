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

/**
 * One stroke of a drawing, as a row of dots. `gaps` is the number of spaces between the dots, so a dot
 * lands on both ends of every stroke and the corners close.
 */
const dots = (d: string, gaps: number, run = false) => (
  <path key={d} className={`vs-group-dots${run ? ' vs-group-dots--run' : ''}`} d={d} pathLength={gaps * 8 + 0.02} />
)

/** One dotted drawing per group: a megaphone calling out, a path into a shopping cart, a loop that hands on by itself. */
const ART = [
  <svg key="attract" viewBox="0 0 160 90" aria-hidden="true">
    {[['M14 38H40', 3], ['M40 38L72 14', 5], ['M72 14V76', 8], ['M72 76L40 52', 5], ['M40 52H14', 3], ['M14 52V38', 2]].map(([d, n]) => dots(d as string, n as number))}
    {[['M94.9 31.6A20 20 0 0 1 94.9 58.4', 4], ['M108.2 19.6A38 38 0 0 1 108.2 70.4', 7], ['M121.6 7.5A56 56 0 0 1 121.6 82.5', 10]].map(([d, n]) => dots(d as string, n as number, true))}
  </svg>,
  <svg key="buy" viewBox="0 0 160 90" aria-hidden="true">
    {dots('M8 76C42 76 40 24 98 24', 15, true)}
    {[['M98 24H108', 1], ['M108 24L116 56', 4], ['M116 56H146', 4], ['M146 56L152 34', 3], ['M152 34H110.5', 5]].map(([d, n]) => dots(d as string, n as number))}
    <circle className="vs-group-wheel" cx="122" cy="69" r="3.8" />
    <circle className="vs-group-wheel" cx="141" cy="69" r="3.8" />
  </svg>,
  <svg key="smarter" viewBox="0 0 160 90" aria-hidden="true">
    {dots('M84 45A28 28 0 1 1 28 45A28 28 0 1 1 84 45', 22, true)}
    {[['M84 45H140', 7], ['M128 33L140 45', 2], ['M128 57L140 45', 2]].map(([d, n]) => dots(d as string, n as number))}
  </svg>,
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
