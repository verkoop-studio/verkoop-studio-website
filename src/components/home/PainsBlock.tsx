import { useInView } from 'motion/react'
import { useRef, type CSSProperties } from 'react'
import { PAINS } from '../../data/pains'
import type { Lang } from '../../data/types'
import { useLang } from '../../i18n/LanguageContext'
import { Pointer, Ticker } from '../brand/demo'
import Reveal from '../brand/Reveal'
import { useBeat } from '../brand/samples'
import Tilted from '../product/Tilted'

/** Words inside the small scenes; the names come from the teardown's sample tables. */
const UI = {
  nl: { sample: 'Voorbeeld', reach: 'Bereik', revenue: 'Omzet', buttons: ['Meer info', 'Bekijk', 'Lees meer', 'Ontdek', 'Contact', 'Info'], inbox: 'Aanvragen', lead: 'Nieuwe aanvraag', open: 'niet beantwoord', ads: ['Video 2 · keuken', 'Carrousel · zomer', 'Korte video'], kpis: ['Verkeer', 'Sessies', 'Weergaven'], bought: 'Aankoop', day: 'dag', mails: 'mails verstuurd' },
  en: { sample: 'Sample', reach: 'Reach', revenue: 'Revenue', buttons: ['More info', 'View', 'Read more', 'Discover', 'Contact', 'Info'], inbox: 'Enquiries', lead: 'New enquiry', open: 'not answered', ads: ['Video 2 · kitchen', 'Carousel · summer', 'Short video'], kpis: ['Traffic', 'Sessions', 'Views'], bought: 'Purchase', day: 'day', mails: 'emails sent' },
}

/** Calm grounds, one per card. */
const TINTS = ['#eef1ff', '#fff6d6', '#ffeaf4', '#eaf7ee', '#f1edfd', '#fff0e6']
/** Where the pointer wanders on the page that does not convince. */
const WANDER: [number, number][] = [[22, 40], [70, 34], [40, 72], [84, 70], [55, 50], [18, 72]]

function Scene({ i, lang, on }: { i: number; lang: Lang; on: boolean }) {
  const t = UI[lang]
  const beat = useBeat(on, 1100)
  const fmt = (v: number) => Math.round(v).toLocaleString(lang === 'nl' ? 'nl-BE' : 'en-GB')
  if (i === 0) {
    return (
      <div className="pn-scene pn-reach">
        <p><span>{t.reach}</span><b className="pn-up">↑ <Ticker to={12480} on={on} ms={2200} format={fmt} /></b></p>
        <span className="pn-bar pn-bar--up"><i className={on ? 'is-on' : ''} /></span>
        <p><span>{t.revenue}</span><b>€ 0</b></p>
        <span className="pn-bar"><i /></span>
      </div>
    )
  }
  if (i === 1) {
    const [x, y] = WANDER[beat % WANDER.length]
    return (
      <div className="pn-scene pn-page">
        <span className="pn-page-buttons">{t.buttons.map((b) => <i key={b}>{b}</i>)}</span>
        <Pointer x={x} y={y} hidden={!on} />
      </div>
    )
  }
  if (i === 2) {
    const unread = 3 + (beat % 7)
    return (
      <div className="pn-scene pn-inbox">
        <p className="pn-inbox-head"><b>{t.inbox}</b><span key={unread} className="pn-badge">{unread}</span></p>
        {[0, 1].map((row) => <p key={row} className="pn-inbox-row"><span className="pn-dot" />{t.lead}<em>{t.open}</em></p>)}
      </div>
    )
  }
  if (i === 3) {
    return (
      <div className="pn-scene pn-ads">
        {t.ads.map((ad) => <p key={ad}><span>{ad}</span><b className="pn-q">?</b></p>)}
      </div>
    )
  }
  if (i === 4) {
    // The same shuffle on every load: numbers that move without meaning anything.
    const n = (k: number) => 1000 + ((beat * 7919 + k * 104729) % 8999)
    return (
      <div className="pn-scene pn-kpis">
        {t.kpis.map((kpi, k) => <p key={kpi}><span>{kpi}</span><b key={beat} className="pn-flick">{fmt(n(k))}</b></p>)}
      </div>
    )
  }
  return (
    <div className="pn-scene pn-quiet">
      <p className="pn-quiet-line"><span className="pn-dot pn-dot--green" /><b>{t.bought}</b><em>{t.day} 0</em></p>
      <p className="pn-quiet-line pn-quiet-now"><span className="pn-dot" />{t.day} {on ? 1 + (beat % 30) : 30}<em>0 {t.mails}</em></p>
    </div>
  )
}

function PainCard({ i, title, line, lang }: { i: number; title: string; line: string; lang: Lang }) {
  const ref = useRef<HTMLDivElement>(null)
  const on = useInView(ref, { amount: 0.5 })
  return (
    <Tilted lean={i % 2 ? 1.4 : -1.4} className="vs-pain" style={{ '--tint': TINTS[i % TINTS.length] } as CSSProperties}>
      <div ref={ref} className="vs-pain-win" aria-hidden="true">
        <p className="vs-pain-bar"><i /><i /><i /><em>{UI[lang].sample}</em></p>
        <Scene i={i} lang={lang} on={on} />
      </div>
      <h3>{title}</h3>
      <p>{line}</p>
    </Tilted>
  )
}

/** Where growth gets stuck: six cards, each with a small scene that shows the problem happening. */
export default function PainsBlock() {
  const { lang } = useLang()
  return (
    <section className="vs-wrap vs-section vs-pains" aria-labelledby="pains-title">
      <Reveal as="h2" className="vs-h2" id="pains-title">{lang === 'nl' ? 'Waar groei vastloopt.' : 'Where growth gets stuck.'}</Reveal>
      <ul className="vs-pains-grid">
        {PAINS[lang].map(([title, line], i) => (
          <li key={title}><PainCard i={i} title={title} line={line} lang={lang} /></li>
        ))}
      </ul>
    </section>
  )
}
