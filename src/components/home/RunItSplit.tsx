import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { crmLanding } from '../../data/crmLanding'
import type { Lang } from '../../data/types'
import { useLang } from '../../i18n/LanguageContext'
import { trackCrmSignupClick, trackEvent } from '../../lib/analytics'
import BotAvatar from '../brand/BotAvatar'
import Cta from '../brand/Cta'
import RollingNumber from '../brand/RollingNumber'
import { SamplePipeline } from '../brand/samples'
import TiltCard from '../brand/TiltCard'
import ScrambleText from '../brand/ScrambleText'

const COPY = {
  nl: {
    title: 'Zelf doen of wij doen het?',
    self: { label: 'Zelf doen', head: 'Jij beheert het, met onze software.', fact: 'Gratis tot 500 leads', cta: crmLanding.cta.nl },
    done: { label: 'Wij doen het', head: 'Wij draaien je groei, elke maand.', fact: 'Vanaf €1.500 per maand', cta: 'Plan een gesprek' },
    sample: 'Voorbeeld',
    more: 'Ontdek meer',
  },
  en: {
    title: 'Run it yourself, or we do?',
    self: { label: 'Run it yourself', head: 'You run it, with our software.', fact: 'Free up to 500 leads', cta: crmLanding.cta.en },
    done: { label: 'We do it', head: 'We run your growth, every month.', fact: 'From €1,500 a month', cta: 'Plan a call' },
    sample: 'Sample',
    more: 'Learn more',
  },
}

const PHONE = {
  nl: { crm: 'Sales CRM', report: 'Maandrapport · oktober', from: 'Van: Verkoop Studio', date: '1 nov', rows: [['Omzet uit advertenties', 18, '+', '%'], ['Nieuwe leads', 38, '', ''], ['Meeste omzet via Google', 0, '', '€ 2.910']], weeks: ['wk 1', 'wk 2', 'wk 3', 'wk 4'], next: 'Volgende stap', advice: 'Zet € 300 meer op Google', note: 'dit doen we deze maand' },
  en: { crm: 'Sales CRM', report: 'Monthly report · October', from: 'From: Verkoop Studio', date: '1 Nov', rows: [['Revenue from ads', 18, '+', '%'], ['New leads', 38, '', ''], ['Most revenue through Google', 0, '', '€ 2,910']], weeks: ['wk 1', 'wk 2', 'wk 3', 'wk 4'], next: 'Next step', advice: 'Put € 300 more on Google', note: 'we do this this month' },
} as const

/** A long arrow for the ghost link; it stretches on hover. */
const LongArrow = () => <svg className="vs-split-arrow" viewBox="0 0 40 12" aria-hidden="true"><path d="M0 6h38M33 1l5 5-5 5" /></svg>

/** The phone frame both sides share: notch, app bar with the sample chip, tilt toward the pointer. */
function Phone({ dark = false, title, lang, children }: { dark?: boolean; title: string; lang: Lang; children: ReactNode }) {
  return (
    <TiltCard className="vs-split-tilt" max={4}>
      <div className={`vs-split-phone${dark ? ' vs-split-phone--dark' : ''}`} aria-hidden="true">
        <span className="vs-split-notch" />
        <p className="vs-split-app">{title} <em>{COPY[lang].sample}</em></p>
        {children}
      </div>
    </TiltCard>
  )
}

/** One revenue line for the month: a single path with its area, the last point pulsing. */
const LINE = [26, 23, 24, 19, 20, 15, 16, 11, 12, 7, 5]
const POINTS = LINE.map((y, i) => [(i / (LINE.length - 1)) * 100, y] as const)
const PATH = POINTS.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y}`).join(' ')

/** The monthly report as it lands in the inbox: header, three numbers, the month's line and the next step. */
function ReportScreen({ lang }: { lang: Lang }) {
  const p = PHONE[lang]
  const [endX, endY] = POINTS[POINTS.length - 1]
  return (
    <div className="vs-split-mail">
      <p className="vs-split-from"><BotAvatar shape="verkoop" size={22} eyeColor="#ffffff" className="tx-ava-bot" /><span><b>{p.from}</b><em>{p.report}</em></span><i>{p.date}</i></p>
      <ul className="vs-split-report">
        {p.rows.map(([label, value, pre, suf], i) => (
          <li key={label} style={{ animationDelay: `${0.3 + i * 0.15}s` }}><span>{label}</span><b>{value ? <RollingNumber value={value} prefix={pre} suffix={suf} /> : suf}</b></li>
        ))}
      </ul>
      <div className="vs-split-chart">
        <svg viewBox="0 0 100 30" preserveAspectRatio="none">
          <defs><linearGradient id={`split-area-${lang}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#9fb0ff" stopOpacity="0.45" /><stop offset="1" stopColor="#9fb0ff" stopOpacity="0" /></linearGradient></defs>
          <path className="vs-split-area" d={`${PATH} L100 30 L0 30 Z`} fill={`url(#split-area-${lang})`} />
          <path className="vs-split-line" d={PATH} pathLength={1} />
        </svg>
        <span className="vs-split-dot" style={{ left: `${endX}%`, top: `${(endY / 30) * 58}px` }} />
        <p className="vs-split-weeks">{p.weeks.map((w) => <span key={w}>{w}</span>)}</p>
      </div>
      <div className="vs-split-next">
        <p><BotAvatar shape="verkoop" size={20} eyeColor="#ffffff" className="tx-ava-bot" /><span><em>{p.next}</em><b>{p.advice}</b></span></p>
        <span className="vs-split-hand">{p.note}</span>
      </div>
    </div>
  )
}

/** The two ways to work with Verkoop Studio, side by side: our free software, or the monthly plans. */
export default function RunItSplit() {
  const { lang } = useLang()
  const t = COPY[lang]
  const reduce = useReducedMotion()
  const deal = (from: number) => (reduce ? {} : { initial: { opacity: 0, x: from, rotate: from > 0 ? 3 : -3 }, whileInView: { opacity: 1, x: 0, rotate: 0 }, viewport: { once: true, margin: '-80px' }, transition: { type: 'spring' as const, stiffness: 90, damping: 16 } })
  return (
    <section className="vs-wrap vs-section vs-split" aria-labelledby="split-title">
      <h2 id="split-title" className="vs-h2 vs-split-title"><ScrambleText text={t.title} /></h2>
      <div className="vs-split-grid">
        <motion.article className="vs-split-panel" {...deal(-80)}>
          <p className="vs-split-label">{t.self.label}</p>
          <h3>{t.self.head}</h3>
          <p className="vs-split-fact">{t.self.fact}</p>
          <div className="vs-split-actions">
            <Cta to="/crm" onClick={() => trackCrmSignupClick('home_split')}>{t.self.cta}</Cta>
            <Link to="/crm" className="vs-split-more">{t.more}<LongArrow /></Link>
          </div>
          <Phone title={PHONE[lang].crm} lang={lang}><SamplePipeline lang={lang} layout="lanes" id="split" today /></Phone>
        </motion.article>
        <motion.article className="vs-split-panel vs-split-panel--dark" {...deal(80)}>
          <p className="vs-split-label">{t.done.label}</p>
          <h3>{t.done.head}</h3>
          <p className="vs-split-fact">{t.done.fact}</p>
          <div className="vs-split-actions">
            <Cta to="/contact" variant="paper" onClick={() => trackEvent('audit_cta_clicked', { placement: 'home_split' })}>{t.done.cta}</Cta>
            <Link to="/prijzen" className="vs-split-more">{t.more}<LongArrow /></Link>
          </div>
          <Phone dark title={lang === 'nl' ? 'Maandrapport' : 'Monthly report'} lang={lang}><ReportScreen lang={lang} /></Phone>
        </motion.article>
      </div>
    </section>
  )
}
