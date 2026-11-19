import { type CSSProperties, useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Link } from 'react-router-dom'
import { caseContent } from '../../data/caseContent'
import { getCase } from '../../data/cases'
import type { Lang } from '../../data/types'
import { trackEvent } from '../../lib/analytics'
import { RESULTS } from '../../data/workResults'
import ResponsiveImage from '../ResponsiveImage'
import RollingNumber from '../brand/RollingNumber'
import TiltCard from '../brand/TiltCard'
import { Like } from '../brand/blocks/Like'

/*
 * The work widgets: the real case material shown as product-grade UI.
 * Every picture, video, caption, domain and figure comes from cases.ts and caseContent.ts;
 * nothing is invented (no like counts, no views, no extra numbers).
 */

const domain = (url?: string) => (url ? url.replace(/^https?:\/\//, '').replace(/\/$/, '') : '')

/** Where each screenshot's own order button sits, as a share of the image, for the cursor to press. */
const CTA: Record<string, [number, number]> = { pinacello: [35, 77], nooms: [61, 78], healthfactor: [74, 95] }

const WORDS = {
  nl: { sponsored: 'Gesponsord', play: 'Speel de video', like: 'Vind ik leuk', comment: 'Reageer', share: 'Deel', save: 'Bewaar', view: 'Bekijk de case', live: 'Live site' },
  en: { sponsored: 'Sponsored', play: 'Play the video', like: 'Like', comment: 'Comment', share: 'Share', save: 'Save', view: 'View the case', live: 'Live site' },
}

/* ── WorkSite ───────────────────────────────────────────────
   The real site in a browser frame with its own domain in the bar.
   On hover the page scrolls slowly inside the frame and a small
   cursor travels to the site's own order button and presses it. */
export function WorkSite({ slug, lang, tilt = true, className = '' }: { slug: string; lang: Lang; tilt?: boolean; className?: string }) {
  const c = getCase(slug)
  if (!c?.image) return null
  const [x, y] = CTA[slug] ?? [50, 70]
  const frame = (
    <figure className={`wk-site ${className}`} style={{ '--cx': `${x}%`, '--cy': `${y}%` } as CSSProperties}>
      <figcaption className="wk-site-bar"><i /><i /><i /><b>{domain(c.liveUrl) || c.name}</b>{c.liveUrl && <em>{WORDS[lang].live}</em>}</figcaption>
      <span className="wk-site-view">
        <span className="wk-site-page">
          <ResponsiveImage src={c.image} alt="" sizes="(max-width: 900px) 100vw, 640px" loading="lazy" />
          {CTA[slug] && (
            <span className="wk-cursor" aria-hidden="true">
              <svg width="18" height="20" viewBox="0 0 18 20"><path d="M2 1.5v15.2l4.1-3.6 2.6 5.6 2.8-1.3-2.6-5.5 5.6-.4Z" fill="#111110" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" /></svg>
              <i />
            </span>
          )}
        </span>
      </span>
    </figure>
  )
  return tilt ? <TiltCard className="wk-site-tilt" max={5}>{frame}</TiltCard> : frame
}

/* ── WorkAd ─────────────────────────────────────────────────
   The real ad as a post in a phone: the brand, "Sponsored", the
   real video behind a play button, the action row and the case's
   own caption. The heart is Bencho's Like, without a count. */
export function WorkAd({ slug, lang, className = '' }: { slug: string; lang: Lang; className?: string }) {
  const c = getCase(slug)
  const [playing, setPlaying] = useState(false)
  if (!c?.video || !c.videoPoster) return null
  const w = WORDS[lang]
  return (
    <figure className={`wk-ad ${className}`}>
      <span className="wk-ad-head">
        <span className="wk-ad-ava" aria-hidden="true">{c.name[0]}</span>
        <span className="wk-ad-who"><b>{c.name}</b><em>{w.sponsored}</em></span>
        <MoreHorizontal size={18} aria-hidden="true" />
      </span>
      <span className="wk-ad-media">
        {playing ? (
          <video src={c.video} poster={c.videoPoster} controls autoPlay playsInline onEnded={() => setPlaying(false)} />
        ) : (
          <button type="button" className="wk-ad-play" aria-label={`${w.play}: ${c.name}`} onClick={() => { setPlaying(true); trackEvent('case_viewed', { case: slug, placement: 'work_ad_video' }) }}>
            <img src={c.videoPoster} alt="" loading="lazy" decoding="async" />
            <span className="wk-ad-play-btn" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 14 14"><path d="M4 2.5v9l7.5-4.5Z" fill="currentColor" /></svg></span>
          </button>
        )}
      </span>
      <span className="wk-ad-actions">
        <Like label={w.like} />
        <span className="wk-ad-icon" title={w.comment}><MessageCircle size={21} aria-hidden="true" /></span>
        <span className="wk-ad-icon" title={w.share}><Send size={20} aria-hidden="true" /></span>
        <span className="wk-ad-icon wk-ad-save" title={w.save}><Bookmark size={20} aria-hidden="true" /></span>
      </span>
      {c.videoCaption && <figcaption className="wk-ad-caption"><b>{c.name}</b> {c.videoCaption[lang]}</figcaption>}
    </figure>
  )
}

/* ── WorkResult ─────────────────────────────────────────────
   Only a published figure: it counts up as it arrives, a small
   line rises under it, and the client and sector sit below. */
export function WorkResult({ slug, lang, index = 0, link = true, dark = false, placement = 'work_result', className = '' }: { slug: string; lang: Lang; index?: number; link?: boolean; dark?: boolean; placement?: string; className?: string }) {
  const c = getCase(slug)
  const f = RESULTS[slug]?.[index]
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref, { once: true, amount: 0.5 })
  if (!c || !f) return null
  const body = (
    <>
      <span className="wk-result-figure">{f.value !== undefined ? <RollingNumber value={f.value} prefix={f.prefix} suffix={f.suffix} /> : f.text?.[lang]}</span>
      <span className="wk-result-label">{f.label[lang]}</span>
      <svg className="wk-result-trend" viewBox="0 0 120 28" preserveAspectRatio="none" aria-hidden="true">
        <path d="M2 24 C 22 23, 30 18, 46 19 S 74 12, 86 10 S 108 5, 118 3" pathLength={1} data-on={seen || undefined} />
      </svg>
      <span className="wk-result-who"><b>{c.name}</b><em>{c.sector[lang]}</em></span>
    </>
  )
  const cls = `wk-result${dark ? ' wk-result--dark' : ''} ${className}`
  return (
    <div ref={ref} className="wk-result-wrap">
      {link ? (
        <Link to={`/cases/${slug}`} className={cls} onClick={() => trackEvent('case_viewed', { case: slug, placement })}>{body}</Link>
      ) : (
        <div className={cls}>{body}</div>
      )}
    </div>
  )
}

/* ── WorkJourney ────────────────────────────────────────────
   The case's three steps as linked mini widgets. A Bencho step
   player runs above them: the current step is a bar that fills,
   then eases on to the next dot. Pressing a dot picks a step. */
const STEP_MS = 3200

/** Each step gets the real material that belongs to it: the ad, the page, or the published figure. Steps without any show their words only. */
function StepWidget({ slug, lang, screen }: { slug: string; lang: Lang; screen: string }) {
  if ((screen === 'ad' || screen === 'subtitle') && getCase(slug)?.video) return <WorkAd slug={slug} lang={lang} />
  if (screen === 'page' || screen === 'presale' || screen === 'tiles') return <WorkSite slug={slug} lang={lang} tilt={false} />
  if ((screen === 'route' || screen === 'creator') && RESULTS[slug]) return <WorkResult slug={slug} lang={lang} link={false} />
  return null
}

export function WorkJourney({ slug, lang, detail = false, more }: { slug: string; lang: Lang; detail?: boolean; more?: string }) {
  const k = (caseContent as Record<string, (typeof caseContent)[keyof typeof caseContent] | undefined>)[slug]
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref, { amount: 0.35 })
  const [at, setAt] = useState(0)
  const [held, setHeld] = useState(false)
  const run = !!k && seen && !held && !reduce
  useEffect(() => {
    if (!run) return
    const id = window.setTimeout(() => setAt((i) => (i + 1) % k.steps.length), STEP_MS)
    return () => window.clearTimeout(id)
  }, [run, at, k])
  if (!k) return null
  return (
    <div ref={ref} className="wk-journey" onPointerEnter={() => setHeld(true)} onPointerLeave={() => setHeld(false)}>
      <div className="wk-steps" role="tablist" aria-label={k.stepsTitle[lang]}>
        {k.steps.map((step, i) => (
          <button key={step.link + i} type="button" role="tab" aria-selected={at === i} aria-label={step.title[lang]} className="wk-step-dot" data-on={at === i || undefined} onClick={() => setAt(i)}>
            {at === i && <motion.i key={`${at}-${run}`} initial={{ scaleX: run ? 0 : 1 }} animate={{ scaleX: 1 }} transition={{ duration: run ? STEP_MS / 1000 : 0, ease: 'linear' }} />}
          </button>
        ))}
      </div>
      <ol className="wk-journey-row">
        {k.steps.map((step, i) => (
          <li key={step.link + i} className="wk-journey-step" data-on={at === i || undefined} style={{ '--i': i } as CSSProperties}>
            <span className="wk-journey-n">{String(i + 1).padStart(2, '0')}</span>
            {detail ? <h3 className="wk-journey-title">{step.title[lang]}</h3> : <b>{step.title[lang]}</b>}
            <StepWidget slug={slug} lang={lang} screen={step.screen} />
            {detail && (
              <>
                <p className="wk-journey-body">{step.body[lang]}</p>
                <ul className="cs-tags">{step.tags[lang].map((tag, j) => <li key={tag} className={`cs-tag cs-tag--${(i + j) % 4}`}>{tag}</li>)}</ul>
                {more && <Link className="vs-textlink vs-textlink--arrow" to={step.link}>{more}</Link>}
              </>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}
