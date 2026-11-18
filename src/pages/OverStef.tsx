import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import Seo from '../components/Seo'
import ResponsiveImage from '../components/ResponsiveImage'
import Cta from '../components/brand/Cta'
import HandNote from '../components/brand/HandNote'
import Reveal from '../components/brand/Reveal'
import SplitHeadline from '../components/brand/SplitHeadline'
import TextLink from '../components/brand/TextLink'
import { EASE } from '../components/brand/motion'
import { processSteps, workModes } from '../data/process'
import { trackEvent } from '../lib/analytics'
import { PAGES_STYLES, usePageStyles } from '../lib/deferredStyles'
import { useLang } from '../i18n/LanguageContext'
import stef from '../assets/stef.webp'
import tanguy from '../assets/studio-flyers.webp'

const COPY = {
  nl: {
    seoTitle: 'De agency',
    seoDescription: "Verkoop Studio uit Lochristi werkt met bedrijven aan de volledige digitale klantreis: advertenties, landingspagina's, tracking, ecommerce en automatisering.",
    label: 'Agency · Lochristi',
    title: [{ text: 'Commercieel denken.' }, { text: 'Technisch bouwen.', tone: 'accent' as const }],
    lead: 'Strategie, marketing, design en ontwikkeling in één studio. Van je eerste groeivraag tot de website, campagnes en systemen die het waarmaken.',
    note: 'dit zijn wij :)',
    teamTitle: 'Twee mensen, één team.',
    stefRole: 'Marketingstrategie, funnels, ecommerce, campagnes en AI-automatisering. Met de volledige klantreis als vertrekpunt.',
    tanguyRole: 'Websites, software en mobiele apps. Productdesign en ontwikkeling vanuit onze studio in Lochristi.',
    stefTags: ['Strategie', 'Funnels', 'Campagnes'],
    tanguyTags: ['Websites', 'Software', 'Apps'],
    stefAlt: 'Stef Keppens bij Nooms',
    tanguyAlt: 'Tanguy De Brabandere op een stadsplein',
    processTitle: 'Van probleem naar werkend systeem.',
    modes: 'Zo werken we samen',
    closingTitle: 'Zullen we kennismaken?',
    closingBody: 'Vertel ons waar je vastloopt. We komen terug met een eerlijk plan.',
    cta: 'Plan een gesprek',
    cases: 'Bekijk de cases',
  },
  en: {
    seoTitle: 'The agency',
    seoDescription: 'Verkoop Studio in Lochristi works with companies on the full digital customer journey: ads, landing pages, tracking, ecommerce and automation.',
    label: 'Agency · Lochristi',
    title: [{ text: 'Commercial thinking.' }, { text: 'Technical craft.', tone: 'accent' as const }],
    lead: 'Strategy, marketing, design and development in one studio. From your first growth question to the website, campaigns and systems that deliver it.',
    note: 'this is us :)',
    teamTitle: 'Two people, one team.',
    stefRole: 'Marketing strategy, funnels, ecommerce, campaigns and AI automation. Starting from the complete customer journey.',
    tanguyRole: 'Websites, software and mobile apps. Product design and development from our studio in Lochristi.',
    stefTags: ['Strategy', 'Funnels', 'Campaigns'],
    tanguyTags: ['Websites', 'Software', 'Apps'],
    stefAlt: 'Stef Keppens at Nooms',
    tanguyAlt: 'Tanguy De Brabandere on a city square',
    processTitle: 'From problem to working system.',
    modes: 'How we work together',
    closingTitle: 'Shall we meet?',
    closingBody: 'Tell us where you are stuck. We come back with an honest plan.',
    cta: 'Plan a call',
    cases: 'See the cases',
  },
}

/** The five steps on one line that draws itself as the section scrolls past. */
function Process({ lang }: { lang: 'nl' | 'en' }) {
  const ref = useRef<HTMLOListElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 55%'] })
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])
  return (
    <div className="ag-process">
      <motion.span className="ag-process-line" aria-hidden="true" style={reduce ? undefined : { scaleX }} />
      <ol ref={ref} className="ag-process-list">
        {processSteps.map((step, i) => (
          <Reveal as="li" key={step.number} delay={i * 0.08} y={30}>
            <span className="ag-process-dot" aria-hidden="true">{step.number}</span>
            <h3 className="ag-process-title">{step.title[lang]}</h3>
            <p className="ag-process-body">{step.description[lang]}</p>
          </Reveal>
        ))}
      </ol>
    </div>
  )
}

export default function OverStef() {
  usePageStyles(PAGES_STYLES)
  const { lang } = useLang()
  const t = COPY[lang]
  const reduce = useReducedMotion()
  const arrive = (delay: number) => (reduce ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease: EASE } })
  const polaroid = (delay: number, rotate: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 80, rotate: rotate * 3 }, animate: { opacity: 1, y: 0, rotate }, transition: { type: 'spring' as const, stiffness: 80, damping: 14, delay } }

  return (
    <div className="vs-page ag-page">
      <Seo title={t.seoTitle} description={t.seoDescription} path="/agency" />

      <section className="vs-wrap ag-hero" aria-labelledby="agency-title">
        <div className="ag-hero-copy">
          <motion.p className="vs-label" {...arrive(0)}>{t.label}</motion.p>
          <SplitHeadline as="h1" id="agency-title" className="vs-h1 ag-h1" parts={t.title} onMount />
          <motion.p className="vs-lead" {...arrive(0.6)}>{t.lead}</motion.p>
          <motion.div className="ag-hero-actions" {...arrive(0.75)}>
            <Cta to="/contact" onClick={() => trackEvent('audit_cta_clicked', { placement: 'agency_hero' })}>{t.cta}</Cta>
            <TextLink to="/cases">{t.cases}</TextLink>
          </motion.div>
        </div>
        <div className="ag-polaroids" aria-hidden="true">
          <motion.figure className="ag-polaroid ag-polaroid--a" {...polaroid(0.4, -5)}>
            <ResponsiveImage src={stef} alt="" sizes="(max-width: 900px) 60vw, 320px" />
            <figcaption>Stef</figcaption>
          </motion.figure>
          <motion.figure className="ag-polaroid ag-polaroid--b" {...polaroid(0.6, 4)}>
            <ResponsiveImage src={tanguy} alt="" sizes="(max-width: 900px) 60vw, 320px" />
            <figcaption>Tanguy</figcaption>
          </motion.figure>
          <span className="ag-tape ag-tape--a" />
          <span className="ag-tape ag-tape--b" />
          <HandNote point="down-right" className="ag-note">{t.note}</HandNote>
        </div>
      </section>

      <section className="vs-wrap vs-section" aria-labelledby="agency-team">
        <Reveal as="h2" className="vs-h2" id="agency-team">{t.teamTitle}</Reveal>
        <ul className="ag-team">
          {[
            { name: 'Stef Keppens', role: t.stefRole, tags: t.stefTags, img: stef, alt: t.stefAlt },
            { name: 'Tanguy De Brabandere', role: t.tanguyRole, tags: t.tanguyTags, img: tanguy, alt: t.tanguyAlt },
          ].map((person, i) => (
            <Reveal as="li" key={person.name} delay={i * 0.1} y={40}>
              <article className="ag-person">
                <span className="ag-person-photo"><ResponsiveImage src={person.img} alt={person.alt} loading="lazy" sizes="(max-width: 900px) 100vw, 560px" /></span>
                <h3 className="ag-person-name">{person.name}</h3>
                <p className="ag-person-role">{person.role}</p>
                <ul className="cs-tags">{person.tags.map((tag, j) => <li key={tag} className={`cs-tag cs-tag--${(i * 2 + j) % 4}`}>{tag}</li>)}</ul>
              </article>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="vs-wrap vs-section" aria-labelledby="agency-process">
        <Reveal as="h2" className="vs-h2" id="agency-process">{t.processTitle}</Reveal>
        <Process lang={lang} />
        <div className="ag-modes">
          <h3 className="ag-modes-title">{t.modes}</h3>
          <ul className="sv-chips">{workModes[lang].map((mode) => <li key={mode}>{mode}</li>)}</ul>
        </div>
      </section>

      <section className="vs-wrap vs-section" aria-labelledby="agency-closing">
        <div className="vs-closing">
          <h2 id="agency-closing" className="vs-h2">{t.closingTitle}</h2>
          <p className="vs-lead">{t.closingBody}</p>
          <div className="vs-closing-actions">
            <Cta to="/contact" onClick={() => trackEvent('audit_cta_clicked', { placement: 'final_cta' })}>{t.cta}</Cta>
            <TextLink href="mailto:stef@verkoop.studio" arrow={false}>stef@verkoop.studio</TextLink>
          </div>
        </div>
      </section>
    </div>
  )
}
