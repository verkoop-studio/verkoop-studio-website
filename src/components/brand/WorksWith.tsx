import type { Lang } from '../../data/types'
import type { Platform } from '../../data/platforms'
import PlatformMark from './PlatformMark'
import Reveal from './Reveal'


/** A row of the platforms a page works with, each as its logo and name, lifting on hover. */
export default function WorksWith({ platforms, lang }: { platforms: Platform[]; lang: Lang }) {
  return (
    <section className="vs-wrap vs-works" aria-labelledby="works-with">
      <Reveal as="h2" className="vs-works-title" id="works-with">{lang === 'nl' ? 'Werkt met' : 'Works with'}</Reveal>
      <ul className="vs-works-list">
        {platforms.map((key, i) => <Reveal as="li" key={key} delay={i * 0.04} y={12}><span className="vs-works-mark"><PlatformMark platform={key} /></span></Reveal>)}
      </ul>
    </section>
  )
}
