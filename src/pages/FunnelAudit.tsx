import { motion, useReducedMotion } from 'motion/react'
import { Check } from 'lucide-react'
import Seo from '../components/Seo'
import QualificationForm from '../components/QualificationForm'
import { Link } from 'react-router-dom'
import { Go } from '../components/brand/Arrow'
import Cta from '../components/brand/Cta'
import { useArrive } from '../components/brand/useArrive'
import HandNote from '../components/brand/HandNote'
import ProcessLine from '../components/brand/ProcessLine'
import Reveal from '../components/brand/Reveal'
import SplitHeadline from '../components/brand/SplitHeadline'
import TextLink from '../components/brand/TextLink'
import { Win } from '../components/service/ServiceScreens'
import { AUDIT_SCOPE } from '../data/audit'
import { getCase } from '../data/cases'
import { trackEvent } from '../lib/analytics'
import { PAGES_STYLES, usePageStyles } from '../lib/deferredStyles'
import { useLang } from '../i18n/LanguageContext'

const COPY = {
  nl: {
    seoTitle: 'Groeianalyse',
    seoDescription: 'Vraag een persoonlijke groeianalyse aan: een gerichte analyse van website, campagnes, ecommerce, tracking en opvolging.',
    label: 'Groeianalyse',
    title: [{ text: 'Vraag een' }, { text: 'groeianalyse aan.', tone: 'accent' as const }],
    body: 'Geen algemene template. We bekijken jullie huidige situatie, doelgroep en commerciële proces. Daarna zien we waar in de klantreis conversie verloren gaat.',
    cta: 'Bespreek je project',
    win: 'Groeianalyse',
    scopeLabel: 'De analyse bekijkt',
    scope: AUDIT_SCOPE.nl,
    deliverablesLabel: 'Mogelijke opleverpunten',
    report: 'Groeianalyse · rapport',
    levels: { pink: 'Eerst', blue: 'Daarna', grey: 'Later' },
    finding: { area: 'Leadflow', notes: [['Conversieprobleem', 'Het aanvraagformulier staat op mobiel onder de vouw.'], ['Aanbeveling', 'Zet de aanvraag boven de vouw, met één duidelijke knop.'], ['Vervolgstap', 'Meet de aanvragen per campagne na twee weken opnieuw.']] as [string, string][] },
    deliverables: ['Belangrijkste conversieproblemen', 'Screenshots en observaties', 'Geprioriteerde aanbevelingen', 'Voorgestelde nieuwe funnel', 'Voorgestelde landingspagina’s', 'Trackinghiaten', 'Automatiseringskansen', 'Aanbevolen vervolgstappen'],
    packagesNote: 'De opstart die hieruit volgt zit altijd inbegrepen in een groeipakket.',
    packagesLink: 'Bekijk de groeipakketten',
    processTitle: 'Van probleem naar werkend systeem.',
    formTitle: 'Vertel kort waar jullie vandaag staan',
    formBody: 'Een paar korte stappen. Op basis daarvan bekijken we hoe we jullie het beste kunnen helpen.',
    note: 'geen template :)',
  },
  en: {
    seoTitle: 'Growth analysis',
    seoDescription: 'Request a personal growth analysis: a focused analysis of website, campaigns, ecommerce, tracking and follow-up.',
    label: 'Growth analysis',
    title: [{ text: 'Request a' }, { text: 'growth analysis.', tone: 'accent' as const }],
    body: 'No generic template. We look at your current situation, audience and commercial process. Then we see where conversion is lost in the journey.',
    cta: 'Discuss your project',
    win: 'Growth analysis',
    scopeLabel: 'The analysis reviews',
    scope: AUDIT_SCOPE.en,
    deliverablesLabel: 'Possible deliverables',
    report: 'Growth analysis · report',
    levels: { pink: 'First', blue: 'Next', grey: 'Later' },
    finding: { area: 'Lead flow', notes: [['Conversion problem', 'On mobile, the enquiry form sits below the fold.'], ['Recommendation', 'Move the enquiry above the fold, with one clear button.'], ['Next step', 'Measure enquiries per campaign again after two weeks.']] as [string, string][] },
    deliverables: ['Key conversion problems', 'Screenshots and observations', 'Prioritised recommendations', 'Proposed new funnel', 'Suggested landing pages', 'Tracking gaps', 'Automation opportunities', 'Recommended next steps'],
    packagesNote: 'The setup that follows from this is always included in a growth package.',
    packagesLink: 'See the growth packages',
    processTitle: 'From problem to working system.',
    formTitle: 'Tell us briefly where you stand today',
    formBody: 'A few short steps. Based on that, we see how we can best help.',
    note: 'no template :)',
  },
}

/** Sample priorities for the report mock; the window says Voorbeeld. */
const pinacello = getCase('pinacello')


export default function FunnelAudit() {
  usePageStyles(PAGES_STYLES)
  const { lang } = useLang()
  const t = COPY[lang]
  const reduce = useReducedMotion()
  const arrive = useArrive()

  return (
    <div className="vs-page fa-page">
      <Seo title={t.seoTitle} description={t.seoDescription} path="/funnel-audit" />

      <section className="vs-wrap sv-hero" aria-labelledby="audit-title">
        <div className="sv-hero-copy">
          <motion.p className="vs-label" {...arrive(0)}>{t.label}</motion.p>
          <SplitHeadline as="h1" id="audit-title" className="vs-h1 sv-h1" parts={t.title} onMount />
          <motion.p className="vs-lead" {...arrive(0.55)}>{t.body}</motion.p>
          <motion.div className="sv-hero-actions" {...arrive(0.75)}>
            <Cta href="#audit-formulier" onClick={() => trackEvent('audit_cta_clicked', { placement: 'audit_offer' })}>{t.cta}</Cta>
            <TextLink to="/#groeipakketten">{t.packagesLink}</TextLink>
          </motion.div>
        </div>
        {/* The hero object: a sample report built from the analysis' own scope. */}
        <motion.div className="sv-hero-visual sv-hero-object" aria-hidden="true" initial={reduce ? false : { opacity: 0, x: 50, rotate: 5 }} animate={{ opacity: 1, x: 0, rotate: 1.5 }} transition={{ type: 'spring', stiffness: 90, damping: 16, delay: 0.5 }}>
          <div>
            <Win title={t.report} lang={lang}>
              <div className="fa-finding">
                <p className="fa-finding-head"><b>{t.finding.area}</b><span className="sv-tag sv-tag--pink">{t.levels.pink}</span></p>
                {t.finding.notes.map(([label, note], i) => (
                  <p key={label} className="fa-finding-note" style={{ animationDelay: `${0.7 + i * 0.18}s` }}><span className="fa-finding-n">{i + 1}</span><span><em>{label}</em>{note}</span></p>
                ))}
              </div>
            </Win>
          </div>
        </motion.div>
      </section>

      <section className="vs-wrap vs-section fa-scope" aria-label={t.deliverablesLabel}>
        <Link to="/cases/pinacello" className="fa-proof" onClick={() => trackEvent('case_viewed', { case: 'pinacello', placement: 'audit_proof' })}>
          <span className="fa-proof-figure">{pinacello?.result?.[lang]}</span>
          <span className="fa-proof-text"><b>Pinacello</b>{pinacello?.summary[lang]}</span>
          <Go />
        </Link>
        <div>
          <Reveal as="h2" className="vs-h2">{t.deliverablesLabel}</Reveal>
          <ul className="sv-deliver-list fa-deliver">{t.deliverables.map((item) => <li key={item}><span className="sv-tick"><Check size={13} strokeWidth={2.6} /></span>{item}</li>)}</ul>
        </div>
        <p className="fa-packages">{t.packagesNote} <TextLink to="/#groeipakketten">{t.packagesLink}</TextLink></p>
      </section>

      <section className="vs-wrap vs-section" aria-labelledby="audit-process">
        <Reveal as="h2" className="vs-h2" id="audit-process">{t.processTitle}</Reveal>
        <ProcessLine lang={lang} />
      </section>

      <section className="vs-wrap vs-section sv-close" aria-labelledby="audit-form-title">
        <div className="sv-close-intro">
          <h2 id="audit-form-title" className="vs-h2">{t.formTitle}</h2>
          <p className="vs-lead">{t.formBody}</p>
          <HandNote point="down-left" className="sv-close-note">{t.note}</HandNote>
        </div>
        <div className="sv-close-form"><QualificationForm /></div>
      </section>
    </div>
  )
}
