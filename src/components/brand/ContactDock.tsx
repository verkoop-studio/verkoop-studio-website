import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { MessageCircle, Phone, X } from 'lucide-react'
import BotAvatar from './BotAvatar'
import { STUDIO_PHONE, whatsappHref } from '../../data/contact'
import { useFooterInView } from '../../lib/useFooterInView'
import { useEffect, useState } from 'react'
import { useLang } from '../../i18n/LanguageContext'
import { trackEvent } from '../../lib/analytics'
import { EASE } from './motion'


const COPY = {
  nl: {
    title: 'Vraag over je groei?',
    body: 'Stuur ons een bericht op WhatsApp of bel. We antwoorden snel en persoonlijk.',
    whatsapp: 'WhatsApp',
    call: 'Bellen',
    open: 'Contactopties openen',
    close: 'Contactopties sluiten',
    message: 'Hallo Verkoop Studio, ik heb een vraag over ',
    greet: 'Vraagje? Stuur ons gerust een bericht.',
  },
  en: {
    title: 'A question about growth?',
    body: 'Send us a WhatsApp message or call. We reply quickly and in person.',
    whatsapp: 'WhatsApp',
    call: 'Call',
    open: 'Open contact options',
    close: 'Close contact options',
    message: 'Hi Verkoop Studio, I have a question about ',
    greet: 'A question? Feel free to send us a message.',
  },
}

/**
 * Appears once the visitor is past the hero, so it never competes with the hero CTAs.
 * The card opens on click only; the halo on the button is the nudge.
 */
export default function ContactDock() {
  const { lang } = useLang()
  const t = COPY[lang]
  const reduce = useReducedMotion()
  const [past, setPast] = useState(false)
  const footerInView = useFooterInView()
  const [open, setOpen] = useState(false)
  const [greet, setGreet] = useState(false)

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > window.innerHeight * 0.85)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // One short opening line, once per visit, a moment after the dock appears.
  useEffect(() => {
    if (!past) return
    let seen = false
    try { seen = sessionStorage.getItem('vs-dock-greet') === '1' } catch { /* storage blocked */ }
    if (seen) return
    const show = window.setTimeout(() => {
      setGreet(true)
      try { sessionStorage.setItem('vs-dock-greet', '1') } catch { /* storage blocked */ }
    }, 2500)
    return () => window.clearTimeout(show)
  }, [past])

  // The line leaves on its own after seven seconds.
  useEffect(() => {
    if (!greet) return
    const hide = window.setTimeout(() => setGreet(false), 7000)
    return () => window.clearTimeout(hide)
  }, [greet])

  const toggle = () => { setGreet(false); setOpen((value) => !value) }

  return (
    <AnimatePresence>
      {past && (
        <motion.div
          className="vs-dock"
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
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.96 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <strong>{t.title}</strong>
                <p>{t.body}</p>
                <div className="vs-dock-actions">
                  <a
                    href={whatsappHref(t.message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('whatsapp_clicked', { placement: 'dock', channel: 'whatsapp' })}
                  >
                    <MessageCircle size={15} aria-hidden="true" />{t.whatsapp}
                  </a>
                  <a href={`tel:${STUDIO_PHONE}`} onClick={() => trackEvent('whatsapp_clicked', { placement: 'dock', channel: 'phone' })}>
                    <Phone size={15} aria-hidden="true" />{t.call}
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {greet && !open && !footerInView && (
              <motion.button
                type="button"
                className="vs-dock-greet"
                onClick={toggle}
                initial={reduce ? false : { opacity: 0, y: 8, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                {t.greet}
              </motion.button>
            )}
          </AnimatePresence>
          <button type="button" className="vs-dock-trigger" aria-label={open ? t.close : t.open} aria-expanded={open} aria-controls="vs-dock-card" onClick={toggle}>
            {!open && !reduce && (
              <motion.span
                className="vs-dock-halo"
                initial={{ opacity: 0.5, scale: 1 }}
                animate={{ opacity: 0, scale: 1.4 }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
            {open ? <X size={22} /> : <BotAvatar shape="verkoop" size={40} color="#2b4bf2" eyeColor="#ffffff" live mood="happy" />}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
