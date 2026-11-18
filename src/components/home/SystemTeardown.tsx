import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import TextLink from '../brand/TextLink'
import type { Bi, Lang } from '../../data/types'
import { useLang } from '../../i18n/LanguageContext'
import { trackEvent } from '../../lib/analytics'
import BotAvatar from '../brand/BotAvatar'
import { StackedBars } from '../brand/blocks/StackedBars'
import { DEALS, PEOPLE, SOURCE } from '../../data/samples'
import { useBeat } from '../../lib/useBeat'
import { Num, Odds, Spark } from '../brand/samples'
import Cta from '../brand/Cta'
import { EASE } from '../brand/motion'
import { useWide } from '../../lib/useWide'

type LayerKey = 'ad' | 'page' | 'form' | 'crm' | 'pixel' | 'dashboard' | 'report'

type Layer = {
  key: LayerKey
  tint: string
  title: Bi<string>
  body: Bi<string>
  specs: Bi<string[]>
}

/**
 * Every claim comes from the products and the site (verkoop-knowledge/knowledge/{crm,dashboard}.md,
 * the services and pricing data). Written for someone without marketing knowledge.
 */
const LAYERS: Layer[] = [
  {
    key: 'ad', tint: '#2b4bf2',
    title: { nl: 'Advertentie', en: 'Ad' },
    body: { nl: 'We zetten je aanbod voor de juiste mensen.', en: 'We put your offer in front of the right people.' },
    specs: { nl: ['Op Facebook, Instagram en Google', 'Alle resultaten op één plek', 'Budget gaat naar wat verkoopt'], en: ['On Facebook, Instagram and Google', 'All results in one place', 'Budget goes to what sells'] },
  },
  {
    key: 'page', tint: '#ffd23f',
    title: { nl: 'Landingspagina', en: 'Landing page' },
    body: { nl: 'Eén pagina, één boodschap, één knop.', en: 'One page, one message, one button.' },
    specs: { nl: ['Wij bouwen hem voor je', 'Gemaakt om aanvragen te krijgen', 'We zien wat bezoekers doen'], en: ['We build it for you', 'Made to get enquiries', 'We see what visitors do'] },
  },
  {
    key: 'form', tint: '#ff9fd0',
    title: { nl: 'Formulier', en: 'Form' },
    body: { nl: 'Wie interesse heeft, laat zijn gegevens achter.', en: 'Whoever is interested leaves their details.' },
    specs: { nl: ['Komt meteen in je CRM', 'Bevestiging per e-mail', 'Je ziet via welke advertentie de lead kwam'], en: ['Lands in your CRM straight away', 'Confirmation by email', 'You see which ad the lead came from'] },
  },
  {
    key: 'crm', tint: '#c9f26a',
    title: { nl: 'Sales CRM', en: 'Sales CRM' },
    body: { nl: 'Al je leads in één overzicht.', en: 'All your leads in one view.' },
    specs: { nl: ['Gratis tot 500 leads', 'Je ziet wie je vandaag moet bellen', 'Offertes en contracten bij elke klant', 'Werkt samen met ChatGPT'], en: ['Free up to 500 leads', 'See who to call today', 'Quotes and contracts on every client', 'Works with ChatGPT'] },
  },
  {
    key: 'pixel', tint: '#7d93ff',
    title: { nl: 'Pixel', en: 'Pixel' },
    body: { nl: 'Een stukje code dat meet wat bezoekers doen.', en: 'A small piece of code that measures what visitors do.' },
    specs: { nl: ['Je eigen meting, niet die van Facebook', 'Respecteert de cookiekeuze van je bezoeker', 'Ziet elke Shopify-bestelling, ook als de browser trackers blokkeert'], en: ['Your own measurement, not Facebook’s', 'Respects your visitor’s cookie choice', 'Sees every Shopify order, even when the browser blocks trackers'] },
  },
  {
    key: 'dashboard', tint: '#ff7a59',
    title: { nl: 'Dashboard', en: 'Dashboard' },
    body: { nl: 'Zie welke advertentie echt verkoopt.', en: 'See which ad really sells.' },
    specs: { nl: ['Uitgaven en omzet per kanaal', 'De weg van eerste klik tot aankoop', 'Facebook, Google, TikTok, Shopify en meer'], en: ['Spend and revenue per channel', 'The path from first click to purchase', 'Facebook, Google, TikTok, Shopify and more'] },
  },
  {
    key: 'report', tint: '#f5f3ee',
    title: { nl: 'Rapport', en: 'Report' },
    body: { nl: 'Elke maand: wat werkte, en wat nu.', en: 'Every month: what worked, and what next.' },
    specs: { nl: ['Een helder maandrapport', 'Concreet advies voor je budget', 'Deel het met je team'], en: ['A clear monthly report', 'Concrete advice on your budget', 'Share it with your team'] },
  },
]

const COPY = {
  nl: { label: 'Het systeem, uit elkaar gehaald', intro: 'Zeven onderdelen. Eén weg van klik tot klant.', end: 'Alles weer samen.', endBody: 'Wij bouwen het voor jou. Elk onderdeel meet wat het volgende doet.', cta: 'Plan een gesprek', cases: 'Bekijk de resultaten', sample: 'Voorbeeld' },
  en: { label: 'The system, taken apart', intro: 'Seven parts. One path from click to customer.', end: 'All back together.', endBody: 'We build it for you. Every part measures what the next one does.', cta: 'Plan a call', cases: 'See the results', sample: 'Sample' },
}

/** The words inside each sample screen. Every name and figure here is invented and the window says "Voorbeeld". */
const UI = {
  nl: {
    ad: { win: 'Facebook', note: 'Budget volgt wat verkoopt', page: 'Verkoop Studio', meta: 'Gesponsord · 2 min', text: 'Meer klanten uit je advertenties? Vraag je gratis groeiplan aan.', head: 'Gratis groeiplan voor je webshop', site: 'verkoop.studio', cta: 'Meer info', reacts: '128', comments: '14 reacties', stats: [['Bereik', '', '12.480', ''], ['Kliks', '', '342', ''], ['Per klik', '€ ', '0,41', '']] },
    page: { win: 'jouwsite.be/actie', note: 'Eén pagina, één actie', h: 'Meer klanten uit je advertenties', ticks: ['Gratis plan op maat', 'Antwoord binnen 1 werkdag', 'Geen contract'], cta: 'Vraag je gratis plan aan', live: '3 mensen bekijken dit nu', rate: ['Conversie', '', '6,2', '%'] },
    form: { win: 'Aanvraag', note: 'Lead ontvangen', fields: [['Naam', 'Sarah Peeters'], ['E-mail', 'sarah@bakkerijpeeters.be'], ['Budget per maand', '€ 1.000 – € 5.000']], consent: 'Ik ga akkoord met de privacyverklaring', send: 'Verstuur', toast: 'Nieuwe lead in je CRM', src: 'via Facebook-advertentie' },
    crm: { win: 'Sales CRM', note: '38 van 500 gratis leads', cols: [['Nieuw', '€ 4.800'], ['Gecontacteerd', '€ 7.200'], ['Afspraak', '€ 3.100'], ['Voorstel', '€ 9.600']], cards: DEALS.nl, meter: 'gratis leads' },
    pixel: { win: 'Metingen · live', note: 'Cookiekeuze gerespecteerd', events: [['Pagina bekeken', '/actie', 'Meta', '14:02'], ['Knop geklikt', 'Plan aanvragen', 'Meta', '14:03'], ['Formulier verstuurd', 'Sarah P.', 'Meta', '14:04'], ['Pagina bekeken', '/prijzen', 'Google', '14:06'], ['Aankoop', '€ 84', 'Google', '14:09']], consent: 'Toestemming: ja' },
    dashboard: { win: 'Performance', note: 'Beste advertentie: video 2', kpis: [['Uitgaven', '€ ', '1.240', '', '+4%'], ['Omzet', '€ ', '5.890', '', '+18%'], ['Per euro', '', '4,7', '×', '+0,6']], channels: [['Meta', 62, '5,1×'], ['Google', 48, '4,4×'], ['TikTok', 21, '2,3×'], ['E-mail', 14, '8,0×']] },
    report: { win: 'Maandrapport · oktober', note: 'Elke maand in je mailbox', from: 'Verkoop Studio', to: 'aan jou', rows: [['up', 'Omzet uit advertenties', '+18%'], ['up', 'Meeste omzet via Google', '€ 2.910'], ['down', 'Facebook: duurdere leads', '+€ 3,20']], advice: 'Advies: zet € 300 meer op Google', open: 'Bekijk het rapport' },
  },
  en: {
    ad: { win: 'Facebook', note: 'Budget follows what sells', page: 'Verkoop Studio', meta: 'Sponsored · 2 min', text: 'More customers from your ads? Ask for your free growth plan.', head: 'A free growth plan for your shop', site: 'verkoop.studio', cta: 'Learn more', reacts: '128', comments: '14 comments', stats: [['Reach', '', '12,480', ''], ['Clicks', '', '342', ''], ['Per click', '€ ', '0.41', '']] },
    page: { win: 'yoursite.com/offer', note: 'One page, one action', h: 'More customers from your ads', ticks: ['A free plan for you', 'An answer within 1 working day', 'No contract'], cta: 'Ask for your free plan', live: '3 people are looking now', rate: ['Conversion', '', '6.2', '%'] },
    form: { win: 'Enquiry', note: 'Lead received', fields: [['Name', 'Sarah Peeters'], ['Email', 'sarah@peetersbakery.com'], ['Budget per month', '€ 1,000 – € 5,000']], consent: 'I agree to the privacy policy', send: 'Send', toast: 'New lead in your CRM', src: 'from a Facebook ad' },
    crm: { win: 'Sales CRM', note: '38 of 500 free leads', cols: [['New', '€ 4,800'], ['Contacted', '€ 7,200'], ['Meeting', '€ 3,100'], ['Proposal', '€ 9,600']], cards: DEALS.en, meter: 'free leads' },
    pixel: { win: 'Events · live', note: 'Cookie choice respected', events: [['Page viewed', '/offer', 'Meta', '14:02'], ['Button clicked', 'Ask for plan', 'Meta', '14:03'], ['Form sent', 'Sarah P.', 'Meta', '14:04'], ['Page viewed', '/pricing', 'Google', '14:06'], ['Purchase', '€ 84', 'Google', '14:09']], consent: 'Consent: yes' },
    dashboard: { win: 'Performance', note: 'Best ad: video 2', kpis: [['Spend', '€ ', '1,240', '', '+4%'], ['Revenue', '€ ', '5,890', '', '+18%'], ['Per euro', '', '4.7', '×', '+0.6']], channels: [['Meta', 62, '5.1×'], ['Google', 48, '4.4×'], ['TikTok', 21, '2.3×'], ['Email', 14, '8.0×']] },
    report: { win: 'Monthly report · October', note: 'In your inbox every month', from: 'Verkoop Studio', to: 'to you', rows: [['up', 'Revenue from ads', '+18%'], ['up', 'Most revenue through Google', '€ 2,910'], ['down', 'Facebook: dearer leads', '+€ 3.20']], advice: 'Advice: put € 300 more on Google', open: 'Open the report' },
  },
}

/** The character that runs each part of the system. */
const BUDDY: Record<LayerKey, [string, string]> = { ad: ['rocket', '#2b4bf2'], page: ['magnifier', '#ffd23f'], form: ['book', '#ff9fd0'], crm: ['brain', '#9be15d'], pixel: ['camera', '#7d93ff'], dashboard: ['bull', '#ff7a59'], report: ['cat', '#111110'] }

/** What sits inside the app window for one layer. Flat HTML, so every word stays readable, with hover life inside. */
function Screen({ k, lang, on }: { k: LayerKey; lang: Lang; on: boolean }) {
  const u = UI[lang]
  const beat = useBeat(on, k === 'pixel' ? 1400 : 1700)
  const [liked, setLiked] = useState(false)

  if (k === 'ad') {
    const a = u.ad
    return (
      <div className="tx-ad">
        <div className="tx-post-head"><BotAvatar shape="verkoop" size={26} eyeColor="#ffffff" className="tx-ava-bot" /><p><b>{a.page}</b><span>{a.meta}</span></p><i>···</i></div>
        <p className="tx-post-text">{a.text}</p>
        <div className="tx-ad-img"><span className="tx-ad-mock"><i /><i /><i /></span></div>
        <div className="tx-ad-cta"><p><span>{a.site}</span><b>{a.head}</b></p><span className="tx-btn">{a.cta}</span></div>
        <div className="tx-ad-foot">
          <span className={`tx-like${liked ? ' is-on' : ''}`} onClick={() => setLiked((x) => !x)}>♥ <b>{liked ? '129' : a.reacts}</b></span>
          <span>{a.comments}</span>
          <span className="tx-ad-stats">{a.stats.map(([label, pre, v, suf]) => <em key={label}>{label} <Num pre={pre} v={v} suf={suf} /></em>)}</span>
        </div>
      </div>
    )
  }
  if (k === 'page') {
    const pg = u.page
    return (
      <div className="tx-page">
        <div className="tx-page-main">
          <p className="tx-live"><i />{pg.live}</p>
          <p className="tx-page-h">{pg.h}</p>
          <ul>{pg.ticks.map((t, i) => <li key={t}><Tick delay={0.3 + i * 0.15} />{t}</li>)}</ul>
          <span className="tx-btn tx-btn--ink tx-magnet">{pg.cta} →</span>
        </div>
        <div className="tx-page-side">
          <p className="tx-stars">★★★★★ <span>4,9</span></p>
          <p className="tx-rate">{pg.rate[0]}<Num pre={pg.rate[1]} v={pg.rate[2]} suf={pg.rate[3]} /></p>
          <span className="tx-spark"><svg viewBox="0 0 100 34" preserveAspectRatio="none"><path pathLength={1} d="M0 30 18 24 34 26 52 15 70 18 86 8 100 4" /></svg></span>
        </div>
      </div>
    )
  }
  if (k === 'form') {
    const f = u.form
    const sent = on && beat % 4 >= 2
    return (
      <div className="tx-form">
        {f.fields.map(([label, value], i) => (
          <label key={label} className={i === 2 ? 'tx-select' : ''}><span>{label}</span><b className={`tx-type tx-type--${i + 1}`}>{value}</b>{i < 2 && <Tick delay={1 + i * 0.9} />}</label>
        ))}
        <p className="tx-consent"><span className="tx-box"><Tick delay={2.4} /></span>{f.consent}</p>
        <span className={`tx-btn tx-btn--ink tx-send${sent ? ' is-sent' : ''}`}>{sent ? '✓' : f.send}</span>
        <p className={`tx-toast${sent ? ' is-on' : ''}`}><BotAvatar shape="mug" size={24} color="#ff9fd0" className="tx-ava-bot" /><b>{f.toast}<em>{f.src}</em></b></p>
      </div>
    )
  }
  if (k === 'crm') {
    const c = u.crm
    const move = on ? beat % 4 : 0
    return (
      <div className="tx-crm">
        {c.cols.map(([name, total], col) => (
          <div key={name} className="tx-col">
            <p className="tx-col-head" title={total}><b>{name}</b><span>{c.cards.filter((_, i) => i % 4 === col && i !== 0).length + (move === col ? 1 : 0)}</span></p>
            {c.cards.filter((_, i) => i % 4 === col && i !== 0).map(([ini, who, value, src, due]) => (
              <span key={who} className="tx-deal"><BotAvatar shape={PEOPLE[ini]?.[0] ?? "chat"} color={PEOPLE[ini]?.[1] ?? "#7d93ff"} size={20} className="tx-ava-bot" /><b>{who}</b><em><Num v={value} /></em><i style={{ color: SOURCE[src] }}>● {src}</i><small>{due}</small></span>
            ))}
            {move === col && (() => { const [ini, who, value, src, due] = c.cards[0]; return <motion.span layoutId={`deal-${lang}`} className="tx-deal tx-deal--hot" transition={{ type: 'spring', stiffness: 240, damping: 24 }}><BotAvatar shape={PEOPLE[ini]?.[0] ?? "chat"} color={PEOPLE[ini]?.[1] ?? "#7d93ff"} size={20} className="tx-ava-bot" /><b>{who}</b><em><Num v={value} /></em><i style={{ color: SOURCE[src] }}>● {src}</i><small>{due}</small></motion.span> })()}
          </div>
        ))}
        <p className="tx-meter"><span><b style={{ width: `${((38 + move) / 500) * 100 + 3}%` }} /></span><Num v={String(38 + move)} suf=" / 500" /> {c.meter}</p>
      </div>
    )
  }
  if (k === 'pixel') {
    const p = u.pixel
    const shown = on ? 2 + (beat % 4) : 3
    return (
      <div className="tx-pixel">
        <p className="tx-pixel-top"><span className="tx-pulse" /><b>{lang === 'nl' ? 'Vandaag' : 'Today'} · <Num v="5" /> {lang === 'nl' ? 'meetpunten' : 'events'}</b><em>✓ {p.consent}</em></p>
        <ul className="tx-feed">
          {p.events.slice(0, shown).reverse().map(([what, detail, src, time], i) => (
            <motion.li key={what + time} layout initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className={what.startsWith('Aankoop') || what.startsWith('Purchase') ? 'is-sale' : ''}>
              <span className="tx-ev" style={{ background: SOURCE[src] }} /><b>{what}</b><em>{detail}</em><i>{src}</i><small>{time}</small>
              {i === 0 && <span className="tx-new">{lang === 'nl' ? 'nieuw' : 'new'}</span>}
            </motion.li>
          ))}
        </ul>
      </div>
    )
  }
  if (k === 'dashboard') {
    const nl = lang === 'nl'
    return (
      <div className="tx-dash-stb">
        <StackedBars lang={lang} title={nl ? 'Omzet per kanaal' : 'Revenue by channel'} unit={nl ? 'omzet' : 'revenue'} prefix="€ " cats={['Meta', 'Google', 'TikTok', nl ? 'E-mail' : 'Email']} escLabel={nl ? 'Retouren' : 'Returns'} width={520} plotHeight={82} belowHeight={14} bars={24} />
      </div>
    )
  }
  const r = u.report
  return (
    <div className="tx-mail">
      <div className="tx-post-head"><BotAvatar shape="verkoop" size={26} eyeColor="#ffffff" className="tx-ava-bot" /><p><b>{r.from}</b><span>{r.to}</span></p><i>09:00</i></div>
      <ul className="tx-report">
        {r.rows.map(([dir, label, value], i) => (
          <li key={label} style={{ animationDelay: `${0.3 + i * 0.2}s` }}><span className={`tx-dir tx-dir--${dir}`}>{dir === 'up' ? '↑' : '↓'}</span>{label}<b>{value}</b></li>
        ))}
      </ul>
      <p className="tx-advice"><span>★</span>{r.advice}</p>
      <span className="tx-btn">{r.open} →</span>
    </div>
  )
}

function Tick({ delay = 0 }: { delay?: number }) {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path className="tx-tick" style={{ animationDelay: `${delay}s` }} d="M2 7.5 5.5 11 12 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" pathLength={1} /></svg>
}

/* ── App views inside the cards: a second tab per window, laid out like a real CRM table ── */

type Cell =
  | { t: 'who'; shape: string; color: string; name: string; sub?: string }
  | { t: 'pill'; v: string; tone: 'blue' | 'green' | 'amber' | 'pink' | 'grey' | 'red' }
  | { t: 'pills'; v: [string, Tone][] }
  | { t: 'odds'; v: number }
  | { t: 'spark'; v: number[] }
  | { t: 'money'; v: string }
  | { t: 'text'; v: string }
  | { t: 'date'; v: string; tag?: string }
type Tone = 'blue' | 'green' | 'amber' | 'pink' | 'grey' | 'red'
type Table = { tabs: [string, string]; count?: string; chips: string[]; cols: string[]; widths: string; rows: Cell[][] }

const who = (shape: string, color: string, name: string, sub?: string): Cell => ({ t: 'who', shape, color, name, sub })
const pill = (v: string, tone: Tone): Cell => ({ t: 'pill', v, tone })
const odds = (v: number): Cell => ({ t: 'odds', v })
const spark = (...v: number[]): Cell => ({ t: 'spark', v })
const money = (v: string): Cell => ({ t: 'money', v })
const text = (v: string): Cell => ({ t: 'text', v })
const date = (v: string, tag?: string): Cell => ({ t: 'date', v, tag })

/** The second tab of each window. Every row is sample data under the window's "Voorbeeld" chip. */
const TABLES: Record<Lang, Record<LayerKey, Table>> = {
  nl: {
    ad: { tabs: ['Advertentie', 'Campagnes'], count: '4', chips: ['Sorteer: Rendement', 'Status: Actief'], cols: ['Campagne', 'Status', 'Trend', 'Rendement'], widths: '1.5fr 0.9fr 0.9fr 0.9fr', rows: [
      [who('rocket', '#2b4bf2', 'Zomeractie', 'Meta'), pill('Actief', 'green'), spark(3, 4, 6, 5, 7, 8, 9), odds(8)],
      [who('star', '#ffd23f', 'Nieuwe klanten', 'Google'), pill('Actief', 'green'), spark(4, 4, 5, 6, 5, 7, 7), odds(7)],
      [who('cloud', '#7d93ff', 'Retargeting', 'Meta'), pill('Leert', 'amber'), spark(2, 3, 3, 4, 3, 4, 5), odds(5)],
      [who('bunny', '#ff9fd0', 'Merkvideo', 'TikTok'), pill('Gepauzeerd', 'grey'), spark(5, 4, 3, 3, 2, 2, 1), odds(2)],
    ] },
    page: { tabs: ['Pagina', 'Varianten'], count: '2', chips: ['Test: Kop', 'Laatste 14 dagen'], cols: ['Variant', 'Bezoekers', 'Trend', 'Conversie'], widths: '1.4fr 0.9fr 0.9fr 1fr', rows: [
      [who('magnifier', '#ffd23f', 'A · "Meer klanten"', 'winnaar'), money('2.140'), spark(3, 5, 6, 6, 7, 8, 8), odds(8)],
      [who('lightbulb', '#c9f26a', 'B · "Gratis plan"', 'test'), money('2.098'), spark(4, 4, 5, 4, 5, 5, 6), odds(5)],
    ] },
    form: { tabs: ['Formulier', 'Inzendingen'], count: '12', chips: ['Bron: Alle', 'Vandaag'], cols: ['Wie', 'Bron', 'Budget', 'Binnen'], widths: '1.5fr 0.9fr 1fr 0.8fr', rows: [
      [who('mug', '#ff9fd0', 'Sarah Peeters', 'Bakkerij'), pill('Facebook', 'blue'), money('€ 1–5k'), date('14:04')],
      [who('controller', '#7d93ff', 'Tom De Wit', 'Garage'), pill('Google', 'red'), money('€ 5–15k'), date('11:37')],
      [who('sprout', '#c9f26a', 'Lien Vos', 'Tuinen'), pill('Website', 'grey'), money('< € 1k'), date('09:12')],
      [who('chat', '#ff7a59', 'Eva Claes', 'Kliniek'), pill('Facebook', 'blue'), money('€ 1–5k'), date('gisteren')],
    ] },
    crm: { tabs: ['Pipeline', 'Leads'], count: '38', chips: ['Eigenaar: Iedereen', 'Fase: Alle', '90 dagen'], cols: ['Lead', 'Fase', 'Kans', 'Waarde', 'Contact'], widths: '1.45fr 1fr 0.95fr 0.8fr 0.8fr', rows: [
      [who('chat', '#ff7a59', 'Eva Claes', 'Kliniek'), { t: 'pills', v: [['Voorstel', 'blue'], ['Warm', 'pink']] }, odds(8), money('€ 5.100'), date('vandaag', 'Bellen')],
      [who('lightbulb', '#ffd23f', 'Jonas Maes', 'Bouw'), pill('Afspraak', 'green'), odds(6), money('€ 4.500'), date('ma', 'Demo')],
      [who('sprout', '#c9f26a', 'Lien Vos', 'Tuinen'), pill('Gecontacteerd', 'amber'), odds(4), money('€ 3.100'), date('do')],
      [who('mug', '#ff9fd0', 'Sarah Peeters', 'Bakkerij'), pill('Nieuw', 'grey'), odds(3), money('€ 2.400'), date('14:04')],
    ] },
    pixel: { tabs: ['Live', 'Bronnen'], count: '5', chips: ['Vandaag', 'Toestemming: ja'], cols: ['Bron', 'Bezoeken', 'Trend', 'Verkopen'], widths: '1.3fr 0.9fr 1fr 1fr', rows: [
      [who('rocket', '#1877f2', 'Meta', 'advertenties'), money('1.284'), spark(4, 5, 5, 6, 7, 6, 8), odds(7)],
      [who('magnifier', '#ea4335', 'Google', 'zoeken'), money('962'), spark(5, 5, 6, 6, 6, 7, 7), odds(8)],
      [who('cloud', '#111110', 'Direct', 'typt je adres'), money('410'), spark(3, 3, 4, 3, 4, 4, 4), odds(5)],
      [who('book', '#7d93ff', 'E-mail', 'nieuwsbrief'), money('188'), spark(2, 6, 2, 2, 7, 2, 3), odds(9)],
    ] },
    dashboard: { tabs: ['Kanalen', 'Advertenties'], count: '6', chips: ['Sorteer: Omzet', 'Laatste 30 dagen'], cols: ['Advertentie', 'Kanaal', 'Uitgaven', 'Omzet', 'Rendement'], widths: '1.4fr 0.8fr 0.8fr 0.8fr 0.95fr', rows: [
      [who('star', '#ff7a59', 'Video 2 · keuken', 'beste'), pill('Meta', 'blue'), money('€ 420'), money('€ 2.140'), odds(9)],
      [who('magnifier', '#ffd23f', 'Zoekwoord "offerte"', ''), pill('Google', 'red'), money('€ 310'), money('€ 1.380'), odds(7)],
      [who('bunny', '#ff9fd0', 'Carrousel · zomer', ''), pill('Meta', 'blue'), money('€ 280'), money('€ 760'), odds(5)],
      [who('cloud', '#7d93ff', 'Korte video', ''), pill('TikTok', 'grey'), money('€ 230'), money('€ 310'), odds(2)],
    ] },
    report: { tabs: ['Samenvatting', 'Acties'], count: '3', chips: ['Oktober', 'Voor: jou'], cols: ['Actie', 'Wie', 'Status', 'Tegen'], widths: '1.7fr 0.9fr 0.9fr 0.7fr', rows: [
      [text('€ 300 meer budget naar Google'), who('verkoop', '#2b4bf2', 'Stef'), pill('Bezig', 'amber'), date('ma')],
      [text('Nieuwe video voor Facebook'), who('verkoop', '#2b4bf2', 'Stef'), pill('Gepland', 'blue'), date('do')],
      [text('Prijspagina sneller maken'), who('cat', '#111110', 'Jij'), pill('Klaar', 'green'), date('✓')],
    ] },
  },
  en: {
    ad: { tabs: ['Ad', 'Campaigns'], count: '4', chips: ['Sort: Return', 'Status: Active'], cols: ['Campaign', 'Status', 'Trend', 'Return'], widths: '1.5fr 0.9fr 0.9fr 0.9fr', rows: [
      [who('rocket', '#2b4bf2', 'Summer offer', 'Meta'), pill('Active', 'green'), spark(3, 4, 6, 5, 7, 8, 9), odds(8)],
      [who('star', '#ffd23f', 'New customers', 'Google'), pill('Active', 'green'), spark(4, 4, 5, 6, 5, 7, 7), odds(7)],
      [who('cloud', '#7d93ff', 'Retargeting', 'Meta'), pill('Learning', 'amber'), spark(2, 3, 3, 4, 3, 4, 5), odds(5)],
      [who('bunny', '#ff9fd0', 'Brand video', 'TikTok'), pill('Paused', 'grey'), spark(5, 4, 3, 3, 2, 2, 1), odds(2)],
    ] },
    page: { tabs: ['Page', 'Variants'], count: '2', chips: ['Test: Headline', 'Last 14 days'], cols: ['Variant', 'Visitors', 'Trend', 'Conversion'], widths: '1.4fr 0.9fr 0.9fr 1fr', rows: [
      [who('magnifier', '#ffd23f', 'A · "More customers"', 'winner'), money('2,140'), spark(3, 5, 6, 6, 7, 8, 8), odds(8)],
      [who('lightbulb', '#c9f26a', 'B · "Free plan"', 'test'), money('2,098'), spark(4, 4, 5, 4, 5, 5, 6), odds(5)],
    ] },
    form: { tabs: ['Form', 'Entries'], count: '12', chips: ['Source: All', 'Today'], cols: ['Who', 'Source', 'Budget', 'In'], widths: '1.5fr 0.9fr 1fr 0.8fr', rows: [
      [who('mug', '#ff9fd0', 'Sarah Peeters', 'Bakery'), pill('Facebook', 'blue'), money('€ 1–5k'), date('14:04')],
      [who('controller', '#7d93ff', 'Tom De Wit', 'Garage'), pill('Google', 'red'), money('€ 5–15k'), date('11:37')],
      [who('sprout', '#c9f26a', 'Lien Vos', 'Gardens'), pill('Website', 'grey'), money('< € 1k'), date('09:12')],
      [who('chat', '#ff7a59', 'Eva Claes', 'Clinic'), pill('Facebook', 'blue'), money('€ 1–5k'), date('yesterday')],
    ] },
    crm: { tabs: ['Pipeline', 'Leads'], count: '38', chips: ['Owner: Everyone', 'Stage: All', '90 days'], cols: ['Lead', 'Stage', 'Odds', 'Value', 'Contact'], widths: '1.45fr 1fr 0.95fr 0.8fr 0.8fr', rows: [
      [who('chat', '#ff7a59', 'Eva Claes', 'Clinic'), { t: 'pills', v: [['Proposal', 'blue'], ['Warm', 'pink']] }, odds(8), money('€ 5,100'), date('today', 'Call')],
      [who('lightbulb', '#ffd23f', 'Jonas Maes', 'Building'), pill('Meeting', 'green'), odds(6), money('€ 4,500'), date('Mon', 'Demo')],
      [who('sprout', '#c9f26a', 'Lien Vos', 'Gardens'), pill('Contacted', 'amber'), odds(4), money('€ 3,100'), date('Thu')],
      [who('mug', '#ff9fd0', 'Sarah Peeters', 'Bakery'), pill('New', 'grey'), odds(3), money('€ 2,400'), date('14:04')],
    ] },
    pixel: { tabs: ['Live', 'Sources'], count: '5', chips: ['Today', 'Consent: yes'], cols: ['Source', 'Visits', 'Trend', 'Sales'], widths: '1.3fr 0.9fr 1fr 1fr', rows: [
      [who('rocket', '#1877f2', 'Meta', 'ads'), money('1,284'), spark(4, 5, 5, 6, 7, 6, 8), odds(7)],
      [who('magnifier', '#ea4335', 'Google', 'search'), money('962'), spark(5, 5, 6, 6, 6, 7, 7), odds(8)],
      [who('cloud', '#111110', 'Direct', 'types your address'), money('410'), spark(3, 3, 4, 3, 4, 4, 4), odds(5)],
      [who('book', '#7d93ff', 'Email', 'newsletter'), money('188'), spark(2, 6, 2, 2, 7, 2, 3), odds(9)],
    ] },
    dashboard: { tabs: ['Channels', 'Ads'], count: '6', chips: ['Sort: Revenue', 'Last 30 days'], cols: ['Ad', 'Channel', 'Spend', 'Revenue', 'Return'], widths: '1.4fr 0.8fr 0.8fr 0.8fr 0.95fr', rows: [
      [who('star', '#ff7a59', 'Video 2 · kitchen', 'best'), pill('Meta', 'blue'), money('€ 420'), money('€ 2,140'), odds(9)],
      [who('magnifier', '#ffd23f', 'Keyword "quote"', ''), pill('Google', 'red'), money('€ 310'), money('€ 1,380'), odds(7)],
      [who('bunny', '#ff9fd0', 'Carousel · summer', ''), pill('Meta', 'blue'), money('€ 280'), money('€ 760'), odds(5)],
      [who('cloud', '#7d93ff', 'Short video', ''), pill('TikTok', 'grey'), money('€ 230'), money('€ 310'), odds(2)],
    ] },
    report: { tabs: ['Summary', 'Actions'], count: '3', chips: ['October', 'For: you'], cols: ['Action', 'Who', 'Status', 'By'], widths: '1.7fr 0.9fr 0.9fr 0.7fr', rows: [
      [text('€ 300 more budget to Google'), who('verkoop', '#2b4bf2', 'Stef'), pill('Doing', 'amber'), date('Mon')],
      [text('A new video for Facebook'), who('verkoop', '#2b4bf2', 'Stef'), pill('Planned', 'blue'), date('Thu')],
      [text('Make the pricing page faster'), who('cat', '#111110', 'You'), pill('Done', 'green'), date('✓')],
    ] },
  },
}

function CellView({ c }: { c: Cell }) {
  if (c.t === 'who') return <span className="tx-who"><BotAvatar shape={c.shape} color={c.color} eyeColor={c.color === '#111110' || c.color === '#2b4bf2' ? '#ffffff' : undefined} size={20} /><span><b>{c.name}</b>{c.sub && <em>{c.sub}</em>}</span></span>
  if (c.t === 'pill') return <span className={`tx-pill tx-pill--${c.tone}`}>{c.v}</span>
  if (c.t === 'pills') return <span className="tx-pills">{c.v.map(([v, tone]) => <span key={v} className={`tx-pill tx-pill--${tone}`}>{v}</span>)}</span>
  if (c.t === 'odds') return <Odds v={c.v} />
  if (c.t === 'spark') return <Spark v={c.v} />
  if (c.t === 'money') return <span className="tx-money">{c.v}</span>
  if (c.t === 'date') return <span className="tx-date"><span>{c.v}</span>{c.tag && <em>{c.tag}</em>}</span>
  return <span className="tx-cell-text">{c.v}</span>
}

/** The second tab: filter chips, then the rows. Rows lift under the pointer and the hovered one gets a ring. */
function TableView({ table }: { table: Table }) {
  return (
    <div className="tx-tbl" style={{ '--cols': table.widths } as CSSProperties}>
      <p className="tx-chips">{table.chips.map((chip) => { const [k, v] = chip.split(': '); return <span key={chip}>{v ? <><em>{k}</em>{v}</> : k}<i>▾</i></span> })}</p>
      <div className="tx-tr tx-th">{table.cols.map((col) => <span key={col}>{col}</span>)}</div>
      {table.rows.map((row, i) => (
        <motion.div key={i} className="tx-tr" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.06, duration: 0.35 }}>
          {row.map((cell, j) => <CellView key={j} c={cell} />)}
        </motion.div>
      ))}
    </div>
  )
}

/** The window's title bar holds the tabs; the line under the open tab slides between them. */
function WinTabs({ tabs, count, tab, setTab, sample, id }: { tabs: [string, string]; count?: string; tab: number; setTab: (n: number) => void; sample: string; id: string }) {
  return (
    <div className="tx-win-bar tx-win-bar--tabs">
      <i /><i /><i />
      <span className="tx-tabs" role="tablist">
        {tabs.map((label, i) => (
          <span key={label} role="tab" aria-selected={tab === i} className={`tx-tab${tab === i ? ' is-on' : ''}`} onClick={(e) => { e.stopPropagation(); setTab(i) }}>
            {label}{i === 1 && count && <small>{count}</small>}
            {tab === i && <motion.b layoutId={`tab-${id}`} className="tx-tab-line" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
          </span>
        ))}
      </span>
      <em>{sample}</em>
    </div>
  )
}

/** One part of the system as a card: its screen on top, what it does for you underneath. */
function Card({ layer, index, lang, active }: { layer: Layer; index: number; lang: Lang; active: boolean }) {
  const ui = UI[lang][layer.key]
  const table = TABLES[lang][layer.key]
  const [tab, setTab] = useState(0)
  const [touched, setTouched] = useState(false)
  /* while the card is in front, the window flips to its second tab and back on its own, until someone picks a tab */
  useEffect(() => {
    if (!active) { setTab(0); setTouched(false); return }
    if (touched || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setTab((x) => 1 - x), 5200)
    return () => window.clearInterval(id)
  }, [active, touched])
  return (
    <article className={`tx-card${active ? ' is-on' : ''}${layer.key === 'dashboard' ? ' tx-card--tall' : ''}`} style={{ '--t': layer.tint } as CSSProperties}>
      <div className="tx-stage" aria-hidden="true">
        <div className="tx-win">
          <WinTabs tabs={table.tabs} count={table.count} tab={tab} setTab={(n) => { setTouched(true); setTab(n) }} sample={COPY[lang].sample} id={layer.key} />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={tab} className="tx-view" initial={{ opacity: 0, x: tab ? 18 : -18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: tab ? -18 : 18 }} transition={{ duration: 0.28, ease: EASE }}>
              {tab === 0 ? <Screen k={layer.key} lang={lang} on={active} /> : <TableView table={table} />}
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="tx-note"><Tick delay={0.9} />{ui.note}</p>
        <span className="tx-buddy"><BotAvatar shape={BUDDY[layer.key][0]} color={BUDDY[layer.key][1]} eyeColor={layer.key === 'report' ? '#ffffff' : undefined} size={60} live={active} mood={active ? 'happy' : 'idle'} /></span>
      </div>
      <div className="tx-info">
        <p className="tx-step">{String(index + 1).padStart(2, '0')} / {String(LAYERS.length).padStart(2, '0')}</p>
        <h3 className="tx-title">{layer.title[lang]}</h3>
        <p className="tx-body">{layer.body[lang]}</p>
        <ul className="tx-specs">{layer.specs[lang].map((spec) => <li key={spec}><Tick />{spec}</li>)}</ul>
      </div>
    </article>
  )
}

/** Dot shapes for the mark beside the cards: one set of dots, a new home for each on every step. */
const SHAPES = [
  (x: number, y: number) => x * x + y * y < 0.72,
  (x: number, y: number) => Math.abs(x) < 0.74 && Math.abs(y) < 0.74,
  (x: number, y: number) => y > -0.8 && y < 0.8 && Math.abs(x) < 0.16 + (0.8 - y) * 0.42,
  (x: number, y: number) => { const r = x * x + y * y; return r < 0.76 && r > 0.3 },
]
const DOTS = 220

function homes(shape: number, size: number) {
  const inside = SHAPES[shape % SHAPES.length]
  const pts: number[][] = []
  for (let gap = 0.2; pts.length < DOTS && gap > 0.04; gap -= 0.01) {
    pts.length = 0
    for (let y = -1, row = 0; y <= 1; y += gap * 0.87, row++) for (let x = -1 + (row % 2) * gap * 0.5; x <= 1; x += gap) if (inside(x, y)) pts.push([x, y])
  }
  return Array.from({ length: DOTS }, (_, i) => { const p = pts[Math.floor((i * pts.length) / DOTS)]; return [(p[0] + 1) * size / 2, (p[1] + 1) * size / 2] })
}

/** A shape made of dots that re-forms for each step and parts round the pointer. */
function DotMark({ step }: { step: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const state = useRef<{ dots: number[][]; hand: number[] | null; raf: number }>({ dots: [], hand: null, raf: 0 })
  const SIZE = 180
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const s = state.current
    const ratio = Math.min(2, window.devicePixelRatio || 1)
    canvas.width = canvas.height = SIZE * ratio
    const next = homes(Math.max(0, step), SIZE)
    if (!s.dots.length) s.dots = next.map(([x, y]) => [x, y, 0, 0, x, y])
    else {
      const byAngle = (list: number[][], a: number, b: number) => list.map((d, i) => [Math.atan2(d[b] - SIZE / 2, d[a] - SIZE / 2), i]).sort((p, q) => p[0] - q[0])
      const from = byAngle(s.dots, 0, 1), to = byAngle(next, 0, 1)
      from.forEach(([, di], k) => { s.dots[di][4] = next[to[k][1]][0]; s.dots[di][5] = next[to[k][1]][1] })
    }
    const g = canvas.getContext('2d')!
    const tick = () => {
      let busy = !!s.hand
      g.setTransform(ratio, 0, 0, ratio, 0, 0); g.clearRect(0, 0, SIZE, SIZE); g.fillStyle = getComputedStyle(canvas).color; g.beginPath()
      for (const d of s.dots) {
        if (s.hand) { const dx = d[0] - s.hand[0], dy = d[1] - s.hand[1], dist = Math.hypot(dx, dy); if (dist < 46 && dist > 0.01) { const f = (1 - dist / 46) ** 2 * 5; d[2] += (dx / dist) * f; d[3] += (dy / dist) * f } }
        d[2] = (d[2] + (d[4] - d[0]) * 0.06) * 0.82; d[3] = (d[3] + (d[5] - d[1]) * 0.06) * 0.82
        d[0] += d[2]; d[1] += d[3]
        if (Math.abs(d[2]) + Math.abs(d[3]) + Math.abs(d[4] - d[0]) + Math.abs(d[5] - d[1]) > 0.08) busy = true
        g.moveTo(d[0] + 1.7, d[1]); g.arc(d[0], d[1], 1.7, 0, Math.PI * 2)
      }
      g.fill()
      s.raf = busy ? requestAnimationFrame(tick) : 0
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { s.dots.forEach((d) => { d[0] = d[4]; d[1] = d[5] }) }
    cancelAnimationFrame(s.raf); s.raf = requestAnimationFrame(tick)
    const move = (e: PointerEvent) => { const box = canvas.getBoundingClientRect(); s.hand = [e.clientX - box.left, e.clientY - box.top]; if (!s.raf) s.raf = requestAnimationFrame(tick) }
    const leave = () => { s.hand = null; if (!s.raf) s.raf = requestAnimationFrame(tick) }
    canvas.addEventListener('pointermove', move); canvas.addEventListener('pointerleave', leave)
    return () => { cancelAnimationFrame(s.raf); s.raf = 0; canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerleave', leave) }
  }, [step])
  return <canvas ref={ref} className="tx-dots" style={{ width: SIZE, height: SIZE }} aria-hidden="true" />
}

const PHASE_START = 0.06
const PHASE_END = 0.9

/**
 * The growth system, one part at a time. On a wide screen the section pins and each
 * part arrives as a card dealt onto a small pile, with its own sample screen; the
 * index on the left jumps between them. Phones and reduced motion get the same
 * cards as a plain list.
 */
export default function SystemTeardown() {
  const { lang } = useLang()
  const t = COPY[lang]
  const reduce = useReducedMotion()
  const wide = useWide()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [step, setStep] = useState(-1)

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (p < PHASE_START) return setStep(-1)
    if (p > PHASE_END) return setStep(LAYERS.length)
    setStep(Math.min(LAYERS.length - 1, Math.floor(((p - PHASE_START) / (PHASE_END - PHASE_START)) * LAYERS.length)))
  })

  const cta = <Cta to="/contact" onClick={() => trackEvent('audit_cta_clicked', { placement: 'home_teardown' })}>{t.cta}</Cta>

  if (reduce || !wide) {
    return (
      <section className="tx tx--list" aria-labelledby="td-title">
        <div className="vs-wrap">
          <p className="vs-label">{t.label}</p>
          <h2 id="td-title" className="vs-h2">{t.intro}</h2>
          <div className="tx-list">{LAYERS.map((layer, i) => <Card key={layer.key} layer={layer} index={i} lang={lang} active />)}</div>
          <p className="tx-end">{t.end}</p>
          {cta}
        </div>
      </section>
    )
  }

  const jump = (i: number) => {
    const el = ref.current
    if (!el) return
    const span = el.offsetHeight - window.innerHeight
    const at = PHASE_START + ((i + 0.5) / LAYERS.length) * (PHASE_END - PHASE_START)
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + span * at, behavior: 'smooth' })
  }
  const done = step >= LAYERS.length
  const shown = Math.min(step, LAYERS.length - 1)

  return (
    <section ref={ref} className="tx" aria-labelledby="td-title" style={{ height: `${LAYERS.length * 62 + 150}vh` }}>
      <div className="tx-sticky">
        <div className="vs-wrap tx-grid">
          <div className="tx-side">
            <p className="vs-label">{t.label}</p>
            <AnimatePresence mode="wait">
              <motion.h2 key={done ? 'end' : 'intro'} id="td-title" className="tx-head" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.45, ease: EASE }}>
                {done ? t.end : t.intro}
              </motion.h2>
            </AnimatePresence>
            <ol className="tx-index">
              {LAYERS.map((layer, i) => (
                <li key={layer.key}>
                  <button type="button" className={i === shown ? 'is-on' : i < shown ? 'is-past' : ''} onClick={() => jump(i)} aria-current={i === shown ? 'step' : undefined}>
                    <span>{String(i + 1).padStart(2, '0')}</span>{layer.title[lang]}
                  </button>
                </li>
              ))}
            </ol>
            <div className="tx-foot">
              <DotMark step={shown} />
              {done && (
                <motion.div className="tx-actions" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE }}>
                  <p>{t.endBody}</p>
                  {cta}
                  <TextLink to="/#resultaten">{t.cases}</TextLink>
                </motion.div>
              )}
            </div>
          </div>
          <div className="tx-deck">
            {LAYERS.map((layer, i) => {
              const depth = shown - i
              const waiting = depth < 0
              const lean = (i % 2 ? 1 : -1)
              return (
                <motion.div
                  key={layer.key}
                  className="tx-slot"
                  style={{ zIndex: i + 1, pointerEvents: depth === 0 ? 'auto' : 'none' }}
                  initial={false}
                  animate={
                    waiting ? { y: step < 0 && i === 0 ? '64%' : '118%', rotate: lean * 5, scale: 1, opacity: 1 }
                    : done ? { y: (i - 3) * 7, x: (i - 3) * 16, rotate: (i - 3) * 2.4, scale: 0.9, opacity: 1 }
                    : { y: -depth * 18, x: 0, rotate: depth === 0 ? lean * 0.7 : lean * (1.4 + depth), scale: 1 - depth * 0.045, opacity: depth > 2 ? 0 : 1 }
                  }
                  transition={{ type: 'spring', stiffness: 150, damping: 21, mass: 0.9 }}
                >
                  <Card layer={layer} index={i} lang={lang} active={depth === 0 && !done} />
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
