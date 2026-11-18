import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import type { Lang } from '../../data/types'
import BotAvatar from './BotAvatar'

/*
 * The sample screens' shared pieces: the home teardown, the split phones, the mega menu
 * tiles and the footer card all draw from here. Every name and figure is sample data and
 * each screen carries a "Voorbeeld" chip.
 */

/** A number with its own prefix and suffix, in tabular figures. */
export function Num({ pre = '', v, suf = '' }: { pre?: string; v: string; suf?: string }) {
  return <span className="tx-num">{pre && <small>{pre}</small>}{v}{suf && <small>{suf}</small>}</span>
}

/** A small, steady beat while `on`, for the screens that play out on a loop. Stands still with reduced motion. */
export function useBeat(on: boolean, ms: number) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!on || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setN((x) => x + 1), ms)
    return () => window.clearInterval(id)
  }, [on, ms])
  return n
}

/** Each sample person is a small character: shape and colour. */
export const PEOPLE: Record<string, [string, string]> = { SP: ['mug', '#ff9fd0'], TD: ['controller', '#7d93ff'], LV: ['sprout', '#c9f26a'], JM: ['lightbulb', '#ffd23f'], EC: ['chat', '#ff7a59'] }

export const SOURCE: Record<string, string> = { Meta: '#1877f2', Facebook: '#1877f2', Google: '#ea4335', Website: '#111110', TikTok: '#111110' }

/** The sample deals: initials, name, value, source, when to call. */
export type Deal = [string, string, string, string, string]
export const DEALS: Record<Lang, Deal[]> = {
  nl: [['SP', 'Sarah Peeters', '€ 2.400', 'Facebook', 'vandaag'], ['TD', 'Tom De Wit', '€ 1.800', 'Google', 'morgen'], ['LV', 'Lien Vos', '€ 3.100', 'Website', 'do'], ['JM', 'Jonas Maes', '€ 4.500', 'Facebook', 'vr'], ['EC', 'Eva Claes', '€ 5.100', 'Google', 'ma']],
  en: [['SP', 'Sarah Peeters', '€ 2,400', 'Facebook', 'today'], ['TD', 'Tom De Wit', '€ 1,800', 'Google', 'tomorrow'], ['LV', 'Lien Vos', '€ 3,100', 'Website', 'Thu'], ['JM', 'Jonas Maes', '€ 4,500', 'Facebook', 'Fri'], ['EC', 'Eva Claes', '€ 5,100', 'Google', 'Mon']],
}

/** The company behind each sample lead, as in the teardown's lead table. */
export const COMPANY: Record<Lang, Record<string, string>> = {
  nl: { SP: 'Bakkerij', TD: 'Garage', LV: 'Tuinen', JM: 'Bouw', EC: 'Kliniek' },
  en: { SP: 'Bakery', TD: 'Garage', LV: 'Gardens', JM: 'Building', EC: 'Clinic' },
}

/** Ten small blocks, red to green; the share that is lit is the odds. */
export function Odds({ v }: { v: number }) {
  return <span className="tx-odds" aria-hidden="true">{Array.from({ length: 10 }, (_, i) => <i key={i} className={i < v ? `is-${v >= 7 ? 'hi' : v >= 4 ? 'mid' : 'lo'}` : ''} style={{ animationDelay: `${i * 30}ms` }} />)}<b>{v * 10}%</b></span>
}

export function Spark({ v }: { v: number[] }) {
  const max = Math.max(...v)
  return <span className="tx-spk" aria-hidden="true">{v.map((h, i) => <i key={i} style={{ height: `${(h / max) * 100}%`, animationDelay: `${i * 40}ms` }} />)}</span>
}

export function Person({ ini, size = 18 }: { ini: string; size?: number }) {
  const [shape, color] = PEOPLE[ini] ?? ['chat', '#7d93ff']
  return <BotAvatar shape={shape} color={color} size={size} className="tx-ava-bot" />
}

const STAGES: Record<Lang, string[]> = { nl: ['Nieuw', 'Afspraak', 'Voorstel', 'Gewonnen'], en: ['New', 'Meeting', 'Proposal', 'Won'] }
const PIPE = {
  nl: { call: 'Vandaag bellen', done: 'gebeld' },
  en: { call: 'Call today', done: 'called' },
}
/** Where the four steady deals sit; Sarah is the one that moves on, one stage per beat. */
const HOME: Record<string, number> = { TD: 0, LV: 1, JM: 2, EC: 3 }
const short = (name: string) => { const [first, last] = name.split(' '); return `${first} ${last[0]}.` }

function DealCard({ deal, lang }: { deal: Deal; lang: Lang }) {
  const [ini, who, value, src, due] = deal
  const today = due === 'vandaag' || due === 'today'
  return (
    <>
      <Person ini={ini} />
      <b>{short(who)}{today && <span className="sk-today" />}</b>
      <em>{COMPANY[lang][ini]}</em>
      <span className="sk-deal-foot"><Num v={value} /><i className="sk-src" style={{ '--src': SOURCE[src] } as React.CSSProperties}>{src}</i></span>
    </>
  )
}

/**
 * A small live pipeline: four stages with counts, the sample deals as cards, and every beat
 * one deal moves on a stage with a toast. `lanes` stacks the stages for a phone; `columns`
 * lays them side by side for a wide tile.
 */
export function SamplePipeline({ lang, on = true, layout = 'columns', id, ms = 3000, today = false }: { lang: Lang; on?: boolean; layout?: 'lanes' | 'columns'; id: string; ms?: number; today?: boolean }) {
  const beat = useBeat(on, ms)
  const stage = beat % 4
  const deals = DEALS[lang]
  const mover = deals[0]
  const stages = STAGES[lang]
  return (
    <div className={`sk-pipe sk-pipe--${layout}`}>
      {stages.map((name, col) => {
        const here = deals.filter(([ini]) => HOME[ini] === col)
        return (
          <div key={name} className="sk-stage">
            <p className="sk-stage-head"><b>{name}</b><span>{here.length + (stage === col ? 1 : 0)}</span></p>
            <div className="sk-stage-cards">
              {stage === col && (
                <motion.span layoutId={`sk-${id}-${lang}`} className="sk-deal sk-deal--hot" transition={{ type: 'spring', stiffness: 240, damping: 24 }}>
                  <DealCard deal={mover} lang={lang} />
                </motion.span>
              )}
              {here.map((deal) => <span key={deal[0]} className="sk-deal"><DealCard deal={deal} lang={lang} /></span>)}
            </div>
          </div>
        )
      })}
      {beat > 0 && <p key={beat} className="sk-toast"><Person ini={mover[0]} size={16} /><b>{short(mover[1])} → {stages[stage]}</b></p>}
      {today && (
        <p className="sk-call">
          <b>{PIPE[lang].call}</b>
          <span className="sk-call-people"><Person ini="SP" size={18} /><Person ini="EC" size={18} /></span>
          <span className="sk-call-meter"><i style={{ width: stage >= 1 ? '50%' : '8%' }} /></span>
          <small><Num v={stage >= 1 ? '1' : '0'} suf=" / 2" /> {PIPE[lang].done}</small>
        </p>
      )}
    </div>
  )
}
