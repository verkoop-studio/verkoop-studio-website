import { type CSSProperties, useState } from 'react'
import type { Lang } from '../../data/types'
import { COMPANY, DEALS } from '../../data/samples'
import { StackedBars } from './blocks/StackedBars'
import { ToastStack, type ToastItem } from './blocks/ToastStack'
import { Person } from './samples'

const WORDS = {
  nl: { sample: 'Voorbeeld', lead: 'Nieuwe lead via', leads: 'Nieuwe leads', revenue: 'Omzet uit advertenties', unit: 'omzet', returns: 'Retouren', mail: 'E-mail' },
  en: { sample: 'Sample', lead: 'New lead via', leads: 'New leads', revenue: 'Revenue from ads', unit: 'revenue', returns: 'Returns', mail: 'Email' },
}

const short = (name: string) => { const [first, last] = name.split(' '); return `${first} ${last[0]}.` }

/** The sample deals as arriving leads: who, which company, where from, and what it is worth. */
function leads(lang: Lang): ToastItem[] {
  const w = WORDS[lang]
  return DEALS[lang].map(([ini, who, value, src]) => ({
    key: ini,
    icon: <Person ini={ini} size={30} />,
    title: <>{short(who)} <small>· {COMPANY[lang][ini]}</small></>,
    body: `${w.lead} ${src}`,
    aside: value,
  }))
}

/** Leads arriving: the count pops a digit at a time, the stack fans out over it on hover. */
function CrmLeads({ lang }: { lang: Lang }) {
  const w = WORDS[lang]
  const [count, setCount] = useState(3)
  return (
    <div className="pm-body pm-crm">
      <p className="pm-crm-head">
        <span>{w.leads}</span>
        <b key={count} className="pm-crm-count">{String(count).split('').map((ch, i) => <span key={i} style={{ '--i': i } as CSSProperties}>{ch}</span>)}</b>
      </p>
      <ToastStack items={leads(lang)} label={w.leads} height={58} peek={12} gap={8} anchor="bottom" onArrive={setCount} />
    </div>
  )
}

/**
 * The two products as small live screens, for the home tiles, the menu and the footer card:
 * sample leads arriving in a toast stack, or revenue per channel as stacked bars.
 * Both are sample screens under the "Voorbeeld" chip.
 */
export default function ProductMini({ kind, lang, id }: { kind: 'crm' | 'performance'; lang: Lang; on?: boolean; id: string }) {
  const w = WORDS[lang]
  const title = kind === 'crm' ? 'Sales CRM' : 'Performance'
  return (
    <div className={`pm pm--${kind}`} aria-hidden="true" data-id={id}>
      <p className="pm-bar"><i /><i /><i /><b>{title}</b><em>{w.sample}</em></p>
      {kind === 'crm' ? (
        <CrmLeads lang={lang} />
      ) : (
        <div className="pm-body pm-perf">
          <StackedBars
            fluid
            lang={lang}
            title={w.revenue}
            unit={w.unit}
            prefix="€ "
            cats={['Meta', 'Google', 'TikTok', w.mail]}
            base={[260, 190, 90, 60]}
            escLabel={w.returns}
            bars={16}
            plotHeight={78}
            belowHeight={12}
          />
        </div>
      )}
    </div>
  )
}
