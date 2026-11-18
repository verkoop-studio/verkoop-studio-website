import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Lang } from '../../data/types'
import { findChatAnswers, getChatArticles, type ChatArticle } from '../../lib/chatKnowledge'

type Message = { question: string; answers: ChatArticle[] }

/** The starters from the studio's FAQ chat, unchanged. */
const STARTERS = (nl: boolean): [string, string][] => [
  ['pricing', nl ? 'Wat past bij mijn budget?' : 'What fits my budget?'],
  ['service-websites', nl ? 'Een website die verkoopt' : 'A website that sells'],
  ['cases', nl ? 'Laat jullie werk zien' : 'Show me your work'],
  ['service-ai-automatiseringen', nl ? 'Slimmer werken met AI' : 'Work smarter with AI'],
]

/**
 * The studio's FAQ chat inside the dock: suggested questions as chips, a free question, and
 * answers that come only from the site's own knowledge (lib/chatKnowledge). When nothing
 * fits, it hands over to the team.
 */
export default function DockChat({ lang, onNavigate }: { lang: Lang; onNavigate: () => void }) {
  const nl = lang === 'nl'
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const log = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const previousLang = useRef(lang)
  const articles = getChatArticles(lang)
  const lastAnswer = messages.at(-1)?.answers[0]

  useEffect(() => { if (previousLang.current !== lang) { setMessages([]); setQuery(''); previousLang.current = lang } }, [lang])
  useEffect(() => { if (log.current) log.current.scrollTop = messages.length ? log.current.scrollHeight : 0 }, [messages])

  const add = (question: string, answers: ChatArticle[]) => { setMessages((previous) => [...previous.slice(-19), { question, answers }]); setQuery('') }
  const choose = (id: string) => { const article = articles.find((a) => a.id === id); if (article) add(article.title, [article]) }
  const send = () => { if (query.trim()) add(query.trim(), findChatAnswers(query.trim(), lang, lastAnswer?.id)) }

  return (
    <div className="dc" data-clarity-mask="true">
      <div className="dc-log" ref={log} role="log" aria-live="polite" aria-relevant="additions">
        {!messages.length && (
          <div className="dc-welcome">
            <p>{nl ? 'Ontdek onze diensten, prijzen en projecten. Ik zoek het antwoord in de informatie van onze studio.' : 'Explore our services, pricing and projects. I find answers in our studio information.'}</p>
            <div className="dc-chips">{STARTERS(nl).map(([id, label]) => <button type="button" key={id} onClick={() => choose(id)}>{label}</button>)}</div>
          </div>
        )}
        {messages.map((message, index) => (
          <div key={index} className="dc-exchange">
            <p className="dc-question">{message.question}</p>
            {message.answers.length ? message.answers.map((answer) => (
              <article key={answer.id} className="dc-answer">
                <h3>{answer.title}</h3>
                <p>{answer.text}</p>
                {answer.bullets && <ul>{answer.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
                <Link className="dc-source" to={answer.href} onClick={onNavigate}>{nl ? 'Bekijk op de website' : 'View on the website'}</Link>
              </article>
            )) : (
              <div className="dc-answer">
                <h3>{nl ? 'Dat bespreken we graag persoonlijk.' : 'Let’s discuss that personally.'}</h3>
                <p>{nl ? 'Ik vind hiervoor geen betrouwbaar antwoord in onze website-informatie. Ons team kan je verder helpen.' : 'I can’t find a reliable answer in our website information. Our team can help you further.'}</p>
                <Link className="dc-source" to="/contact" onClick={onNavigate}>{nl ? 'Stel je vraag aan ons team' : 'Ask our team'}</Link>
              </div>
            )}
          </div>
        ))}
        {!!messages.length && (
          <div className="dc-chips dc-chips--follow">
            {(lastAnswer?.followups ?? ['pricing', 'cases', 'start']).map((id) => { const a = articles.find((item) => item.id === id); return a && <button key={id} type="button" onClick={() => choose(id)}>{a.title}</button> })}
          </div>
        )}
      </div>
      <form className="dc-composer" onSubmit={(event) => { event.preventDefault(); send() }}>
        <label className="sr-only" htmlFor="dock-chat-query">{nl ? 'Je vraag' : 'Your question'}</label>
        <input id="dock-chat-query" ref={input} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={nl ? 'Waar wil je meer over weten?' : 'What would you like to know?'} maxLength={400} autoComplete="off" data-clarity-mask="true" />
        <button type="submit" disabled={!query.trim()} aria-label={nl ? 'Vraag versturen' : 'Send question'}>↑</button>
      </form>
      <p className="dc-foot">{nl ? 'Antwoorden uit onze website' : 'Answers from our website'}</p>
    </div>
  )
}
