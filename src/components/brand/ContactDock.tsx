import { AnimatePresence, motion, useReducedMotion, useSpring, type Variants } from 'motion/react'
import { usePhoneScrollingDown } from '../../lib/usePhoneScrollingDown'
import { MessageCircle, Phone } from 'lucide-react'
import { useEffect, useRef, useState, type PointerEvent } from 'react'
import stef from '../../assets/stef-desk-640.webp'
import { STUDIO_PHONE, STUDIO_PHONE_LOCAL, whatsappHref } from '../../data/contact'
import { useLang } from '../../i18n/LanguageContext'
import { trackEvent } from '../../lib/analytics'
import Arrow from './Arrow'
import DockChat from './DockChat'
import { EASE } from './motion'
import Watcher from './Watcher'

const COPY = {
  nl: {
    title: 'Vraag over je groei?',
    body: 'Stuur ons een bericht op WhatsApp of bel. We antwoorden snel en persoonlijk.',
    reply: 'Antwoord binnen 24 uur',
    ask: 'Stel een vraag',
    talk: 'Praat met Stef',
    whatsapp: 'WhatsApp',
    call: 'Bellen',
    open: 'Contactopties openen',
    close: 'Contactopties sluiten',
    message: 'Hallo Verkoop Studio, ik heb een vraag over ',
  },
  en: {
    title: 'A question about growth?',
    body: 'Send us a WhatsApp message or call. We reply quickly and in person.',
    reply: 'Reply within 24 hours',
    ask: 'Ask a question',
    talk: 'Talk to Stef',
    whatsapp: 'WhatsApp',
    call: 'Call',
    open: 'Open contact options',
    close: 'Close contact options',
    message: 'Hi Verkoop Studio, I have a question about ',
  },
}

/** Pulls a button up to 6px toward the pointer; it springs back when the pointer leaves. */
function useMagnet(reduce: boolean | null) {
  const x = useSpring(0, { stiffness: 300, damping: 20 })
  const y = useSpring(0, { stiffness: 300, damping: 20 })
  const clamp = (v: number) => Math.max(-6, Math.min(6, v))
  return {
    style: { x, y },
    onPointerMove: (event: PointerEvent<HTMLElement>) => {
      if (reduce || event.pointerType !== 'mouse') return
      const box = event.currentTarget.getBoundingClientRect()
      x.set(clamp((event.clientX - (box.left + box.width / 2)) * 0.15))
      y.set(clamp((event.clientY - (box.top + box.height / 2)) * 0.3))
    },
    onPointerLeave: () => { x.set(0); y.set(0) },
  }
}

/** Three dots that type for a moment, then give way to the line itself. */
function Typing({ text, reduce }: { text: string; reduce: boolean | null }) {
  const [done, setDone] = useState(Boolean(reduce))
  useEffect(() => {
    if (reduce) return
    const id = window.setTimeout(() => setDone(true), 1200)
    return () => window.clearTimeout(id)
  }, [reduce])
  return (
    <AnimatePresence mode="wait" initial={false}>
      {done
        ? <motion.p key="text" className="vs-dock-body" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }}>{text}</motion.p>
        : <motion.p key="dots" className="vs-dock-typing" aria-hidden="true" exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.15 }}><i /><i /><i /></motion.p>}
    </AnimatePresence>
  )
}

/**
 * Appears once the visitor is past the hero, so it never competes with the hero CTAs.
 * The card grows out of the button on click; the halo on the button is the nudge.
 * The watching eyes fold into a close mark while it is open. Escape closes it and
 * hands focus back to the button.
 */
export default function ContactDock() {
  const { lang } = useLang()
  const t = COPY[lang]
  const reduce = useReducedMotion()
  const [past, setPast] = useState(false)
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<'ask' | 'talk'>('ask')
  const trigger = useRef<HTMLButtonElement>(null)
  const rotateX = useSpring(0, { stiffness: 200, damping: 20 })
  const rotateY = useSpring(0, { stiffness: 200, damping: 20 })
  const wa = useMagnet(reduce)
  const call = useMagnet(reduce)

  // On phones the button tucks in while a sample screen passes beneath it, so it never covers one.
  const [tucked, setTucked] = useState(false)
  const away = usePhoneScrollingDown()
  useEffect(() => {
    let frame = 0
    const check = () => {
      setPast(window.scrollY > window.innerHeight * 0.85)
      if (window.innerWidth >= 768) { setTucked(false); return }
      const zone = window.innerHeight - 160
      const under = [...document.querySelectorAll<HTMLElement>('.st-win, .tx-win')].some((el) => {
        const box = el.getBoundingClientRect()
        return box.bottom > zone && box.top < window.innerHeight && box.right > window.innerWidth - 90
      })
      setTucked(under)
    }
    const onScroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(check) }
    check()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      trigger.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const toggle = () => setOpen((value) => !value)

  // The card leans toward the pointer, three degrees at most.
  const tilt = (event: PointerEvent<HTMLDivElement>) => {
    if (reduce || event.pointerType !== 'mouse') return
    const box = event.currentTarget.getBoundingClientRect()
    rotateY.set(((event.clientX - box.left) / box.width - 0.5) * 6)
    rotateX.set((0.5 - (event.clientY - box.top) / box.height) * 6)
  }
  const untilt = () => { rotateX.set(0); rotateY.set(0) }

  const lines: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 8 },
    shown: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE, delay: reduce ? 0 : 0.08 + i * 0.07 } }),
  }

  return (
    <AnimatePresence>
      {past && (
        <motion.div
          className={`vs-dock${tucked && !open ? ' is-tucked' : ''}${away && !open ? ' is-away' : ''}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <AnimatePresence>
            {open && (
              <motion.div
                id="vs-dock-card"
                className="vs-dock-card"
                role="dialog"
                aria-label={t.title}
                style={{ rotateX, rotateY, transformPerspective: 900, transformOrigin: '100% 100%' }}
                // Visible from the first frame: the opacity is in by about 90 ms, the overshoot to 1.04 lands near 180 ms.
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, scale: [0.8, 1.04, 1], transition: { opacity: { duration: 0.09, ease: 'linear' }, scale: { duration: 0.36, times: [0, 0.5, 1], ease: ['easeOut', 'easeInOut'] } } }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.85, transition: { duration: 0.18, ease: EASE } }}
                onPointerMove={tab === 'talk' ? tilt : undefined}
                onPointerLeave={untilt}
              >
                <motion.div className="vs-dock-tabs" role="tablist" variants={lines} custom={0} initial="hidden" animate="shown">
                  {(['ask', 'talk'] as const).map((key) => (
                    <button key={key} type="button" role="tab" aria-selected={tab === key} className={tab === key ? 'is-on' : ''} onClick={() => setTab(key)}>
                      {tab === key && <motion.span layoutId="vs-dock-tab" className="vs-dock-tab-bed" transition={{ type: 'spring', stiffness: 420, damping: 32 }} />}
                      <span>{key === 'ask' ? t.ask : t.talk}</span>
                    </button>
                  ))}
                </motion.div>
                {tab === 'ask' ? (
                  <motion.div variants={lines} custom={1} initial="hidden" animate="shown"><DockChat lang={lang} onNavigate={() => setOpen(false)} /></motion.div>
                ) : <>
                <motion.div className="vs-dock-head" variants={lines} custom={1} initial="hidden" animate="shown">
                  <span className="vs-dock-ava"><img src={stef} alt="" width={44} height={44} decoding="async" /><i /></span>
                  <span><b>Stef</b><em>{t.reply}</em></span>
                </motion.div>
                <motion.strong className="vs-dock-title" variants={lines} custom={2} initial="hidden" animate="shown">{t.title}</motion.strong>
                <motion.div variants={lines} custom={3} initial="hidden" animate="shown"><Typing text={t.body} reduce={reduce} /></motion.div>
                <motion.div className="vs-dock-actions" variants={lines} custom={4} initial="hidden" animate="shown">
                  <motion.a
                    href={whatsappHref(t.message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="vs-dock-btn vs-dock-btn--wa"
                    onClick={() => trackEvent('whatsapp_clicked', { placement: 'dock', channel: 'whatsapp' })}
                    {...wa}
                  >
                    <MessageCircle size={15} aria-hidden="true" /><span>{t.whatsapp}</span><span className="vs-dock-btn-go"><Arrow size={13} /></span>
                  </motion.a>
                  <motion.a
                    href={`tel:${STUDIO_PHONE}`}
                    className="vs-dock-btn vs-dock-btn--call"
                    aria-label={`${t.call} ${STUDIO_PHONE_LOCAL}`}
                    onClick={() => trackEvent('whatsapp_clicked', { placement: 'dock', channel: 'phone' })}
                    {...call}
                  >
                    <Phone size={15} aria-hidden="true" />
                    <span className="vs-roll" aria-hidden="true"><span>{t.call}</span><span>{STUDIO_PHONE_LOCAL}</span></span>
                  </motion.a>
                </motion.div>
                </>}
              </motion.div>
            )}
          </AnimatePresence>
          <button ref={trigger} type="button" className={`vs-dock-trigger${open ? ' is-open' : ''}`} aria-label={open ? t.close : t.open} aria-expanded={open} aria-controls="vs-dock-card" onClick={toggle}>
            {!open && !reduce && (
              <motion.span
                className="vs-dock-halo"
                initial={{ opacity: 0.5, scale: 1 }}
                animate={{ opacity: 0, scale: 1.4 }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
            <span className="vs-dock-eyes"><Watcher shape="Ball" size={38} poke={false} within=".vs-dock" /></span>
            <span className="vs-dock-x" aria-hidden="true"><i /><i /></span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
