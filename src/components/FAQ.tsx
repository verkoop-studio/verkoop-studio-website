import { faqItems } from '../data/faq'
import { useLang } from '../i18n/LanguageContext'
import FaqFolder from './brand/FaqFolder'
import { FaqLede } from './brand/FaqList'

/**
 * Questions shown before "show all", by position in `faqItems`: who we are, ads,
 * project or monthly, how a collaboration starts, measurement, cost, and the tools.
 * Every answer stays in the HTML in data order, so search engines still read all of them.
 */
const FEATURED = new Set([0, 4, 10, 11, 12, 14, 15])

export default function FAQ() {
  const { lang } = useLang()
  return (
    <section className="vs-wrap vs-faq-block" aria-labelledby="faq-title">
      <FaqFolder
        id="studio-faq"
        titleId="faq-title"
        group="studio-faq"
        title={lang === 'nl' ? 'Veelgestelde vragen' : 'Frequently asked questions'}
        lede={<FaqLede lang={lang} />}
        lang={lang}
        items={faqItems.map((item, i) => ({ question: item.question[lang], answer: item.answer[lang], extra: !FEATURED.has(i) }))}
      />
    </section>
  )
}
