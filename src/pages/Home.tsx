import Seo from '../components/Seo'
import FAQ from '../components/FAQ'
import HomeHero from '../components/home/HomeHero'
import SystemTeardown from '../components/home/SystemTeardown'
import WorkScroller from '../components/home/WorkScroller'
import ResultBand from '../components/home/ResultBand'
import ServicesList from '../components/home/ServicesList'
import SoftwareShowcase from '../components/home/SoftwareShowcase'
import PlansSection from '../components/home/PlansSection'
import ClosingCta from '../components/home/ClosingCta'
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
      <SystemTeardown />
      <WorkScroller />
      <ResultBand />
      <ServicesList />
      <SoftwareShowcase />
      <PlansSection />
      <FAQ />
      <ClosingCta />
    </div>
  )
}
