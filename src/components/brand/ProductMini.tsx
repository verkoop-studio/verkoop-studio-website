import type { CSSProperties } from 'react'
import type { Lang } from '../../data/types'
import { Ticker } from './demo'
import { SamplePipeline } from './samples'

/** Sample channel revenue per week, stacked Meta, Google, TikTok. Under the "Voorbeeld" chip. */
const WEEKS = [[22, 14, 5], [26, 15, 6], [24, 18, 5], [30, 17, 8], [28, 21, 7], [34, 20, 9], [33, 24, 8], [38, 23, 11]]
const CHANNELS = [['Meta', '#1877f2'], ['Google', '#ea4335'], ['TikTok', '#111110']] as const
const WORDS = {
  nl: { sample: 'Voorbeeld', revenue: 'Omzet uit advertenties', roas: '4,7× per euro' },
  en: { sample: 'Sample', revenue: 'Revenue from ads', roas: '4.7× per euro' },
}

/**
 * The two products as small live screens, for the menu tile and the footer card:
 * the pipeline with one deal moving on, or revenue per channel with the total counting up.
 */
export default function ProductMini({ kind, lang, on = true, id }: { kind: 'crm' | 'performance'; lang: Lang; on?: boolean; id: string }) {
  const w = WORDS[lang]
  const title = kind === 'crm' ? 'Sales CRM' : 'Performance'
  const max = Math.max(...WEEKS.map((week) => week.reduce((a, b) => a + b, 0)))
  const total = 5890
  const fmt = (v: number) => `€ ${Math.round(v).toLocaleString(lang === 'nl' ? 'nl-BE' : 'en-GB')}`
  return (
    <div className={`pm pm--${kind}`} aria-hidden="true">
      <p className="pm-bar"><i /><i /><i /><b>{title}</b><em>{w.sample}</em></p>
      {kind === 'crm' ? (
        <div className="pm-body"><SamplePipeline lang={lang} id={`pm-${id}`} on={on} ms={3000} /></div>
      ) : (
        <div className="pm-body pm-perf">
          <p className="pm-total"><span>{w.revenue}</span><b><Ticker to={total} on={on} ms={1200} format={fmt} /></b><em>{w.roas}</em></p>
          <div className="pm-stacks">
            {WEEKS.map((week, i) => (
              <span key={i} className="pm-stack" style={{ '--i': i, height: `${(week.reduce((a, b) => a + b, 0) / max) * 100}%` } as CSSProperties}>
                {week.map((v, c) => <i key={c} style={{ flexGrow: v, background: CHANNELS[c][1] }} />)}
              </span>
            ))}
            <span className="pm-scan" />
          </div>
          <p className="pm-legend">{CHANNELS.map(([name, color]) => <span key={name}><i style={{ background: color }} />{name}</span>)}</p>
        </div>
      )}
    </div>
  )
}
