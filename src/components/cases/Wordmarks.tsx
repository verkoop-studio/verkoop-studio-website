import { Link } from 'react-router-dom'
import { cases } from '../../data/cases'
import type { Lang } from '../../data/types'

/**
 * The clients by name, sliding past in grey; each turns ink under the pointer and links to its
 * case. The row runs twice for a seamless loop, the copy hidden from assistive tech. Pauses on
 * hover, fades at the edges, stands still with reduced motion.
 */
export default function Wordmarks({ lang }: { lang: Lang }) {
  const names = cases.filter((c) => !c.unavailable)
  const row = [...names, ...names]
  return (
    <section className="vs-wordmarks" aria-label={lang === 'nl' ? 'Klanten' : 'Clients'}>
      <div className="vs-wordmarks-track">
        {[false, true].map((copy) => (
          <ul key={String(copy)} className="vs-wordmarks-row" aria-hidden={copy || undefined}>
            {row.map((item, i) => (
              <li key={`${item.slug}-${i}`}>
                <Link to={`/cases/${item.slug}`} tabIndex={copy || i >= names.length ? -1 : undefined} className={`vs-wordmark vs-wordmark--${item.slug}`}>{item.name}</Link>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  )
}
