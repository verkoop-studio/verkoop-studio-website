import { Link } from 'react-router-dom'
import stef from '../../assets/stef.webp'
import tanguy from '../../assets/studio-flyers.webp'
import { caseHeadline, getCase } from '../../data/cases'
import type { CaseSlug, Lang } from '../../data/types'
import { trackEvent } from '../../lib/analytics'
import ResponsiveImage from '../ResponsiveImage'
import Arrow from '../brand/Arrow'
import Reveal from '../brand/Reveal'
import RollingNumber from '../brand/RollingNumber'
import CasePoster from '../home/CasePoster'

/** Only figures the cases publish: Pinacello's revenue and organic video, the Nooms pre-sale. */
const STATS = {
  nl: [
    { slug: 'pinacello', value: 120, prefix: '+', suffix: '%', label: 'online omzet · Pinacello' },
    { slug: 'pinacello', value: 20, prefix: '', suffix: '', label: 'verkopen uit één organische video' },
    { slug: 'nooms', text: 'Uitverkocht', label: 'pre-sale via influencer marketing · Nooms' },
  ],
  en: [
    { slug: 'pinacello', value: 120, prefix: '+', suffix: '%', label: 'online revenue · Pinacello' },
    { slug: 'pinacello', value: 20, prefix: '', suffix: '', label: 'sales from one organic video' },
    { slug: 'nooms', text: 'Sold out', label: 'pre-sale via influencer marketing · Nooms' },
  ],
} as const

const STILLS = {
  nl: [{ slug: 'pinacello', src: '/images/ads/pinacello-personal.jpg', label: 'Pinacello · organische video' }, { slug: 'healthfactor', src: '/images/ads/healthfactor-personal.jpg', label: 'Healthfactor · videoadvertentie' }],
  en: [{ slug: 'pinacello', src: '/images/ads/pinacello-personal.jpg', label: 'Pinacello · organic video' }, { slug: 'healthfactor', src: '/images/ads/healthfactor-personal.jpg', label: 'Healthfactor · video ad' }],
} as const

function PosterTile({ slug, lang, wide = false, placement }: { slug: CaseSlug; lang: Lang; wide?: boolean; placement: string }) {
  const item = getCase(slug)
  if (!item || item.unavailable) return null
  const caption = caseHeadline(item, lang)
  return (
    <Link to={`/cases/${slug}`} className={`pb-tile pb-poster vs-case-live${wide ? ' pb-poster--wide' : ''}`} aria-label={`${item.name}: ${caption}`} onClick={() => trackEvent('case_viewed', { case: slug, placement })}>
      <span className="pb-poster-frame"><CasePoster slug={slug} name={item.name} caption={caption} lang={lang} /></span>
      <span className="pb-go" aria-hidden="true"><Arrow size={16} /></span>
    </Link>
  )
}

/**
 * The proof in one grid: the cases as their posters, the figures they publish, stills
 * from the two real ad videos and the two people behind the work. Tiles lean and lift
 * under the pointer; the figures count up when they scroll into view.
 */
export default function ProofBento({ lang, placement, title = true }: { lang: Lang; placement: string; title?: boolean }) {
  const stats = STATS[lang]
  const stills = STILLS[lang]
  const statTile = (i: number) => {
    const s = stats[i]
    return (
      <Link to={`/cases/${s.slug}`} className={`pb-tile pb-stat pb-stat--${i}`} onClick={() => trackEvent('case_viewed', { case: s.slug, placement })}>
        <b>{'text' in s ? s.text : <RollingNumber value={s.value} prefix={s.prefix} suffix={s.suffix} />}</b>
        <span>{s.label}</span>
      </Link>
    )
  }
  const stillTile = (i: number) => {
    const s = stills[i]
    return (
      <Link to={`/cases/${s.slug}`} className="pb-tile pb-still" onClick={() => trackEvent('case_viewed', { case: s.slug, placement })}>
        <img src={s.src} alt={s.label} width={360} height={640} loading="lazy" decoding="async" />
        <span className="pb-still-label">{s.label}</span>
      </Link>
    )
  }
  return (
    <section className="vs-wrap vs-section pb" aria-labelledby={title ? `pb-title-${placement}` : undefined} aria-label={title ? undefined : (lang === 'nl' ? 'Bewijs uit het werk' : 'Proof from the work')}>
      {title && <Reveal as="h2" className="vs-h2" id={`pb-title-${placement}`}>{lang === 'nl' ? 'Wat het werk opleverde.' : 'What the work delivered.'}</Reveal>}
      <div className="pb-grid">
        <PosterTile slug="pinacello" lang={lang} wide placement={placement} />
        {statTile(0)}
        {stillTile(0)}
        {statTile(1)}
        <PosterTile slug="nooms" lang={lang} placement={placement} />
        {statTile(2)}
        <PosterTile slug="e-kart" lang={lang} placement={placement} />
        {stillTile(1)}
        <PosterTile slug="healthfactor" lang={lang} placement={placement} />
        <Link to="/agency" className="pb-tile pb-team">
          <span className="pb-team-photos"><ResponsiveImage src={stef} alt="" sizes="160px" /><ResponsiveImage src={tanguy} alt="" sizes="160px" /></span>
          <span><b>Stef &amp; Tanguy</b>{lang === 'nl' ? 'het team achter het werk' : 'the team behind the work'}</span>
        </Link>
      </div>
    </section>
  )
}
