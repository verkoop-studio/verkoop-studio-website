import { useState } from 'react'
import { faqItems } from '../data/faq'
import { useInView } from '../lib/useInView'
import { useLang } from '../i18n/LanguageContext'

/**
 * Questions shown before "show all", by position in `faqItems`: who we are, ads,
 * project or monthly, how a collaboration starts, measurement, cost, and the tools.
 * Every answer stays in the HTML in data order, so search engines still read all of them.
 */
const FEATURED = new Set([0, 4, 10, 11, 12, 14, 15])

export default function FAQ() {
  const { ref } = useInView<HTMLDivElement>()
  const { lang } = useLang()
  const [all, setAll] = useState(false)
  const nl = lang === 'nl'
  return (
    <section className="studio-faq" aria-labelledby="faq-title">
      <div ref={ref} className="reveal studio-faq-inner">
        <h2 id="faq-title" className="font-display text-balance">{nl ? 'Veelgestelde vragen' : 'Frequently asked questions'}</h2>
        <div>
          <div id="faq-list" className={`faq-list${all ? ' is-expanded' : ''}`}>
            {faqItems.map((item, i) => (
              <details key={item.question[lang]} name="studio-faq" open={i === 0} className={`faq-item${FEATURED.has(i) ? '' : ' faq-item--extra'}`}>
                <summary>
                  <span>{item.question[lang]}</span>
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{item.answer[lang]}</p>
              </details>
            ))}
          </div>
          <button type="button" className="faq-more" aria-expanded={all} aria-controls="faq-list" onClick={() => setAll((value) => !value)}>
            {all
              ? (nl ? 'Toon minder vragen' : 'Show fewer questions')
              : (nl ? `Toon alle ${faqItems.length} vragen` : `Show all ${faqItems.length} questions`)}
          </button>
        </div>
      </div>
    </section>
  )
}
