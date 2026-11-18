import { Link } from 'react-router-dom'
import { useLang } from '../../i18n/LanguageContext'
import Reveal from '../brand/Reveal'
import RollingNumber from '../brand/RollingNumber'

const COPY = {
  nl: { body: 'Groei in online omzet bij Pinacello. Campagnes, landingspagina’s en conversie verbonden tot één e-commerce verkoopmotor.', link: 'Lees de case' },
  en: { body: 'Growth in online revenue at Pinacello. Campaigns, landing pages and conversion connected into one ecommerce sales engine.', link: 'Read the case' },
}

export default function ResultBand() {
  const { lang } = useLang()
  const t = COPY[lang]
  return (
    <section className="vs-wrap" aria-label="Pinacello" style={{ paddingBottom: 'clamp(72px, 10vw, 128px)' }}>
      <div className="vs-result">
        <div className="vs-result-figure">
          <RollingNumber value={120} prefix="+" suffix="%" />
        </div>
        <Reveal>
          <p className="vs-lead">{t.body}</p>
          <p style={{ margin: '18px 0 0' }}><Link to="/cases/pinacello" className="vs-textlink">{t.link} →</Link></p>
        </Reveal>
      </div>
    </section>
  )
}
