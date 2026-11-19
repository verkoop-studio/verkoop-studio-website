import { Link } from 'react-router-dom'
import { useLang } from '../../i18n/LanguageContext'
import { trackCrmSignupClick } from '../../lib/analytics'
import Reveal from '../brand/Reveal'
import SplitHeadline from '../brand/SplitHeadline'
import Arrow from '../brand/Arrow'
import ProductMini from '../brand/ProductMini'
import TiltCard from '../brand/TiltCard'

/** Platforms the dashboard reads from. Logos live in /public/platforms. */
const TOOLS = [
  { name: 'Meta', icon: 'meta' },
  { name: 'Google Ads', icon: 'google' },
  { name: 'Google Analytics', icon: 'googleanalytics' },
  { name: 'Tag Manager', icon: 'googletagmanager' },
  { name: 'TikTok', icon: 'tiktok' },
  { name: 'Shopify', icon: 'shopify' },
  { name: 'Wix', icon: 'wix' },
  { name: 'Klaviyo', icon: 'klaviyo' },
  { name: 'Mailchimp', icon: 'mailchimp' },
  { name: 'Resend', icon: 'resend' },
]

const COPY = {
  nl: {
    label: 'Onze eigen software',
    title: [{ text: 'De tools waarop we je groei laten draaien.' }, { text: 'Zelf gebouwd.', tone: 'accent' as const }],
    crm: 'Sales CRM', crmNote: 'Gratis tot 500 leads', crmAlt: 'Pipeline-scherm van het Sales CRM',
    perf: 'Performance-dashboard', perfNote: 'Attributie voor elk kanaal', perfAlt: 'Overzichtsscherm van het Performance-dashboard',
  },
  en: {
    label: 'Our own software',
    title: [{ text: 'The tools we run your growth on.' }, { text: 'Built in-house.', tone: 'accent' as const }],
    crm: 'Sales CRM', crmNote: 'Free up to 500 leads', crmAlt: 'Sales CRM pipeline screen',
    perf: 'Performance dashboard', perfNote: 'Attribution for every channel', perfAlt: 'Performance dashboard overview screen',
  },
}

export default function SoftwareShowcase() {
  const { lang } = useLang()
  const t = COPY[lang]
  return (
    <section id="software" className="vs-section" aria-labelledby="software-title">
      <div className="vs-wrap" style={{ marginBottom: 'clamp(28px, 4vw, 48px)' }}>
        <Reveal as="p" className="vs-label" y={10}>{t.label}</Reveal>
        <SplitHeadline id="software-title" className="vs-h2" parts={t.title} />
      </div>
      <div className="vs-wrap vs-software-grid">
        <Reveal>
          <Link to="/crm" className="vs-product" onClick={() => trackCrmSignupClick('home_software')}>
            <TiltCard className="vs-product-stage">
              <div className="vs-product-mini" role="img" aria-label={t.crmAlt}><ProductMini kind="crm" lang={lang} id="home-crm" /></div>
            </TiltCard>
            <div className="vs-product-row">
              <span className="vs-product-name">{t.crm}</span>
              <span className="vs-textlink vs-textlink--arrow vs-product-note">{t.crmNote}<Arrow size={15} /></span>
            </div>
          </Link>
        </Reveal>
        <Reveal delay={0.1}>
          <Link to="/performance" className="vs-product vs-product--dark">
            <TiltCard className="vs-product-stage">
              <div className="vs-product-mini" role="img" aria-label={t.perfAlt}><ProductMini kind="performance" lang={lang} id="home-perf" /></div>
            </TiltCard>
            <div className="vs-product-row">
              <span className="vs-product-name">{t.perf}</span>
              <span className="vs-textlink vs-textlink--arrow vs-product-note">{t.perfNote}<Arrow size={15} /></span>
            </div>
          </Link>
        </Reveal>
      </div>
      <div className="vs-marquee-band" aria-hidden="true">
        <div className="vs-marquee">
          {[...TOOLS, ...TOOLS].map((tool, i) => (
            <span key={i} className="vs-logo-item">
              <img src={`/platforms/${tool.icon}.svg`} alt="" width={24} height={24} loading="lazy" decoding="async" />
              {tool.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
