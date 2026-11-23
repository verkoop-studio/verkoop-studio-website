import { type ReactNode, createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

/*
 * One detail card for the whole site. A row in a sample window stays short; point at it with a
 * mouse and a card with everything about that row opens above the pointer, after a short pause so
 * that moving across a window does not flash a card at every row. Once a card is open, the next
 * one follows the pointer at once. On a touch screen a tap opens it. Pressing anywhere, scrolling
 * or resizing closes it. The card is placed from the live element every time and stays inside the
 * window's edges.
 */

type Card = { el: HTMLElement; body: ReactNode; id: number; px: number | null }
type Api = { show: (el: HTMLElement, body: ReactNode, px: number | null, now?: boolean) => void; move: (el: HTMLElement, px: number) => void; hide: () => void }
const Ctx = createContext<Api>({ show: () => {}, move: () => {}, hide: () => {} })

export function DetailLayer({ children }: { children: ReactNode }) {
  const [card, setCard] = useState<Card | null>(null)
  const wait = useRef(0)
  const open = useRef(false)
  const serial = useRef(0)
  const hide = useCallback(() => { window.clearTimeout(wait.current); open.current = false; setCard(null) }, [])
  const show = useCallback((el: HTMLElement, body: ReactNode, px: number | null, now = false) => {
    window.clearTimeout(wait.current)
    const go = () => { if (!el.isConnected) return; open.current = true; setCard({ el, body, id: ++serial.current, px }) }
    if (now || open.current) go()
    else wait.current = window.setTimeout(go, 240)
  }, [])
  const move = useCallback((el: HTMLElement, px: number) => {
    setCard((c) => (c && c.el === el && Math.abs((c.px ?? 0) - px) > 2 ? { ...c, px } : c))
  }, [])
  useEffect(() => {
    const away = () => hide()
    window.addEventListener('scroll', away, true)
    window.addEventListener('pointerdown', away, true)
    window.addEventListener('resize', away)
    return () => { window.removeEventListener('scroll', away, true); window.removeEventListener('pointerdown', away, true); window.removeEventListener('resize', away); window.clearTimeout(wait.current) }
  }, [hide])
  return (
    <Ctx.Provider value={{ show, move, hide }}>
      {children}
      <AnimatePresence>{card && <Pop key="detail" card={card} />}</AnimatePresence>
    </Ctx.Provider>
  )
}

function Pop({ card }: { card: Card }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [at, setAt] = useState<{ x: number; y: number; below: boolean } | null>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const w = el.offsetWidth, h = el.offsetHeight, pad = 10, gap = 10
    const box = card.el.getBoundingClientRect()
    const left = Math.max(box.left, 0), right = Math.min(box.right, window.innerWidth)
    const ax = card.px !== null ? Math.min(Math.max(card.px, left), right) : (left + right) / 2
    const below = box.top - h - gap < pad + 64
    const y = below ? box.bottom + gap : box.top - h - gap
    setAt({ x: Math.min(Math.max(ax - w / 2, pad), window.innerWidth - w - pad), y: Math.min(Math.max(y, pad), window.innerHeight - h - pad), below })
  }, [card])
  return (
    <motion.div
      ref={ref}
      className="dv"
      aria-hidden="true"
      style={{ left: at?.x ?? -9999, top: at?.y ?? -9999, transformOrigin: at?.below ? '50% 0' : '50% 100%' }}
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
      animate={{ opacity: at ? 1 : 0, scale: 1 }}
      exit={{ opacity: 0, scale: reduce ? 1 : 0.97, transition: { duration: 0.12 } }}
      transition={{ type: 'spring', stiffness: 520, damping: 34 }}
    >
      <motion.div key={card.id} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>{card.body}</motion.div>
    </motion.div>
  )
}

/** Props that open the detail card: pointing with a mouse, or a tap on a touch screen. */
export function useDetail() {
  const api = useContext(Ctx)
  return (body: () => ReactNode) => ({
    'data-detail': '',
    onPointerEnter: (e: React.PointerEvent<HTMLElement>) => { if (e.pointerType === 'mouse' && !e.buttons) api.show(e.currentTarget, body(), e.clientX) },
    onPointerMove: (e: React.PointerEvent<HTMLElement>) => { if (e.pointerType === 'mouse' && !e.buttons) api.move(e.currentTarget, e.clientX) },
    onPointerLeave: (e: React.PointerEvent<HTMLElement>) => { if (e.pointerType === 'mouse') api.hide() },
    onPointerUp: (e: React.PointerEvent<HTMLElement>) => { if (e.pointerType !== 'mouse') api.show(e.currentTarget, body(), e.clientX, true) },
  })
}
