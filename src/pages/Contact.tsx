import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { caseHeadline, cases } from '../data/cases'
import { pricingTiers } from '../data/pricing'
import Seo from '../components/Seo'
import QualificationForm from '../components/QualificationForm'
import HandNote from '../components/brand/HandNote'
import SplitHeadline from '../components/brand/SplitHeadline'
import TextLink from '../components/brand/TextLink'
import { EASE } from '../components/brand/motion'
import { PAGES_STYLES, usePageStyles } from '../lib/deferredStyles'
import { useLang } from '../i18n/LanguageContext'
import stefSmall from '../assets/stef-desk-640.webp'

const COPY = {
  nl: {
    seoTitle: 'Contact',
    seoDescription: 'Bespreek je website, software, app of groeiplan met Verkoop Studio in Lochristi.',
    label: 'Contact',
    title: [{ text: 'Waar wil je bedrijf' }, { text: 'naartoe?', tone: 'accent' as const }],
    platformTitle: [{ text: 'Toegang tot' }, { text: 'onze platforms.', tone: 'accent' as const }],
    body: 'Vertel ons je doel en wat vandaag vastloopt. We bekijken waar de grootste kans zit en welke samenwerking past.',
    platformBody: (name: string) => `Je wilt meer weten over ${name}. Deze platforms zijn gratis voor klanten van Verkoop Studio. Vertel ons waarvoor je het wilt gebruiken.`,
    reply: 'Je hoort binnen 24 uur van ons.',
    note: 'drie korte stappen :)',
    callTitle: 'Wat er in het gesprek gebeurt',
    call: [['Jij vertelt', 'Je deelt je doel en wat vandaag vastloopt.'], ['We kijken samen', 'We bespreken de kansen en wat eerst moet.'], ['Je krijgt een voorstel', 'Met de scope en het budget, zwart op wit.']],
    proof: 'Werk voor',
    academy: ['Je wilt Meta ads leren met', 'een begeleid leertraject', 'Naar de academy'],
    package: ['Je wilt meer weten over', 'Pakketten bekijken'],
  },
  en: {
    seoTitle: 'Contact',
    seoDescription: 'Discuss your website, software, app or growth plan with Verkoop Studio in Lochristi.',
    label: 'Contact',
    title: [{ text: 'Where do you want your business' }, { text: 'to go?', tone: 'accent' as const }],
    platformTitle: [{ text: 'Access to' }, { text: 'our platforms.', tone: 'accent' as const }],
    body: 'Tell us your goal and what is holding you back. We look at where the biggest opportunity is and which way of working fits.',
    platformBody: (name: string) => `You’re interested in ${name}. These platforms are free for Verkoop Studio clients. Tell us how you would like to use it.`,
    reply: 'You’ll hear from us within 24 hours.',
    note: 'three short steps :)',
    callTitle: 'What happens in the call',
    call: [['You tell us', 'You share your goal and what is stuck today.'], ['We look together', 'We discuss the opportunities and what comes first.'], ['You get a proposal', 'With the scope and the budget, in writing.']],
    proof: 'Work for',
    academy: ['You want to learn Meta ads with', 'a guided learning track', 'Back to the academy'],
    package: ['You’re interested in', 'View packages'],
  },
}

export default function Contact() {
  usePageStyles(PAGES_STYLES)
  const { lang } = useLang()
  const t = COPY[lang]
  const reduce = useReducedMotion()
  const [params] = useSearchParams()
  const [ready, setReady] = useState(false)
  useEffect(() => { setReady(true) }, [])
  const selectedPackage = ready ? pricingTiers.find(tier => tier.key === params.get('pakket')) : undefined
  const academyInterest = ready && params.get('interesse') === 'academy'
  const platformNames = { overview: lang === 'nl' ? 'onze klantenplatforms' : 'our client platforms', crm: 'Sales CRM', dashboard: lang === 'nl' ? 'het marketingdashboard' : 'the marketing dashboard' }
  const platformKey = ready ? params.get('platform') : null
  const selectedPlatform = platformKey && Object.hasOwn(platformNames, platformKey) ? platformNames[platformKey as keyof typeof platformNames] : undefined
  const arrive = (delay: number) => (reduce ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease: EASE } })

  return (
    <div className="vs-page ct-page">
      <Seo title={t.seoTitle} description={t.seoDescription} path="/contact" />

      <section className="vs-wrap ct-book" aria-labelledby="contact-title">
        <div className="ct-copy">
          <motion.p className="vs-label" {...arrive(0)}>{t.label}</motion.p>
          <SplitHeadline as="h1" id="contact-title" className="vs-h1 ct-h1" parts={selectedPlatform ? t.platformTitle : t.title} onMount />
          <motion.p className="vs-lead" {...arrive(0.55)}>{selectedPlatform ? t.platformBody(selectedPlatform) : t.body}</motion.p>
          {academyInterest && !selectedPackage && !selectedPlatform && (
            <p className="ct-context">{t.academy[0]} <strong>{t.academy[1]}</strong>. <TextLink to="/academy">{t.academy[2]}</TextLink></p>
          )}
          {selectedPackage && (
            <p className="ct-context">{t.package[0]} <strong>{selectedPackage.name[lang]}</strong>. <TextLink to="/#groeipakketten">{t.package[1]}</TextLink></p>
          )}
          <motion.div className="ct-call" {...arrive(0.7)}>
            <h2 className="ct-call-title">{t.callTitle}</h2>
            <ol>
              {t.call.map(([title, line], i) => (
                <li key={title}><span className="ct-call-num">0{i + 1}</span><span><b>{title}</b>{line}</span></li>
              ))}
            </ol>
          </motion.div>
          <motion.div className="ct-who" {...arrive(0.8)}>
            <img src={stefSmall} alt="" width={56} height={56} decoding="async" />
            <span>
              <strong>Stef Keppens</strong>
              <TextLink href="mailto:stef@verkoop.studio" arrow={false}>stef@verkoop.studio</TextLink>
              <em>{t.reply}</em>
            </span>
          </motion.div>
        </div>
        {/* The form duo's two parts become cells of this grid: the form on the panel, the live preview under the steps. */}
        <div className="ct-panel">
          <HandNote point="down-left" className="ct-note">{t.note}</HandNote>
          <QualificationForm
            id="audit-formulier-contact"
            preview
            inquiryContext={selectedPlatform ? `Platform: ${selectedPlatform}` : selectedPackage ? `Pakket: ${selectedPackage.name[lang]}` : academyInterest ? 'Academy: begeleid Meta Ads-leertraject' : undefined}
          />
        </div>
      </section>

      <section className="vs-wrap ct-proof" aria-label={t.proof}>
        <span className="ct-proof-label">{t.proof}</span>
        <ul>{cases.filter((item) => !item.unavailable).map((item) => <li key={item.slug}><Link to={`/cases/${item.slug}`}><b>{item.name}</b><span>{caseHeadline(item, lang)}</span></Link></li>)}</ul>
      </section>
    </div>
  )
}
