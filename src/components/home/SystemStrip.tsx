import { useLang } from '../../i18n/LanguageContext'
import Reveal from '../brand/Reveal'
import { trackSpotlight } from '../brand/spotlight'

const COPY = {
  nl: {
    label: 'Eén systeem, van klik tot klant',
    built: 'Zelf gebouwd',
    steps: [
      { n: '01 · Aantrekken', title: 'Meta & Google Ads', copy: 'Campagnes die mensen in een commerciële route sturen, niet alleen bereik.' },
      { n: '02 · Converteren', title: 'Pagina’s & Sales CRM', copy: 'Landingspagina’s met één volgende stap, leads meteen in het CRM.' },
      { n: '03 · Meten', title: 'Performance-dashboard', copy: 'Elke verkoop terug te leiden naar de advertentie waar het begon.' },
    ],
  },
  en: {
    label: 'One system, from click to customer',
    built: 'Built in-house',
    steps: [
      { n: '01 · Attract', title: 'Meta & Google Ads', copy: 'Campaigns that send people into a commercial route, not just reach.' },
      { n: '02 · Convert', title: 'Pages & Sales CRM', copy: 'Landing pages with one next step, leads straight into the CRM.' },
      { n: '03 · Measure', title: 'Performance dashboard', copy: 'Every sale traced back to the ad that started it.' },
    ],
  },
}

export default function SystemStrip() {
  const { lang } = useLang()
  const t = COPY[lang]
  return (
    <section className="vs-wrap" aria-label={t.label} style={{ paddingBottom: 'clamp(24px, 4vw, 48px)' }}>
      <Reveal>
        <div className="vs-system vs-spot" onPointerMove={trackSpotlight}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <span className="vs-label">{t.label}</span>
          <span className="vs-label">{t.built}</span>
        </div>
        <div className="vs-system-grid">
          {t.steps.map((step) => (
            <div key={step.n} className="vs-system-step">
              <span className="vs-label">{step.n}</span>
              <span className="vs-system-title">{step.title}</span>
              <span className="vs-system-copy">{step.copy}</span>
            </div>
          ))}
        </div>
        <div className="vs-signal" aria-hidden="true"><span /><span /><span /></div>
        </div>
      </Reveal>
    </section>
  )
}
