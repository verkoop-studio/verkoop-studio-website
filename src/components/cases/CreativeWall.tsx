import { useState, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { caseHeadline, cases } from '../../data/cases'
import type { CaseStudy, Lang } from '../../data/types'
import { trackEvent } from '../../lib/analytics'
import Reveal from '../brand/Reveal'
import CasePoster from '../home/CasePoster'

type Video = { src: string; poster: string; label: string }
type Tile = { kind: 'case'; item: CaseStudy } | ({ kind: 'video' } & Video)

/** The two published ad videos, from the Pinacello and Healthfactor cases. */
const VIDEOS = (lang: Lang): Video[] => [
  { src: '/videos/ads/pinacello-personal.mp4', poster: '/images/ads/pinacello-personal.jpg', label: lang === 'nl' ? 'Pinacello · organische video' : 'Pinacello · organic video' },
  { src: '/videos/ads/healthfactor-personal.mp4', poster: '/images/ads/healthfactor-personal.jpg', label: lang === 'nl' ? 'Healthfactor · videoadvertentie' : 'Healthfactor · video ad' },
]

/** Every listed case as its poster, with a video after the first and the third poster. */
function tiles(lang: Lang): Tile[] {
  const posters: Tile[] = cases.filter((c) => c.image && !c.unavailable).map((item) => ({ kind: 'case', item }))
  const [first, second] = VIDEOS(lang)
  const out = [...posters]
  out.splice(1, 0, { kind: 'video', ...first })
  out.splice(Math.min(out.length, 4), 0, { kind: 'video', ...second })
  return out
}

function VideoTile({ tile, lang, copy }: { tile: Video; lang: Lang; copy: boolean }) {
  const [playing, setPlaying] = useState(false)
  if (playing) return <video className="vs-wall-media" src={tile.src} poster={tile.poster} controls autoPlay playsInline aria-label={tile.label} />
  return (
    <button type="button" className="vs-wall-play" onClick={() => setPlaying(true)} tabIndex={copy ? -1 : undefined} aria-label={`${lang === 'nl' ? 'Speel af' : 'Play'}: ${tile.label}`}>
      <img className="vs-wall-media" src={tile.poster} alt="" width={360} height={640} loading="lazy" decoding="async" />
      <span className="vs-wall-btn" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 14 14"><path d="M4.2 2.4v9.2L11.8 7Z" fill="currentColor" /></svg></span>
    </button>
  )
}

/** The pointer's place over a poster, from -1 to 1, for the stickers' parallax. */
function tiltTo(event: PointerEvent<HTMLElement>) {
  const el = event.currentTarget
  const box = el.getBoundingClientRect()
  el.style.setProperty('--px', ((event.clientX - box.left) / box.width * 2 - 1).toFixed(3))
  el.style.setProperty('--py', ((event.clientY - box.top) / box.height * 2 - 1).toFixed(3))
}
function tiltReset(event: PointerEvent<HTMLElement>) {
  event.currentTarget.style.removeProperty('--px')
  event.currentTarget.style.removeProperty('--py')
}

/**
 * A slow wall of the real work: each case as the poster it has on the homepage, with the
 * two published ad videos between them. The row runs twice for a seamless loop; the copy
 * is hidden from assistive tech. It pauses under the pointer and stands still with reduced motion.
 */
export default function CreativeWall({ lang }: { lang: Lang }) {
  const list = tiles(lang)
  return (
    <section className="vs-section vs-wall" aria-labelledby="wall-title">
      <div className="vs-wrap">
        <Reveal as="h2" className="vs-h2" id="wall-title">{lang === 'nl' ? 'Uit het werk.' : 'From the work.'}</Reveal>
      </div>
      <div className="vs-wall-track">
        {[false, true].map((copy) => (
          <ul key={String(copy)} className="vs-wall-row" aria-hidden={copy || undefined}>
            {list.map((tile) => {
              if (tile.kind === 'video') {
                return (
                  <li key={tile.label} className="vs-wall-tile vs-wall-tile--video">
                    <VideoTile tile={tile} lang={lang} copy={copy} />
                    <span className="vs-wall-label">{tile.label}</span>
                  </li>
                )
              }
              const { item } = tile
              const label = `${item.name} · ${item.sector[lang].split(' · ')[0]}`
              return (
                <li key={item.slug} className="vs-wall-tile vs-wall-tile--case">
                  <Link
                    to={`/cases/${item.slug}`}
                    className="vs-wall-case vs-case-live"
                    tabIndex={copy ? -1 : undefined}
                    aria-label={label}
                    onPointerMove={tiltTo}
                    onPointerLeave={tiltReset}
                    onClick={() => trackEvent('case_viewed', { case: item.slug, placement: 'cases_wall' })}
                  >
                    <span className="vs-wall-frame">
                      <CasePoster slug={item.slug} name={item.name} caption={caseHeadline(item, lang)} lang={lang} />
                    </span>
                    <span className="vs-wall-label">{label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        ))}
      </div>
    </section>
  )
}
