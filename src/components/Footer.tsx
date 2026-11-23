import { motion, useInView, useReducedMotion } from 'motion/react'
import { Mail } from 'lucide-react'
import WhatsAppIcon from './brand/WhatsAppIcon'
import { useRef, type PointerEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import stef from '../assets/stef-desk-640.webp'
import { articles } from '../data/articles'
import { whatsappHref } from '../data/contact'
import { persistentCta, persistentCtaHref } from '../data/nav'
import { services } from '../data/services'
import { useLang } from '../i18n/LanguageContext'
import { trackEvent } from '../lib/analytics'
import Arrow, { Go } from './brand/Arrow'
import { Ribbon } from './brand/Playful'
import Cta from './brand/Cta'
import HandNote from './brand/HandNote'
import LangPicker from './brand/LangPicker'
import ProductMini from './brand/ProductMini'
import NewsletterInline from './brand/forms/NewsletterInline'
import { EASE } from './brand/motion'

const COPY = {
  nl: {
    band: 'Laten we groeien.', bandCta: 'Plan een gesprek', bandNote: 'we antwoorden snel :)', bandAsk: 'Vraag over je groei?', crossLead: 'Liever zelf doen?', crossFact: 'Gratis tot 500 leads', crossCta: 'Start je CRM',
    newsTitle: 'Advertentietips in je inbox.', newsBody: 'Praktische tips over Meta Ads, Google Ads en opschalen.', newsNote: 'Uitschrijven kan altijd, met één klik.',
    software: 'Software', crm: 'Gratis tot 500 leads', perf: 'Vanaf €49 per maand',
    contact: 'Contact', reply: 'Antwoord binnen 24 uur', where: 'Lochristi, België',
    blog: 'Nieuw op de blog', allPosts: 'Alle artikels',
    services: 'Diensten', agency: 'Agency', legal: 'Juridisch', privacy: 'Privacy', terms: 'Voorwaarden',
    agencyLinks: [['De agency', '/agency'], ['Cases', '/cases'], ['Academy', '/academy'], ['Blog', '/blog'], ['Groeianalyse', '/funnel-audit']],
    hand: 'gebouwd in Lochristi, met veel koffie :)', entity: 'TanguyDeBee BV · BE 1002.613.972', lang: 'Taal',
  },
  en: {
    band: 'Let’s grow.', bandCta: 'Plan a call', bandNote: 'we reply fast :)', bandAsk: 'A question about growth?', crossLead: 'Rather run it yourself?', crossFact: 'Free up to 500 leads', crossCta: 'Start your CRM',
    newsTitle: 'Ad tips in your inbox.', newsBody: 'Practical tips on Meta Ads, Google Ads and scaling.', newsNote: 'Unsubscribe any time, in one click.',
    software: 'Software', crm: 'Free up to 500 leads', perf: 'From €49 a month',
    contact: 'Contact', reply: 'Reply within 24 hours', where: 'Lochristi, Belgium',
    blog: 'New on the blog', allPosts: 'All articles',
    services: 'Services', agency: 'Agency', legal: 'Legal', privacy: 'Privacy', terms: 'Terms',
    agencyLinks: [['The agency', '/agency'], ['Cases', '/cases'], ['Academy', '/academy'], ['Blog', '/blog'], ['Growth analysis', '/funnel-audit']],
    hand: 'built in Lochristi, with lots of coffee :)', entity: 'TanguyDeBee BV · BE 1002.613.972', lang: 'Language',
  },
}

/** Pages that already end in their own form or call to action do not get the band on top of it. */
const NO_BAND = /^\/(contact|crm|performance|academy|gratis-website|funnel-audit|cases\/.+|[a-z-]+-ads|landing-pages|funnels|ecommerce-conversie|ai-automatiseringen|distributie|email-marketing|data-analytics|websites|software)\/?$/

const LETTERS = 'verkoop'.split('')

/** The wordmark: always drawn; the letters settle one by one as it arrives, then lift and lean toward the pointer. */
function Wordmark() {
  const reduce = useReducedMotion()
  const letters = useRef<(HTMLSpanElement | null)[]>([])
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== 'mouse') return
    for (const el of letters.current) {
      if (!el) continue
      const r = el.getBoundingClientRect()
      const d = (e.clientX - (r.left + r.width / 2)) / r.width
      const pull = Math.max(0, 1 - Math.abs(d) / 2.2)
      el.style.setProperty('--lift', `${(-pull * 0.12).toFixed(3)}em`)
      el.style.setProperty('--lean', `${(-d * pull * 5).toFixed(2)}deg`)
    }
  }
  const onLeave = () => letters.current.forEach((el) => { el?.style.removeProperty('--lift'); el?.style.removeProperty('--lean') })
  return (
    <div className="vs-footer-mark" aria-hidden="true" onPointerMove={onMove} onPointerLeave={onLeave}>
      <span className="vs-footer-word">
        {LETTERS.map((letter, i) => (
          <motion.span
            key={i}
            className="vs-footer-letter"
            initial={reduce ? false : { y: '24%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 160, damping: 18, delay: i * 0.06 }}
          >
            <span ref={(el) => { letters.current[i] = el }}>{letter}</span>
          </motion.span>
        ))}
        <span className="vs-footer-dot" aria-hidden="true" />
      </span>
    </div>
  )
}

/** The blue band before the footer: one bold line and one call to action, with a wave that draws itself. */
function CtaBand({ home }: { home: boolean }) {
  const { lang } = useLang()
  const t = COPY[lang]
  const reduce = useReducedMotion()
  const placement = home ? 'home_closing' : 'footer_band'
  const band = useRef<HTMLElement>(null)
  const near = useInView(band, { margin: '200px 0px' })
  return (
    <section ref={band} className="vs-band" data-near={near || undefined} aria-labelledby="band-title">
      <span className="vs-band-glow" aria-hidden="true" />
      <svg className="vs-band-wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
        <path className="vs-band-wave-fill" d="M0 80V40C160 8 320 8 480 32s320 56 480 32 320-48 480-24V80Z" />
        <motion.path className="vs-band-wave-line" d="M0 40C160 8 320 8 480 32s320 56 480 32 320-48 480-24" initial={reduce ? false : { pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, ease: EASE }} />
      </svg>
      <Ribbon className="vs-band-ribbon" />
      <div className="vs-wrap vs-band-inner">
        <h2 id="band-title" className="vs-band-title">{t.band}</h2>
        <p className="vs-band-ask">{t.bandAsk}</p>
        <div className="vs-band-actions">
          <Cta to="/contact" variant="paper" onClick={() => trackEvent('audit_cta_clicked', { placement })}>{t.bandCta}</Cta>
          <a className="vs-band-link" href={whatsappHref()} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('whatsapp_clicked', { placement })}><WhatsAppIcon size={17} />WhatsApp</a>
          <HandNote point="up-left" className="vs-band-note">{t.bandNote}</HandNote>
        </div>
        <Link to="/crm" className="vs-band-cross">
          <span><b>{t.crossLead}</b> {t.crossFact}</span>
          <span className="vs-band-cross-go">{t.crossCta}<Arrow size={15} /></span>
        </Link>
      </div>
    </section>
  )
}

const card = (i: number, reduce: boolean | null) => (reduce ? {} : {
  initial: { opacity: 0, y: 40, rotate: i % 2 ? 1.5 : -1.5 },
  whileInView: { opacity: 1, y: 0, rotate: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { type: 'spring' as const, stiffness: 110, damping: 16, delay: i * 0.08 },
})

/**
 * The closing frame of every page: the blue band where it adds something, a bento of
 * cards (newsletter, software, contact, the newest posts), quiet link columns, the
 * giant wordmark with the watching dot, and one base row.
 */
export default function Footer() {
  const { lang } = useLang()
  const t = COPY[lang]
  const reduce = useReducedMotion()
  const { pathname } = useLocation()
  const latest = [...articles].sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? '')).slice(0, 2)
  const date = (iso?: string) => (iso ? new Date(iso).toLocaleDateString(lang === 'nl' ? 'nl-BE' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '')

  return (
    <>
      {!NO_BAND.test(pathname) && <CtaBand home={pathname === '/'} />}
      <footer className="vs-footer" data-watch-area>
        <div className="vs-wrap vs-bento">
          <motion.section className="vs-bento-card vs-bento-news" aria-labelledby="footer-news" {...card(0, reduce)}>
            <h2 id="footer-news" className="vs-bento-title">{t.newsTitle}</h2>
            <p>{t.newsBody}</p>
            <NewsletterInline id="footer-newsletter" />
            <p className="vs-bento-small">{t.newsNote}</p>
          </motion.section>
          <motion.section className="vs-bento-card" aria-labelledby="footer-software" {...card(1, reduce)}>
            <h2 id="footer-software" className="vs-bento-label">{t.software}</h2>
            <ul className="vs-bento-products">
              {[{ href: '/crm', kind: 'crm' as const, name: 'Sales CRM', fact: t.crm }, { href: '/performance', kind: 'performance' as const, name: 'Performance', fact: t.perf }].map((p) => (
                <li key={p.href}>
                  <Link to={p.href} className="vs-bento-product">
                    <span className="vs-bento-thumb"><ProductMini kind={p.kind} lang={lang} on={!reduce} id={`footer-${p.kind}`} /></span>
                    <span className="vs-bento-product-text"><b>{p.name}</b><em>{p.fact}</em></span>
                    <Go />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.section>
          <motion.section className="vs-bento-card" aria-labelledby="footer-contact" {...card(2, reduce)}>
            <h2 id="footer-contact" className="vs-bento-label">{t.contact}</h2>
            <p className="vs-bento-who"><img src={stef} alt="" width={44} height={44} loading="lazy" decoding="async" /><span><b>Stef Keppens</b><em className="vs-bento-pill">{t.reply}</em></span></p>
            <ul className="vs-bento-lines">
              <li><a href="mailto:stef@verkoop.studio"><Mail size={15} aria-hidden="true" />stef@verkoop.studio</a></li>
              <li><a href={whatsappHref()} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('whatsapp_clicked', { placement: 'footer', channel: 'whatsapp' })}><WhatsAppIcon size={15} />WhatsApp</a></li>
              <li><Link to={persistentCtaHref} className="vs-bento-cta">{persistentCta[lang]}<Arrow size={14} /></Link></li>
              <li className="vs-bento-where">{t.where}</li>
            </ul>
          </motion.section>
          <motion.section className="vs-bento-card vs-bento-blog" aria-labelledby="footer-blog" {...card(3, reduce)}>
            <h2 id="footer-blog" className="vs-bento-label">{t.blog}</h2>
            <ul>
              {latest.map((post) => (
                <li key={post.slug}><Link to={`/blog/${post.slug}`}><b>{post.title}</b><em>{date(post.publishedAt)}</em></Link></li>
              ))}
            </ul>
            <Link to="/blog" className="vs-bento-cta">{t.allPosts}<Arrow size={14} /></Link>
          </motion.section>
        </div>

        <nav className="vs-wrap vs-footer-links" aria-label={lang === 'nl' ? 'Alle pagina’s' : 'All pages'}>
          <div className="vs-footer-links-services">
            <h3>{t.services}</h3>
            <ul>{services.map((service) => <li key={service.slug}><Link to={`/${service.slug}`}>{service.title[lang]}</Link></li>)}</ul>
          </div>
          <div>
            <h3>{t.agency}</h3>
            <ul>{t.agencyLinks.map(([label, href]) => <li key={href}><Link to={href}>{label}</Link></li>)}</ul>
          </div>
          <div>
            <h3>{t.legal}</h3>
            <ul><li><Link to="/privacy">{t.privacy}</Link></li><li><Link to="/voorwaarden">{t.terms}</Link></li></ul>
          </div>
        </nav>

        <Wordmark />

        <div className="vs-wrap vs-footer-base">
          <span>© {new Date().getFullYear()} Verkoop Studio · {t.entity}</span>
          <span className="vs-footer-hand">{t.hand}</span>
          <nav aria-label={t.legal} className="vs-footer-legal">
            <Link to="/privacy">{t.privacy}</Link>
            <Link to="/voorwaarden">{t.terms}</Link>
          </nav>
          <LangPicker up dark />
        </div>
      </footer>
    </>
  )
}
