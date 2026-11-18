import { motion, useReducedMotion } from 'motion/react'
import Seo from '../components/Seo'
import ResponsiveImage from '../components/ResponsiveImage'
import Cta from '../components/brand/Cta'
import Polaroids from '../components/brand/Polaroids'
import ProcessLine from '../components/brand/ProcessLine'
import Reveal from '../components/brand/Reveal'
import { NoteCard } from '../components/brand/Playful'
import RollingNumber from '../components/brand/RollingNumber'
import BelgiumMap from '../components/brand/blocks/BelgiumMap'
import { cases } from '../data/cases'
import SplitHeadline from '../components/brand/SplitHeadline'
import TextLink from '../components/brand/TextLink'
import { EASE } from '../components/brand/motion'
import { workModes } from '../data/process'
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
    mapTitle: 'Vanuit Lochristi.',
    mapBody: 'Een studio in Lochristi, vlak bij Gent. Hier bouwen we het werk dat je op deze site ziet.',
    casesStat: 'gepubliceerde cases',
    teamStat: 'mensen, één studio',
    processTitle: 'Van probleem naar werkend systeem.',
    modes: 'Zo werken we samen',
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
    mapTitle: 'From Lochristi.',
    mapBody: 'A studio in Lochristi, close to Ghent. This is where we build the work you see on this site.',
    casesStat: 'published cases',
    teamStat: 'people, one studio',
    processTitle: 'From problem to working system.',
    modes: 'How we work together',
    cta: 'Plan a call',
    cases: 'See the cases',
  },
}

/** The original line from the contact page, in Stef's hand. */
const NOTE = {
  nl: ['Vertel ons je doel', 'en wat vandaag vastloopt.', 'We bespreken je aanpak', 'en zoeken samen', 'waar de grootste kans zit.'],
  en: ['Tell us your goal', 'and what is holding you back.', 'We discuss your approach', 'and look together for', 'the biggest opportunity.'],
}

export default function OverStef() {
  usePageStyles(PAGES_STYLES)
  const { lang } = useLang()
  const t = COPY[lang]
  const reduce = useReducedMotion()
  const arrive = (delay: number) => (reduce ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease: EASE } })
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
        <Polaroids photos={[{ src: stef, name: 'Stef' }, { src: tanguy, name: 'Tanguy' }]} note={t.note} />
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

      <section className="vs-wrap vs-note-wrap" aria-label={lang === 'nl' ? 'Een woordje van Stef' : 'A note from Stef'}>
        <NoteCard lines={NOTE[lang]} sign="Stef" />
      </section>

      <section className="vs-wrap vs-section ag-map" aria-labelledby="agency-map">
        <div className="ag-map-copy">
          <Reveal as="h2" className="vs-h2" id="agency-map">{t.mapTitle}</Reveal>
          <Reveal as="p" className="vs-lead" delay={0.1}>{t.mapBody}</Reveal>
          <dl className="ag-stats">
            <div><dt>{t.casesStat}</dt><dd><RollingNumber value={cases.filter((item) => !item.unavailable).length} /></dd></div>
            <div><dt>{t.teamStat}</dt><dd><RollingNumber value={2} /></dd></div>
          </dl>
        </div>
        <BelgiumMap lang={lang} />
      </section>

      <section className="vs-wrap vs-section" aria-labelledby="agency-process">
        <Reveal as="h2" className="vs-h2" id="agency-process">{t.processTitle}</Reveal>
        <ProcessLine lang={lang} />
        <div className="ag-modes">
          <h3 className="ag-modes-title">{t.modes}</h3>
          <ul className="sv-chips">{workModes[lang].map((mode) => <li key={mode}>{mode}</li>)}</ul>
        </div>
      </section>

    </div>
  )
}
