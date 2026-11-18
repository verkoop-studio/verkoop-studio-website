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
  nl: { title: 'Inzichten voor ondernemers in Gent en omgeving', description: 'Praktische artikelen over marketing, Google Ads en websites voor bedrijven in Gent en omgeving. Vanuit Verkoop Studio in Lochristi.', by: 'Door', updated: 'Bijgewerkt op', from: 'Vanuit Lochristi', toc: 'In dit artikel', apply: 'Van lezen naar toepassen', cta: 'Bespreek jouw groeivraag', all: 'Alle artikelen', read: 'Lees het artikel', dutchOnly: '', headline: [{ text: 'Inzichten voor ondernemers' }, { text: 'in Gent.', tone: 'accent' as const }], note: 'gratis te lezen :)' },
  en: { title: 'Insights for businesses in and around Ghent', description: 'Practical articles on marketing, Google Ads and websites for businesses in and around Ghent. From Verkoop Studio in Lochristi.', by: 'By', updated: 'Updated', from: 'From Lochristi', toc: 'In this article', apply: 'Putting it into practice', cta: 'Talk to us about your growth', all: 'All articles', read: 'Read the article', dutchOnly: 'This article is only available in Dutch for now.', headline: [{ text: 'Insights for businesses' }, { text: 'in Ghent.', tone: 'accent' as const }], note: 'free to read :)' },
}

export default function Blog() {
 usePageStyles(PAGES_STYLES)
 const { slug } = useParams()
 const { lang } = useLang(),c = COPY[lang],articles = nlArticles.map(a => localized(a, lang))
 const article = articles.find(a => a.slug === slug)
 if (slug && !article) return <NotFound />
 const title = article?.title ?? c.title
 const description = article?.description ?? c.description
 const pageLang = article ? (article.en ? 'en' : 'nl') : lang
 const path = article ? `/blog/${article.slug}` : '/blog'
 return <div lang={pageLang} className="vs-page bl-page">
  <Seo title={title} description={description} path={path} language={pageLang} />
  {article && <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'BlogPosting',headline:title,description,url:SITE_URL+path,inLanguage:pageLang==='nl'?'nl-BE':'en',datePublished:article.publishedAt,...(article.modifiedAt ? {dateModified:article.modifiedAt} : {}),author:{'@type':'Organization',name:'Verkoop Studio',url:SITE_URL+'/agency'},publisher:{'@id':SITE_URL+'/#organization'},mainEntityOfPage:{'@id':SITE_URL+path+'#webpage'}}).replace(/</g,'\\u003c')}} />}
  {article ? (
   <div className="vs-wrap bl-article">
    <header className="bl-head">
     <Breadcrumbs items={[{ label: 'Blog', href: '/blog' }, { label: article.category }]} />
     <span className="bl-chip">{article.category}</span>
     <h1 className="vs-h1 bl-h1">{title}</h1>
     <p className="vs-lead">{description}</p>
     <p className="bl-byline">{c.by} <Link to="/agency">Verkoop Studio</Link> · <time dateTime={article.publishedAt}>{dateLabel(article.publishedAt!, lang)}</time>{article.modifiedAt && <> · {c.updated} <time dateTime={article.modifiedAt}>{dateLabel(article.modifiedAt, lang)}</time></>} · {c.from}</p>
     {lang === 'en' && !article.en && <p className="bl-note" lang="en">{c.dutchOnly}</p>}
    </header>
    <div className="bl-layout">
     <nav aria-label={c.toc} className="bl-toc"><p>{c.toc}</p><ol>{article.sections.map((s, i) => <li key={s.title}><a href={`#deel-${i + 1}`}><span>0{i + 1}</span>{s.title}</a></li>)}</ol></nav>
     <div>
      <article className="bl-body">{article.sections.map((s, i) => (
       <section key={s.title} id={`deel-${i + 1}`} className="bl-section">
        <h2>{s.title}</h2>
        {s.paragraphs.map((para) => <p key={para}>{para}</p>)}
        {s.checklist && <ul className="bl-check">{s.checklist.map((item) => <li key={item}><span className="sv-tick" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M3 7.5 6 10.5 11 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>{item}</li>)}</ul>}
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
    </header>
    <HandNote point="down-left" className="bl-handnote">{c.note}</HandNote>
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
