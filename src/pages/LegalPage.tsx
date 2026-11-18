import Breadcrumbs from '../components/Breadcrumbs'
import Seo from '../components/Seo'
import HandNote from '../components/brand/HandNote'
import TextLink from '../components/brand/TextLink'
import { legalDocuments, type LegalSlug } from '../data/legal'
import { PAGES_STYLES, usePageStyles } from '../lib/deferredStyles'
import { useLang } from '../i18n/LanguageContext'

/** Privacy and terms, laid out like an article: a header, a sticky table of contents and readable sections. */
export default function LegalPage({ slug }: { slug: LegalSlug }) {
  usePageStyles(PAGES_STYLES)
  const { lang } = useLang()
  const page = legalDocuments[slug]
  const other = slug === 'privacy' ? legalDocuments.terms : legalDocuments.privacy
  const toc = lang === 'nl' ? 'Op deze pagina' : 'On this page'

  return (
    <div className="vs-page bl-page">
      <Seo title={page.title[lang]} description={page.description[lang]} path={page.path} />
      <div className="vs-wrap bl-article">
        <header className="bl-head">
          <Breadcrumbs items={[{ label: page.title[lang] }]} />
          <h1 className="vs-h1 bl-h1">{page.title[lang]}</h1>
          <HandNote point="up-left" className="bl-handnote-inline">{lang === 'nl' ? 'het saaie deel, kort gehouden :)' : 'the boring part, kept short :)'}</HandNote>
          <p className="bl-byline">{page.updated[lang]}</p>
          <p className="bl-note">{page.notice[lang]}</p>
        </header>
        <div className="bl-layout">
          <nav aria-label={toc} className="bl-toc">
            <p>{toc}</p>
            <ol>{page.sections.map((section, i) => <li key={section.title.nl}><a href={`#deel-${i + 1}`}><span>{String(i + 1).padStart(2, '0')}</span>{section.title[lang]}</a></li>)}</ol>
          </nav>
          <div>
            <article className="bl-body">
              {page.sections.map((section, i) => (
                <section key={section.title.nl} id={`deel-${i + 1}`} className="bl-section">
                  <h2>{section.title[lang]}</h2>
                  {section.paragraphs[lang].map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </section>
              ))}
            </article>
            <p className="bl-actions"><TextLink to={other.path}>{other.title[lang]}</TextLink></p>
          </div>
        </div>
      </div>
    </div>
  )
}
