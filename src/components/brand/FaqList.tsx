import type { Bi } from '../../data/types'
import type { Lang } from '../../data/types'
import Reveal from './Reveal'

export interface FaqEntry { question: Bi<string>; answer: Bi<string> }

/** A short FAQ in the same accordion as the homepage: hairlines only, the first one open. */
export default function FaqList({ id, title, items, lang }: { id: string; title: string; items: FaqEntry[]; lang: Lang }) {
  return (
    <section className="vs-wrap vs-section vs-faq-block" aria-labelledby={`${id}-title`}>
      <Reveal as="h2" className="vs-h2" id={`${id}-title`}>{title}</Reveal>
      <div className="faq-list">
        {items.map((item, i) => (
          <details key={item.question.en} name={id} open={i === 0} className="faq-item">
            <summary><span>{item.question[lang]}</span><span aria-hidden="true">+</span></summary>
            <p>{item.answer[lang]}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
