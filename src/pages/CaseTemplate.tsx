import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import ekartSite from '../assets/cases/ekart-640.webp'
import healthfactorSite from '../assets/cases/healthfactor-website-640.webp'
import noomsSite from '../assets/cases/nooms-640.webp'
import pinacelloSite from '../assets/cases/pinacello-640.webp'
import { Check, MapPin, Users } from 'lucide-react'
import { useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import Seo from '../components/Seo'
import Arrow, { Go } from '../components/brand/Arrow'
import { useArrive } from '../components/brand/useArrive'
import BotAvatar from '../components/brand/BotAvatar'
import Cta from '../components/brand/Cta'
import HandNote from '../components/brand/HandNote'
import Reveal from '../components/brand/Reveal'
import RollingNumber from '../components/brand/RollingNumber'
import SplitHeadline from '../components/brand/SplitHeadline'
import TextLink from '../components/brand/TextLink'
import CasePoster from '../components/home/CasePoster'
import ResponsiveImage from '../components/ResponsiveImage'
import type { CaseContent, CaseScreen, CaseStat } from '../data/caseContent'
import { caseHeadline, cases } from '../data/cases'
import type { CaseSlug, CaseStudy, Lang } from '../data/types'
import { trackEvent } from '../lib/analytics'
import { PAGES_STYLES, usePageStyles } from '../lib/deferredStyles'
import { useLang } from '../i18n/LanguageContext'

const COPY = {
  nl: { crumb: 'Cases', approach: 'Bekijk de aanpak', site: 'Bekijk de website', more: 'Meer over deze aanpak', sample: 'Voorbeeld', play: 'Speel de video af', evidence: 'Wat deze case laat zien', next: 'Volgende case', others: 'Bekijk andere cases', result: 'Resultaat' },
  en: { crumb: 'Cases', approach: 'See the approach', site: 'View the website', more: 'More about this approach', sample: 'Sample', play: 'Play the video', evidence: 'What this case shows', next: 'Next case', others: 'See other cases', result: 'Result' },
}

function StatIcon({ icon }: { icon: CaseStat['icon'] }) {
  if (icon === 'play') return <span className="cs-stat-icon cs-stat-icon--play"><svg width="12" height="12" viewBox="0 0 14 14"><path d="M4 2.5v9l7.5-4.5Z" fill="currentColor" /></svg></span>
  if (icon === 'people') return <span className="cs-stat-icon cs-stat-icon--soft"><Users size={16} /></span>
  if (icon === 'pin') return <span className="cs-stat-icon cs-stat-icon--soft"><MapPin size={16} /></span>
  if (icon === 'check') return <span className="cs-stat-icon cs-stat-icon--ok"><Check size={16} strokeWidth={3} /></span>
  if (icon === 'pulse') return <span className="cs-stat-icon cs-stat-icon--pulse"><i /></span>
  return (
    <svg className="cs-spark" viewBox="0 0 80 28" aria-hidden="true">
      <path d="M2 24 14 20 24 22 36 14 48 16 60 8 78 3" pathLength={1} />
    </svg>
  )
}

/** Each case's own material: the ad still where one was published, and the live site. */
const ASSETS: Record<CaseSlug, { still?: string; site: string }> = {
  pinacello: { still: '/images/ads/pinacello-personal.jpg', site: pinacelloSite },
  'e-kart': { site: ekartSite },
  nooms: { site: noomsSite },
  healthfactor: { still: '/images/ads/healthfactor-personal.jpg', site: healthfactorSite },
}
const domain = (url?: string) => (url ? url.replace(/^https?:\/\//, '').replace(/\/$/, '') : '')

/* The journey's screens, built from the case's own material and real labels, each marked as a sample. */
function Screen({ kind, lang, tags, c }: { kind: CaseScreen; lang: Lang; tags: string[]; c: CaseStudy }) {
  const nl = lang === 'nl'
  const name = c.name
  const art = ASSETS[c.slug]
  const site = domain(c.liveUrl)
  const extra = ExtraScreen({ kind, nl, art, name, site })
  if (extra) return extra
  if (kind === 'ad') {
    return (
      <div className="cs-mock cs-mock--ad">
        <div className="cs-mock-head"><span className="cs-ava">{name.charAt(0)}</span><p><b>{name}</b><span>{nl ? 'Gesponsord' : 'Sponsored'}</span></p></div>
        <div className="cs-mock-media"><img src={art.still ?? art.site} alt="" width={360} height={270} loading="lazy" decoding="async" /><span className="cs-play-s"><svg width="14" height="14" viewBox="0 0 14 14"><path d="M4 2.5v9l7.5-4.5Z" fill="currentColor" /></svg></span></div>
        <div className="cs-mock-foot"><span className="cs-mock-caption"><b>{name}</b>{site && <em>{site}</em>}</span><span className="cs-mock-btn">{nl ? 'Shop nu' : 'Shop now'}</span></div>
      </div>
    )
  }
  if (kind === 'page') {
    return (
      <div className="cs-mock cs-mock--page">
        <div className="cs-mock-site"><img src={art.site} alt="" width={640} height={400} loading="lazy" decoding="async" /></div>
        <div className="cs-bundles">
          <span><b>1×</b></span>
          <span className="is-on"><b>2×</b><em>{nl ? 'Populair' : 'Popular'}</em></span>
          <span><b>3×</b></span>
        </div>
        <span className="cs-mock-btn cs-mock-btn--wide">{nl ? 'Bestel nu' : 'Order now'}</span>
      </div>
    )
  }
  const steps = nl ? ['Bekeken', 'In het mandje', 'Herinnering', 'Betaald'] : ['Viewed', 'In the cart', 'Reminder', 'Paid']
  // A retargeting reminder for the case's own shop, then the route it closes.
  return (
    <div className="cs-mock cs-mock--retarget">
      <div className="cs-mock cs-mock--ad cs-mock--ad-sm">
        <div className="cs-mock-head"><span className="cs-ava">{name.charAt(0)}</span><p><b>{name}</b><span>{tags[0]}</span></p></div>
        <div className="cs-mock-site"><img src={art.site} alt="" width={640} height={400} loading="lazy" decoding="async" /></div>
        <div className="cs-mock-foot"><span className="cs-mock-caption"><b>{nl ? 'Je mandje wacht nog op je.' : 'Your cart is still waiting.'}</b>{site && <em>{site}</em>}</span><span className="cs-mock-btn">{nl ? 'Afrekenen' : 'Check out'}</span></div>
      </div>
      <ol className="cs-mock--route cs-route-mini">
        {steps.map((step, i) => (
          <li key={step} className={i === 3 ? 'is-done' : ''} style={{ '--i': i } as CSSProperties}>
            <span className="cs-route-dot">{i === 3 ? <Check size={12} strokeWidth={3} /> : i + 1}</span>{step}
          </li>
        ))}
      </ol>
    </div>
  )
}

/** The screens the other cases need. Same rules: skeleton content, real labels, marked as a sample. */
function ExtraScreen({ kind, nl, art, name, site }: { kind: CaseScreen; nl: boolean; art: { still?: string; site: string }; name: string; site: string }) {
  if (kind === 'booking') {
    const slots = ['14:00', '15:30', '17:00', '19:30']
    return (
      <div className="cs-mock cs-mock--card">
        <p className="cs-mock-title">{nl ? 'Kies je tijdslot' : 'Pick a time slot'}</p>
        <div className="cs-slots">{slots.map((slot, i) => <span key={slot} className={i === 3 ? 'is-on' : ''}>{slot}</span>)}</div>
        <span className="cs-mock-btn cs-mock-btn--wide">{nl ? 'Boek nu' : 'Book now'}</span>
      </div>
    )
  }
  if (kind === 'group') {
    return (
      <div className="cs-mock cs-mock--card">
        <p className="cs-mock-title">{nl ? 'Groepsaanvraag' : 'Group request'}</p>
        <div className="cs-fields">
          <span><b>{nl ? 'Aantal personen' : 'Group size'}</b><i /></span>
          <span><b>{nl ? 'Datum' : 'Date'}</b><i /></span>
          <span><b>{nl ? 'Soort uitje' : 'Kind of outing'}</b><i /></span>
        </div>
        <span className="cs-mock-btn cs-mock-btn--wide">{nl ? 'Vraag een offerte' : 'Ask for a quote'}</span>
      </div>
    )
  }
  if (kind === 'goal') {
    return (
      <div className="cs-mock cs-mock--card">
        <p className="cs-mock-title">{nl ? 'Doel' : 'Goal'}</p>
        <div className="cs-goal-rows">
          <span><b>B2C</b>{nl ? 'Boekingen van rijders' : 'Bookings from drivers'}<i className="cs-goal-bar" /></span>
          <span><b>B2B</b>{nl ? 'Aanvragen van groepen' : 'Requests from groups'}<i className="cs-goal-bar cs-goal-bar--b" /></span>
        </div>
      </div>
    )
  }
  if (kind === 'creator') {
    return (
      <div className="cs-mock cs-mock--story">
        <div className="cs-story-bars"><i /><i /><i /></div>
        <div className="cs-mock-head"><span className="cs-ava cs-ava--ring" /><p><b>{nl ? 'creator' : 'creator'}</b><span>{nl ? 'Verhaal' : 'Story'}</span></p></div>
        <span className="cs-story-product"><img src={art.site} alt="" width={640} height={400} loading="lazy" decoding="async" /></span>
        <span className="cs-mock-btn cs-mock-btn--wide">{nl ? 'Bekijk het product' : 'See the product'}</span>
      </div>
    )
  }
  if (kind === 'presale') {
    return (
      <div className="cs-mock cs-mock--card">
        <div className="cs-mock-product"><img className="cs-mock-img" src={art.site} alt="" width={64} height={64} loading="lazy" decoding="async" /><span className="cs-mock-caption"><b>{name}</b>{site && <em>{site}</em>}</span></div>
        <p className="cs-presale"><span className="cs-presale-bar"><i /></span>{nl ? 'Pre-sale uitverkocht' : 'Pre-sale sold out'}</p>
        <span className="cs-mock-btn cs-mock-btn--wide cs-mock-btn--off">{nl ? 'Uitverkocht' : 'Sold out'}</span>
      </div>
    )
  }
  if (kind === 'repeat') {
    const rows = nl ? ['Welkom', 'Hoe gaat het?', 'Tijd om bij te vullen'] : ['Welcome', 'How is it going?', 'Time to restock']
    return (
      <ol className="cs-mock cs-mock--route">
        {rows.map((row, i) => (
          <li key={row} className={i === 2 ? 'is-done' : ''}>
            <span className="cs-route-dot">{i === 2 ? <Check size={12} strokeWidth={3} /> : '✉'}</span>{row}
          </li>
        ))}
      </ol>
    )
  }
  if (kind === 'subtitle') {
    return (
      <div className="cs-mock cs-mock--vertical">
        <img className="cs-vert-face" src={art.still ?? art.site} alt="" width={360} height={640} loading="lazy" decoding="async" />
        <span className="cs-vert-sub">{nl ? 'Welkom in onze gym' : 'Welcome to our gym'}</span>
      </div>
    )
  }
  if (kind === 'tiles') {
    return (
      <div className="cs-mock cs-mock--tiles">
        {[0, 1, 2, 3].map((i) => <span key={i} className={`cs-tile cs-tile--${i}`}><img src={i % 2 ? art.site : art.still ?? art.site} alt="" width={180} height={180} loading="lazy" decoding="async" /></span>)}
      </div>
    )
  }
  if (kind === 'metrics') {
    const rows = nl ? ['Weergaven', 'Kliks', 'Aanvragen', 'Kennismakingen'] : ['Views', 'Clicks', 'Enquiries', 'Intro calls']
    return (
      <ul className="cs-mock cs-mock--route">
        {rows.map((row, i) => (
          <li key={row} className={i > 1 ? 'is-done' : ''}>
            <span className="cs-route-dot">{i > 1 ? <Check size={12} strokeWidth={3} /> : i + 1}</span>{row}
          </li>
        ))}
      </ul>
    )
  }
  return null
}

/** A local video in a phone frame. Our own cover shows until the visitor presses play. */
function PhoneVideo({ c, lang }: { c: CaseStudy; lang: Lang }) {
  const [playing, setPlaying] = useState(false)
  if (!c.video) return null
  return (
    <div className="cs-phone">
      <span className="cs-phone-notch" aria-hidden="true" />
      {playing ? (
        <video src={c.video} poster={c.videoPoster} controls autoPlay playsInline aria-label={c.videoCaption?.[lang] ?? c.name} />
      ) : (
        <button type="button" className="cs-phone-cover" onClick={() => setPlaying(true)} aria-label={`${COPY[lang].play}: ${c.videoCaption?.[lang] ?? c.name}`}>
          {c.videoPoster && <img src={c.videoPoster} alt="" width={360} height={640} loading="lazy" decoding="async" />}
          <span className="cs-phone-play" aria-hidden="true"><span /><svg width="22" height="22" viewBox="0 0 14 14"><path d="M4.2 2.4v9.2L11.8 7Z" fill="currentColor" /></svg></span>
        </button>
      )}
    </div>
  )
}

export default function CaseTemplate({ c, content: k }: { c: CaseStudy; content: CaseContent }) {
  usePageStyles(PAGES_STYLES)
  const { lang } = useLang()
  const t = COPY[lang]
  const reduce = useReducedMotion()
  const windowRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: windowRef, offset: ['start end', 'end start'] })
  const shotY = useTransform(scrollYProgress, [0, 1], ['0%', '-14%'])
  const list = cases.filter((item) => !item.unavailable)
  const next = list[(list.findIndex((item) => item.slug === c.slug) + 1) % list.length]
  const [lead, accent] = k.headline[lang]
  const arrive = useArrive(16)

  return (
    <div className="vs-page cs-page">
      <Seo title={k.seoTitle[lang]} description={c.summary[lang]} path={`/cases/${c.slug}`} />

      <section className="vs-wrap cs-hero" aria-labelledby="case-title">
        <div className="cs-hero-copy">
          <Breadcrumbs items={[{ label: t.crumb, href: '/cases' }, { label: c.name }]} />
          <SplitHeadline as="h1" id="case-title" className="vs-h1 cs-h1" parts={[{ text: lead }, { text: accent, tone: 'accent' }]} onMount />
          <motion.p className="vs-lead" {...arrive(0.55)}>{k.lead[lang]}</motion.p>
          <motion.div {...arrive(0.7)}><TextLink href="#case-steps">{t.approach}</TextLink></motion.div>
        </div>
        <motion.div
          className="cs-hero-poster vs-case-live"
          initial={reduce ? false : { opacity: 0, y: 60, rotate: 5 }}
          animate={{ opacity: 1, y: 0, rotate: 2 }}
          transition={{ type: 'spring', stiffness: 80, damping: 15, delay: 0.35 }}
          aria-hidden="true"
        >
          <CasePoster slug={c.slug} name={c.name} caption={caseHeadline(c, lang)} lang={lang} />
        </motion.div>
        <ul className="cs-stats" aria-label={t.result}>
          {k.stats.map((stat, i) => (
            <motion.li
              key={stat.label.en}
              className="cs-stat"
              initial={reduce ? false : { opacity: 0, y: 40, rotate: 0 }}
              animate={{ opacity: 1, y: 0, rotate: [-1.5, 1, -0.8][i % 3] }}
              transition={{ type: 'spring', stiffness: 110, damping: 15, delay: 0.8 + i * 0.12 }}
            >
              <span className="cs-stat-value">
                {stat.value !== undefined ? <RollingNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} /> : stat.text?.[lang]}
              </span>
              <span className="cs-stat-label">{stat.label[lang]}</span>
              <StatIcon icon={stat.icon} />
            </motion.li>
          ))}
        </ul>
      </section>

      <section className="vs-wrap vs-section cs-challenge" aria-labelledby="case-challenge">
        <Reveal as="h2" className="vs-h2" id="case-challenge">{k.challenge.title[lang]}</Reveal>
        <Reveal as="p" className="cs-challenge-body" delay={0.1}>{k.challenge.body[lang]}</Reveal>
      </section>

      {c.image && (
        <section className="vs-wrap cs-window-wrap">
          <Reveal className="cs-window" y={50}>
            <div className="cs-window-bar">
              <i /><i /><i />
              <span className="cs-window-url">{c.liveUrl ? new URL(c.liveUrl).host : c.name}</span>
              <em>{k.windowLabel[lang]}</em>
              <BotAvatar shape="verkoop" size={34} live className="cs-window-bot" />
            </div>
            <div ref={windowRef} className="cs-window-view">
              <motion.div className="cs-window-shot" style={reduce ? undefined : { y: shotY }}>
                <ResponsiveImage src={c.image} width="1900" height="1024" alt={lang === 'nl' ? `Campagne-landingspagina van ${c.name}` : `${c.name} campaign landing page`} />
              </motion.div>
            </div>
          </Reveal>
          {c.liveUrl && (
            <p className="cs-window-link">
              <a className="vs-textlink vs-textlink--arrow" href={c.liveUrl} target="_blank" rel="noopener noreferrer">{t.site}<Arrow direction="up-right" size={15} /></a>
            </p>
          )}
        </section>
      )}

      <section id="case-steps" className="vs-wrap vs-section cs-steps" aria-labelledby="case-steps-title">
        <Reveal as="h2" className="vs-h2" id="case-steps-title">{k.stepsTitle[lang]}</Reveal>
        <ol className="cs-step-grid">
          {k.steps.map((step, i) => (
            <motion.li
              key={step.title.en}
              className="cs-step"
              initial={reduce ? false : { opacity: 0, y: 90, rotate: (i - 1) * 6 }}
              whileInView={{ opacity: 1, y: 0, rotate: (i - 1) * 1.2 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ type: 'spring', stiffness: 90, damping: 15, delay: i * 0.12 }}
            >
              <div className="cs-step-screen" aria-hidden="true">
                <span className="cs-step-chip">{t.sample}</span>
                <Screen kind={step.screen} lang={lang} tags={step.tags[lang]} c={c} />
              </div>
              <p className="cs-step-num">0{i + 1}</p>
              <h3 className="cs-step-title">{step.title[lang]}</h3>
              <p className="cs-step-body">{step.body[lang]}</p>
              <ul className="cs-tags">{step.tags[lang].map((tag, j) => <li key={tag} className={`cs-tag cs-tag--${(i + j) % 4}`}>{tag}</li>)}</ul>
              <Link className="vs-textlink vs-textlink--arrow cs-step-link" to={step.link}>{t.more}<Arrow size={15} /></Link>
            </motion.li>
          ))}
        </ol>
      </section>

      {k.proof && (k.proof.media === 'stamp' || c.video) && (
        <section className="vs-wrap vs-section cs-proof" aria-labelledby="case-proof">
          <div className="cs-proof-copy">
            <Reveal as="h2" className="cs-proof-title" id="case-proof">
              {k.proof.lead[lang]} <span className="vs-mark"><span className="vs-mark-bg" aria-hidden="true" />{k.proof.figure[lang]}</span>
            </Reveal>
            <Reveal as="p" className="vs-lead" delay={0.1}>{k.proof.body[lang]}</Reveal>
          </div>
          <div className="cs-proof-phone">
            <HandNote point="down-right" className="cs-proof-note">{k.proof.note[lang]}</HandNote>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 60, rotate: -6 }}
              whileInView={{ opacity: 1, y: 0, rotate: -2.5 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ type: 'spring', stiffness: 80, damping: 14 }}
            >
              {k.proof.media === 'stamp' ? (
                <div className="cs-stamp-card vs-case-live" aria-hidden="true">
                  <CasePoster slug={c.slug} name={c.name} caption={caseHeadline(c, lang)} lang={lang} />
                  <motion.span
                    className="cs-stamp"
                    initial={reduce ? false : { scale: 2.2, opacity: 0, rotate: -24 }}
                    whileInView={{ scale: 1, opacity: 1, rotate: -12 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.5 }}
                  >
                    {k.proof.figure[lang].replace(/\.$/, '')}
                  </motion.span>
                </div>
              ) : (
                <PhoneVideo c={c} lang={lang} />
              )}
            </motion.div>
          </div>
        </section>
      )}

      <section className="vs-wrap cs-evidence" aria-labelledby="case-evidence">
        <h2 id="case-evidence" className="cs-evidence-label">{t.evidence}</h2>
        <p>{k.evidence[lang]}</p>
      </section>

      {next && next.slug !== c.slug && (
        <section className="vs-wrap vs-section cs-next" aria-label={t.next}>
          <Link to={`/cases/${next.slug}`} className="cs-next-link vs-case-live" onClick={() => trackEvent('case_viewed', { case: next.slug, placement: `case_${c.slug}_next` })}>
            <span className="cs-next-copy">
              <HandNote point="down-right" className="cs-next-note">{lang === 'nl' ? 'nog eentje :)' : 'one more :)'}</HandNote>
              <span className="cs-next-label">{t.next}<Go /></span>
              <span className="cs-next-name">{next.name}</span>
              <span className="cs-next-result">{caseHeadline(next, lang)}</span>
            </span>
            <span className="cs-next-poster cs-next-shot"><img src={ASSETS[next.slug].site} alt="" width={640} height={400} loading="lazy" decoding="async" /></span>
          </Link>
        </section>
      )}

      <section className="vs-wrap vs-section" aria-labelledby="case-closing">
        <div className="vs-closing">
          <h2 id="case-closing" className="vs-h2">{k.closing.title[lang]}</h2>
          <p className="vs-lead">{k.closing.body[lang]}</p>
          <div className="vs-closing-actions">
            <Cta to="/contact" onClick={() => trackEvent('audit_cta_clicked', { placement: `case_${c.slug}` })}>{k.closing.cta[lang]}</Cta>
            <TextLink to="/cases">{t.others}</TextLink>
          </div>
        </div>
      </section>
    </div>
  )
}
