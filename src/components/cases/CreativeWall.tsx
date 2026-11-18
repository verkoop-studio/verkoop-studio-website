import { useState } from 'react'
import ekart from '../../assets/cases/ekart-640.webp'
import healthfactor from '../../assets/cases/healthfactor-website-640.webp'
import nooms from '../../assets/cases/nooms-640.webp'
import pinacello from '../../assets/cases/pinacello-640.webp'
import type { Lang } from '../../data/types'
import Reveal from '../brand/Reveal'

type Tile =
  | { kind: 'video'; src: string; poster: string; label: string }
  | { kind: 'image'; src: string; label: string }

/** Real work only: the two published ad videos and the live sites from the cases. */
const TILES = (lang: Lang): Tile[] => [
  { kind: 'video', src: '/videos/ads/pinacello-personal.mp4', poster: '/images/ads/pinacello-personal.jpg', label: lang === 'nl' ? 'Pinacello · organische video' : 'Pinacello · organic video' },
  { kind: 'image', src: pinacello, label: lang === 'nl' ? 'Pinacello · campagnepagina' : 'Pinacello · campaign page' },
  { kind: 'image', src: ekart, label: 'E-Kart · website' },
  { kind: 'video', src: '/videos/ads/healthfactor-personal.mp4', poster: '/images/ads/healthfactor-personal.jpg', label: lang === 'nl' ? 'Healthfactor · videoadvertentie' : 'Healthfactor · video ad' },
  { kind: 'image', src: nooms, label: 'Nooms · webshop' },
  { kind: 'image', src: healthfactor, label: 'Healthfactor · website' },
]

function VideoTile({ tile, lang, copy }: { tile: Extract<Tile, { kind: 'video' }>; lang: Lang; copy: boolean }) {
  const [playing, setPlaying] = useState(false)
  if (playing) return <video className="vs-wall-media" src={tile.src} poster={tile.poster} controls autoPlay playsInline aria-label={tile.label} />
  return (
    <button type="button" className="vs-wall-play" onClick={() => setPlaying(true)} tabIndex={copy ? -1 : undefined} aria-label={`${lang === 'nl' ? 'Speel af' : 'Play'}: ${tile.label}`}>
      <img className="vs-wall-media" src={tile.poster} alt="" loading="lazy" decoding="async" />
      <span className="vs-wall-btn" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 14 14"><path d="M4.2 2.4v9.2L11.8 7Z" fill="currentColor" /></svg></span>
    </button>
  )
}

/**
 * A slow wall of real creatives from the cases. The row runs twice for a seamless loop;
 * the copy is hidden from assistive tech. It pauses under the pointer and stands still
 * with reduced motion.
 */
export default function CreativeWall({ lang }: { lang: Lang }) {
  const tiles = TILES(lang)
  return (
    <section className="vs-section vs-wall" aria-labelledby="wall-title">
      <div className="vs-wrap">
        <Reveal as="h2" className="vs-h2" id="wall-title">{lang === 'nl' ? 'Uit het werk.' : 'From the work.'}</Reveal>
      </div>
      <div className="vs-wall-track">
        {[false, true].map((copy) => (
          <ul key={String(copy)} className="vs-wall-row" aria-hidden={copy || undefined}>
            {tiles.map((tile) => (
              <li key={tile.label} className={`vs-wall-tile vs-wall-tile--${tile.kind}`}>
                {tile.kind === 'video' ? <VideoTile tile={tile} lang={lang} copy={copy} /> : <img className="vs-wall-media" src={tile.src} alt={copy ? '' : tile.label} loading="lazy" decoding="async" />}
                <span className="vs-wall-label">{tile.label}</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  )
}
