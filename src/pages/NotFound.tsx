import Seo from '../components/Seo'
import BotAvatar from '../components/brand/BotAvatar'
import Cta from '../components/brand/Cta'
import HandNote from '../components/brand/HandNote'
import TextLink from '../components/brand/TextLink'
import { useLang } from '../i18n/LanguageContext'

const COPY = {
  nl: { title: 'Pagina niet gevonden', description: 'Deze pagina bestaat niet. Ontdek de diensten en cases van Verkoop Studio.', heading: 'Deze pagina bestaat niet.', text: 'Misschien is de link oud. Bekijk onze cases of ga terug naar de homepage.', back: 'Naar de homepage', cases: 'Bekijk de cases', note: 'oeps, kwijt :)' },
  en: { title: 'Page not found', description: 'This page does not exist. Explore the services and cases of Verkoop Studio.', heading: 'This page does not exist.', text: 'The link may be old. See our cases or go back to the homepage.', back: 'Back to the homepage', cases: 'See the cases', note: 'oops, lost :)' },
}

export default function NotFound() {
  const { lang } = useLang()
  const t = COPY[lang]
  return (
    <div className="vs-page">
      <Seo title={t.title} description={t.description} path="/404" noindex />
      <section className="vs-wrap vs-404" aria-labelledby="nf-title">
        <div className="vs-404-mark" aria-hidden="true">
          <span>4</span>
          <BotAvatar shape="verkoop" size={150} live mood="thinking" />
          <span>4</span>
          <HandNote point="up-left" className="vs-404-note">{t.note}</HandNote>
        </div>
        <h1 id="nf-title" className="vs-h2">{t.heading}</h1>
        <p className="vs-lead">{t.text}</p>
        <div className="vs-404-actions">
          <Cta to="/">{t.back}</Cta>
          <TextLink to="/cases">{t.cases}</TextLink>
        </div>
      </section>
    </div>
  )
}
