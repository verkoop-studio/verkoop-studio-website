import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useState, type CSSProperties, type PointerEvent } from 'react'
import stefAvatar from '../assets/stef-desk-640.webp'
import HandNote from './brand/HandNote'
import './HeroVideo.css'

type Lang = 'nl' | 'en'

interface HeroVideoProps {
  lang?: Lang
  videoId?: string
  /** The player's accessible title. */
  title?: string
  /** A few plain words on the cover: what the video is about. */
  heading?: string
  /** The video's real running time, e.g. "1:14". Left out when unknown. */
  duration?: string
  /** Shows the small "much budget, little result" card from the video's story. */
  story?: boolean
  /** Hand-written note pointing at the play button. */
  note?: string
  /** Which of YouTube's stills to use: the default thumbnail or one of the auto frames. */
  frame?: 'maxresdefault' | 'maxres1' | 'maxres2' | 'maxres3'
  /** Vertical position of the play button, so it never sits on a face. */
  playY?: string
}

const STORY = {
  nl: { win: 'Advertenties', chip: 'Uit de video', title: 'Veel budget, weinig resultaat', spend: 'Budget', sales: 'Verkopen' },
  en: { win: 'Ads', chip: 'From the video', title: 'Big budget, little result', spend: 'Budget', sales: 'Sales' },
}

/**
 * A designed cover in front of a YouTube video. Nothing from YouTube loads until the
 * visitor presses play; then the player opens in place, with sound and its own controls.
 */
export default function HeroVideo({ lang = 'nl', videoId = 'tSjPY9J6ynk', title, heading, duration, story = false, note, frame = 'maxresdefault', playY }: HeroVideoProps) {
  const videoTitle = title ?? (lang === 'nl' ? 'Waarom je Meta Ads geld VERBRANDEN (en hoe je het fixt)' : 'Why your Meta Ads BURN money (and how to fix it) — video in Dutch')
  const [playing, setPlaying] = useState(false)
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.6 })
  const y = useSpring(my, { stiffness: 220, damping: 18, mass: 0.6 })
  const s = STORY[lang]

  // The play button leans toward the cursor while it is near, like a magnet.
  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (reduce || event.pointerType !== 'mouse') return
    const box = event.currentTarget.getBoundingClientRect()
    const dx = event.clientX - (box.left + box.width / 2)
    const dy = event.clientY - (box.top + box.height / 2)
    const reach = Math.max(0, 1 - Math.hypot(dx, dy) / (box.width * 0.45))
    mx.set(dx * 0.12 * reach)
    my.set(dy * 0.12 * reach)
  }
  const onPointerLeave = () => { mx.set(0); my.set(0) }

  return (
    <div className={`hero-video${playing ? ' is-playing' : ''}`}>
      {playing && (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1&modestbranding=1&controls=1`}
          title={videoTitle}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      )}
      <AnimatePresence>
        {!playing && (
          <motion.div
            key="cover"
            className="vs-vc"
            style={playY ? ({ '--vc-play-y': playY } as CSSProperties) : undefined}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.06, filter: 'blur(6px)' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              className="hero-video-play vs-vc-button"
              aria-label={`${lang === 'nl' ? 'Speel video af' : 'Play video'}: ${videoTitle}`}
              onClick={() => setPlaying(true)}
              onPointerMove={onPointerMove}
              onPointerLeave={onPointerLeave}
            >
              <span className="vs-vc-media" aria-hidden="true">
                <img src={`https://i.ytimg.com/vi/${videoId}/${frame}.jpg`} alt="" width="1280" height="720" decoding="async" fetchPriority="high" />
              </span>
              <span className="vs-vc-shade" aria-hidden="true" />
              <span className="vs-vc-copy" aria-hidden="true">
                <span className="vs-vc-chip">
                  <img src={stefAvatar} alt="" width="28" height="28" decoding="async" />
                  Stef{duration && <> · {duration}</>}
                </span>
                {heading && <span className="vs-vc-title">{heading}</span>}
              </span>
              <motion.span className="vs-vc-play" style={reduce ? undefined : { x, y }} aria-hidden="true">
                <span className="vs-vc-ring" />
                <span className="vs-vc-disc">
                  <svg width="26" height="26" viewBox="0 0 14 14"><path d="M4.2 2.4v9.2L11.8 7Z" fill="currentColor" /></svg>
                </span>
              </motion.span>
              {story && (
                <span className="vs-vc-story" aria-hidden="true">
                  <span className="vs-vc-story-bar"><i /><i /><i /><b>{s.win}</b><em>{s.chip}</em></span>
                  <span className="vs-vc-story-body">
                    <b className="vs-vc-story-title">{s.title}</b>
                    <svg viewBox="0 0 220 90" className="vs-vc-chart" preserveAspectRatio="none">
                      <path d="M0 89.5H220" className="vs-vc-axis" />
                      <path d="M4 80C40 74 70 62 100 50s70-30 112-42" className="vs-vc-line vs-vc-line--spend" pathLength={1} />
                      <path d="M4 72C50 71 90 73 130 71s60 0 82-1" className="vs-vc-line vs-vc-line--sales" pathLength={1} />
                    </svg>
                    <span className="vs-vc-legend"><span><i className="is-spend" />{s.spend}</span><span><i className="is-sales" />{s.sales}</span></span>
                  </span>
                </span>
              )}
            </button>
            {note && <HandNote point="down-left" className="vs-vc-note">{note}</HandNote>}
          </motion.div>
        )}
      </AnimatePresence>
      <noscript><a href={`https://www.youtube.com/watch?v=${videoId}`}>{videoTitle}</a></noscript>
    </div>
  )
}
