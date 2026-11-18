import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { Check } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import QualificationForm from '../components/QualificationForm'
import Seo from '../components/Seo'
import WebsiteStage from '../components/WebsiteStage'
import Arrow from '../components/brand/Arrow'
import Cta from '../components/brand/Cta'
import HandNote from '../components/brand/HandNote'
import Reveal from '../components/brand/Reveal'
import SplitHeadline, { type HeadlinePart } from '../components/brand/SplitHeadline'
import TextLink from '../components/brand/TextLink'
import { EASE } from '../components/brand/motion'
import CasePoster from '../components/home/CasePoster'
import { getCase } from '../data/cases'
import { getService } from '../data/services'
import type { Bi, CaseSlug, Lang, ServiceSlug } from '../data/types'
import { trackEvent } from '../lib/analytics'
import { PAGES_STYLES, usePageStyles } from '../lib/deferredStyles'
import { useInView } from '../lib/useInView'
import { useLang } from '../i18n/LanguageContext'

const COPY = {
  nl: {
    servicesCrumb: 'Diensten',
    cta: 'Bespreek jouw aanpak',
    reply: 'Je hoort binnen 24 uur van ons.',
    planWin: 'Jouw plan',
    planChip: 'Wat erin zit',
    problemLabel: 'Waar het vastloopt',
    howLabel: 'Zo werkt het',
    howTitle: 'Drie stappen. Jij ziet elke stap.',
    processTitle: 'Zo werken we',
    deliverablesLabel: 'Wat je krijgt',
    proofLabel: 'Echt resultaat',
    view: 'Lees de case',
    partnerLabel: 'Gerelateerd project',
    sample: 'Voorbeeld',
    formTitle: 'Vertel ons over je project',
    formNote: 'we lezen alles :)',
  },
  en: {
    servicesCrumb: 'Services',
    cta: 'Discuss your approach',
    reply: 'You’ll hear from us within 24 hours.',
    planWin: 'Your plan',
    planChip: 'What’s included',
    problemLabel: 'Where it gets stuck',
    howLabel: 'How it works',
    howTitle: 'Three steps. You see every one.',
    processTitle: 'How we work',
    deliverablesLabel: 'What you get',
    proofLabel: 'Real result',
    view: 'Read the case',
    partnerLabel: 'Related project',
    sample: 'Sample',
    formTitle: 'Tell us about your project',
    formNote: 'we read everything :)',
  },
}

/** Short headlines: what the service does for you, eight words at most. The second part is the blue chip. */
const HEADLINE: Record<ServiceSlug, Bi<[string, string]>> = {
  'meta-ads': { nl: ['Meta Ads die', 'verkopen.'], en: ['Meta Ads that', 'sell.'] },
  'google-ads': { nl: ['Gevonden wanneer ze', 'zoeken.'], en: ['Found when they', 'search.'] },
  'landing-pages': { nl: ['Eén pagina.', 'Eén actie.'], en: ['One page.', 'One action.'] },
  funnels: { nl: ['Van klik tot', 'klant.'], en: ['From click to', 'customer.'] },
  'ecommerce-conversie': { nl: ['Meer bezoekers die', 'afrekenen.'], en: ['More visitors who', 'check out.'] },
  'ai-automatiseringen': { nl: ['Opvolging die', 'vanzelf loopt.'], en: ['Follow-up that', 'runs itself.'] },
  distributie: { nl: ['Je aanbod op de', 'juiste plek.'], en: ['Your offer in the', 'right place.'] },
  'email-marketing': { nl: ['E-mails die klanten', 'terugbrengen.'], en: ['Emails that bring customers', 'back.'] },
  'data-analytics': { nl: ['Zie wat je', 'groei drijft.'], en: ['See what drives your', 'growth.'] },
  websites: { nl: ['Websites die', 'aanvragen opleveren.'], en: ['Websites that bring in', 'enquiries.'] },
  software: { nl: ['Software op', 'maat.'], en: ['Software built', 'for you.'] },
}

/** Published results only, as on the cases page. */
const CASE_RESULT: Partial<Record<CaseSlug, Bi<string>>> = {
  pinacello: { nl: '+120% online omzet', en: '+120% online revenue' },
  nooms: { nl: 'Pre-sale volledig uitverkocht', en: 'Pre-sale sold out' },
}

function leadIn(lang: Lang, slug: ServiceSlug) {
  if (slug === 'websites') {
    return lang === 'nl' ? 'Vul je gegevens in. We sturen een voorstel met scope en budget.' : 'Add your details. We’ll send a proposal with scope and budget.'
  }
  return lang === 'nl'
    ? 'Vertel ons waar je nu staat. We bekijken je situatie en zeggen welke aanpak past.'
    : 'Tell us where you stand. We’ll look at your situation and say which approach fits.'
}

/* ------------------------------------------------------------------ */
/* Sample screens. Every name and figure is invented; each says so.   */
/* ------------------------------------------------------------------ */

function Win({ title, chip, children, className = '' }: { title: string; chip: string; children: ReactNode; className?: string }) {
  return (
    <div className={`sv-win ${className}`.trim()}>
      <div className="sv-win-bar"><i /><i /><i /><b>{title}</b><em>{chip}</em></div>
      <div className="sv-win-body">{children}</div>
    </div>
  )
}

const META = {
  nl: {
    tree: {
      win: 'Advertentiebeheer', goal: 'Doel: verkopen',
      rows: [['Koud', 'Nieuwe mensen · 25–55 · Oost-Vlaanderen', '€ 20 / dag', 56], ['Warm', 'Bezocht je site · laatste 30 dagen', '€ 10 / dag', 28], ['Retargeting', 'Mandje niet afgerond', '€ 6 / dag', 16]] as [string, string, string, number][],
    },
    ads: [
      { stage: 'Koud', text: 'Maak kennis in 20 seconden.', cta: 'Meer info', tone: 'video' },
      { stage: 'Warm', text: 'Zo werkt het, stap voor stap.', cta: 'Bekijk', tone: 'steps' },
      { stage: 'Retargeting', text: 'Je mandje wacht nog op je.', cta: 'Afrekenen', tone: 'cart' },
    ],
    page: 'Jouw merk', sponsored: 'Gesponsord',
    table: {
      win: 'Maandrapport', head: ['Campagne', 'Uitgaven', 'Verkopen', 'Per euro'],
      rows: [['Koud', '€ 600', '14', '3,1×'], ['Warm', '€ 300', '11', '4,6×'], ['Retargeting', '€ 180', '9', '6,2×']],
      advice: 'Advies: zet € 100 meer op retargeting',
    },
    toast: 'Nieuwe verkoop', toastSrc: 'via Instagram',
    steps: [
      { title: 'Doelgroep en structuur', body: 'We bouwen je campagnes rond één doel: aanvragen, boekingen of verkopen.' },
      { title: 'Creatives per fase', body: 'Wie je nog niet kent, krijgt een ander bericht dan wie al twijfelt.' },
      { title: 'Meten op verkopen', body: 'Elke maand zie je wat een euro advertentie opbracht. Niet alleen kliks.' },
    ],
    proof: { lead: 'Eén organische video.', figure: '20 verkopen.', body: 'Voor Pinacello maakten we een video die zonder advertentiebudget twintig verkopen opleverde. Die video werd daarna de basis voor de campagnes.', bodyShort: 'Pinacello, ecommerce' },
  },
  en: {
    tree: {
      win: 'Ads Manager', goal: 'Goal: sales',
      rows: [['Cold', 'New people · 25–55 · East Flanders', '€ 20 / day', 56], ['Warm', 'Visited your site · last 30 days', '€ 10 / day', 28], ['Retargeting', 'Cart not finished', '€ 6 / day', 16]] as [string, string, string, number][],
    },
    ads: [
      { stage: 'Cold', text: 'Meet us in 20 seconds.', cta: 'Learn more', tone: 'video' },
      { stage: 'Warm', text: 'How it works, step by step.', cta: 'Watch', tone: 'steps' },
      { stage: 'Retargeting', text: 'Your cart is still waiting.', cta: 'Check out', tone: 'cart' },
    ],
    page: 'Your brand', sponsored: 'Sponsored',
    table: {
      win: 'Monthly report', head: ['Campaign', 'Spend', 'Sales', 'Per euro'],
      rows: [['Cold', '€ 600', '14', '3.1×'], ['Warm', '€ 300', '11', '4.6×'], ['Retargeting', '€ 180', '9', '6.2×']],
      advice: 'Advice: put € 100 more on retargeting',
    },
    toast: 'New sale', toastSrc: 'from Instagram',
    steps: [
      { title: 'Audience and structure', body: 'We build your campaigns around one goal: enquiries, bookings or sales.' },
      { title: 'Creatives per stage', body: 'People who don’t know you yet get a different message from people who are close to buying.' },
      { title: 'Measured on sales', body: 'Every month you see what a euro of ads brought in. Not just clicks.' },
    ],
    proof: { lead: 'One organic video.', figure: '20 sales.', body: 'For Pinacello we made a video that brought in twenty sales without any ad budget. That video then became the base for the campaigns.', bodyShort: 'Pinacello, ecommerce' },
  },
}

function AdCard({ ad, lang }: { ad: (typeof META)['nl']['ads'][number]; lang: Lang }) {
  const m = META[lang]
  return (
    <div className="sv-ad">
      <div className="sv-ad-head"><span className="sv-ava">v.</span><p><b>{m.page}</b><span>{m.sponsored}</span></p><span className="sv-stage">{ad.stage}</span></div>
      <div className={`sv-ad-img sv-ad-img--${ad.tone}`} aria-hidden="true">
        {ad.tone === 'video' && <span className="sv-play"><svg width="16" height="16" viewBox="0 0 14 14"><path d="M4 2.5v9l7.5-4.5Z" fill="currentColor" /></svg></span>}
        {ad.tone === 'steps' && <span className="sv-ad-steps"><i>1</i><i>2</i><i>3</i></span>}
        {ad.tone === 'cart' && <span className="sv-ad-cart"><i /><i /><b>1</b></span>}
      </div>
      <div className="sv-ad-foot"><p>{ad.text}</p><span className="sv-btn">{ad.cta}</span></div>
    </div>
  )
}

function CampaignTree({ lang }: { lang: Lang }) {
  const t = META[lang].tree
  return (
    <Win title={t.win} chip={COPY[lang].sample}>
      <p className="sv-goal"><span className="sv-pulse" />{t.goal}</p>
      <ul className="sv-tree">
        {t.rows.map(([stage, who, budget, share], i) => (
          <li key={stage} style={{ '--w': `${share}%`, '--d': `${0.2 + i * 0.12}s` } as CSSProperties}>
            <b>{stage}</b><span>{who}</span><em>{budget}</em><i className="sv-bar" />
          </li>
        ))}
      </ul>
    </Win>
  )
}

function CreativeSet({ lang }: { lang: Lang }) {
  return (
    <Win title="Instagram · Facebook" chip={COPY[lang].sample}>
      <div className="sv-ads">{META[lang].ads.map((ad) => <AdCard key={ad.stage} ad={ad} lang={lang} />)}</div>
    </Win>
  )
}

function ResultTable({ lang }: { lang: Lang }) {
  const t = META[lang].table
  return (
    <Win title={t.win} chip={COPY[lang].sample}>
      <table className="sv-table">
        <thead><tr>{t.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
        <tbody>{t.rows.map((row) => <tr key={row[0]}>{row.map((cell, i) => (i === 0 ? <th key={i} scope="row">{cell}</th> : <td key={i}>{cell}</td>))}</tr>)}</tbody>
      </table>
      <p className="sv-advice"><span>★</span>{t.advice}</p>
    </Win>
  )
}

/** Meta Ads hero: a phone with one sample ad, and a sale arriving from it. */
function MetaHero({ lang }: { lang: Lang }) {
  const m = META[lang]
  const reduce = useReducedMotion()
  return (
    <div className="sv-hero-visual sv-phone-stage" aria-hidden="true">
      <motion.div className="sv-phone" initial={reduce ? false : { opacity: 0, y: 50, rotate: 6 }} animate={{ opacity: 1, y: 0, rotate: 2.5 }} transition={{ type: 'spring', stiffness: 90, damping: 16, delay: 0.5 }}>
        <span className="sv-phone-notch" />
        <span className="sv-phone-chip">{COPY[lang].sample}</span>
        <AdCard ad={m.ads[0]} lang={lang} />
        <div className="sv-feed-ghost"><i /><i /><i /></div>
      </motion.div>
      <motion.div className="sv-toast" initial={reduce ? false : { opacity: 0, x: -30, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 160, damping: 16, delay: 1.3 }}>
        <span className="sv-toast-dot"><Check size={14} strokeWidth={2.6} /></span>
        <b>{m.toast}<em>{m.toastSrc}</em></b>
      </motion.div>
    </div>
  )
}

/** Every other service: the real list of what you get, ticked off one by one. */
function PlanCard({ items, lang }: { items: string[]; lang: Lang }) {
  const reduce = useReducedMotion()
  const t = COPY[lang]
  return (
    <motion.div className="sv-hero-visual" initial={reduce ? false : { opacity: 0, x: 50, rotate: 4 }} animate={{ opacity: 1, x: 0, rotate: 1.5 }} transition={{ type: 'spring', stiffness: 90, damping: 16, delay: 0.5 }}>
      <Win title={t.planWin} chip={t.planChip} className="sv-plan">
        <ul className="sv-plan-list">
          {items.map((item, i) => (
            <motion.li key={item} initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.9 + i * 0.14, ease: EASE }}>
              <span className="sv-tick"><Check size={13} strokeWidth={2.6} /></span>{item}
            </motion.li>
          ))}
        </ul>
      </Win>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* How it works: pinned on wide screens, a plain list otherwise.      */
/* ------------------------------------------------------------------ */

const STEP_SCREENS: Partial<Record<ServiceSlug, ((props: { lang: Lang }) => ReactNode)[]>> = {
  'meta-ads': [CampaignTree, CreativeSet, ResultTable],
}
const STEP_COPY: Partial<Record<ServiceSlug, Bi<{ title: string; body: string }[]>>> = {
  'meta-ads': { nl: META.nl.steps, en: META.en.steps },
}

function useWide() {
  const [wide, setWide] = useState(true)
  useEffect(() => {
    const query = window.matchMedia('(min-width: 900px)')
    const update = () => setWide(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return wide
}

function HowItWorks({ slug, lang }: { slug: ServiceSlug; lang: Lang }) {
  const screens = STEP_SCREENS[slug]!
  const steps = STEP_COPY[slug]![lang]
  const t = COPY[lang]
  const reduce = useReducedMotion()
  const wide = useWide()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [step, setStep] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (p) => setStep(Math.min(steps.length - 1, Math.max(0, Math.floor(p * steps.length * 0.999)))))

  const head = (
    <>
      <p className="vs-label">{t.howLabel}</p>
      <h2 className="vs-h2 sv-how-title">{t.howTitle}</h2>
    </>
  )

  if (reduce || !wide) {
    return (
      <section className="vs-wrap vs-section sv-how sv-how--list" aria-label={t.howLabel}>
        {head}
        <ol className="sv-how-list">
          {steps.map((s, i) => {
            const Screen = screens[i]
            return (
              <Reveal as="li" key={s.title} y={30}>
                <p className="sv-how-num">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="sv-how-step">{s.title}</h3>
                <p className="sv-how-body">{s.body}</p>
                <div className="sv-how-screen" aria-hidden="true"><Screen lang={lang} /></div>
              </Reveal>
            )
          })}
        </ol>
      </section>
    )
  }

  const jump = (i: number) => {
    const el = ref.current
    if (!el) return
    const span = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + span * ((i + 0.5) / steps.length), behavior: 'smooth' })
  }

  return (
    <section ref={ref} className="sv-how sv-how--pinned" aria-label={t.howLabel} style={{ height: `${steps.length * 80 + 60}vh` }}>
      <div className="sv-how-sticky">
        <div className="vs-wrap sv-how-grid">
          <div className="sv-how-side">
            {head}
            <ol className="sv-how-index">
              {steps.map((s, i) => (
                <li key={s.title}>
                  <button type="button" className={i === step ? 'is-on' : i < step ? 'is-past' : ''} aria-current={i === step ? 'step' : undefined} onClick={() => jump(i)}>
                    <span className="sv-how-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="sv-how-step">{s.title}</span>
                    <span className="sv-how-body">{s.body}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
          <div className="sv-how-stage" aria-hidden="true">
            {screens.map((Screen, i) => {
              const depth = step - i
              return (
                <motion.div
                  key={i}
                  className="sv-how-slot"
                  initial={false}
                  animate={depth < 0 ? { y: '110%', rotate: 4, opacity: 0 } : { y: -depth * 22, rotate: depth === 0 ? -1 : -2 - depth, scale: 1 - depth * 0.05, opacity: depth > 1 ? 0 : 1 }}
                  transition={{ type: 'spring', stiffness: 140, damping: 20 }}
                  style={{ zIndex: i + 1 }}
                >
                  <Screen lang={lang} />
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

export default function ServicePage({ slug }: { slug: ServiceSlug }) {
  usePageStyles(PAGES_STYLES)
  const service = getService(slug)
  const { lang } = useLang()
  const t = COPY[lang]
  const reduce = useReducedMotion()
  const { ref } = useInView<HTMLDivElement>(() => trackEvent('service_viewed', { service: slug, placement: 'page' }))

  if (!service) return null
  const relatedCase = service.relatedCase ? getCase(service.relatedCase) : undefined
  const [lead, accent] = HEADLINE[slug][lang]
  const parts: HeadlinePart[] = [{ text: lead }, { text: accent, tone: 'accent' }]
  const pinned = Boolean(STEP_SCREENS[slug])
  const arrive = (delay: number) => (reduce ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease: EASE } })

  return (
    <div ref={ref} className="vs-page sv-page">
      <Seo title={service.title[lang]} description={service.summary[lang]} path={`/${service.slug}`} />

      <section className="vs-wrap sv-hero" aria-labelledby="service-title">
        <div className="sv-hero-copy">
          <Breadcrumbs items={[{ label: t.servicesCrumb, href: '/#expertise' }, { label: service.title[lang] }]} />
          <SplitHeadline as="h1" id="service-title" className="vs-h1 sv-h1" parts={parts} onMount />
          <motion.p className="vs-lead" {...arrive(0.55)}>{service.summary[lang]}</motion.p>
          {slug === 'meta-ads' && (
            <motion.ul className="sv-chips" {...arrive(0.7)}>
              {service.includes[lang].map((item) => <li key={item}>{item.charAt(0).toUpperCase() + item.slice(1)}</li>)}
            </motion.ul>
          )}
          <motion.div className="sv-hero-actions" {...arrive(0.85)}>
            <Cta href="#audit-formulier-section" onClick={() => trackEvent('audit_cta_clicked', { placement: 'service_hero', service: slug })}>{t.cta}</Cta>
            <span className="sv-reply">{t.reply}</span>
          </motion.div>
        </div>
        {slug === 'websites' ? <WebsiteStage lang={lang} /> : slug === 'meta-ads' ? <MetaHero lang={lang} /> : <PlanCard items={service.includes[lang].map((item) => item.charAt(0).toUpperCase() + item.slice(1))} lang={lang} />}
      </section>

      {slug !== 'websites' && (
        <section className="vs-wrap vs-section sv-problem" aria-labelledby="service-problem">
          <h2 className="vs-label sv-problem-label" id="service-problem">{t.problemLabel}</h2>
          <Reveal as="p" className="sv-problem-text">{service.problem[lang]}</Reveal>
        </section>
      )}

      {pinned ? (
        <HowItWorks slug={slug} lang={lang} />
      ) : (
        <section className="vs-wrap vs-section sv-process" aria-labelledby="service-process">
          <h2 id="service-process" className="vs-h2">{t.processTitle}</h2>
          <ol className="sv-process-list">
            {service.process[lang].map((step, i) => (
              <Reveal as="li" key={step} delay={(i % 3) * 0.08} y={26}>
                <span className="sv-how-num">{String(i + 1).padStart(2, '0')}</span>
                <p>{step}</p>
              </Reveal>
            ))}
          </ol>
        </section>
      )}

      {slug !== 'websites' && (
        <section className="vs-wrap vs-section sv-deliver" aria-labelledby="service-deliver">
          <h2 id="service-deliver" className="vs-h2">{t.deliverablesLabel}</h2>
          <ul className="sv-deliver-list">
            {service.deliverables[lang].map((item) => <li key={item}><span className="sv-tick"><Check size={13} strokeWidth={2.6} /></span>{item}</li>)}
          </ul>
        </section>
      )}

      {slug === 'meta-ads' ? (
        <section className="vs-wrap vs-section" aria-labelledby="service-proof">
          <Link to="/cases/pinacello" className="sv-proof sv-proof--video" onClick={() => trackEvent('case_viewed', { case: 'pinacello', placement: 'service_page' })}>
            <span className="sv-proof-thumb">
              <img src="/images/ads/pinacello-personal.jpg" alt="" width={360} height={450} loading="lazy" decoding="async" />
              <span className="sv-play" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 14 14"><path d="M4 2.5v9l7.5-4.5Z" fill="currentColor" /></svg></span>
            </span>
            <span className="sv-proof-copy">
              <span className="vs-label">{t.proofLabel} · {META[lang].proof.bodyShort}</span>
              <span id="service-proof" className="sv-proof-title">{META[lang].proof.lead} <span className="vs-mark"><span className="vs-mark-bg" aria-hidden="true" />{META[lang].proof.figure}</span></span>
              <span className="sv-proof-body">{META[lang].proof.body}</span>
              <span className="vs-textlink vs-textlink--arrow">{t.view}<Arrow size={15} /></span>
            </span>
          </Link>
        </section>
      ) : relatedCase ? (
        <section className="vs-wrap vs-section" aria-labelledby="service-proof">
          <Link to={`/cases/${relatedCase.slug}`} className="sv-proof vs-case-live" onClick={() => trackEvent('case_viewed', { case: relatedCase.slug, placement: 'service_page' })}>
            <span className="sv-proof-frame"><CasePoster slug={relatedCase.slug} name={relatedCase.name} caption={CASE_RESULT[relatedCase.slug]?.[lang] ?? relatedCase.sector[lang]} lang={lang} /></span>
            <span className="sv-proof-copy">
              <span className="vs-label">{t.proofLabel}</span>
              <span id="service-proof" className="sv-proof-title">{relatedCase.name}</span>
              <span className="sv-proof-result">{CASE_RESULT[relatedCase.slug]?.[lang] ?? relatedCase.sector[lang]}</span>
              <span className="sv-proof-body">{relatedCase.summary[lang]}</span>
              <span className="vs-textlink vs-textlink--arrow">{t.view}<Arrow size={15} /></span>
            </span>
          </Link>
        </section>
      ) : null}

      {service.partnerCase && slug !== 'websites' && (
        <section className="vs-wrap sv-partner-wrap" aria-label={t.partnerLabel}>
          <a className="sv-partner" href={service.partnerCase.url} target="_blank" rel="noopener noreferrer">
            <span className="vs-label">{t.partnerLabel}</span>
            <span className="sv-partner-name">{service.partnerCase.name}<Arrow direction="up-right" size={18} /></span>
            <span className="sv-partner-body">{service.partnerCase.description[lang]}</span>
          </a>
        </section>
      )}

      <section id="audit-formulier-section" className="vs-wrap vs-section sv-close" aria-labelledby="service-form-title">
        <div className="sv-close-intro">
          <h2 id="service-form-title" className="vs-h2">{t.formTitle}</h2>
          <p className="vs-lead">{leadIn(lang, slug)}</p>
          <p className="sv-close-who">
            <span className="sv-ava sv-ava--lg" aria-hidden="true">SK</span>
            <span><strong>Stef Keppens</strong><span>Lochristi · <TextLink href="mailto:stef@verkoop.studio" arrow={false}>stef@verkoop.studio</TextLink></span></span>
          </p>
          <HandNote point="down-left" className="sv-close-note">{t.formNote}</HandNote>
        </div>
        <div className="sv-close-form">
          <QualificationForm id={`audit-formulier-${service.slug}`} inquiryContext={lang === 'nl' ? `Dienst: ${service.title[lang]}` : `Service: ${service.title[lang]}`} />
        </div>
      </section>
    </div>
  )
}
