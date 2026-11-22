import Seo from '../components/Seo'
import FAQ from '../components/FAQ'
import HomeHero from '../components/home/HomeHero'
import SystemTeardown from '../components/home/SystemTeardown'
import WorkScroller from '../components/home/WorkScroller'
import ResultCards from '../components/home/ResultCards'
import ServicesList from '../components/home/ServicesList'
import SoftwareShowcase from '../components/home/SoftwareShowcase'
import RunItSplit from '../components/home/RunItSplit'
import PainsBlock from '../components/home/PainsBlock'
import StartTour from '../components/home/StartTour'
import FeatureMosaic from '../components/home/FeatureMosaic'
import { NoteCard, Ribbon } from '../components/brand/Playful'

/** The original line from the contact page, in Stef's hand. */
const NOTE = {
  nl: ['Vertel ons je doel', 'en wat vandaag vastloopt.', 'We bespreken je aanpak', 'en zoeken samen', 'waar de grootste kans zit.'],
  en: ['Tell us your goal', 'and what is holding you back.', 'We discuss your approach', 'and look together for', 'the biggest opportunity.'],
}
import PlansSection from '../components/home/PlansSection'
import { useLang } from '../i18n/LanguageContext'

export default function Home() {
  const { lang } = useLang()
  return (
    <div className="vs-page">
      <Seo
        title={
          lang === 'nl'
            ? 'Marketingbureau in Lochristi | Google Ads & data'
            : 'Marketing agency in Lochristi | Google Ads & analytics'
        }
        description={
          lang === 'nl'
            ? 'Verkoop Studio in Lochristi helpt bedrijven groeien met Google Ads, Meta Ads, e-mailmarketing, data-analyse en websites die bezoekers omzetten in klanten.'
            : 'Verkoop Studio in Lochristi helps businesses grow with Google Ads, Meta Ads, email marketing, analytics and websites that turn visitors into customers.'
        }
        path="/"
      />
      <HomeHero />
      <PainsBlock />
      <ResultCards />
      {/* Reviews go here once real client quotes are available; none are published yet. */}
      <SystemTeardown />
      <WorkScroller />
      <Ribbon />
      <ServicesList />
      <SoftwareShowcase />
      <RunItSplit />
      <FeatureMosaic />
      <PlansSection />
      <StartTour />
      <section className="vs-wrap vs-section vs-note-wrap" aria-label={lang === 'nl' ? 'Een woordje van Stef' : 'A note from Stef'}>
        <NoteCard lines={NOTE[lang]} sign="Stef" />
      </section>
      <FAQ />
    </div>
  )
}
