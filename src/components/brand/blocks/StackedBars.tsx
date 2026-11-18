import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react'
import { animate, motion, useMotionValue } from 'motion/react'

/* ══ Stacked bars ═════════════════════════════════════════
   A card of stacked bars: one stack per day (or week) of four
   channels, and under the baseline a small second series.

   Run along it: the column under the pointer gets a ring round its
   whole stack, the rest step back (their colour mixed toward the
   card, never faded), and one tooltip glides beside it on a spring
   with the date, the total and what made it up.

   Day / Week swaps the dataset; every segment eases to its new
   height a beat after its left neighbour. The same transition grows
   the bars out of the baseline the first time the card is seen. */

const PAD = 16
const SEG_GAP = 2
const LIFT = 2
const TIP_W = 136
const SPRING = { type: 'spring' as const, stiffness: 380, damping: 34 }
const DAY_MS = 86400000
const LAST = Date.UTC(2026, 9, 11)

type Mode = 'Day' | 'Week'
type Bar = { vals: number[]; esc: number; label: string; short: string }
type Lang = 'nl' | 'en'

const MONTHS: Record<Lang, string[]> = {
  nl: ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
}
const WORDS: Record<Lang, { day: string; week: string; days: string; weeks: string; last: string }> = {
  nl: { day: 'Dag', week: 'Week', days: 'dagen', weeks: 'weken', last: 'Laatste' },
  en: { day: 'Day', week: 'Week', days: 'days', weeks: 'weeks', last: 'Last' },
}

/* a small seeded generator: the same chart on every load */
function mulberry(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function makeBars(mode: Mode, n: number, base: number[], lang: Lang): Bar[] {
  const rnd = mulberry(mode === 'Day' ? 4396 : 9117)
  const day = (ms: number) => { const d = new Date(ms); return lang === 'nl' ? `${d.getUTCDate()} ${MONTHS.nl[d.getUTCMonth()]}` : `${MONTHS.en[d.getUTCMonth()]} ${d.getUTCDate()}` }
  const out: Bar[] = []
  for (let i = 0; i < 30; i++) {
    const back = 29 - i
    if (mode === 'Day') {
      const ms = LAST - back * DAY_MS
      const wd = new Date(ms).getUTCDay()
      const quiet = wd === 0 || wd === 6 ? 0.55 : 1
      const surge = rnd() < 0.12 ? 1.5 : 1
      const vals = base.map((b, k) => Math.round(b * quiet * (0.6 + rnd() * 0.8) * (k === 3 ? surge * surge : surge)))
      const esc = Math.round(3 + rnd() * 9 * quiet * surge)
      out.push({ vals, esc, label: day(ms), short: day(ms) })
    } else {
      const end = LAST - back * 7 * DAY_MS
      const start = end - 6 * DAY_MS
      const vals = base.map((b) => Math.round(b * 5.6 * (0.75 + rnd() * 0.5)))
      const esc = Math.round(30 + rnd() * 44)
      out.push({ vals, esc, label: `${day(start)} – ${day(end)}`, short: day(start) })
    }
  }
  return out.slice(30 - n)
}

const sum = (a: number[]) => a.reduce((s, v) => s + v, 0)

export function StackedBars({
  lang = 'nl',
  title,
  unit,
  cats,
  escLabel,
  base = [520, 360, 210, 260],
  prefix = '',
  bars = 20,
  gap = 6,
  width = 300,
  plotHeight = 104,
  belowHeight = 22,
  colour = 'Colour',
}: {
  lang?: Lang
  title: string
  unit: string
  cats: string[]
  escLabel: string
  base?: number[]
  prefix?: string
  bars?: number
  gap?: number
  width?: number
  plotHeight?: number
  belowHeight?: number
  colour?: 'Mono' | 'Colour'
}) {
  const W = width
  const CW = W - PAD * 2
  const CH = plotHeight
  const BH = belowHeight
  const w = WORDS[lang]
  const fmt = (v: number) => prefix + Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'nl' ? '.' : ',')
  const n = Math.max(2, Math.round(bars))
  const [mode, setMode] = useState<Mode>('Day')
  const [at, setAt] = useState<number | null>(null)
  const [seen, setSeen] = useState(false)
  const root = useRef<HTMLDivElement | null>(null)
  const plot = useRef<HTMLDivElement | null>(null)

  /* grow in once, the first time the card is on screen */
  useEffect(() => {
    const el = root.current
    if (!el || seen) return
    if (typeof IntersectionObserver === 'undefined') { setSeen(true); return }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect() }
    }, { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [seen])

  const data = useMemo(() => makeBars(mode, n, base, lang), [mode, n, base, lang])

  const g = Math.max(1, Math.min(gap, (CW - 3 * n) / (n - 1)))
  const bw = (CW - g * (n - 1)) / n
  const r = Math.min(2.5, bw / 2)
  const totals = data.map((b) => sum(b.vals))
  const maxT = Math.max(...totals)
  const maxE = Math.max(...data.map((b) => b.esc))
  const scale = (CH - LIFT - 2 - SEG_GAP * (cats.length - 1)) / maxT
  const layout = data.map((b) => {
    let y = 0
    const segs = b.vals.map((v) => {
      const h = Math.max(2, v * scale)
      const s = { bottom: y, h }
      y += h + SEG_GAP
      return s
    })
    return { segs, top: y - SEG_GAP, esc: Math.max(3, (b.esc / maxE) * (BH - LIFT - 2)) }
  })

  /* the headline pops in on a change: every character is keyed by a
     generation, so a new total is new elements and each plays one
     short entrance, left to right. The first paint does not play it. */
  const total = sum(totals)
  const [gen, setGen] = useState(0)
  const last = useRef(total)
  useEffect(() => {
    if (last.current === total) return
    last.current = total
    setGen((x) => x + 1)
  }, [total])

  /* ring and tooltip: placed at once when they appear, glide after */
  const ringX = useMotionValue(0)
  const ringY = useMotionValue(0)
  const ringH = useMotionValue(0)
  const tipX = useMotionValue(0)
  const was = useRef<number | null>(null)
  useEffect(() => {
    if (at === null || at >= n) { was.current = null; return }
    const L = layout[at]
    const left = at * (bw + g)
    const x = left - 3
    const up = seen ? L.top : 0
    const down = seen ? L.esc : 0
    const y = CH - LIFT - up - 3
    const h = up + LIFT + 1 + LIFT + down + 6
    const right = left + bw + 8
    const tx = right + TIP_W <= CW || left - 8 - TIP_W < 0 ? Math.min(CW - TIP_W, right) : left - 8 - TIP_W
    const go = (mv: typeof ringX, v: number) => {
      if (was.current === null) mv.set(v)
      else animate(mv, v, SPRING)
    }
    go(ringX, x); go(ringY, y); go(ringH, h); go(tipX, tx)
    was.current = at
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [at, n, bw, g, mode, seen])

  const pick = (e: React.PointerEvent) => {
    const b = plot.current?.getBoundingClientRect()
    if (!b || b.width === 0) return
    const i = Math.floor(((e.clientX - b.left) / b.width) * n)
    setAt(Math.max(0, Math.min(n - 1, i)))
  }

  const cur = at !== null && at < n ? data[at] : null
  const top2 = cur ? cur.vals.map((v, k) => ({ v, k })).sort((a, b) => b.v - a.v).slice(0, 2) : []

  return (
    <div
      ref={root}
      className="stb"
      data-colour={colour === 'Colour' ? 'on' : 'off'}
      data-scrub={cur ? '' : undefined}
      style={{ width: W, ['--stb-r' as string]: `${r}px`, ['--stb-rr' as string]: `${r + 3}px` } as CSSProperties}
    >
      <div className="stb-head">
        <div className="stb-titles">
          <div className="stb-title">{title}</div>
          <div className="stb-sub">{w.last} {n} {mode === 'Day' ? w.days : w.weeks}</div>
        </div>
        <div className="stb-seg-ctl" data-mode={mode} role="tablist">
          <span className="stb-thumb" aria-hidden />
          {(['Day', 'Week'] as Mode[]).map((m) => (
            <button key={m} type="button" role="tab" aria-selected={mode === m} data-on={mode === m || undefined} className="stb-tab" onClick={() => setMode(m)}>
              {m === 'Day' ? w.day : w.week}
            </button>
          ))}
        </div>
      </div>

      <div className="stb-figure">
        <span className="stb-num" aria-label={fmt(total)}>
          {fmt(total).split('').map((ch, i) => (
            <span key={`${gen}-${i}`} className="stb-digit" data-pop={gen > 0 || undefined} style={{ ['--i' as string]: i } as CSSProperties} aria-hidden>
              {ch}
            </span>
          ))}
        </span>
        <span className="stb-unit">{unit}</span>
      </div>

      <div
        ref={plot}
        className="stb-plot"
        style={{ height: CH + 1 + BH }}
        onPointerDown={(e) => {
          try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* scripted */ }
          pick(e)
        }}
        onPointerMove={pick}
        onPointerUp={(e) => {
          try { e.currentTarget.releasePointerCapture(e.pointerId) } catch { /* scripted */ }
          if (e.pointerType !== 'mouse') setAt(null)
        }}
        onPointerCancel={() => setAt(null)}
        onPointerLeave={() => setAt(null)}
      >
        <span className="stb-base" style={{ top: CH }} />
        {data.map((_, i) => (
          <div key={i} className="stb-col" data-on={at === i || undefined} style={{ left: i * (bw + g), width: bw, ['--i' as string]: i } as CSSProperties}>
            {layout[i].segs.map((s, k) => (
              <span
                key={k}
                className="stb-bar"
                style={{ ['--c' as string]: `var(--stb-c${k + 1})`, bottom: BH + 1 + LIFT + (seen ? s.bottom : 0), height: seen ? s.h : 0 } as CSSProperties}
              />
            ))}
            <span className="stb-esc" style={{ top: CH + 1 + LIFT, height: seen ? layout[i].esc : 0 }} />
          </div>
        ))}

        <motion.span className="stb-ring" aria-hidden style={{ x: ringX, y: ringY, height: ringH, width: bw + 6 }} />

        <motion.div className="stb-tip" style={{ x: tipX, width: TIP_W }} aria-hidden={!cur}>
          {cur && (
            <>
              <div className="stb-tip-head"><span>{cur.label}</span><b>{fmt(totals[at!])}</b></div>
              {top2.map(({ v, k }) => (
                <div className="stb-tip-row" key={cats[k]}>
                  <i style={{ ['--c' as string]: `var(--stb-c${k + 1})` } as CSSProperties} />
                  <span>{cats[k]}</span>
                  <b>{fmt(v)}</b>
                </div>
              ))}
              <div className="stb-tip-row" data-esc=""><i /><span>{escLabel}</span><b>{cur.esc}</b></div>
            </>
          )}
        </motion.div>
      </div>

      <div className="stb-axis"><span>{data[0].short}</span><span>{data[n - 1].short}</span></div>
    </div>
  )
}
