import { useLang } from '../../i18n/LanguageContext'
import { trackEvent } from '../../lib/analytics'
import Cta from '../brand/Cta'
import ProcessLine from '../brand/ProcessLine'
import Reveal from '../brand/Reveal'

/** How a collaboration starts: the five steps from process.ts on one line, ending on the call to action. */
export default function StartSteps() {
  const { lang } = useLang()
  return (
    <section className="vs-wrap vs-section vs-start" aria-labelledby="start-title">
      <Reveal as="h2" className="vs-h2" id="start-title">{lang === 'nl' ? 'Zo starten we.' : 'How we start.'}</Reveal>
      <ProcessLine lang={lang} />
      <div className="vs-start-cta">
        <Cta to="/contact" onClick={() => trackEvent('audit_cta_clicked', { placement: 'home_start' })}>{lang === 'nl' ? 'Plan een gesprek' : 'Plan a call'}</Cta>
      </div>
    </section>
  )
}
