import { Check, Minus } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { featureRows, pricingTiers } from '../../data/pricing'
import { useLang } from '../../i18n/LanguageContext'
import { trackEvent } from '../../lib/analytics'
import Cta from '../brand/Cta'
import Reveal from '../brand/Reveal'
import SplitHeadline from '../brand/SplitHeadline'
import { EASE_WIPE } from '../brand/motion'
import { trackSpotlight } from '../brand/spotlight'

const COPY = {
  nl: { title: [{ text: 'Drie pakketten.' }, { text: 'Eén volledige aanpak.', tone: 'accent' as const }], label: 'Per maand, excl. btw', start: 'Start met' },
  en: { title: [{ text: 'Three plans.' }, { text: 'One full approach.', tone: 'accent' as const }], label: 'Per month, excl. VAT', start: 'Start with' },
}

function Plan({ index }: { index: number }) {
  const { lang } = useLang()
  const reduce = useReducedMotion()
  const [hovered, setHovered] = useState(false)
  const tier = pricingTiers[index]
  const dark = index === 1
  const [price, unit] = tier.price[lang].split(' / ')
  const shortName = tier.name[lang].replace('Growth ', '')

  return (
    <div
      className={`vs-plan vs-spot${dark ? ' vs-plan--dark' : ''}`}
      onPointerMove={trackSpotlight}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {!reduce && (
        <svg className="vs-plan-outline" aria-hidden="true" preserveAspectRatio="none">
          <motion.rect
            x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="21"
            fill="none" stroke={dark ? '#7d93ff' : '#111110'} strokeWidth="1.5"
            pathLength={1} strokeDasharray={1}
            initial={false}
            animate={{ strokeDashoffset: hovered ? 0 : 1 }}
            transition={{ duration: 0.8, ease: EASE_WIPE }}
          />
        </svg>
      )}
      <span className="vs-label">{String(index + 1).padStart(2, '0')} · {tier.name[lang]}</span>
      <span className="vs-plan-price">{price}<small>/ {unit}</small></span>
      <p className="vs-plan-audience">{tier.audience[lang]}</p>
      {/* The full rate card per plan: what is in it, and what only the bigger plans add. */}
      <ul>
        {featureRows.map((row) => {
          const included = row.values[index].type === 'check'
          return (
            <li key={row.label.nl} className={included ? undefined : 'vs-plan-off'}>
              {included ? <Check size={15} strokeWidth={2.2} aria-hidden="true" /> : <Minus size={15} strokeWidth={2} aria-hidden="true" />}
              <span>{row.label[lang]}{!included && <span className="vs-visually-hidden">{lang === 'nl' ? ' (niet inbegrepen)' : ' (not included)'}</span>}</span>
            </li>
          )
        })}
      </ul>
      <Cta
        to={`/contact?pakket=${tier.key}`}
        variant={dark ? 'paper' : 'ink'}
        onClick={() => trackEvent('audit_cta_clicked', { placement: 'home_plans', tier: tier.key })}
      >
        {COPY[lang].start} {shortName}
      </Cta>
    </div>
  )
}

export default function PlansSection() {
  const { lang } = useLang()
  const t = COPY[lang]
  return (
    <section id="groeipakketten" className="vs-section vs-wrap" aria-labelledby="pricing-title">
      <div className="vs-section-head">
        <SplitHeadline id="pricing-title" className="vs-h2" parts={t.title} />
        <span className="vs-label">{t.label}</span>
      </div>
      <div className="vs-plans">
        {pricingTiers.map((tier, i) => (
          <Reveal key={tier.key} delay={i * 0.08}>
            <Plan index={i} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
