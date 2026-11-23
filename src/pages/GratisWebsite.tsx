import { motion, useReducedMotion } from 'motion/react'
import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import GiveawayEntryForm from '../components/GiveawayEntryForm'
import ResponsiveImage from '../components/ResponsiveImage'
import Arrow from '../components/brand/Arrow'
import { useArrive } from '../components/brand/useArrive'
import Cta from '../components/brand/Cta'
import HandNote from '../components/brand/HandNote'
import Reveal from '../components/brand/Reveal'
import SplitHeadline from '../components/brand/SplitHeadline'
import CasePoster from '../components/home/CasePoster'
import { giveaway } from '../data/giveaway'
import { caseHeadline, getCase } from '../data/cases'
import { trackEvent } from '../lib/analytics'
import { PAGES_STYLES, usePageStyles } from '../lib/deferredStyles'
import { useLang } from '../i18n/LanguageContext'
import pinacelloSite from '../assets/pinacello-site.webp'
import healthfactorSite from '../assets/cases/healthfactor-website.webp'
import studioFlyers from '../assets/studio-flyers.webp'
import stefSmall from '../assets/stef-desk-640.webp'

/** A browser window around a real screenshot. */
function Shot({ src, alt, url, eager = false }: { src: string; alt: string; url: string; eager?: boolean }) {
  return (
    <div className="cs-window">
      <div className="cs-window-bar"><i /><i /><i /><span className="cs-window-url">{url}</span></div>
      <ResponsiveImage src={src} alt={alt} sizes="(max-width: 1024px) 100vw, 600px" loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : undefined} className="gw-shot" />
    </div>
  )
}

/** The headline's last two words carry the blue chip. */
function split(title: string) {
  const words = title.split(' ')
  return [{ text: words.slice(0, -2).join(' ') }, { text: words.slice(-2).join(' '), tone: 'accent' as const }]
}

export default function GratisWebsite() {
  usePageStyles(PAGES_STYLES)
  const { lang } = useLang()
  const g = giveaway
  const reduce = useReducedMotion()
  const proofCases = g.proof.cases.map((slug) => getCase(slug)).filter((item) => item !== undefined)
  const arrive = useArrive()

  return (
    <div className="vs-page gw-page">
      <Seo title={g.seo.title[lang]} description={g.seo.description[lang]} path={g.path} />

      <section className="vs-wrap sv-hero" aria-labelledby="gw-title">
        <div className="sv-hero-copy">
          <SplitHeadline as="h1" id="gw-title" className="vs-h1 sv-h1" parts={split(g.hero.title[lang])} onMount />
          <motion.p className="vs-lead" {...arrive(0.55)}>{g.hero.lead[lang]}</motion.p>
          <motion.dl className="gw-facts" {...arrive(0.7)}>
            {g.hero.facts[lang].map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
          </motion.dl>
          <motion.div className="sv-hero-actions" {...arrive(0.85)}>
            <Cta href="#deelnemen" onClick={() => trackEvent('audit_cta_clicked', { placement: 'giveaway_hero' })}>{g.hero.cta[lang]}</Cta>
          </motion.div>
        </div>
        <motion.figure className="gw-hero-shot" initial={reduce ? false : { opacity: 0, x: 50, rotate: 4 }} animate={{ opacity: 1, x: 0, rotate: 1.5 }} transition={{ type: 'spring', stiffness: 90, damping: 16, delay: 0.5 }}>
          <Shot src={pinacelloSite} alt={g.hero.figureAlt[lang]} url="promo.pinacello.com" eager />
          <figcaption>{g.hero.figureCaption[lang]}</figcaption>
        </motion.figure>
      </section>

      <section className="vs-wrap vs-section gw-prize" aria-labelledby="prijs-titel">
        <div>
          <Reveal as="h2" className="vs-h2" id="prijs-titel">{g.prize.title[lang]}</Reveal>
          <p className="vs-lead">{g.prize.intro[lang]}</p>
          <ul className="sv-deliver-list gw-list">{g.prize.items[lang].map((item) => <li key={item}><span className="sv-tick"><Check size={13} strokeWidth={2.6} /></span>{item}</li>)}</ul>
          <p className="gw-excluded">{g.prize.excluded[lang]}</p>
        </div>
        <figure className="gw-prize-shot">
          <Shot src={healthfactorSite} alt={g.prize.figureAlt[lang]} url="healthfactor" />
          <figcaption>{g.prize.figureCaption[lang]}</figcaption>
        </figure>
      </section>

      <section className="vs-wrap vs-section" aria-labelledby="werk-titel">
        <Reveal as="h2" className="vs-h2" id="werk-titel">{g.proof.title[lang]}</Reveal>
        <p className="vs-lead gw-proof-lead">{g.proof.body[lang]}</p>
        <ul className="gw-proof">
          {proofCases.map((item, i) => (
            <Reveal as="li" key={item.slug} delay={i * 0.08} y={30}>
              <Link to={`/cases/${item.slug}`} className="vs-case-card vs-case-live" onClick={() => trackEvent('case_viewed', { case: item.slug, placement: 'giveaway_page' })}>
                <div className="vs-case-card-frame"><CasePoster slug={item.slug} name={item.name} caption={caseHeadline(item, lang)} lang={lang} /></div>
                <h3 className="vs-case-card-name">{item.name}</h3>
                <p className="vs-case-card-result">{caseHeadline(item, lang)}</p>
                <span className="vs-textlink vs-textlink--arrow">{g.proof.view[lang]}<Arrow size={14} /></span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="vs-wrap vs-section gw-steps" aria-labelledby="stappen-titel">
        <Reveal as="h2" className="vs-h2" id="stappen-titel">{g.steps.title[lang]}</Reveal>
        <ol className="ct-call gw-call">
          {g.steps.items[lang].map((step, index) => (
            <li key={step.title}><span className="ct-call-num">0{index + 1}</span><span><b>{step.title}</b>{step.body}</span></li>
          ))}
        </ol>
      </section>

      <section className="vs-wrap vs-section gw-why" aria-labelledby="waarom-titel">
        <div>
          <Reveal as="h2" className="vs-h2" id="waarom-titel">{g.why.title[lang]}</Reveal>
          <p className="vs-lead">{g.why.body[lang]}</p>
        </div>
        <figure className="ag-polaroid gw-polaroid">
          <ResponsiveImage src={studioFlyers} alt={g.why.photoAlt[lang]} sizes="(max-width: 1024px) 70vw, 320px" loading="lazy" />
          <figcaption>Lochristi</figcaption>
        </figure>
      </section>

      <section id="deelnemen" className="vs-wrap vs-section sv-close" aria-labelledby="formulier-titel">
        <div className="sv-close-intro">
          <h2 id="formulier-titel" className="vs-h2">{g.form.title[lang]}</h2>
          <p className="vs-lead">{g.form.body[lang]}</p>
          <p className="ct-who gw-who">
            <img src={stefSmall} alt={g.form.photoAlt[lang]} width={56} height={56} loading="lazy" decoding="async" />
            <span><strong>{g.form.who[lang]}</strong><em>{g.form.where[lang]}</em></span>
          </p>
          <HandNote point="down-left" className="sv-close-note">{lang === 'nl' ? 'veel succes :)' : 'good luck :)'}</HandNote>
        </div>
        <div className="sv-close-form"><GiveawayEntryForm /></div>
      </section>

      <section id="voorwaarden" className="vs-wrap gw-rules" aria-labelledby="voorwaarden-titel">
        <h2 id="voorwaarden-titel">{g.rules.title[lang]}</h2>
        <p>{g.rules.notice[lang]}</p>
        <ol>{g.rules.items[lang].map((rule, index) => <li key={rule}><span>{index + 1}.</span>{rule}</li>)}</ol>
      </section>
    </div>
  )
}
