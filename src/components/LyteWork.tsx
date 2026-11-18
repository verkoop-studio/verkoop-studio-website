import { lyteCases } from '../data/lyteCases'
import { useLang } from '../i18n/LanguageContext'
import Arrow from './brand/Arrow'
import Reveal from './brand/Reveal'
import CalmPoster from './home/CalmPoster'

const COPY = {
  nl: { title: 'Eerder werk van ons team bij LYTE Studios.', body: 'Elke case opent op de site van LYTE Studios.', view: 'Bekijk de case', credit: 'Design en development door LYTE Studios' },
  en: { title: 'Earlier work by our team at LYTE Studios.', body: 'Each case opens on the LYTE Studios site.', view: 'View the case', credit: 'Design and development by LYTE Studios' },
}

/** Work the team did at LYTE Studios, in the calm poster family. Links go to the original case pages. */
export default function LyteWork() {
  const { lang } = useLang()
  const t = COPY[lang]
  return (
    <section id="lyte-projects" className="vs-wrap vs-section vs-lyte" aria-labelledby="lyte-title">
      <div className="vs-lyte-head">
        <h2 id="lyte-title" className="vs-h2">{t.title}</h2>
        <p className="vs-lead">{t.body}</p>
      </div>
      <ul className="vs-lyte-strip">
        {lyteCases.map((c, i) => (
          <Reveal as="li" key={c.url} delay={i * 0.08} y={30}>
            <a href={c.url} target="_blank" rel="noopener noreferrer" className="vs-lyte-card">
              <span className="vs-lyte-frame"><CalmPoster name={c.name} pattern={c.pattern} /></span>
              <span className="vs-lyte-meta">
                <span className="vs-lyte-chip">{c.category}</span>
                <span className="vs-lyte-desc">{c.description[lang]}</span>
              </span>
              <span className="vs-textlink vs-textlink--arrow vs-lyte-link">{t.view}<Arrow direction="up-right" size={15} /><span className="sr-only"> ({lang === 'nl' ? 'opent LYTE Studios in een nieuw venster' : 'opens LYTE Studios in a new window'})</span></span>
              <span className="vs-lyte-credit">{t.credit}</span>
            </a>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
