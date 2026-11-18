import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { persistentCta, persistentCtaHref } from '../data/nav'
import { services } from '../data/services'
import { useLang } from '../i18n/LanguageContext'
import Arrow from './brand/Arrow'
import Watcher from './brand/Watcher'
import NewsletterInline from './brand/forms/NewsletterInline'

const COPY = {
  nl: {
    newsTitle: 'Advertentietips in je inbox.',
    newsBody: 'Praktische tips over Meta Ads, Google Ads en opschalen, van Verkoop Studio.',
    services: 'Diensten',
    software: 'Software',
    agency: 'Agency',
    contact: 'Contact',
    agencyLinks: [['De agency', '/agency'], ['Cases', '/cases'], ['Academy', '/academy'], ['Blog', '/blog'], ['Groeianalyse', '/funnel-audit']],
    software1: 'Sales CRM',
    software2: 'Performance',
    where: 'Lochristi, België',
    legal: 'Juridisch',
    privacy: 'Privacy',
    terms: 'Voorwaarden',
    hand: 'gebouwd in Lochristi, met veel koffie :)',
    entity: 'TanguyDeBee BV · BE 1002.613.972',
    home: 'Verkoop Studio, naar de homepage',
    lang: 'Taal',
  },
  en: {
    newsTitle: 'Ad tips in your inbox.',
    newsBody: 'Practical tips on Meta Ads, Google Ads and scaling, from Verkoop Studio.',
    services: 'Services',
    software: 'Software',
    agency: 'Agency',
    contact: 'Contact',
    agencyLinks: [['The agency', '/agency'], ['Cases', '/cases'], ['Academy', '/academy'], ['Blog', '/blog'], ['Growth analysis', '/funnel-audit']],
    software1: 'Sales CRM',
    software2: 'Performance',
    where: 'Lochristi, Belgium',
    legal: 'Legal',
    privacy: 'Privacy',
    terms: 'Terms',
    hand: 'built in Lochristi, with lots of coffee :)',
    entity: 'TanguyDeBee BV · BE 1002.613.972',
    home: 'Verkoop Studio, to the homepage',
    lang: 'Language',
  },
}

/**
 * The closing frame of every page: the newsletter, four columns of links, and a giant
 * "verkoop" wordmark that rises out of its mask as the visitor reaches the end, with
 * the blue dot as the live Watcher looking at the pointer.
 */
export default function Footer() {
  const { lang, setLang } = useLang()
  const t = COPY[lang]
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const rise = useTransform(scrollYProgress, [0.25, 1], ['62%', '0%'])

  return (
    <footer ref={ref} className="vs-footer" data-watch-area>
      <div className="vs-wrap vs-footer-top">
        <div className="vs-footer-news">
          <h2 className="vs-footer-title">{t.newsTitle}</h2>
          <p>{t.newsBody}</p>
          <NewsletterInline id="footer-newsletter" />
        </div>
        <nav className="vs-footer-cols" aria-label={lang === 'nl' ? 'Footer' : 'Footer'}>
          <div>
            <h3>{t.services}</h3>
            <ul>{services.map((service) => <li key={service.slug}><Link to={`/${service.slug}`}>{service.title[lang]}</Link></li>)}</ul>
          </div>
          <div>
            <h3>{t.software}</h3>
            <ul>
              <li><Link to="/crm">{t.software1}</Link></li>
              <li><Link to="/performance">{t.software2}</Link></li>
            </ul>
            <h3 className="vs-footer-sub">{t.agency}</h3>
            <ul>{t.agencyLinks.map(([label, href]) => <li key={href}><Link to={href}>{label}</Link></li>)}</ul>
          </div>
          <div>
            <h3>{t.contact}</h3>
            <ul>
              <li><a href="mailto:stef@verkoop.studio">stef@verkoop.studio</a></li>
              <li><Link to={persistentCtaHref} className="vs-footer-cta">{persistentCta[lang]}<Arrow size={14} /></Link></li>
              <li className="vs-footer-where">{t.where}</li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="vs-footer-mark" aria-hidden="true">
        <motion.span className="vs-footer-word" style={reduce ? undefined : { y: rise }}>
          verkoop<span className="vs-footer-dot"><Watcher shape="Circle" size={200} poke={false} within=".vs-footer" /></span>
        </motion.span>
      </div>

      <div className="vs-wrap vs-footer-base">
        <Link to="/" className="vs-footer-home" aria-label={t.home}>© {new Date().getFullYear()} Verkoop Studio</Link>
        <p className="vs-footer-hand">{t.hand}</p>
        <nav aria-label={t.legal} className="vs-footer-legal">
          <Link to="/privacy">{t.privacy}</Link>
          <Link to="/voorwaarden">{t.terms}</Link>
          <span>{t.entity}</span>
        </nav>
        <div className="vs-footer-lang" role="group" aria-label={t.lang}>
          <button type="button" aria-pressed={lang === 'nl'} onClick={() => setLang('nl')}>NL</button>
          <button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
        </div>
      </div>
    </footer>
  )
}
