import { Link } from 'react-router-dom'
import type { Bi, Lang } from '../../data/types'
import FaqFolder from './FaqFolder'

export interface FaqEntry { question: Bi<string>; answer: Bi<string> }

/** The line under every FAQ title: the questions not listed go straight to us. */
export function FaqLede({ lang }: { lang: Lang }) {
  return <>{lang === 'nl' ? 'Staat je vraag er niet bij?' : 'Can’t find your question?'} <Link to="/contact">{lang === 'nl' ? 'Stel ze rechtstreeks.' : 'Ask us directly.'}</Link></>
}

/** A short FAQ section in the site's FAQ folder. */
export default function FaqList({ id, title, items, lang, lede = true }: { id: string; title: string; items: FaqEntry[]; lang: Lang; lede?: boolean }) {
  return (
    <section className="vs-wrap vs-faq-block" aria-labelledby={`${id}-title`}>
      <FaqFolder id={id} title={title} lang={lang} lede={lede ? <FaqLede lang={lang} /> : undefined} items={items.map((item) => ({ question: item.question[lang], answer: item.answer[lang] }))} />
    </section>
  )
}
