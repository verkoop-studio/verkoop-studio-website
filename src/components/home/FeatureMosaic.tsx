import { useInView, useReducedMotion } from 'motion/react'
import { Check, MessageCircle } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import type { Platform } from '../../data/platforms'
import { useLang } from '../../i18n/LanguageContext'
import { trackEvent } from '../../lib/analytics'
import { Go } from '../brand/Arrow'
import Cta from '../brand/Cta'
import PlatformMark from '../brand/PlatformMark'

const COPY = {
  nl: {
    label: 'Hoe alles samenwerkt',
    lead: ['Automatiseer', ' je opvolging.'],
    lead2: 'Focus op je klanten.',
    sub: 'Advertenties, website en CRM die als één systeem werken.',
    pill: 'Opvolging verstuurd',
    sample: 'Voorbeeld',
    toastTitle: 'Nieuwe aanvraag opgevolgd',
    toastSub: 'Bevestiging automatisch verstuurd',
    toastTime: '14:34',
    tools: ['Werkt met je', 'tools.'],
    toolsSub: 'Sluit aan op wat je al gebruikt',
    crmTag: 'Sales CRM',
    crmFigure: '500 leads',
    crmSub: 'gratis in je CRM',
    crmLink: 'Bekijk het Sales CRM',
    days: ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'],
    chart: 'Voorbeeldgrafiek: het aantal leads loopt op in de loop van de week.',
    ask: ['Niet zeker wat', 'je nodig hebt?'],
    askHint: 'Vertel ons je doel en wat vandaag vastloopt',
    askCta: 'Vraag je groeiplan',
  },
  en: {
    label: 'How it all works together',
    lead: ['Automate', ' your follow-up.'],
    lead2: 'Focus on your customers.',
    sub: 'Ads, website and CRM that work as one system.',
    pill: 'Follow-up sent',
    sample: 'Sample',
    toastTitle: 'New enquiry followed up',
    toastSub: 'Confirmation sent automatically',
    toastTime: '2:34 PM',
    tools: ['Works with your', 'tools.'],
    toolsSub: 'Fits what you already use',
    crmTag: 'Sales CRM',
    crmFigure: '500 leads',
    crmSub: 'free in your CRM',
    crmLink: 'See the Sales CRM',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    chart: 'Sample chart: the number of leads rises through the week.',
    ask: ['Not sure what', 'you need?'],
    askHint: 'Tell us your goal and what is holding you back',
    askCta: 'Get your growth plan',
  },
}

/** The platforms the homepage names, as rows of logo chips; one floats, tilted, above the stack. */
const ROWS: Platform[][] = [['meta', 'google'], ['gtm'], ['ga4', 'looker'], ['shopify', 'klaviyo'], ['mailchimp']]
const FLOAT: Platform = 'tiktok'
const BARS = [43.2, 80.9, 131.7, 165.5, 203.2, 235.2, 265]

type Phase = 'idle' | 'pending' | 'run'

/**
 * The offer as one mosaic of five cards: follow-up that runs by itself in the middle, a sample notification,
 * the tools it works with, the free tier of the CRM, and a way to ask for a plan. The cards are drawn in
 * units of the stage width, so the whole composition scales as one piece. It arrives once, in a set order,
 * when it scrolls into view; without scripts or with reduced motion it is simply there.
 */
export default function FeatureMosaic() {
  const { lang } = useLang()
  const t = COPY[lang]
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -16% 0px' })
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('idle')

  useEffect(() => { if (!reduce) setPhase((now) => (now === 'idle' ? 'pending' : now)) }, [reduce])
  useEffect(() => {
    if (!inView || reduce) return
    setPhase('run')
    const done = window.setTimeout(() => setPhase('idle'), 2100)
    return () => window.clearTimeout(done)
  }, [inView, reduce])

  return (
    <section ref={ref} className="fm" data-phase={phase} aria-label={t.label}>
      <div className="fm-stage">
        <div className="fm-card fm-notif">
          <span className="fm-sample">{t.sample}</span>
          <div className="fm-toast-wrap">
            <span className="fm-toast-ledge" aria-hidden="true" />
            <div className="fm-toast">
              <span className="fm-toast-icon" aria-hidden="true"><Check size={14} strokeWidth={3} /></span>
              <p><b>{t.toastTitle}</b><span>{t.toastSub}</span></p>
              <time>{t.toastTime}</time>
            </div>
          </div>
        </div>

        <div className="fm-card fm-connect">
          <h3>{t.tools[0]}<br />{t.tools[1]}</h3>
          <p className="fm-sub">{t.toolsSub}</p>
          <span className="fm-chip fm-chip-float"><PlatformMark platform={FLOAT} /></span>
          <ul className="fm-chips">
            {ROWS.map((row, r) => (
              <li key={r} className={`fm-chip-row fm-chip-row--${r}`}>
                {row.map((key) => <span key={key} className="fm-chip"><PlatformMark platform={key} /></span>)}
              </li>
            ))}
          </ul>
        </div>

        <div className="fm-card fm-automate">
          <div className="fm-copy">
            <h2><span className="fm-g">{t.lead[0]}</span>{t.lead[1]}<br />{t.lead2}</h2>
            <p className="fm-sub">{t.sub}</p>
          </div>
          <div className="fm-illo" aria-hidden="true">
            <div className="fm-win fm-win-back">
              <span className="fm-win-bar"><i /><i /><i /></span>
              <span className="fm-win-body"><span className="fm-win-side" /><span className="fm-win-main"><i /><i /><i /><i /></span></span>
            </div>
            <div className="fm-win fm-win-front">
              <span className="fm-win-bar"><i /><i /><i /></span>
              <span className="fm-win-body"><span className="fm-win-side" /><span className="fm-win-main"><i /><i /><i /><i /></span></span>
            </div>
            <span className="fm-pill-wf"><span className="fm-tick"><Check size={12} strokeWidth={2.6} /></span>{t.pill}</span>
            <span className="fm-pill-lead"><span className="fm-ava" /><span className="fm-lines"><i /><i /></span></span>
            <svg className="fm-cursor" viewBox="0 0 24 28"><path d="M4 2.5v20.2l5.4-4.6 3.3 7.6 3.5-1.5-3.3-7.5 7-.6L4 2.5Z" fill="#fff" stroke="#2b2b2b" strokeWidth="1.3" strokeLinejoin="round" /></svg>
          </div>
        </div>

        <Link to="/crm" className="fm-card fm-insights" aria-label={t.crmLink}>
          <span className="fm-tag-row"><span className="fm-tag">{t.crmTag}</span><span className="fm-sample fm-sample--inline">{t.sample}</span></span>
          <h3>{t.crmFigure}</h3>
          <p className="fm-sub">{t.crmSub}</p>
          <ul className="fm-chart" role="img" aria-label={t.chart}>
            {BARS.map((height, i) => (
              <li key={i} className={i === BARS.length - 1 ? 'is-top' : ''} aria-hidden="true">
                <span className="fm-bar" style={{ '--h': height } as CSSProperties} />
                <span className="fm-day">{t.days[i]}</span>
              </li>
            ))}
          </ul>
          <Go size={17} className="fm-go" />
        </Link>

        <div className="fm-card fm-search">
          <h3>{t.ask[0]}{' '}<br />{t.ask[1]}</h3>
          <div className="fm-bar-search">
            <span className="fm-bar-icon" aria-hidden="true"><MessageCircle size={19} strokeWidth={2.1} /></span>
            <span className="fm-bar-hint">{t.askHint}</span>
            <Cta to="/#groeiplan" className="fm-bar-cta" onClick={() => trackEvent('audit_cta_clicked', { placement: 'home_mosaic' })}>{t.askCta}</Cta>
          </div>
        </div>
      </div>
    </section>
  )
}
