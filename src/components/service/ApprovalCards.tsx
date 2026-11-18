import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import type { Lang } from '../../data/types'
import Reveal from '../brand/Reveal'
import { AdCard } from './ServiceScreens'

const COPY = {
  nl: { title: 'Een creative-ronde, in het klein.', body: 'Een voorbeeld van creatives per fase. Druk maar op Goedkeuren.', approve: 'Goedkeuren', waiting: 'Ter goedkeuring', live: 'Live', sample: 'Voorbeeld' },
  en: { title: 'A creative round, in miniature.', body: 'A sample of creatives per stage. Go on, press Approve.', approve: 'Approve', waiting: 'Awaiting approval', live: 'Live', sample: 'Sample' },
}

const PLATFORMS: Record<'meta' | 'mix', string[]> = { meta: ['Instagram', 'Facebook', 'Instagram'], mix: ['LinkedIn', 'Meta', 'Google'] }

/** Sample creatives that can be approved: the tick draws and the card slides from waiting to live. */
export default function ApprovalCards({ lang, platforms = 'meta' }: { lang: Lang; platforms?: 'meta' | 'mix' }) {
  const t = COPY[lang]
  const reduce = useReducedMotion()
  const [approved, setApproved] = useState<boolean[]>([false, false, false])
  return (
    <section className="vs-wrap vs-section sv-approve-wrap" aria-labelledby="approve-title">
      <Reveal as="h2" className="vs-h2" id="approve-title">{t.title}</Reveal>
      <Reveal as="p" className="sv-how-lead" delay={0.1}>{t.body}</Reveal>
      <ul className="sv-approve-grid">
        {[0, 1, 2].map((i) => {
          const done = approved[i]
          return (
            <Reveal as="li" key={i} delay={i * 0.1} y={40}>
              <article className="sv-approve-card" data-live={done || undefined}>
                <header className="sv-approve-head">
                  <span className="sv-tag sv-tag--blue">{PLATFORMS[platforms][i]}</span>
                  <span className="sv-approve-status">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span key={done ? 'live' : 'wait'} className={done ? 'sv-tag sv-tag--green' : 'sv-tag sv-tag--grey'} initial={reduce ? false : { y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={{ duration: 0.25 }}>
                        {done ? t.live : t.waiting}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <em className="sv-approve-sample">{t.sample}</em>
                </header>
                <AdCard index={i} lang={lang} />
                <button type="button" className="sv-approve-btn" aria-pressed={done} onClick={() => setApproved((prev) => prev.map((v, j) => (j === i ? !v : v)))}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M3.5 9.5 7.5 13.5 14.5 5" pathLength={1} /></svg>
                  {done ? t.live : t.approve}
                </button>
              </article>
            </Reveal>
          )
        })}
      </ul>
    </section>
  )
}
