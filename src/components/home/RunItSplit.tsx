import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { crmLanding } from '../../data/crmLanding'
import type { Lang } from '../../data/types'
import { useLang } from '../../i18n/LanguageContext'
import { trackCrmSignupClick, trackEvent } from '../../lib/analytics'
import Cta from '../brand/Cta'
import ScrambleText from '../brand/ScrambleText'

const COPY = {
  nl: {
    title: 'Zelf doen of wij doen het?',
    self: { label: 'Zelf doen', head: 'Jij beheert het, met onze software.', fact: 'Gratis tot 500 leads', cta: crmLanding.cta.nl },
    done: { label: 'Wij doen het', head: 'Wij draaien je groei, elke maand.', fact: 'Vanaf €1.500 per maand', cta: 'Plan een gesprek' },
    sample: 'Voorbeeld',
  },
  en: {
    title: 'Run it yourself, or we do?',
    self: { label: 'Run it yourself', head: 'You run it, with our software.', fact: 'Free up to 500 leads', cta: crmLanding.cta.en },
    done: { label: 'We do it', head: 'We run your growth, every month.', fact: 'From €1,500 a month', cta: 'Plan a call' },
    sample: 'Sample',
  },
}

/** A phone with the CRM: one deal moves a column every few seconds. */
function CrmPhone({ lang }: { lang: Lang }) {
  const reduce = useReducedMotion()
  const [col, setCol] = useState(0)
  useEffect(() => {
    if (reduce) return
    const id = window.setInterval(() => setCol((n) => (n + 1) % 3), 2200)
    return () => window.clearInterval(id)
  }, [reduce])
  const cols = lang === 'nl' ? ['Nieuw', 'Afspraak', 'Voorstel'] : ['New', 'Meeting', 'Proposal']
  return (
    <div className="vs-split-phone" aria-hidden="true">
      <span className="vs-split-notch" />
      <p className="vs-split-app">Sales CRM <em>{COPY[lang].sample}</em></p>
      <div className="vs-split-cols">
        {cols.map((name, i) => (
          <div key={name}>
            <b>{name}</b>
            <span className="vs-split-deal" />
            {i === col && <motion.span layoutId="split-deal" className="vs-split-deal vs-split-deal--hot" transition={{ type: 'spring', stiffness: 260, damping: 24 }}>Sarah P.</motion.span>}
          </div>
        ))}
      </div>
    </div>
  )
}

/** A phone with the monthly report from the studio. */
function ReportPhone({ lang }: { lang: Lang }) {
  const rows = lang === 'nl' ? [['Omzet uit advertenties', '+18%'], ['Nieuwe leads', '38'], ['Advies', '€ 300 naar Google']] : [['Revenue from ads', '+18%'], ['New leads', '38'], ['Advice', '€ 300 to Google']]
  return (
    <div className="vs-split-phone vs-split-phone--dark" aria-hidden="true">
      <span className="vs-split-notch" />
      <p className="vs-split-app">{lang === 'nl' ? 'Maandrapport' : 'Monthly report'} <em>{COPY[lang].sample}</em></p>
      <ul className="vs-split-report">{rows.map(([label, value], i) => <li key={label} style={{ animationDelay: `${0.3 + i * 0.15}s` }}><span>{label}</span><b>{value}</b></li>)}</ul>
      <span className="vs-split-spark"><svg viewBox="0 0 100 30" preserveAspectRatio="none"><path d="M0 26 16 22 30 24 46 15 62 17 78 8 100 4" pathLength={1} /></svg></span>
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
          <CrmPhone lang={lang} />
          <Cta to="/crm" onClick={() => trackCrmSignupClick('home_split')}>{t.self.cta}</Cta>
        </motion.article>
        <motion.article className="vs-split-panel vs-split-panel--dark" {...deal(80)}>
          <p className="vs-split-label">{t.done.label}</p>
          <h3>{t.done.head}</h3>
          <p className="vs-split-fact">{t.done.fact}</p>
          <ReportPhone lang={lang} />
          <Cta to="/contact" variant="paper" onClick={() => trackEvent('audit_cta_clicked', { placement: 'home_split' })}>{t.done.cta}</Cta>
        </motion.article>
      </div>
    </section>
  )
}
