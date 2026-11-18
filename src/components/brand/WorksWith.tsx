import type { Lang } from '../../data/types'
import { PLATFORMS, type Platform } from '../../data/platforms'
import Reveal from './Reveal'


/** A quiet row of the platforms a page works with, set as plain monochrome wordmarks that lift on hover. */
export default function WorksWith({ platforms, lang }: { platforms: Platform[]; lang: Lang }) {
  return (
    <section className="vs-wrap vs-works" aria-labelledby="works-with">
      <Reveal as="h2" className="vs-works-title" id="works-with">{lang === 'nl' ? 'Werkt met' : 'Works with'}</Reveal>
      <ul className="vs-works-list">
        {platforms.map((key, i) => <Reveal as="li" key={key} delay={i * 0.04} y={12}><span className="vs-works-mark">{PLATFORMS[key]}</span></Reveal>)}
      </ul>
    </section>
  )
}
