import { useLang } from '../../i18n/LanguageContext'
import { trackEvent } from '../../lib/analytics'
import Cta from '../brand/Cta'
import Reveal from '../brand/Reveal'
import SplitHeadline from '../brand/SplitHeadline'

const COPY = {
  nl: { title: [{ text: 'Laten we' }, { text: 'groeien.', tone: 'accent' as const }], primary: 'Bespreek je project', whatsapp: 'WhatsApp' },
  en: { title: [{ text: 'Let’s' }, { text: 'grow.', tone: 'accent' as const }], primary: 'Discuss your project', whatsapp: 'WhatsApp' },
}

export default function ClosingCta() {
  const { lang } = useLang()
  const t = COPY[lang]
  return (
    <section className="vs-wrap" aria-labelledby="closing-title" style={{ paddingBottom: 'clamp(64px, 9vw, 112px)' }}>
      <div className="vs-closing">
        <SplitHeadline id="closing-title" className="vs-closing-title" parts={t.title} />
        <Reveal className="vs-closing-actions" y={12}>
          <Cta to="/contact" onClick={() => trackEvent('audit_cta_clicked', { placement: 'home_closing' })}>{t.primary}</Cta>
          <Cta href="https://wa.me/32478731138" variant="line" onClick={() => trackEvent('whatsapp_clicked', { placement: 'home_closing' })}>{t.whatsapp}</Cta>
          <a className="vs-textlink" href="mailto:stef@verkoop.studio">stef@verkoop.studio</a>
        </Reveal>
      </div>
    </section>
  )
}
