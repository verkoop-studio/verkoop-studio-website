import type { ReactNode } from 'react'
import { useLang } from '../../i18n/LanguageContext'
import Reveal from '../brand/Reveal'
import { PAINS } from '../../data/pains'

/** One small glyph per card, each with its own motion: a coin that flips, a cursor that wanders, a bell that rings, and so on. */
const GLYPHS: ReactNode[] = [
  <svg key="0" viewBox="0 0 32 32" className="vs-pain-glyph vs-pain-glyph--flip"><circle cx="16" cy="16" r="10" /><path d="M16 11v10M13 13.5h4.5a2 2 0 0 1 0 4h-3a2 2 0 0 0 0 4H19" /></svg>,
  <svg key="1" viewBox="0 0 32 32" className="vs-pain-glyph vs-pain-glyph--wander"><path d="M9 7l14 8-6 1.5L14 23Z" /></svg>,
  <svg key="2" viewBox="0 0 32 32" className="vs-pain-glyph vs-pain-glyph--ring"><path d="M10 21V14a6 6 0 0 1 12 0v7l2 2H8ZM14 26h4" /></svg>,
  <svg key="3" viewBox="0 0 32 32" className="vs-pain-glyph vs-pain-glyph--blink"><circle cx="16" cy="16" r="9" /><path d="M16 11v1M16 15v6" /></svg>,
  <svg key="4" viewBox="0 0 32 32" className="vs-pain-glyph vs-pain-glyph--bars"><path d="M8 24V18M14 24V12M20 24V15M26 24V9" /></svg>,
  <svg key="5" viewBox="0 0 32 32" className="vs-pain-glyph vs-pain-glyph--float"><path d="M6 10h20v13H6ZM6 10l10 8 10-8" /></svg>,
]

/** Where growth gets stuck: six short cards, each with a glyph that moves its own way. */
export default function PainsBlock() {
  const { lang } = useLang()
  return (
    <section className="vs-wrap vs-section vs-pains" aria-labelledby="pains-title">
      <Reveal as="h2" className="vs-h2" id="pains-title">{lang === 'nl' ? 'Waar groei vastloopt.' : 'Where growth gets stuck.'}</Reveal>
      <ul className="vs-pains-grid">
        {PAINS[lang].map(([title, line], i) => (
          <Reveal as="li" key={title} delay={(i % 3) * 0.08} y={30}>
            <article className="vs-pain">
              <span className="vs-pain-icon" aria-hidden="true">{GLYPHS[i]}</span>
              <h3>{title}</h3>
              <p>{line}</p>
            </article>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
