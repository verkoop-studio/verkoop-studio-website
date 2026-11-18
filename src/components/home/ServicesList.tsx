import { ArrowRight } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import { services } from '../../data/services'
import type { ServiceSlug } from '../../data/types'
import { useLang } from '../../i18n/LanguageContext'
import { trackEvent } from '../../lib/analytics'
import SplitHeadline from '../brand/SplitHeadline'
import { DoodleField, WaveEdge } from '../brand/Playful'
import { EASE, VIEWPORT } from '../brand/motion'

const ORDER: ServiceSlug[] = ['meta-ads', 'google-ads', 'landing-pages', 'funnels', 'websites', 'email-marketing', 'data-analytics', 'ai-automatiseringen']

const COPY = {
  nl: { title: [{ text: 'Wat we' }, { text: 'doen', tone: 'accent' as const }] },
  en: { title: [{ text: 'What we' }, { text: 'do', tone: 'accent' as const }] },
}

export default function ServicesList() {
  const { lang } = useLang()
  const t = COPY[lang]
  const reduce = useReducedMotion()
  const list = ORDER.map((slug) => services.find((s) => s.slug === slug)).filter((s) => s !== undefined)

  return (
    <div className="vs-dark">
    <WaveEdge />
    <DoodleField />
    <section id="expertise" className="vs-section vs-wrap" aria-labelledby="services-title">
      <div className="vs-section-head">
        <SplitHeadline id="services-title" className="vs-h2" parts={t.title} />
      </div>
      <div className="vs-services">
        {list.map((service, i) => (
          <motion.div
            key={service.slug}
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.7, delay: i * 0.05, ease: EASE }}
          >
            <Link to={`/${service.slug}`} className="vs-service" onClick={() => trackEvent('service_viewed', { service: service.slug, placement: 'home_list' })}>
              <span className="vs-label">{String(i + 1).padStart(2, '0')}</span>
              <span className="vs-service-title">{service.title[lang]}</span>
              <span className="vs-service-copy">{service.summary[lang]}</span>
              <ArrowRight className="vs-service-arrow" size={22} aria-hidden="true" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
    <WaveEdge flip />
    </div>
  )
}
