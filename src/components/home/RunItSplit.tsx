import { Link } from 'react-router-dom'
import { crmLanding } from '../../data/crmLanding'
import { useLang } from '../../i18n/LanguageContext'
import { trackCrmSignupClick, trackEvent } from '../../lib/analytics'
import Arrow from '../brand/Arrow'

const COPY = {
  nl: { title: 'Zelf doen of wij doen het?', self: crmLanding.cta.nl, selfFact: 'gratis tot 500 leads', done: 'Laat ons je groei draaien', doneFact: 'vanaf €1.500 per maand' },
  en: { title: 'Run it yourself, or we do?', self: crmLanding.cta.en, selfFact: 'free up to 500 leads', done: 'Let us run your growth', doneFact: 'from €1,500 a month' },
}

/** The two ways to work with Verkoop Studio, as one line: the free software above, or the monthly plans. */
export default function RunItSplit() {
  const { lang } = useLang()
  const t = COPY[lang]
  return (
    <section className="vs-wrap vs-split-line" aria-label={t.title}>
      <p className="vs-split-line-title">{t.title}</p>
      <Link to="/crm" className="vs-split-line-link" onClick={() => trackCrmSignupClick('home_split')}>
        <b>{t.self}</b><span>{t.selfFact}</span><Arrow size={15} />
      </Link>
      <Link to="/prijzen" className="vs-split-line-link" onClick={() => trackEvent('audit_cta_clicked', { placement: 'home_split' })}>
        <b>{t.done}</b><span>{t.doneFact}</span><Arrow size={15} />
      </Link>
    </section>
  )
}
