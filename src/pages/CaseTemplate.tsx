import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { Check } from 'lucide-react'
import { useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import Seo from '../components/Seo'
import Arrow from '../components/brand/Arrow'
import BotAvatar from '../components/brand/BotAvatar'
import Cta from '../components/brand/Cta'
import HandNote from '../components/brand/HandNote'
import Reveal from '../components/brand/Reveal'
import RollingNumber from '../components/brand/RollingNumber'
import SplitHeadline from '../components/brand/SplitHeadline'
import TextLink from '../components/brand/TextLink'
import { EASE } from '../components/brand/motion'
import CasePoster from '../components/home/CasePoster'
import ResponsiveImage from '../components/ResponsiveImage'
import type { CaseContent, CaseScreen, CaseStat } from '../data/caseContent'
import { cases } from '../data/cases'
import type { CaseStudy, Lang } from '../data/types'
import { trackEvent } from '../lib/analytics'
import { PAGES_STYLES, usePageStyles } from '../lib/deferredStyles'
import { useLang } from '../i18n/LanguageContext'

const COPY = {
  nl: { crumb: 'Cases', approach: 'Bekijk de aanpak', site: 'Bekijk de website', more: 'Meer over deze aanpak', sample: 'Voorbeeld', play: 'Speel de video af', evidence: 'Wat deze case laat zien', next: 'Volgende case', others: 'Bekijk andere cases', result: 'Resultaat' },
  en: { crumb: 'Cases', approach: 'See the approach', site: 'View the website', more: 'More about this approach', sample: 'Sample', play: 'Play the video', evidence: 'What this case shows', next: 'Next case', others: 'See other cases', result: 'Result' },
}

/** Published results, shown on the next-case poster. */
const RESULT: Record<string, { nl: string; en: string }> = {
  pinacello: { nl: '+120% online omzet', en: '+120% online revenue' },
  nooms: { nl: 'Pre-sale volledig uitverkocht', en: 'Pre-sale sold out' },
}

function StatIcon({ icon }: { icon: CaseStat['icon'] }) {
  if (icon === 'play') return <span className="cs-stat-icon cs-stat-icon--play"><svg width="12" height="12" viewBox="0 0 14 14"><path d="M4 2.5v9l7.5-4.5Z" fill="currentColor" /></svg></span>
  if (icon === 'pulse') return <span className="cs-stat-icon cs-stat-icon--pulse"><i /></span>
  return (
    <svg className="cs-spark" viewBox="0 0 80 28" aria-hidden="true">
      <path d="M2 24 14 20 24 22 36 14 48 16 60 8 78 3" pathLength={1} />
    </svg>
  )
}

/* Sample screens: skeleton content and real labels only, each marked as a sample. */
function Screen({ kind, lang, tags }: { kind: CaseScreen; lang: Lang; tags: string[] }) {
  const nl = lang === 'nl'
  if (kind === 'ad') {
    return (
      <div className="cs-mock cs-mock--ad">
        <div className="cs-mock-head"><span className="cs-ava">P</span><p><b>Pinacello</b><span>{nl ? 'Gesponsord' : 'Sponsored'}</span></p></div>
        <div className="cs-mock-media"><span className="cs-play-s"><svg width="14" height="14" viewBox="0 0 14 14"><path d="M4 2.5v9l7.5-4.5Z" fill="currentColor" /></svg></span></div>
        <div className="cs-mock-foot"><span className="cs-lines"><i /><i /></span><span className="cs-mock-btn">{nl ? 'Shop nu' : 'Shop now'}</span></div>
      </div>
    )
  }
  if (kind === 'page') {
    return (
      <div className="cs-mock cs-mock--page">
        <div className="cs-mock-product"><span className="cs-mock-img" /><span className="cs-lines"><i /><i /><i /></span></div>
        <div className="cs-bundles">
          <span><b>1×</b><i /></span>
          <span className="is-on"><b>2×</b><i /><em>{nl ? 'Populair' : 'Popular'}</em></span>
          <span><b>3×</b><i /></span>
        </div>
        <span className="cs-mock-btn cs-mock-btn--wide">{nl ? 'Bestel nu' : 'Order now'}</span>
      </div>
    )
  }
  const steps = nl ? ['Bekeken', 'In het mandje', 'Herinnering', 'Betaald'] : ['Viewed', 'In the cart', 'Reminder', 'Paid']
  return (
    <ol className="cs-mock cs-mock--route">
      {steps.map((step, i) => (
        <li key={step} className={i === 3 ? 'is-done' : ''} style={{ '--i': i } as CSSProperties}>
          <span className="cs-route-dot">{i === 3 ? <Check size={12} strokeWidth={3} /> : i + 1}</span>{step}
          {i === 2 && <em>{tags[0]}</em>}
        </li>
      ))}
    </ol>
  )
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
  const arrive = (delay: number) => (reduce ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease: EASE } })

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
          <CasePoster slug={c.slug} name={c.name} caption={RESULT[c.slug]?.[lang] ?? c.sector[lang]} lang={lang} />
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
              key={step.link}
              className="cs-step"
              initial={reduce ? false : { opacity: 0, y: 90, rotate: (i - 1) * 6 }}
              whileInView={{ opacity: 1, y: 0, rotate: (i - 1) * 1.2 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ type: 'spring', stiffness: 90, damping: 15, delay: i * 0.12 }}
            >
              <div className="cs-step-screen" aria-hidden="true">
                <span className="cs-step-chip">{t.sample}</span>
                <Screen kind={step.screen} lang={lang} tags={step.tags[lang]} />
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

      {k.proof && c.video && (
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
              <PhoneVideo c={c} lang={lang} />
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
              <span className="cs-next-label">{t.next}<Arrow size={18} /></span>
              <span className="cs-next-name">{next.name}</span>
              <span className="cs-next-result">{RESULT[next.slug]?.[lang] ?? next.sector[lang]}</span>
            </span>
            <span className="cs-next-poster"><CasePoster slug={next.slug} name={next.name} caption={RESULT[next.slug]?.[lang] ?? next.sector[lang]} lang={lang} /></span>
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
