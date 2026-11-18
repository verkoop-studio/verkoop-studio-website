import { Check } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'
import type { ServiceScreen } from '../../data/serviceSteps'
import type { Lang } from '../../data/types'
import BotAvatar from '../brand/BotAvatar'

/*
 * Sample screens for the service pages. Every name and figure in them is invented,
 * and every window says so in its title bar.
 */

type ScreenProps = { lang: Lang }
const SAMPLE = { nl: 'Voorbeeld', en: 'Sample' }
const v = (vars: Record<string, string | number>) => vars as CSSProperties

export function Win({ title, lang, children, className = '' }: { title: string; lang: Lang; children: ReactNode; className?: string }) {
  return (
    <div className={`sv-win ${className}`.trim()}>
      <div className="sv-win-bar"><i /><i /><i /><b>{title}</b><em>{SAMPLE[lang]}</em></div>
      <div className="sv-win-body">{children}</div>
    </div>
  )
}

const Tick = () => <span className="sv-tick"><Check size={13} strokeWidth={2.6} /></span>
const Lines = ({ n = 2 }: { n?: number }) => <span className="sv-lines">{Array.from({ length: n }, (_, i) => <i key={i} />)}</span>

/* ---------- Meta Ads ---------- */

const ADS = {
  nl: [{ stage: 'Koud', text: 'Maak kennis in 20 seconden.', cta: 'Meer info', tone: 'video' }, { stage: 'Warm', text: 'Zo werkt het, stap voor stap.', cta: 'Bekijk', tone: 'steps' }, { stage: 'Retargeting', text: 'Je mandje wacht nog op je.', cta: 'Afrekenen', tone: 'cart' }],
  en: [{ stage: 'Cold', text: 'Meet us in 20 seconds.', cta: 'Learn more', tone: 'video' }, { stage: 'Warm', text: 'How it works, step by step.', cta: 'Watch', tone: 'steps' }, { stage: 'Retargeting', text: 'Your cart is still waiting.', cta: 'Check out', tone: 'cart' }],
}

export function AdCard({ index, lang }: { index: number; lang: Lang }) {
  const ad = ADS[lang][index]
  return (
    <div className="sv-ad">
      <div className="sv-ad-head"><span className="sv-ava">v.</span><p><b>{lang === 'nl' ? 'Jouw merk' : 'Your brand'}</b><span>{lang === 'nl' ? 'Gesponsord' : 'Sponsored'}</span></p><span className="sv-stage">{ad.stage}</span></div>
      <div className={`sv-ad-img sv-ad-img--${ad.tone}`} aria-hidden="true">
        {ad.tone === 'video' && <span className="sv-play"><svg width="16" height="16" viewBox="0 0 14 14"><path d="M4 2.5v9l7.5-4.5Z" fill="currentColor" /></svg></span>}
        {ad.tone === 'steps' && <span className="sv-ad-steps"><i>1</i><i>2</i><i>3</i></span>}
        {ad.tone === 'cart' && <span className="sv-ad-cart"><b>1</b></span>}
      </div>
      <div className="sv-ad-foot"><p>{ad.text}</p><span className="sv-btn">{ad.cta}</span></div>
    </div>
  )
}

function Campaigns({ lang }: ScreenProps) {
  const nl = lang === 'nl'
  const rows: [string, string, string, number][] = nl
    ? [['Koud', 'Nieuwe mensen · 25–55 · Oost-Vlaanderen', '€ 20 / dag', 56], ['Warm', 'Bezocht je site · laatste 30 dagen', '€ 10 / dag', 28], ['Retargeting', 'Mandje niet afgerond', '€ 6 / dag', 16]]
    : [['Cold', 'New people · 25–55 · East Flanders', '€ 20 / day', 56], ['Warm', 'Visited your site · last 30 days', '€ 10 / day', 28], ['Retargeting', 'Cart not finished', '€ 6 / day', 16]]
  return (
    <Win title={nl ? 'Advertentiebeheer' : 'Ads Manager'} lang={lang}>
      <p className="sv-goal"><span className="sv-pulse" />{nl ? 'Doel: verkopen' : 'Goal: sales'}</p>
      <ul className="sv-tree">
        {rows.map(([stage, who, budget, share], i) => <li key={stage} style={v({ '--w': `${share}%`, '--d': `${0.2 + i * 0.12}s` })}><b>{stage}</b><span>{who}</span><em>{budget}</em><i className="sv-bar" /></li>)}
      </ul>
    </Win>
  )
}

function Creatives({ lang }: ScreenProps) {
  return <Win title="Instagram · Facebook" lang={lang}><div className="sv-ads">{[0, 1, 2].map((i) => <AdCard key={i} index={i} lang={lang} />)}</div></Win>
}

function Table({ title, head, rows, advice, lang }: { title: string; head: string[]; rows: string[][]; advice?: string; lang: Lang }) {
  return (
    <Win title={title} lang={lang}>
      <table className="sv-table">
        <thead><tr>{head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
        <tbody>{rows.map((row) => <tr key={row[0]}>{row.map((cell, i) => (i === 0 ? <th key={i} scope="row">{cell}</th> : <td key={i}>{cell}</td>))}</tr>)}</tbody>
      </table>
      {advice && <p className="sv-advice"><span>★</span>{advice}</p>}
    </Win>
  )
}

const Report = ({ lang }: ScreenProps) => (lang === 'nl'
  ? <Table lang={lang} title="Maandrapport" head={['Campagne', 'Uitgaven', 'Verkopen', 'Per euro']} rows={[['Koud', '€ 600', '14', '3,1×'], ['Warm', '€ 300', '11', '4,6×'], ['Retargeting', '€ 180', '9', '6,2×']]} advice="Advies: zet € 100 meer op retargeting" />
  : <Table lang={lang} title="Monthly report" head={['Campaign', 'Spend', 'Sales', 'Per euro']} rows={[['Cold', '€ 600', '14', '3.1×'], ['Warm', '€ 300', '11', '4.6×'], ['Retargeting', '€ 180', '9', '6.2×']]} advice="Advice: put € 100 more on retargeting" />)

/* ---------- Search and landing pages ---------- */

function Search({ lang }: ScreenProps) {
  const nl = lang === 'nl'
  return (
    <Win title="Google" lang={lang}>
      <p className="sv-searchbar"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.6" /><path d="m9.5 9.5 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>{nl ? 'loodgieter gent' : 'plumber ghent'}<span className="sv-caret" /></p>
      <div className="sv-result sv-result--ad">
        <p className="sv-result-site"><b>{nl ? 'Gesponsord' : 'Sponsored'}</b> · jouwbedrijf.be</p>
        <p className="sv-result-title">{nl ? 'Loodgieter in Gent · Vandaag nog langs' : 'Plumber in Ghent · Out today'}</p>
        <Lines n={2} />
        <p className="sv-sitelinks"><span>{nl ? 'Prijzen' : 'Prices'}</span><span>{nl ? 'Afspraak' : 'Book'}</span><span>{nl ? 'Reviews' : 'Reviews'}</span></p>
      </div>
      <div className="sv-result"><p className="sv-result-site">concurrent.be</p><Lines n={2} /></div>
    </Win>
  )
}

const Keywords = ({ lang }: ScreenProps) => (lang === 'nl'
  ? <Table lang={lang} title="Zoekwoorden" head={['Campagne', 'Zoekterm', 'Kliks', 'Per aanvraag']} rows={[['Merk', 'jouwbedrijf', '210', '€ 4'], ['Niet-merk', 'loodgieter dringend', '96', '€ 18'], ['Lokaal', 'loodgieter gent', '140', '€ 11']]} />
  : <Table lang={lang} title="Keywords" head={['Campaign', 'Search term', 'Clicks', 'Per enquiry']} rows={[['Brand', 'yourcompany', '210', '€ 4'], ['Non-brand', 'emergency plumber', '96', '€ 18'], ['Local', 'plumber ghent', '140', '€ 11']]} />)

function Tracking({ lang }: ScreenProps) {
  const nl = lang === 'nl'
  const events = nl ? [['Formulier verstuurd', 'Google Ads · GA4'], ['Telefoonklik', 'Google Ads'], ['Offerte aangevraagd', 'GA4 · CRM'], ['Aankoop', 'GA4 · Meta']] : [['Form sent', 'Google Ads · GA4'], ['Phone click', 'Google Ads'], ['Quote requested', 'GA4 · CRM'], ['Purchase', 'GA4 · Meta']]
  return (
    <Win title={nl ? 'Conversies' : 'Conversions'} lang={lang}>
      <ul className="sv-events">{events.map(([name, where], i) => <li key={name} style={v({ '--d': `${0.15 + i * 0.12}s` })}><Tick /><b>{name}</b><em>{where}</em><span className="sv-live">{nl ? 'meet' : 'live'}</span></li>)}</ul>
    </Win>
  )
}

function Page({ lang }: ScreenProps) {
  const nl = lang === 'nl'
  return (
    <Win title={nl ? 'jouwsite.be/actie' : 'yoursite.com/offer'} lang={lang}>
      <div className="sv-page-mock">
        <span className="sv-page-chip">{nl ? '1 boodschap · 1 actie' : '1 message · 1 action'}</span>
        <p className="sv-page-h">{nl ? 'Meer klanten uit je advertenties' : 'More customers from your ads'}</p>
        <Lines n={2} />
        <span className="sv-page-cta">{nl ? 'Vraag je plan aan' : 'Ask for your plan'} →</span>
        <span className="sv-cursor" aria-hidden="true" />
      </div>
    </Win>
  )
}

function Sources({ lang }: ScreenProps) {
  const nl = lang === 'nl'
  const rows = [['Meta', '#1877f2'], ['Google', '#ea4335'], [nl ? 'E-mail' : 'Email', '#2b4bf2'], ['Referral', '#28c840']]
  return (
    <Win title={nl ? 'Hoe bezoekers binnenkomen' : 'How visitors arrive'} lang={lang}>
      <ul className="sv-sources">{rows.map(([name, color], i) => <li key={name} style={v({ '--c': color, '--d': `${i * 0.12}s` })}><i />{name}<span className="sv-arrow-line" /><b>{nl ? 'pagina' : 'page'}</b></li>)}</ul>
    </Win>
  )
}

/* ---------- Funnels ---------- */

function Funnel({ lang }: ScreenProps) {
  const nl = lang === 'nl'
  const nodes = nl ? ['Klik', 'Pagina', 'Lead', 'Opvolging', 'Klant'] : ['Click', 'Page', 'Lead', 'Follow-up', 'Customer']
  return (
    <Win title={nl ? 'Klantreis' : 'Customer journey'} lang={lang}>
      <ol className="sv-funnel">{nodes.map((node, i) => <li key={node} style={v({ '--d': `${i * 0.14}s` })}><span>{i + 1}</span>{node}</li>)}</ol>
      <p className="sv-funnel-foot">{nl ? 'Daarna: herhaalaankoop' : 'Then: repeat purchase'}</p>
    </Win>
  )
}

function Followup({ lang }: ScreenProps) {
  const nl = lang === 'nl'
  const rows = nl ? [['Nu', 'Bevestiging per e-mail'], ['+5 min', 'Lead in het CRM, taak voor jou'], ['+1 dag', 'Opvolgmail met een voorbeeld'], ['+3 dagen', 'Herinnering als er geen antwoord is']] : [['Now', 'Confirmation by email'], ['+5 min', 'Lead in the CRM, a task for you'], ['+1 day', 'Follow-up email with an example'], ['+3 days', 'Reminder if there is no reply']]
  return (
    <Win title={nl ? 'Opvolging' : 'Follow-up'} lang={lang}>
      <div className="sv-person"><BotAvatar shape="cat" size={34} color="#ff9fd0" /><p><b>Sarah Peeters</b><span>{nl ? 'Nieuwe lead · via Facebook' : 'New lead · from Facebook'}</span></p></div>
      <ol className="sv-timeline">{rows.map(([when, what], i) => <li key={when} className={i === 0 ? 'is-done' : ''}><em>{when}</em>{what}</li>)}</ol>
    </Win>
  )
}

function Dashboard({ lang }: ScreenProps) {
  const nl = lang === 'nl'
  const kpis = nl ? [['Kosten', '€ 1.240'], ['Aanvragen', '38'], ['Omzet', '€ 5.890']] : [['Cost', '€ 1,240'], ['Enquiries', '38'], ['Revenue', '€ 5,890']]
  const bars = [34, 42, 38, 55, 61, 58, 72]
  return (
    <Win title={nl ? 'Overzicht' : 'Overview'} lang={lang}>
      <dl className="sv-kpis">{kpis.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      <div className="sv-bars" aria-hidden="true">{bars.map((h, i) => <i key={i} style={v({ '--h': `${h}%`, '--d': `${0.1 + i * 0.06}s` })} />)}</div>
    </Win>
  )
}

/* ---------- Ecommerce ---------- */

function Product({ lang }: ScreenProps) {
  const nl = lang === 'nl'
  return (
    <Win title={nl ? 'Productpagina' : 'Product page'} lang={lang}>
      <div className="sv-product"><span className="sv-product-img" /><div><Lines n={2} /><p className="sv-price">€ 24,90</p></div></div>
      <div className="sv-bundles"><span>1×</span><span className="is-on">2× <em>{nl ? 'Populair' : 'Popular'}</em></span><span>3×</span></div>
      <span className="sv-page-cta sv-page-cta--wide">{nl ? 'In mijn mandje' : 'Add to cart'}</span>
    </Win>
  )
}

function Checkout({ lang }: ScreenProps) {
  const nl = lang === 'nl'
  const steps = nl ? ['Mandje', 'Gegevens', 'Betalen'] : ['Cart', 'Details', 'Pay']
  return (
    <Win title="Checkout" lang={lang}>
      <ol className="sv-checkout">{steps.map((s, i) => <li key={s} className={i < 2 ? 'is-done' : 'is-now'}>{i < 2 ? <Tick /> : <span className="sv-step-no">3</span>}{s}</li>)}</ol>
      <div className="sv-upsell"><span className="sv-product-img sv-product-img--sm" /><p><b>{nl ? 'Vaak samen gekocht' : 'Often bought together'}</b><span>+ € 6,90</span></p><span className="sv-btn">{nl ? 'Voeg toe' : 'Add'}</span></div>
    </Win>
  )
}

function Cart({ lang }: ScreenProps) {
  const nl = lang === 'nl'
  return (
    <Win title={nl ? 'E-mail' : 'Email'} lang={lang}>
      <p className="sv-mail-subject">{nl ? 'Je mandje wacht nog op je' : 'Your cart is still waiting'}</p>
      <div className="sv-product"><span className="sv-product-img sv-product-img--sm" /><div><Lines n={2} /></div></div>
      <span className="sv-page-cta sv-page-cta--wide">{nl ? 'Rond je bestelling af' : 'Finish your order'}</span>
      <p className="sv-mail-meta"><span>{nl ? 'Verstuurd na 1 uur' : 'Sent after 1 hour'}</span><span className="sv-live">{nl ? 'geopend' : 'opened'}</span></p>
    </Win>
  )
}

/* ---------- Automation ---------- */

function Tasks({ lang }: ScreenProps) {
  const nl = lang === 'nl'
  const rows: [string, string, number][] = nl ? [['Leads overtypen in het CRM', '3 u / week', 80], ['Offertes voorbereiden', '2 u / week', 55], ['Vergaderingen samenvatten', '1,5 u / week', 40], ['Klantvragen doorsturen', '1 u / week', 28]] : [['Retyping leads into the CRM', '3 h / week', 80], ['Preparing quotes', '2 h / week', 55], ['Summarising meetings', '1.5 h / week', 40], ['Routing customer questions', '1 h / week', 28]]
  return (
    <Win title={nl ? 'Terugkerende taken' : 'Recurring tasks'} lang={lang}>
      <ul className="sv-tasks">{rows.map(([task, time, w], i) => <li key={task} style={v({ '--w': `${w}%`, '--d': `${0.15 + i * 0.1}s` })}><b>{task}</b><em>{time}</em><i className="sv-bar" /></li>)}</ul>
    </Win>
  )
}

function Automation({ lang }: ScreenProps) {
  const nl = lang === 'nl'
  const nodes = nl ? [['Formulier', 'Nieuwe aanvraag'], ['AI', 'Kwalificeert en vat samen'], ['CRM', 'Lead met notitie'], [nl ? 'Jij' : 'You', 'Keurt goed']] : [['Form', 'New enquiry'], ['AI', 'Qualifies and summarises'], ['CRM', 'Lead with a note'], ['You', 'Approve']]
  return (
    <Win title={nl ? 'Workflow' : 'Workflow'} lang={lang}>
      <ol className="sv-flow">
        {nodes.map(([name, what], i) => (
          <li key={name} style={v({ '--d': `${i * 0.18}s` })}>
            {i === 1 ? <BotAvatar shape="brain" size={30} color="#7d93ff" /> : i === 3 ? <BotAvatar shape="verkoop" size={30} /> : <span className="sv-flow-icon">{name.charAt(0)}</span>}
            <p><b>{name}</b><span>{what}</span></p>
          </li>
        ))}
      </ol>
    </Win>
  )
}

function Review({ lang }: ScreenProps) {
  const nl = lang === 'nl'
  return (
    <Win title={nl ? 'Ter goedkeuring' : 'For approval'} lang={lang}>
      <div className="sv-person"><BotAvatar shape="brain" size={34} color="#7d93ff" /><p><b>{nl ? 'Concept van de AI' : 'Draft by the AI'}</b><span>{nl ? 'Antwoord op een offerteaanvraag' : 'Reply to a quote request'}</span></p></div>
      <div className="sv-draft"><Lines n={3} /></div>
      <p className="sv-approve"><span className="sv-btn sv-btn--ghost">{nl ? 'Aanpassen' : 'Edit'}</span><span className="sv-btn sv-btn--blue">{nl ? 'Goedkeuren' : 'Approve'}</span></p>
    </Win>
  )
}

/* ---------- Distribution ---------- */

function Offer({ lang }: ScreenProps) {
  const nl = lang === 'nl'
  return (
    <Win title={nl ? 'Aanbod' : 'Offer'} lang={lang}>
      <p className="sv-page-h">{nl ? 'Gratis kennismaking voor kmo’s in Gent' : 'Free intro for small businesses in Ghent'}</p>
      <p className="sv-offer-row"><span className="sv-tag sv-tag--blue">{nl ? 'Voor wie' : 'For whom'}</span>{nl ? 'Kmo’s met 5–50 mensen' : 'Firms with 5–50 people'}</p>
      <p className="sv-offer-row"><span className="sv-tag sv-tag--pink">{nl ? 'Eén actie' : 'One action'}</span>{nl ? 'Plan een gesprek' : 'Book a call'}</p>
    </Win>
  )
}

function Channels({ lang }: ScreenProps) {
  const nl = lang === 'nl'
  const rows = nl ? [['B2B-outreach', 'E-mail · Sales Navigator', true], ['B2C-advertenties', 'Meta · Google', true], ['Offline', 'Flyers · lokaal', false], ['SEO en GEO', 'Zoeken · AI-antwoorden', true]] : [['B2B outreach', 'Email · Sales Navigator', true], ['B2C ads', 'Meta · Google', true], ['Offline', 'Flyers · local', false], ['SEO and GEO', 'Search · AI answers', true]]
  return (
    <Win title={nl ? 'Kanalen' : 'Channels'} lang={lang}>
      <ul className="sv-channels">{rows.map(([name, how, on]) => <li key={String(name)}><p><b>{name}</b><span>{how}</span></p><span className="sv-switch" data-on={on || undefined} /></li>)}</ul>
    </Win>
  )
}

const ChannelResults = ({ lang }: ScreenProps) => (lang === 'nl'
  ? <Table lang={lang} title="Per kanaal" head={['Kanaal', 'Bereikt', 'Aanvragen', 'Per aanvraag']} rows={[['Outreach', '420', '12', '€ 9'], ['Advertenties', '18.400', '31', '€ 22'], ['SEO', '2.100', '8', '€ 0']]} advice="Advies: meer outreach, minder advertenties" />
  : <Table lang={lang} title="Per channel" head={['Channel', 'Reached', 'Enquiries', 'Per enquiry']} rows={[['Outreach', '420', '12', '€ 9'], ['Ads', '18,400', '31', '€ 22'], ['SEO', '2,100', '8', '€ 0']]} advice="Advice: more outreach, fewer ads" />)

/* ---------- Email ---------- */

function Flows({ lang }: ScreenProps) {
  const nl = lang === 'nl'
  const rows: [string, string, boolean][] = nl ? [['Welkom', 'Na inschrijving', true], ['Verlaten mandje', 'Na 1 uur', true], ['Herhaalaankoop', 'Na 30 dagen', false], ['Opvolging', 'Na een aanvraag', false]] : [['Welcome', 'After sign-up', true], ['Abandoned cart', 'After 1 hour', true], ['Repeat purchase', 'After 30 days', false], ['Follow-up', 'After an enquiry', false]]
  return (
    <Win title={nl ? 'Flows' : 'Flows'} lang={lang}>
      <ul className="sv-channels">{rows.map(([name, when, on]) => <li key={name}><p><b>{name}</b><span>{when}</span></p><span className={`sv-tag ${on ? 'sv-tag--green' : 'sv-tag--grey'}`}>{on ? (nl ? 'Eerst' : 'First') : (nl ? 'Daarna' : 'Next')}</span></li>)}</ul>
    </Win>
  )
}

function Mail({ lang }: ScreenProps) {
  const nl = lang === 'nl'
  return (
    <Win title={nl ? 'Inbox' : 'Inbox'} lang={lang}>
      <div className="sv-person"><BotAvatar shape="verkoop" size={34} /><p><b>{nl ? 'Jouw merk' : 'Your brand'}</b><span>{nl ? 'Fijn dat je er bent' : 'Good to have you here'}</span></p></div>
      <div className="sv-draft"><Lines n={3} /></div>
      <span className="sv-page-cta">{nl ? 'Ontdek je eerste tip' : 'See your first tip'} →</span>
    </Win>
  )
}

const MailStats = ({ lang }: ScreenProps) => (lang === 'nl'
  ? <Table lang={lang} title="Resultaten" head={['Flow', 'Geopend', 'Geklikt', 'Uitgeschreven']} rows={[['Welkom', '58%', '14%', '0,4%'], ['Verlaten mandje', '46%', '11%', '0,6%'], ['Herhaalaankoop', '39%', '7%', '0,8%']]} advice="Advies: kortere onderwerpregel voor herhaalaankoop" />
  : <Table lang={lang} title="Results" head={['Flow', 'Opened', 'Clicked', 'Unsubscribed']} rows={[['Welcome', '58%', '14%', '0.4%'], ['Abandoned cart', '46%', '11%', '0.6%'], ['Repeat purchase', '39%', '7%', '0.8%']]} advice="Advice: a shorter subject line for repeat purchase" />)

/* ---------- Analytics ---------- */

function Audit({ lang }: ScreenProps) {
  const nl = lang === 'nl'
  const rows: [string, 'ok' | 'warn'][] = nl ? [['GA4 basis-tag', 'ok'], ['Formulier verstuurd', 'ok'], ['Aankoop telt dubbel', 'warn'], ['Telefoonklik ontbreekt', 'warn']] : [['GA4 base tag', 'ok'], ['Form sent', 'ok'], ['Purchase counts twice', 'warn'], ['Phone click missing', 'warn']]
  return (
    <Win title={nl ? 'Meetcontrole' : 'Tracking check'} lang={lang}>
      <ul className="sv-events">{rows.map(([name, state], i) => <li key={name} style={v({ '--d': `${0.15 + i * 0.12}s` })}>{state === 'ok' ? <Tick /> : <span className="sv-warn">!</span>}<b>{name}</b><span className={`sv-tag ${state === 'ok' ? 'sv-tag--green' : 'sv-tag--amber'}`}>{state === 'ok' ? 'ok' : (nl ? 'oplossen' : 'fix')}</span></li>)}</ul>
    </Win>
  )
}

/* ---------- Websites and software ---------- */

function Sitemap({ lang }: ScreenProps) {
  const nl = lang === 'nl'
  const pages = nl ? ['Diensten', 'Cases', 'Over ons'] : ['Services', 'Cases', 'About']
  return (
    <Win title={nl ? 'Structuur' : 'Structure'} lang={lang}>
      <div className="sv-sitemap">
        <span className="sv-node sv-node--root">Home</span>
        <div className="sv-node-row">{pages.map((p) => <span key={p} className="sv-node">{p}</span>)}</div>
        <span className="sv-node sv-node--goal">{nl ? 'Contact · de ene actie' : 'Contact · the one action'}</span>
      </div>
    </Win>
  )
}

function Devices({ lang }: ScreenProps) {
  const nl = lang === 'nl'
  return (
    <Win title={nl ? 'Getest op elk scherm' : 'Tested on every screen'} lang={lang}>
      <div className="sv-devices">
        <div className="sv-device sv-device--desk"><span className="sv-page-h sv-page-h--sm">{nl ? 'Jouw nieuwe site' : 'Your new site'}</span><Lines n={2} /><span className="sv-page-cta">{nl ? 'Contact' : 'Contact'}</span></div>
        <div className="sv-device sv-device--phone"><Lines n={3} /><span className="sv-page-cta">→</span></div>
      </div>
      <p className="sv-mail-meta"><span>Chrome · Safari · {nl ? 'telefoon' : 'phone'}</span><span className="sv-live">ok</span></p>
    </Win>
  )
}

function Users({ lang }: ScreenProps) {
  const nl = lang === 'nl'
  const people: [string, string, string, string][] = nl ? [['bunny', '#ff9fd0', 'Planner', 'Maakt de weekplanning'], ['cat', '#ffd23f', 'Monteur', 'Werkt op locatie, op de telefoon'], ['star', '#7d93ff', 'Zaakvoerder', 'Wil één overzicht']] : [['bunny', '#ff9fd0', 'Planner', 'Makes the weekly schedule'], ['cat', '#ffd23f', 'Technician', 'Works on site, on the phone'], ['star', '#7d93ff', 'Owner', 'Wants one overview']]
  return (
    <Win title={nl ? 'Gebruikers' : 'Users'} lang={lang}>
      <ul className="sv-people">{people.map(([shape, color, role, need]) => <li key={role}><BotAvatar shape={shape} size={34} color={color} /><p><b>{role}</b><span>{need}</span></p></li>)}</ul>
    </Win>
  )
}

function Roadmap({ lang }: ScreenProps) {
  const nl = lang === 'nl'
  const cols: [string, string[]][] = nl ? [['Versie 1', ['Inloggen', 'Planning', 'Meldingen']], ['Daarna', ['Rapporten', 'Facturen']]] : [['Version 1', ['Log in', 'Schedule', 'Notifications']], ['Later', ['Reports', 'Invoices']]]
  return (
    <Win title="Roadmap" lang={lang}>
      <div className="sv-roadmap">{cols.map(([name, items], c) => <div key={name}><p className="sv-roadmap-head">{name}</p>{items.map((item) => <span key={item} className={`sv-card ${c === 0 ? 'is-now' : ''}`}>{item}</span>)}</div>)}</div>
    </Win>
  )
}

function App({ lang }: ScreenProps) {
  const nl = lang === 'nl'
  const rows = nl ? [['08:30', 'Onderhoud · Lochristi'], ['11:00', 'Herstelling · Gent'], ['14:30', 'Plaatsing · Destelbergen']] : [['08:30', 'Service · Lochristi'], ['11:00', 'Repair · Ghent'], ['14:30', 'Install · Destelbergen']]
  return (
    <div className="sv-app">
      <span className="sv-app-notch" />
      <p className="sv-app-title">{nl ? 'Vandaag' : 'Today'}</p>
      <ul>{rows.map(([time, job], i) => <li key={time} className={i === 0 ? 'is-now' : ''}><em>{time}</em>{job}</li>)}</ul>
      <span className="sv-app-chip">{SAMPLE[lang]}</span>
    </div>
  )
}

const SCREENS: Record<ServiceScreen, (props: ScreenProps) => ReactNode> = {
  campaigns: Campaigns, creatives: Creatives, report: Report,
  search: Search, keywords: Keywords, tracking: Tracking, page: Page, sources: Sources,
  funnel: Funnel, followup: Followup, dashboard: Dashboard,
  product: Product, checkout: Checkout, cart: Cart,
  tasks: Tasks, automation: Automation, review: Review,
  offer: Offer, channels: Channels, channelResults: ChannelResults,
  flows: Flows, mail: Mail, mailStats: MailStats,
  audit: Audit,
  sitemap: Sitemap, devices: Devices,
  users: Users, roadmap: Roadmap, app: App,
}

/** One sample screen by name. */
export default function ServiceScreenView({ screen, lang }: { screen: ServiceScreen; lang: Lang }) {
  const Screen = SCREENS[screen]
  return <Screen lang={lang} />
}
