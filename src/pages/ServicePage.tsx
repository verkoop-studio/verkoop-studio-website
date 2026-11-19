import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { Check } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import QualificationForm from '../components/QualificationForm'
import Seo from '../components/Seo'
import WebsiteStage from '../components/WebsiteStage'
import Arrow, { Go } from '../components/brand/Arrow'
import { useArrive } from '../components/brand/useArrive'
import AudienceRows from '../components/brand/AudienceRows'
import Cta from '../components/brand/Cta'
import HandNote from '../components/brand/HandNote'
import Reveal from '../components/brand/Reveal'
import SplitHeadline, { type HeadlinePart } from '../components/brand/SplitHeadline'
import { headlineFit } from '../lib/headline'
import TextLink from '../components/brand/TextLink'
import CasePoster from '../components/home/CasePoster'
import ApprovalCards from '../components/service/ApprovalCards'
import FaqList from '../components/brand/FaqList'
import WorksWith from '../components/brand/WorksWith'
import { faqItems } from '../data/faq'
import { serviceExtras } from '../data/serviceExtras'
import { services } from '../data/services'
import ServiceScreenView, { AdCard } from '../components/service/ServiceScreens'
import { serviceStories, type ServiceScreen, type ServiceStep } from '../data/serviceSteps'
import { caseHeadline, getCase } from '../data/cases'
import { getService } from '../data/services'
import type { Bi, Lang, ServiceSlug } from '../data/types'
import { trackEvent } from '../lib/analytics'
import { PAGES_STYLES, usePageStyles } from '../lib/deferredStyles'
import { useInView } from '../lib/useInView'
import { useLang } from '../i18n/LanguageContext'
import { useWide } from '../lib/useWide'

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
    whoTitle: 'Voor wie',
    faqTitle: 'Vragen over deze dienst',
    nextLabel: 'Volgende dienst',
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
    whoTitle: 'Who it is for',
    faqTitle: 'Questions about this service',
    nextLabel: 'Next service',
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

function leadIn(lang: Lang, slug: ServiceSlug) {
  if (slug === 'websites') {
    return lang === 'nl' ? 'Vul je gegevens in. We sturen een voorstel met scope en budget.' : 'Add your details. We’ll send a proposal with scope and budget.'
  }
  return lang === 'nl'
    ? 'Vertel ons waar je nu staat. We bekijken je situatie en zeggen welke aanpak past.'
    : 'Tell us where you stand. We’ll look at your situation and say which approach fits.'
}

const PROOF = {
  nl: { lead: 'Eén organische video.', figure: '20 verkopen.', body: 'Voor Pinacello maakten we een video die zonder advertentiebudget twintig verkopen opleverde. Die video werd daarna de basis voor de campagnes.', short: 'Pinacello, ecommerce' },
  en: { lead: 'One organic video.', figure: '20 sales.', body: 'For Pinacello we made a video that brought in twenty sales without any ad budget. That video then became the base for the campaigns.', short: 'Pinacello, ecommerce' },
}

/** Meta Ads hero: a phone with one sample ad. */
function MetaHero({ lang }: { lang: Lang }) {
  const reduce = useReducedMotion()
  return (
    <div className="sv-hero-visual sv-phone-stage" aria-hidden="true">
      <motion.div className="sv-phone" initial={reduce ? false : { opacity: 0, y: 50, rotate: 6 }} animate={{ opacity: 1, y: 0, rotate: 2.5 }} transition={{ type: 'spring', stiffness: 90, damping: 16, delay: 0.5 }}>
        <span className="sv-phone-notch" />
        <span className="sv-phone-chip">{COPY[lang].sample}</span>
        <AdCard index={0} lang={lang} art="healthfactor-still" />
      </motion.div>
    </div>
  )
}

/** Every other service: its own sample screen, tilted. */
function HeroObject({ screen, lang }: { screen: ServiceScreen; lang: Lang }) {
  const reduce = useReducedMotion()
  return (
    <div className="sv-hero-visual sv-hero-object" aria-hidden="true">
      <motion.div initial={reduce ? false : { opacity: 0, x: 50, rotate: 5 }} animate={{ opacity: 1, x: 0, rotate: 1.5 }} transition={{ type: 'spring', stiffness: 90, damping: 16, delay: 0.5 }}>
        <ServiceScreenView screen={screen} lang={lang} />
      </motion.div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* How it works: pinned on wide screens, a plain list otherwise.      */
/* ------------------------------------------------------------------ */

function HowItWorks({ steps: story, lang }: { steps: ServiceStep[]; lang: Lang }) {
  const steps = story.map((item) => ({ title: item.title[lang], body: item.body[lang], screen: item.screen }))
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
      <h2 className="vs-h2 sv-how-title" id="service-process">{t.processTitle}</h2>
      <p className="sv-how-lead">{t.howTitle}</p>
    </>
  )

  if (reduce || !wide) {
    return (
      <section className="vs-wrap vs-section sv-how sv-how--list" aria-label={t.howLabel}>
        {head}
        <ol className="sv-how-list">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.title} y={30}>
              <p className="sv-how-num">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="sv-how-step">{s.title}</h3>
              <p className="sv-how-body">{s.body}</p>
              <div className="sv-how-screen" aria-hidden="true"><ServiceScreenView screen={s.screen} lang={lang} /></div>
            </Reveal>
          ))}
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
            {steps.map((s, i) => {
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
                  <ServiceScreenView screen={s.screen} lang={lang} />
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
  const { ref } = useInView<HTMLDivElement>(() => trackEvent('service_viewed', { service: slug, placement: 'page' }))
  const arrive = useArrive()

  if (!service) return null
  const relatedCase = service.relatedCase ? getCase(service.relatedCase) : undefined
  const [lead, accent] = HEADLINE[slug][lang]
  const parts: HeadlinePart[] = [{ text: lead }, { text: accent, tone: 'accent' }]
  const story = serviceStories[slug]
  const extra = serviceExtras[slug]
  const next = services[(services.findIndex((item) => item.slug === slug) + 1) % services.length]

  return (
    <div ref={ref} className="vs-page sv-page">
      <Seo title={service.title[lang]} description={service.summary[lang]} path={`/${service.slug}`} />

      <section className="vs-wrap sv-hero" aria-labelledby="service-title">
        <div className="sv-hero-copy" style={headlineFit(parts)}>
          <Breadcrumbs items={[{ label: t.servicesCrumb, href: '/#expertise' }, { label: service.title[lang] }]} />
          <SplitHeadline as="h1" id="service-title" className="vs-h1 sv-h1" parts={parts} onMount />
          <motion.p className="vs-lead" {...arrive(0.55)}>{service.summary[lang]}</motion.p>
          <motion.div className="sv-hero-actions" {...arrive(0.85)}>
            <Cta href="#audit-formulier-section" onClick={() => trackEvent('audit_cta_clicked', { placement: 'service_hero', service: slug })}>{t.cta}</Cta>
            <span className="sv-reply">{t.reply}</span>
          </motion.div>
        </div>
        {slug === 'websites' ? <WebsiteStage lang={lang} /> : slug === 'meta-ads' ? <MetaHero lang={lang} /> : <HeroObject screen={story.hero} lang={lang} />}
      </section>

      {slug !== 'websites' && (
        <section className="vs-wrap vs-section sv-problem" aria-labelledby="service-problem">
          <h2 className="vs-label sv-problem-label" id="service-problem">{t.problemLabel}</h2>
          <Reveal as="p" className="sv-problem-text">{service.problem[lang]}</Reveal>
        </section>
      )}

      <HowItWorks steps={story.steps} lang={lang} />
      {(slug === 'meta-ads' || slug === 'distributie') && <ApprovalCards lang={lang} platforms={slug === 'meta-ads' ? 'meta' : 'mix'} />}

      {slug !== 'websites' && (
        <section className="vs-wrap vs-section sv-deliver" aria-labelledby="service-deliver">
          <h2 id="service-deliver" className="vs-h2">{t.deliverablesLabel}</h2>
          <ul className="sv-deliver-list">
            {service.deliverables[lang].map((item) => <li key={item}><span className="sv-tick"><Check size={13} strokeWidth={2.6} /></span>{item}</li>)}
          </ul>
        </section>
      )}

      <section className="vs-wrap vs-section sv-who" aria-labelledby="service-who">
        <Reveal as="h2" className="vs-h2" id="service-who">{t.whoTitle}</Reveal>
        <AudienceRows rows={extra.audiences.map((row) => row[lang])} />
      </section>

      {extra.platforms.length > 0 && <WorksWith lang={lang} platforms={extra.platforms} />}

      {slug === 'meta-ads' ? (
        <section className="vs-wrap vs-section" aria-labelledby="service-proof">
          <Link to="/cases/pinacello" className="sv-proof sv-proof--video" onClick={() => trackEvent('case_viewed', { case: 'pinacello', placement: 'service_page' })}>
            <span className="sv-proof-thumb">
              <img src="/images/ads/pinacello-personal.jpg" alt="" width={360} height={450} loading="lazy" decoding="async" />
              <span className="sv-play" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 14 14"><path d="M4 2.5v9l7.5-4.5Z" fill="currentColor" /></svg></span>
            </span>
            <span className="sv-proof-copy">
              <span className="vs-label">{t.proofLabel} · {PROOF[lang].short}</span>
              <span id="service-proof" className="sv-proof-title">{PROOF[lang].lead} <span className="vs-mark"><span className="vs-mark-bg" aria-hidden="true" />{PROOF[lang].figure}</span></span>
              <span className="sv-proof-body">{PROOF[lang].body}</span>
              <span className="vs-textlink vs-textlink--arrow">{t.view}<Arrow size={15} /></span>
            </span>
          </Link>
        </section>
      ) : relatedCase ? (
        <section className="vs-wrap vs-section" aria-labelledby="service-proof">
          <Link to={`/cases/${relatedCase.slug}`} className="sv-proof vs-case-live" onClick={() => trackEvent('case_viewed', { case: relatedCase.slug, placement: 'service_page' })}>
            <span className="sv-proof-frame"><CasePoster slug={relatedCase.slug} name={relatedCase.name} caption={caseHeadline(relatedCase, lang)} lang={lang} /></span>
            <span className="sv-proof-copy">
              <span className="vs-label">{t.proofLabel}</span>
              <span id="service-proof" className="sv-proof-title">{relatedCase.name}</span>
              <span className="sv-proof-result">{caseHeadline(relatedCase, lang)}</span>
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

      <FaqList id={`faq-${service.slug}`} title={t.faqTitle} lang={lang} items={[
        { question: { nl: 'Wat krijg ik precies?', en: 'What exactly do I get?' }, answer: { nl: service.deliverables.nl.join('. ') + '.', en: service.deliverables.en.join('. ') + '.' } },
        { question: { nl: 'Hoe pakken jullie het aan?', en: 'How do you go about it?' }, answer: { nl: service.process.nl.join(' '), en: service.process.en.join(' ') } },
        faqItems[extra.faq],
        faqItems[14],
      ]} />

      <section className="vs-wrap vs-section sv-next" aria-label={t.nextLabel}>
        <Link to={`/${next.slug}`} className="sv-next-link" onClick={() => trackEvent('service_viewed', { service: next.slug, placement: 'service_next' })}>
          <span className="sv-next-label">{t.nextLabel}<Go /></span>
          <span className="sv-next-name">{next.title[lang]}</span>
          <span className="sv-next-body">{next.summary[lang]}</span>
        </Link>
      </section>
    </div>
  )
}
