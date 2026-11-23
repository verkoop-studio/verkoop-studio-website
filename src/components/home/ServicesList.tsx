import { motion, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import pinacelloSite from '../../assets/pinacello-site.webp'
import overview from '../../assets/performance/overview.webp'
import { menuTabs } from '../../data/nav'
import { useLang } from '../../i18n/LanguageContext'
import { trackEvent } from '../../lib/analytics'
import { useWide } from '../../lib/useWide'
import { Go } from '../brand/Arrow'
import SplitHeadline from '../brand/SplitHeadline'
import { WaveEdge } from '../brand/Playful'
import { EASE, VIEWPORT } from '../brand/motion'

const COPY = {
  nl: { title: [{ text: 'Wat we' }, { text: 'doen', tone: 'accent' as const }], count: (n: number) => `${n} diensten` },
  en: { title: [{ text: 'What we' }, { text: 'do', tone: 'accent' as const }], count: (n: number) => `${n} services` },
}

/** Our own work behind each group: a real ad we made, a webshop we built, and our own dashboard. */
const MEDIA = [
  { video: '/videos/ads/healthfactor-personal.mp4', src: '/images/ads/healthfactor-personal.jpg', width: 720, height: 1280, position: '50% 22%' },
  { src: pinacelloSite, width: 1440, height: 846, position: '50% 0%' },
  { src: overview, width: 1440, height: 700, position: '38% 0%' },
]

/**
 * What we do, as three tall panels in the colours of the three groups, each over our own work.
 * The panel you point at or tab into opens wide and lists its services; the others narrow to
 * their name, set upright. On phones and tablets the three are stacked and always open.
 */
export default function ServicesList() {
  const { lang } = useLang()
  const t = COPY[lang]
  const reduce = useReducedMotion()
  const wide = useWide()
  const groups = menuTabs.find((tab) => tab.id === 'diensten')?.groups ?? []
  const [active, setActive] = useState(0)
  const wrap = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const near = useInView(wrap, { margin: '120px 0px' })

  // the ad plays only while its panel is open, on screen, on a wide screen, and motion is welcome
  useEffect(() => {
    const el = video.current
    if (!el) return
    if (active === 0 && near && wide && !reduce) el.play().catch(() => {})
    else el.pause()
  }, [active, near, wide, reduce])

  return (
    <div className="vs-dark">
      <WaveEdge />
      <section id="expertise" className="vs-section vs-wrap" aria-labelledby="services-title">
        <div className="vs-section-head">
          <SplitHeadline id="services-title" className="vs-h2" parts={t.title} />
        </div>
        <motion.div
          ref={wrap}
          className="vs-panels"
          initial={reduce ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {groups.map((group, g) => {
            const media = MEDIA[g]
            const open = !wide || active === g
            return (
              <article
                key={group.label.en}
                className={`vs-panel vs-panel--${g}`}
                data-open={open || undefined}
                onPointerEnter={() => setActive(g)}
                onFocus={() => setActive(g)}
              >
                <div className="vs-panel-media" aria-hidden="true">
                  {media.video
                    ? <video ref={video} src={media.video} poster={media.src} width={media.width} height={media.height} muted loop playsInline preload="none" style={{ '--pos': media.position } as React.CSSProperties} />
                    : <img src={media.src} alt="" width={media.width} height={media.height} loading="lazy" decoding="async" style={{ '--pos': media.position } as React.CSSProperties} />}
                </div>
                <span className="vs-panel-spine" aria-hidden="true"><b>0{g + 1}</b>{group.label[lang]}</span>
                <div className="vs-panel-body">
                  <h3 className="vs-panel-title"><span>0{g + 1}</span>{group.label[lang]}</h3>
                  <p className="vs-panel-count">{t.count(group.links.length)}</p>
                  <ul className="vs-panel-list">
                    {group.links.map((link, i) => {
                      const slug = link.href.slice(1)
                      return (
                        <li key={link.href} style={{ '--i': i } as React.CSSProperties}>
                          <Link to={link.href} className="vs-panel-link" onClick={() => trackEvent('service_viewed', { service: slug, placement: 'home_list' })}>
                            <span><b>{link.title[lang]}</b><em>{link.note[lang]}</em></span>
                            <Go />
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </article>
            )
          })}
        </motion.div>
      </section>
      <WaveEdge flip />
    </div>
  )
}
