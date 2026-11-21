import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ChevronDown, Globe } from 'lucide-react'
import { type KeyboardEvent, useEffect, useId, useRef, useState } from 'react'
import { useLang } from '../../i18n/LanguageContext'
import { LANGUAGES } from '../../i18n/languages'

const LABEL = { nl: 'Taal', en: 'Language' }

/**
 * Language picker: a pill with a globe and the current language, which opens a short
 * list. Each language is named in its own words and says hello; a soft highlight
 * follows the pointer or the arrow keys from row to row, the current one carries a
 * tick that draws itself, and the code in the pill rolls over when the choice changes.
 * `up` opens the list above the pill, for the foot of the phone menu and the footer;
 * `dark` is for dark surfaces. The list lines up with whichever edge of the pill keeps
 * it on screen.
 */
export default function LangPicker({ up = false, dark = false }: { up?: boolean; dark?: boolean }) {
  const { lang, setLang } = useLang()
  const reduce = useReducedMotion()
  const id = useId()
  const root = useRef<HTMLDivElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [at, setAt] = useState(0)
  const [end, setEnd] = useState(false)
  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0]

  useEffect(() => {
    if (!open) return
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false) }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [open])

  const show = () => {
    const box = button.current?.getBoundingClientRect()
    if (box) setEnd(box.left + box.width / 2 > window.innerWidth / 2)
    setAt(Math.max(0, LANGUAGES.findIndex((l) => l.code === lang)))
    setOpen(true)
  }
  const choose = (index: number) => { setLang(LANGUAGES[index].code); setOpen(false); button.current?.focus() }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const n = LANGUAGES.length
    if (!open) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); show() }
      return
    }
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); setOpen(false) }
    else if (event.key === 'ArrowDown') { event.preventDefault(); setAt((i) => (i + 1) % n) }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setAt((i) => (i - 1 + n) % n) }
    else if (event.key === 'Home') { event.preventDefault(); setAt(0) }
    else if (event.key === 'End') { event.preventDefault(); setAt(n - 1) }
    else if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); choose(at) }
    else if (event.key === 'Tab') setOpen(false)
  }

  return (
    <div ref={root} className={`vs-lang${up ? ' vs-lang--up' : ''}${end ? ' vs-lang--end' : ''}${dark ? ' vs-lang--dark' : ''}`}>
      <button
        ref={button}
        type="button"
        className="vs-lang-btn"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-activedescendant={open ? `${id}-${LANGUAGES[at].code}` : undefined}
        aria-label={`${LABEL[lang]}: ${current.name}`}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onKeyDown}
      >
        <Globe size={16} aria-hidden="true" className="vs-lang-globe" />
        <span className="vs-lang-code" aria-hidden="true">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={lang}
              initial={reduce ? false : { y: '90%', opacity: 0, filter: 'blur(3px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={reduce ? { opacity: 0 } : { y: '-90%', opacity: 0, filter: 'blur(3px)' }}
              transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            >
              {up ? current.name : lang.toUpperCase()}
            </motion.span>
          </AnimatePresence>
        </span>
        <ChevronDown size={14} aria-hidden="true" className="vs-lang-chev" />
      </button>

      {/* The list stays in the page, hidden until asked for, so the languages are there before any script runs. */}
      <motion.div
        className="vs-lang-menu"
        data-open={open}
        inert={!open}
        initial={false}
        animate={open ? { opacity: 1, y: 0, scale: 1 } : reduce ? { opacity: 0, y: 0, scale: 1 } : { opacity: 0, y: up ? 8 : -8, scale: 0.96 }}
        transition={open ? { type: 'spring', stiffness: 460, damping: 32 } : { duration: 0.14 }}
      >
        <p className="vs-lang-title" id={`${id}-label`}>{LABEL[lang]}</p>
        <ul id={`${id}-list`} role="listbox" aria-labelledby={`${id}-label`} className="vs-lang-list">
          {LANGUAGES.map((option, index) => {
            const selected = option.code === lang
            return (
              <li
                key={option.code}
                id={`${id}-${option.code}`}
                role="option"
                aria-label={option.name}
                aria-selected={selected}
                lang={option.code}
                className="vs-lang-opt"
                data-at={at === index || undefined}
                onPointerMove={() => setAt(index)}
                onClick={() => choose(index)}
              >
                {open && at === index && <motion.span layoutId={`${id}-hl`} className="vs-lang-hl" transition={{ type: 'spring', stiffness: 520, damping: 36 }} />}
                <span className="vs-lang-name">{option.name}</span>
                {selected ? (
                  <svg key={String(open)} className="vs-lang-tick" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                    <motion.path d="M4 9.4 7.6 13 14 5.6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={reduce || !open ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, delay: 0.12, ease: [0.22, 1, 0.36, 1] }} />
                  </svg>
                ) : (
                  <span className="vs-lang-hello" aria-hidden="true">{option.hello}</span>
                )}
              </li>
            )
          })}
        </ul>
      </motion.div>
    </div>
  )
}
