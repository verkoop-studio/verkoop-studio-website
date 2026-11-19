import { useEffect, useState } from 'react'
import ekartSite from '../assets/cases/ekart-640.webp'
import healthfactorSite from '../assets/cases/healthfactor-website-640.webp'
import noomsSite from '../assets/cases/nooms-640.webp'
import pinacelloSite from '../assets/cases/pinacello-640.webp'
import { Link, useParams } from 'react-router-dom'
import Seo from '../components/Seo'
import Breadcrumbs from '../components/Breadcrumbs'
import { articles as nlArticles, type Article } from '../data/articles'
import english from '../i18n/articles.en.json'
import { useLang } from '../i18n/LanguageContext'
import { SITE_URL } from '../lib/site'
import NotFound from './NotFound'
import Arrow from '../components/brand/Arrow'
import Cta from '../components/brand/Cta'
import { trackEvent } from '../lib/analytics'
import HandNote from '../components/brand/HandNote'
import Reveal from '../components/brand/Reveal'
import SplitHeadline from '../components/brand/SplitHeadline'
import TextLink from '../components/brand/TextLink'
import { PAGES_STYLES, usePageStyles } from '../lib/deferredStyles'

const dateLabel = (date: string, lang: 'nl' | 'en') => new Date(date + 'T12:00:00Z').toLocaleDateString(lang === 'nl' ? 'nl-BE' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Brussels' })
type Translation = Pick<Article, 'title' | 'description' | 'category' | 'sections' | 'links'>
const translations = english as Record<string, Translation>
/** The English version of an article, or the Dutch one (en: false) when it has not been translated yet, e.g. a new automated article. */
function localized(article: Article, lang: 'nl' | 'en'): Article & { en: boolean } {
  const t = lang === 'en' ? translations[article.slug] : undefined
  return t ? { ...article, ...t, en: true } : { ...article, en: false }
}
const COPY = {
  nl: { checklist: 'Checklist', points: 'punten', title: 'Inzichten voor ondernemers in Gent en omgeving', description: 'Praktische artikelen over marketing, Google Ads en websites voor bedrijven in Gent en omgeving. Vanuit Verkoop Studio in Lochristi.', by: 'Door', updated: 'Bijgewerkt op', from: 'Vanuit Lochristi', toc: 'In dit artikel', apply: 'Van lezen naar toepassen', cta: 'Bespreek jouw groeivraag', all: 'Alle artikelen', read: 'Lees het artikel', dutchOnly: '', headline: [{ text: 'Inzichten voor ondernemers' }, { text: 'in Gent.', tone: 'accent' as const }], note: 'gratis te lezen :)' },
  en: { checklist: 'Checklist', points: 'points', title: 'Insights for businesses in and around Ghent', description: 'Practical articles on marketing, Google Ads and websites for businesses in and around Ghent. From Verkoop Studio in Lochristi.', by: 'By', updated: 'Updated', from: 'From Lochristi', toc: 'In this article', apply: 'Putting it into practice', cta: 'Talk to us about your growth', all: 'All articles', read: 'Read the article', dutchOnly: 'This article is only available in Dutch for now.', headline: [{ text: 'Insights for businesses' }, { text: 'in Ghent.', tone: 'accent' as const }], note: 'free to read :)' },
}

/** A real page per article, annotated with lines from the article's own checklist (first checklist, by position). */
const COVERS: Record<string, { image: string; picks: number[] }> = {
  'landingspagina-of-website': { image: pinacelloSite, picks: [0, 1, 4] },
  'google-ads-gent-budget-aanvragen': { image: pinacelloSite, picks: [0, 1, 2] },
  'website-gent-meer-aanvragen': { image: ekartSite, picks: [0, 1, 3] },
  'marketingbureau-gent-kiezen': { image: noomsSite, picks: [0, 2, 3] },
  'google-ads-advertentie-niet-zichtbaar': { image: healthfactorSite, picks: [1, 3] },
}

function ArticleCover({ article }: { article: Article }) {
  const cover = COVERS[article.slug]
  const list = article.sections.find((section) => section.checklist)?.checklist ?? []
  if (!cover) return null
  const notes = cover.picks.map((i) => list[i]).filter(Boolean)
  return (
   <figure className="bl-shot" aria-hidden="true">
    <img src={cover.image} alt="" width={640} height={400} decoding="async" />
    {notes.map((note, i) => <figcaption key={note} className={`bl-shot-note bl-shot-note--${i}`}><span>{i + 1}</span>{note}</figcaption>)}
   </figure>
  )
}

/** The article's own short answer as three options side by side (landingspagina-of-website, first section). */
const COMPARE: Record<string, Record<'nl' | 'en', [string, string][]>> = {
  'landingspagina-of-website': {
    nl: [['Bestaande dienstenpagina', 'als die de belofte van je campagne duidelijk waarmaakt.'], ['Aparte landingspagina', 'wanneer één doelgroep, aanbod of actie een eigen uitleg nodig heeft.'], ['De volledige website', 'als bezoekers meerdere diensten moeten vergelijken of als de algemene informatie en navigatie tekortschieten.']],
    en: [['Existing service page', 'if it clearly delivers on your campaign’s promise.'], ['Separate landing page', 'when one audience, offer or action needs its own explanation.'], ['The whole website', 'if visitors need to compare several services, or if the general information and navigation fall short.']],
  },
}

/** The section being read: the last heading that has passed the upper third of the screen. */
function useCurrentSection(count: number, key?: string) {
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    if (!count) return
    const sections = Array.from({ length: count }, (_, i) => document.getElementById(`deel-${i + 1}`)).filter((el): el is HTMLElement => !!el)
    const io = new IntersectionObserver(() => {
      const line = window.innerHeight * 0.33
      let at = 0
      sections.forEach((el, i) => { if (el.getBoundingClientRect().top <= line) at = i })
      setCurrent(at)
    }, { rootMargin: '-33% 0px -60% 0px', threshold: [0, 1] })
    sections.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [count, key])
  return current
}

export default function Blog() {
 usePageStyles(PAGES_STYLES)
 const { slug } = useParams()
 const { lang } = useLang(),c = COPY[lang],articles = nlArticles.map(a => localized(a, lang))
 const article = articles.find(a => a.slug === slug)
 const current = useCurrentSection(article?.sections.length ?? 0, article?.slug)
 if (slug && !article) return <NotFound />
 const title = article?.title ?? c.title
 const description = article?.description ?? c.description
 const pageLang = article ? (article.en ? 'en' : 'nl') : lang
 const path = article ? `/blog/${article.slug}` : '/blog'
 const compare = article ? COMPARE[article.slug]?.[lang] : undefined
 return <div lang={pageLang} className="vs-page bl-page">
  <Seo title={title} description={description} path={path} language={pageLang} />
  {article && <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'BlogPosting',headline:title,description,url:SITE_URL+path,inLanguage:pageLang==='nl'?'nl-BE':'en',datePublished:article.publishedAt,...(article.modifiedAt ? {dateModified:article.modifiedAt} : {}),author:{'@type':'Organization',name:'Verkoop Studio',url:SITE_URL+'/agency'},publisher:{'@id':SITE_URL+'/#organization'},mainEntityOfPage:{'@id':SITE_URL+path+'#webpage'}}).replace(/</g,'\\u003c')}} />}
  {article ? (
   <div className="vs-wrap bl-article">
    <header className="bl-head">
     <Breadcrumbs items={[{ label: 'Blog', href: '/blog' }, { label: article.category }]} />
     <h1 className="vs-h1 bl-h1">{title}</h1>
     <p className="vs-lead">{description}</p>
     <p className="bl-byline">{c.by} <Link to="/agency">Verkoop Studio</Link> · <time dateTime={article.publishedAt}>{dateLabel(article.publishedAt!, lang)}</time>{article.modifiedAt && <> · {c.updated} <time dateTime={article.modifiedAt}>{dateLabel(article.modifiedAt, lang)}</time></>} · {c.from}</p>
     {lang === 'en' && !article.en && <p className="bl-note" lang="en">{c.dutchOnly}</p>}
     <div className="bl-head-cta"><Cta to="/contact" onClick={() => trackEvent('audit_cta_clicked', { placement: 'blog_article_hero' })}>{c.cta}</Cta></div>
     <ArticleCover article={article} />
    </header>
    <div className="bl-layout">
     <details className="bl-toc-chip">
      <summary><span>{c.toc}</span><b><i>0{current + 1}</i>{article.sections[current]?.title}</b></summary>
      <ol>{article.sections.map((s, i) => <li key={s.title}><a href={`#deel-${i + 1}`} className={current === i ? 'is-on' : undefined} onClick={(e) => e.currentTarget.closest('details')?.removeAttribute('open')}><span>0{i + 1}</span>{s.title}</a></li>)}</ol>
     </details>
     <nav aria-label={c.toc} className="bl-toc"><p>{c.toc}</p><ol>{article.sections.map((s, i) => <li key={s.title}><a href={`#deel-${i + 1}`} className={current === i ? 'is-on' : undefined} aria-current={current === i ? 'location' : undefined}><span>0{i + 1}</span>{s.title}</a></li>)}</ol></nav>
     <div>
      <article className="bl-body">{article.sections.map((s, i) => (
       <section key={s.title} id={`deel-${i + 1}`} className="bl-section">
        <h2>{s.title}</h2>
        {i === 0 && compare && (
         <div className="bl-compare" role="group" aria-label={s.title}>
          {compare.map(([option, when], k) => <div key={option} className={`bl-compare-col bl-compare-col--${k}`}><span className="bl-compare-n">{k + 1}</span><b>{option}</b><p>{when}</p></div>)}
         </div>
        )}
        {s.paragraphs.map((para) => <p key={para}>{para}</p>)}
        {s.checklist && <figure className="bl-checkcard">
         <figcaption><span className="bl-checkcard-icon" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2.5" y="1.5" width="11" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.5" /><path d="M5.5 6 7 7.5 10.5 4M5.5 11h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span><b>{c.checklist}</b><small>{s.checklist.length} {c.points}</small></figcaption>
         <ul className="bl-check">{s.checklist.map((item, k) => <li key={item}><span className="bl-check-n" aria-hidden="true">{k + 1}</span><span className="sv-tick" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M3 7.5 6 10.5 11 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>{item}</li>)}</ul>
        </figure>}
       </section>
      ))}</article>
      <aside className="bl-apply">
       <HandNote point="down-left" className="bl-apply-note">{lang === 'nl' ? 'nu jij :)' : 'your turn :)'}</HandNote>
       <h2>{c.apply}</h2>
       <ul>{article.links.map((l) => <li key={l.href}>{l.href.startsWith('https://') ? <a className="vs-textlink vs-textlink--arrow" href={l.href}>{l.label}<Arrow direction="up-right" size={14} /></a> : <Link className="vs-textlink vs-textlink--arrow" to={l.href}>{l.label}<Arrow size={14} /></Link>}</li>)}</ul>
      </aside>
      <div className="bl-actions">
       <Cta to="/contact">{c.cta}</Cta>
       <TextLink to="/blog">{c.all}</TextLink>
      </div>
     </div>
    </div>
   </div>
  ) : (
   <div className="vs-wrap bl-index">
    <header className="bl-head">
     <Breadcrumbs items={[{ label: 'Blog' }]} />
     <SplitHeadline as="h1" className="vs-h1 bl-h1" parts={c.headline} onMount />
     <p className="vs-lead">{description}</p>
     <div className="bl-head-cta"><Cta to="/contact" onClick={() => trackEvent('audit_cta_clicked', { placement: 'blog_hero' })}>{c.cta}</Cta></div>
    </header>
    <ul className="bl-grid">{articles.map((a, i) => (
     <Reveal as="li" key={a.slug} delay={(i % 3) * 0.08} y={30}>
      <article className="bl-card" lang={a.en || lang === 'nl' ? lang : 'nl'}>
       <span className={`bl-cover bl-cover--${i % 4}`} aria-hidden="true"><span>{a.category}</span></span>
       <p className="bl-card-meta">{a.category}{a.publishedAt && <> · <time dateTime={a.publishedAt}>{dateLabel(a.publishedAt, lang)}</time></>}</p>
       <h2><Link to={`/blog/${a.slug}`}>{a.title}</Link></h2>
       <p>{a.description}</p>
       <Link className="vs-textlink vs-textlink--arrow" to={`/blog/${a.slug}`}>{c.read}{lang === 'en' && !a.en ? ' (Dutch)' : ''}<Arrow size={14} /></Link>
      </article>
     </Reveal>
    ))}</ul>
   </div>
  )}
 </div>
}
