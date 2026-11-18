import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import NavMenu, { DrawerMenu } from './NavMenu'
import ScrollProgress from './ScrollProgress'
import { persistentCtaHref } from '../../data/nav'
import type { Bi } from '../../data/types'
import { trackEvent } from '../../lib/analytics'
import { useLang } from '../../i18n/LanguageContext'
import Cta from './Cta'

const cta: Bi<string> = { nl: 'Plan een gesprek', en: 'Plan a call' }

export function Logo() {
  return (
    <Link to="/" className="vs-logo" aria-label="Verkoop Studio, home">
      <span className="vs-logo-word">verkoop<span className="vs-logo-dot">.</span></span>
      <span className="vs-logo-sub">studio</span>
    </Link>
  )
}

function LangSwitch() {
  const { lang, setLang } = useLang()
  const thumb = useId()
  const options = [
    { code: 'nl', label: 'Nederlands' },
    { code: 'en', label: 'English' },
  ] as const
  return (
    <div className="vs-lang" role="group" aria-label={lang === 'nl' ? 'Taal' : 'Language'}>
      {options.map((option) => (
        <button key={option.code} type="button" lang={option.code} aria-label={option.label} aria-pressed={lang === option.code} onClick={() => setLang(option.code)}>
          {lang === option.code && <motion.span layoutId={thumb} className="vs-lang-thumb" transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }} />}
          <span>{option.code.toUpperCase()}</span>
        </button>
      ))}
    </div>
  )
}

export default function SiteHeader() {
  const { lang } = useLang()
  const { pathname, hash } = useLocation()
  const reduce = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname, hash])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (!open) return () => { document.body.style.overflow = '' }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); menuButton.current?.focus() }
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open])

  const onCta = (placement: string) => () => trackEvent('audit_cta_clicked', { placement })

  return (
    <>
      <ScrollProgress />
      <motion.header
        className={`vs-header${scrolled ? ' is-scrolled' : ''}`}
        initial={reduce ? false : { y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 24, stiffness: 240, delay: 0.1 }}
      >
        <div className="vs-header-bar">
          <Logo />
          <NavMenu compact={scrolled} />
          <div className="vs-header-end">
            <LangSwitch />
            <Cta to={persistentCtaHref} onClick={onCta('nav')}>{cta[lang]}</Cta>
            <button
              ref={menuButton}
              type="button"
              className="vs-menu-btn"
              aria-label={lang === 'nl' ? 'Menu openen' : 'Open menu'}
              aria-expanded={open}
              aria-controls="vs-drawer"
              onClick={() => setOpen(true)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="shade"
              className="vs-drawer-shade"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.nav
              key="drawer"
              id="vs-drawer"
              className="vs-drawer"
              aria-label={lang === 'nl' ? 'Menu' : 'Menu'}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            >
              <div className="vs-drawer-top">
                <Logo />
                <button type="button" className="vs-drawer-close" aria-label={lang === 'nl' ? 'Menu sluiten' : 'Close menu'} onClick={() => setOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <DrawerMenu onNavigate={() => setOpen(false)} />
              <div className="vs-drawer-foot">
                <LangSwitch />
                <Cta to={persistentCtaHref} onClick={onCta('nav_mobile')}>{cta[lang]}</Cta>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
