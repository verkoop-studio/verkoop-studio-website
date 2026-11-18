import { AnimatePresence, motion, useReducedMotion, type Variants } from 'motion/react'
import { ChevronDown, Megaphone, MessageCircle, ShoppingBag, Sparkles } from 'lucide-react'
import team from '../../assets/studio-flyers-640.webp'
import { caseHeadline, getCase } from '../../data/cases'
import { whatsappHref } from '../../data/contact'
import { trackEvent } from '../../lib/analytics'
import CasePoster from '../home/CasePoster'
import HandNote from './HandNote'
import Arrow from './Arrow'
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type RefObject } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { menuTabs, type MenuGroup, type MenuLink, type MenuTab } from '../../data/nav'
import type { CaseSlug, Lang } from '../../data/types'
import { useLang } from '../../i18n/LanguageContext'
import { EASE } from './motion'

const PANEL_ID = 'vs-mega'
/** Space kept between the panel and the edge it is clamped to. */
const EDGE = 12
/** Hover intent: wait this long before opening, less when a panel is already open. */
const OPEN_DELAY = 110
const SWITCH_DELAY = 70
/** Grace period on the way out, so the gap between the bar and the panel can be crossed. */
const CLOSE_DELAY = 180
/** One spring moves and resizes the panel from tab to tab. */
const MORPH = { type: 'spring', bounce: 0.14, duration: 0.5 } as const
const INSTANT = { duration: 0 } as const

interface Open {
  id: string
  /** Left edge of the panel, relative to the nav. */
  x: number
  w: number
  /** Direction of travel from the previous tab: -1 left, 1 right, 0 on first open. */
  dir: number
  /** Opened by a click or the keyboard, so the next click closes it. */
  pinned: boolean
}

function isActive(href: string, pathname: string, hash: string) {
  const [path, anchor] = href.split('#')
  if (anchor) return pathname === '/' && hash === `#${anchor}`
  return pathname === path || pathname.startsWith(`${path}/`)
}

function tabActive(tab: MenuTab, pathname: string, hash: string) {
  if (isActive(tab.href, pathname, hash)) return true
  return tab.groups?.some((group) => group.links.some((link) => isActive(link.href, pathname, hash))) ?? false
}

/** Label that rolls up on hover while a copy rolls in from below. */
function Roll({ children }: { children: string }) {
  return (
    <span className="vs-roll">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  )
}

/** One link: dot, title and a one-line note. Shared by the panel and the drawer. */
function Item({ link, lang, onClick, onPreview }: { link: MenuLink; lang: Lang; onClick: () => void; onPreview?: (href: string) => void }) {
  const { pathname } = useLocation()
  return (
    <Link
      to={link.href}
      className="vs-mi"
      aria-current={pathname === link.href ? 'page' : undefined}
      onClick={onClick}
      onMouseEnter={onPreview && (() => onPreview(link.href))}
      onFocus={onPreview && (() => onPreview(link.href))}
    >
      <span className="vs-mi-dot" aria-hidden="true" />
      <span className="vs-mi-t">{link.title[lang]}<Arrow size={13} /></span>
      <span className="vs-mi-n">{link.note[lang]}</span>
    </Link>
  )
}

const PIPELINE = [
  [30, 55, 80],
  [30, 55],
  [30],
  [30, 55],
]
const BARS = [38, 62, 96, 50, 72]

/** Tiny drawn preview of the two products: a pipeline with one lead moving up, or the ad that sells. */
function SoftwarePreview({ kind, reduce }: { kind: 'crm' | 'performance'; reduce: boolean }) {
  const soft = { fill: 'var(--vs-ink)', opacity: 0.16 }
  const card = { fill: 'var(--vs-card)', stroke: 'var(--vs-line)' }
  return (
    <div aria-hidden="true" style={{ display: 'grid', placeItems: 'center', borderRadius: 14, background: 'var(--vs-stone)' }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.svg
          key={kind}
          viewBox="0 0 220 150"
          width="100%"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.18 }}
        >
          {kind === 'crm' ? (
            <>
              {PIPELINE.map((cards, column) => (
                <g key={column} transform={`translate(${14 + column * 50} 0)`}>
                  <rect y={16} width={22} height={5} rx={2.5} style={soft} />
                  {cards.map((y) => (
                    <g key={y} transform={`translate(0 ${y})`}>
                      <rect width={42} height={20} rx={5} style={card} />
                      <rect x={7} y={8.5} width={20} height={3} rx={1.5} style={soft} />
                    </g>
                  ))}
                </g>
              ))}
              <motion.g
                initial={reduce ? false : { x: -50, y: 25 }}
                animate={{ x: 0, y: 0 }}
                transition={{ type: 'spring', bounce: 0.25, duration: 0.7, delay: 0.35 }}
              >
                <rect x={114} y={55} width={42} height={20} rx={5} style={{ fill: 'var(--vs-blue)' }} />
                <rect x={121} y={63.5} width={20} height={3} rx={1.5} fill="#fff" opacity={0.85} />
              </motion.g>
            </>
          ) : (
            <>
              {BARS.map((height, i) => (
                <motion.rect
                  key={i}
                  x={22 + i * 38}
                  y={126 - height}
                  width={24}
                  height={height}
                  rx={5}
                  style={{ ...(i === 2 ? { fill: 'var(--vs-blue)' } : card), originY: 1 }}
                  initial={reduce ? false : { scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.5, delay: 0.05 + i * 0.05, ease: EASE }}
                />
              ))}
              <rect x={14} y={128} width={192} height={2} rx={1} style={soft} />
            </>
          )}
        </motion.svg>
      </AnimatePresence>
    </div>
  )
}

const PANEL_COPY = {
  nl: { call: 'Plan een gesprek', whatsapp: 'WhatsApp', read: 'Lees de case', featured: 'Pinacello · online omzet', unsure: 'Niet zeker wat je nodig hebt?', unsureBody: 'Vraag je gratis groeiplan aan. We zeggen welke aanpak past.', unsureCta: 'Vraag je groeiplan aan', bundled: 'CRM en dashboard zitten in elk maandpakket', bundledLink: 'Bekijk de pakketten', crmFact: 'Gratis tot 500 leads', perfFact: 'Vanaf €49 per maand', us: 'dit zijn wij :)' },
  en: { call: 'Plan a call', whatsapp: 'WhatsApp', read: 'Read the case', featured: 'Pinacello · online revenue', unsure: 'Not sure what you need?', unsureBody: 'Ask for your free growth plan. We tell you which approach fits.', unsureCta: 'Ask for your growth plan', bundled: 'CRM and dashboard come with every monthly plan', bundledLink: 'See the plans', crmFact: 'Free up to 500 leads', perfFact: 'From €49 a month', us: 'this is us :)' },
}

const GROUP_ICONS = [Megaphone, ShoppingBag, Sparkles]

/** Cases: the real posters, small, with the featured result beside them. */
function CasesPanel({ group, lang, onNavigate, item }: { group: MenuGroup; lang: Lang; onNavigate: () => void; item: Variants }) {
  const c = PANEL_COPY[lang]
  return (
    <div className="vs-mega-cases">
      <ul className="vs-mega-tiles">
        {group.links.map((link) => {
          const study = getCase(link.href.split('/').pop() as CaseSlug)
          if (!study) return null
          return (
            <motion.li key={link.href} variants={item}>
              <Link to={link.href} className="vs-mega-tile vs-case-live" onClick={onNavigate}>
                <span className="vs-mega-tile-art" aria-hidden="true"><CasePoster slug={study.slug} name={study.name} caption={caseHeadline(study, lang)} lang={lang} /></span>
                <b>{study.name}</b>
                <span>{caseHeadline(study, lang)}</span>
              </Link>
            </motion.li>
          )
        })}
      </ul>
      <motion.div className="vs-mega-feature" variants={item}>
        <p className="vs-mega-feature-figure">+120%</p>
        <p className="vs-mega-feature-label">{c.featured}</p>
        <Link to="/cases/pinacello" className="vs-mega-more" onClick={onNavigate}>{c.read}<Arrow size={15} /></Link>
      </motion.div>
    </div>
  )
}

/** Services: three groups with an icon tile each, a soft bed under the hovered link, and a dark card for the undecided. */
function ServicesPanel({ groups, lang, onNavigate, item }: { groups: MenuGroup[]; lang: Lang; onNavigate: () => void; item: Variants }) {
  const c = PANEL_COPY[lang]
  const [hover, setHover] = useState<string | null>(null)
  return (
    <div className="vs-mega-services">
      <div className="vs-mega-groups" onMouseLeave={() => setHover(null)}>
        {groups.map((group, g) => {
          const Icon = GROUP_ICONS[g % GROUP_ICONS.length]
          return (
            <div key={g} role="group" aria-labelledby={`vs-mega-diensten-${g}`}>
              <p id={`vs-mega-diensten-${g}`} className="vs-mega-group-head"><span className={`vs-mega-icon vs-mega-icon--${g}`} aria-hidden="true"><Icon size={16} /></span>{group.label[lang]}</p>
              <ul>
                {group.links.map((link) => (
                  <motion.li key={link.href} variants={item} className="vs-mega-bedded" onMouseEnter={() => setHover(link.href)} onFocus={() => setHover(link.href)}>
                    {hover === link.href && <motion.span layoutId="vs-mega-bed" className="vs-mega-bed" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                    <Item link={link} lang={lang} onClick={onNavigate} />
                  </motion.li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
      <motion.div className="vs-mega-dark" variants={item}>
        <p className="vs-mega-dark-title">{c.unsure}</p>
        <p>{c.unsureBody}</p>
        <Link to="/#groeiplan" className="vs-mega-dark-cta" onClick={() => { trackEvent('audit_cta_clicked', { placement: 'nav_services' }); onNavigate() }}>{c.unsureCta}<Arrow size={15} /></Link>
      </motion.div>
    </div>
  )
}

/** Software: one tile per product with its live mini mock, the price fact and an arrow. */
function SoftwarePanel({ lang, onNavigate, reduce, item }: { lang: Lang; onNavigate: () => void; reduce: boolean; item: Variants }) {
  const c = PANEL_COPY[lang]
  const products = [
    { href: '/crm', kind: 'crm' as const, title: 'Sales CRM', fact: c.crmFact },
    { href: '/performance', kind: 'performance' as const, title: 'Performance', fact: c.perfFact },
  ]
  return (
    <div className="vs-mega-software">
      <ul className="vs-mega-products">
        {products.map((product) => (
          <motion.li key={product.href} variants={item}>
            <Link to={product.href} className="vs-mega-product" onClick={onNavigate}>
              <SoftwarePreview kind={product.kind} reduce={reduce} />
              <span className="vs-mega-product-row"><b>{product.title}</b><Arrow size={15} /></span>
              <span className="vs-mega-product-fact">{product.fact}</span>
            </Link>
          </motion.li>
        ))}
      </ul>
      <motion.p className="vs-mega-bundled" variants={item}>{c.bundled} · <Link to="/#groeipakketten" onClick={onNavigate}>{c.bundledLink}</Link></motion.p>
    </div>
  )
}

/** Agency: the team photo with a hand note, and the links with their one-line notes. */
function AgencyPanel({ group, lang, onNavigate, item }: { group: MenuGroup; lang: Lang; onNavigate: () => void; item: Variants }) {
  return (
    <div className="vs-mega-agency">
      <motion.div className="vs-mega-photo" variants={item}>
        <img src={team} alt="" width={320} height={400} loading="lazy" decoding="async" />
        <HandNote point="down-left" className="vs-mega-photo-note">{PANEL_COPY[lang].us}</HandNote>
      </motion.div>
      <ul className="vs-mega-agency-list">
        {group.links.map((link) => <motion.li key={link.href} variants={item}><Item link={link} lang={lang} onClick={onNavigate} /></motion.li>)}
      </ul>
    </div>
  )
}

/** The content of one tab, rendered inside the shared panel and replaced when the tab changes. */
function PanelContent({ tab, width, dir, lang, reduce, onNavigate }: { tab: MenuTab; width: number; dir: number; lang: Lang; reduce: boolean; onNavigate: () => void }) {
  const groups = tab.groups ?? []
  const c = PANEL_COPY[lang]
  const shift = reduce ? 0 : 26
  const content = {
    enter: (d: number) => ({ opacity: 0, x: d * shift }),
    center: { opacity: 1, x: 0, transition: reduce ? INSTANT : { duration: 0.32, ease: EASE, staggerChildren: 0.035, delayChildren: 0.03 } },
    exit: (d: number) => ({ opacity: 0, x: d * -shift, transition: reduce ? INSTANT : { duration: 0.16, ease: EASE } }),
  }
  const item: Variants = {
    enter: { opacity: 0, y: reduce ? 0 : 8 },
    center: { opacity: 1, y: 0, transition: reduce ? INSTANT : { duration: 0.4, ease: EASE } },
  }
  const body = tab.id === 'cases' && groups[0] ? <CasesPanel group={groups[0]} lang={lang} onNavigate={onNavigate} item={item} />
    : tab.id === 'diensten' ? <ServicesPanel groups={groups} lang={lang} onNavigate={onNavigate} item={item} />
    : tab.id === 'software' ? <SoftwarePanel lang={lang} onNavigate={onNavigate} reduce={reduce} item={item} />
    : groups[0] ? <AgencyPanel group={groups[0]} lang={lang} onNavigate={onNavigate} item={item} /> : null
  return (
    <motion.div className="vs-mega-in" data-menu-content={tab.id} style={{ width }} custom={dir} variants={content} initial="enter" animate="center" exit="exit">
      {body}
      <motion.div className="vs-mega-strip" variants={item}>
        <Link to="/contact" className="vs-mega-strip-cta" onClick={() => { trackEvent('audit_cta_clicked', { placement: 'nav_panel' }); onNavigate() }}>{c.call}<Arrow size={14} /></Link>
        <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="vs-mega-strip-link" onClick={() => trackEvent('whatsapp_clicked', { placement: 'nav_panel', channel: 'whatsapp' })}><MessageCircle size={15} aria-hidden="true" />{c.whatsapp}</a>
        {tab.more && <Link className="vs-mega-more vs-mega-strip-more" to={tab.href} onClick={onNavigate}>{tab.more[lang]}<Arrow size={15} /></Link>}
      </motion.div>
    </motion.div>
  )
}

/**
 * The one panel. It keeps a fixed size on screen that springs to the size and
 * place of the open tab, while the content inside cross-fades.
 */
function Panel({ open, lang, reduce, panelRef, onNavigate }: { open: Open; lang: Lang; reduce: boolean; panelRef: RefObject<HTMLDivElement | null>; onNavigate: () => void }) {
  const tab = menuTabs.find((entry) => entry.id === open.id)
  const [height, setHeight] = useState(0)
  /** False until the first height is on screen: the panel must not grow from zero when it opens. */
  const sized = useRef(false)

  useLayoutEffect(() => {
    const content = panelRef.current?.querySelector<HTMLElement>(`[data-menu-content="${open.id}"]`)
    if (!content) return
    const measure = () => setHeight(content.offsetHeight)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(content)
    return () => observer.disconnect()
  }, [open.id, open.w, lang, panelRef])

  useEffect(() => { if (height) sized.current = true }, [height])

  if (!tab) return null
  const morph = reduce || !sized.current ? INSTANT : MORPH
  return (
    <motion.div
      ref={panelRef}
      id={PANEL_ID}
      role="region"
      aria-labelledby={`vs-tab-${open.id}`}
      className="vs-mega"
      initial={{ opacity: 0, y: reduce ? 0 : -8, x: open.x, width: open.w, height: 0 }}
      animate={{ opacity: 1, y: 0, x: open.x, width: open.w, height }}
      exit={{ opacity: 0, y: reduce ? 0 : -6, transition: { duration: reduce ? 0 : 0.16, ease: EASE } }}
      transition={{ default: morph, opacity: { duration: reduce ? 0 : 0.22 }, y: reduce ? INSTANT : { duration: 0.35, ease: EASE } }}
    >
      <AnimatePresence custom={open.dir}>
        <PanelContent key={tab.id} tab={tab} width={open.w} dir={open.dir} lang={lang} reduce={reduce} onNavigate={onNavigate} />
      </AnimatePresence>
    </motion.div>
  )
}

/** Desktop navigation: plain links, and tabs that open the shared panel on hover, click or the keyboard. */
export default function NavMenu({ compact }: { compact: boolean }) {
  const { lang } = useLang()
  const { pathname, hash, key } = useLocation()
  const reduce = useReducedMotion() ?? false
  const [open, setOpen] = useState<Open | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const nav = useRef<HTMLElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const openRef = useRef<Open | null>(null)
  const timer = useRef(0)
  const focusFirst = useRef(false)

  useEffect(() => { openRef.current = open }, [open])

  /** Centre the panel under its tab, kept inside the header when it fits there and inside the window otherwise. */
  const place = useCallback((id: string) => {
    const el = nav.current
    const button = el?.querySelector<HTMLElement>(`[data-menu="${id}"]`)
    const tab = menuTabs.find((entry) => entry.id === id)
    if (!el || !button || !tab?.groups) return null
    const view = document.documentElement.clientWidth
    const w = Math.min(tab.width ?? 560, view - 2 * EDGE)
    const header = el.closest('.vs-header')?.getBoundingClientRect()
    const [min, max] = header && header.width >= w ? [header.left, header.right] : [EDGE, view - EDGE]
    const box = button.getBoundingClientRect()
    const left = Math.max(min, Math.min(box.left + box.width / 2 - w / 2, max - w))
    return { x: Math.round(left - el.getBoundingClientRect().left), w }
  }, [])

  const show = useCallback((id: string, pinned = false) => {
    window.clearTimeout(timer.current)
    const at = place(id)
    if (!at) return
    const order = (entry: string) => menuTabs.findIndex((tab) => tab.id === entry)
    setOpen((prev) => {
      const same = prev?.id === id
      if (prev && same && prev.x === at.x && prev.w === at.w && (prev.pinned || !pinned)) return prev
      return {
        id,
        ...at,
        dir: prev ? (same ? prev.dir : Math.sign(order(id) - order(prev.id))) : 0,
        pinned: pinned || (same && prev.pinned),
      }
    })
  }, [place])

  const close = useCallback(() => {
    window.clearTimeout(timer.current)
    setOpen(null)
  }, [])

  const later = (run: () => void, delay: number) => {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(run, delay)
  }

  useEffect(() => close(), [pathname, hash, key, close])
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const isOpen = open !== null
  useEffect(() => {
    if (!isOpen) return
    const replace = () => { if (openRef.current) show(openRef.current.id) }
    const onPointerDown = (event: PointerEvent) => {
      if (!nav.current?.contains(event.target as Node)) close()
    }
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape' || !openRef.current) return
      const button = nav.current?.querySelector<HTMLElement>(`[data-menu="${openRef.current.id}"]`)
      if (nav.current?.contains(document.activeElement)) button?.focus()
      close()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', replace)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', replace)
    }
  }, [isOpen, show, close])

  /** The header changes width when it turns into the pill: place the panel again once that has settled. */
  useEffect(() => {
    const id = window.setTimeout(() => { if (openRef.current) show(openRef.current.id) }, 540)
    return () => window.clearTimeout(id)
  }, [compact, show])

  const openId = open?.id
  useEffect(() => {
    if (!openId || !focusFirst.current) return
    focusFirst.current = false
    panel.current?.querySelector<HTMLElement>(`[data-menu-content="${openId}"] a`)?.focus()
  }, [openId])

  const onTabEnter = (tab: MenuTab) => () => {
    setHovered(tab.id)
    if (tab.groups) later(() => show(tab.id), openRef.current ? SWITCH_DELAY : OPEN_DELAY)
    else if (openRef.current) later(close, CLOSE_DELAY)
    else window.clearTimeout(timer.current)
  }

  /** A mouse click on a panel that hover already opened keeps it open; the next click closes it. */
  const onTabClick = (id: string) => (event: MouseEvent) => {
    const current = openRef.current
    if (current?.id === id && (current.pinned || event.detail === 0)) close()
    else show(id, true)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const el = nav.current
    if (!el || event.altKey || event.ctrlKey || event.metaKey) return
    const target = event.target as HTMLElement
    const current = openRef.current
    const tabs = [...el.querySelectorAll<HTMLElement>('.vs-tab')]
    const items = current ? [...el.querySelectorAll<HTMLElement>(`[data-menu-content="${current.id}"] a`)] : []
    const t = tabs.indexOf(target)
    const i = items.indexOf(target)
    const key = event.key
    const toTab = (index: number) => {
      const next = tabs[(index + tabs.length) % tabs.length]
      next.focus()
      if (!current) return
      if (next.dataset.menu) show(next.dataset.menu, true)
      else close()
    }
    if (t >= 0) {
      const menu = target.dataset.menu
      if (key === 'ArrowRight') toTab(t + 1)
      else if (key === 'ArrowLeft') toTab(t - 1)
      else if (key === 'Home') toTab(0)
      else if (key === 'End') toTab(tabs.length - 1)
      else if (key === 'ArrowDown' && menu) {
        if (current?.id === menu) items[0]?.focus()
        else { focusFirst.current = true; show(menu, true) }
      } else if (key === 'Tab' && !event.shiftKey && menu && current?.id === menu && items.length) items[0].focus()
      else return
    } else if (i >= 0 && current) {
      const owner = tabs.findIndex((tab) => tab.dataset.menu === current.id)
      if (key === 'ArrowDown') items[Math.min(i + 1, items.length - 1)].focus()
      else if (key === 'ArrowUp') (i === 0 ? tabs[owner] : items[i - 1]).focus()
      else if (key === 'Home') items[0].focus()
      else if (key === 'End') items[items.length - 1].focus()
      else if (key === 'ArrowRight') toTab(owner + 1)
      else if (key === 'ArrowLeft') toTab(owner - 1)
      else if (key === 'Tab' && event.shiftKey && i === 0) tabs[owner].focus()
      else if (key === 'Tab' && !event.shiftKey && i === items.length - 1 && tabs[owner + 1]) { tabs[owner + 1].focus(); close() }
      else return
    } else return
    event.preventDefault()
  }

  const lit = hovered ?? open?.id
  return (
    <nav
      ref={nav}
      className="vs-nav"
      aria-label={lang === 'nl' ? 'Hoofdmenu' : 'Main'}
      onMouseEnter={() => window.clearTimeout(timer.current)}
      onMouseLeave={() => { setHovered(null); later(close, CLOSE_DELAY) }}
      onKeyDown={onKeyDown}
      onBlur={(event) => {
        if (event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) close()
      }}
    >
      {menuTabs.map((tab) => {
        const active = tabActive(tab, pathname, hash)
        const pills = (
          <>
            {active && <motion.span layoutId="vsNavActive" className="vs-nav-pill vs-nav-pill--active" transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }} />}
            {lit === tab.id && !active && <motion.span layoutId="vsNavHover" className="vs-nav-pill vs-nav-pill--hover" transition={{ type: 'spring', bounce: 0.15, duration: 0.3 }} />}
          </>
        )
        if (!tab.groups) {
          return (
            <Link key={tab.id} to={tab.href} className="vs-tab" aria-current={active ? 'page' : undefined} onMouseEnter={onTabEnter(tab)} style={{ isolation: 'isolate' }}>
              {pills}
              <Roll>{tab.label[lang]}</Roll>
            </Link>
          )
        }
        return (
          <button
            key={tab.id}
            type="button"
            id={`vs-tab-${tab.id}`}
            className={`vs-tab${active ? ' is-current' : ''}`}
            data-menu={tab.id}
            aria-expanded={open?.id === tab.id}
            aria-controls={PANEL_ID}
            onMouseEnter={onTabEnter(tab)}
            onClick={onTabClick(tab.id)}
            style={{ isolation: 'isolate' }}
          >
            {pills}
            <Roll>{tab.label[lang]}</Roll>
            <ChevronDown className="vs-tab-caret" size={14} aria-hidden="true" />
          </button>
        )
      })}
      <AnimatePresence>
        {open && <Panel key="panel" open={open} lang={lang} reduce={reduce} panelRef={panel} onNavigate={close} />}
      </AnimatePresence>
    </nav>
  )
}

/** The same tabs inside the mobile drawer: plain links, and groups as accordion sections. */
export function DrawerMenu({ onNavigate }: { onNavigate: () => void }) {
  const { lang } = useLang()
  const reduce = useReducedMotion() ?? false
  const [expanded, setExpanded] = useState<string | null>(null)
  return (
    <>
      {menuTabs.map((tab, i) => (
        <motion.div
          key={tab.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.06 + i * 0.05, duration: 0.45, ease: EASE }}
        >
          {tab.groups ? (
            <>
              <button
                type="button"
                className="vs-drawer-link"
                aria-expanded={expanded === tab.id}
                aria-controls={`vs-drawer-${tab.id}`}
                onClick={() => setExpanded((current) => (current === tab.id ? null : tab.id))}
              >
                {tab.label[lang]}
                <ChevronDown className="vs-tab-caret" size={20} aria-hidden="true" />
              </button>
              <AnimatePresence initial={false}>
                {expanded === tab.id && (
                  <motion.div
                    id={`vs-drawer-${tab.id}`}
                    role="region"
                    aria-label={tab.label[lang]}
                    className="vs-drawer-group"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={reduce ? INSTANT : { duration: 0.4, ease: EASE }}
                  >
                    {tab.groups.map((group, g) => (
                      <div key={g} role="group" aria-labelledby={`vs-drawer-${tab.id}-${g}`}>
                        <p id={`vs-drawer-${tab.id}-${g}`} className="vs-mega-label">{group.label[lang]}</p>
                        <ul>
                          {group.links.map((link) => (
                            <li key={link.href}><Item link={link} lang={lang} onClick={onNavigate} /></li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    {tab.more && (
                      <Link className="vs-mega-more" to={tab.href} onClick={onNavigate}>
                        {tab.more[lang]}
                        <Arrow size={15} />
                      </Link>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <Link className="vs-drawer-link" to={tab.href} onClick={onNavigate}>
              {tab.label[lang]}
              <Arrow direction="up-right" size={20} />
            </Link>
          )}
        </motion.div>
      ))}
    </>
  )
}
