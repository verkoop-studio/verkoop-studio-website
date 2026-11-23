import { Link } from 'react-router-dom'
import type { Lang } from '../../data/types'
import { trackEvent } from '../../lib/analytics'
import { Go } from '../brand/Arrow'
import Reveal from '../brand/Reveal'

/** Only figures the cases publish (cases.ts): Pinacello's revenue and organic video, the Nooms pre-sale. */
const STATS = {
  nl: [
    { slug: 'pinacello', figure: '+120%', label: 'online omzet', name: 'Pinacello' },
    { slug: 'pinacello', figure: '20', label: 'verkopen uit één organische video', name: 'Pinacello' },
    { slug: 'nooms', figure: 'Uitverkocht', label: 'pre-sale via influencer marketing', name: 'Nooms' },
  ],
  en: [
    { slug: 'pinacello', figure: '+120%', label: 'online revenue', name: 'Pinacello' },
    { slug: 'pinacello', figure: '20', label: 'sales from one organic video', name: 'Pinacello' },
    { slug: 'nooms', figure: 'Sold out', label: 'pre-sale via influencer marketing', name: 'Nooms' },
  ],
}

/** The published results as a row of figures, each linking to its case. No covers: the posters live in the list above. */
export default function ProofBento({ lang, placement }: { lang: Lang; placement: string }) {
  return (
    <section className="vs-wrap vs-section pb" aria-label={lang === 'nl' ? 'Resultaten uit de cases' : 'Results from the cases'}>
      <ul className="pb-stats">
        {STATS[lang].map((s, i) => (
          <Reveal as="li" key={s.figure} delay={i * 0.06}>
            <Link to={`/cases/${s.slug}`} className={`pb-stat pb-stat--${i}`} onClick={() => trackEvent('case_viewed', { case: s.slug, placement })}>
              <b>{s.figure}</b>
              <span>{s.label}</span>
              <small>{s.name}<Go /></small>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
