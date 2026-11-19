// From Bencho (bencho.dev), MIT licence, (c) 2026 Lorenzo Cabra.
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'

/* ══ Toast stack ══════════════════════════════════════════
   Three toasts, always: the newest in front, the two before it
   tucked behind with a sliver of each showing above it, a step
   smaller each. Point at the stack and it fans out into a list;
   move away and it gathers back up.

   One spring, three places: a toast's place is worked out from how
   far back it is and whether the stack is open, and the spring takes
   it there. Opening, closing and the next toast arriving are all the
   same move.

   Hover is the whole frame: the frame is the open list's size, so
   hovering it is hovering the list, and the list cannot slide out
   from under the pointer.

   It never runs out: on a beat the next item rises in at the front
   and the oldest drops off the back, so there are always three. */

export type ToastItem = { key: string; icon: ReactNode; title: ReactNode; body: ReactNode; aside?: ReactNode }

const SHOWN = 3
const SPRING = { type: 'spring', stiffness: 380, damping: 34, mass: 1 } as const

export function ToastStack({
  items,
  height = 64,
  peek = 14,
  gap = 10,
  corner = 18,
  every = 2600,
  label,
  anchor = 'middle',
  onArrive,
  className = '',
}: {
  /** The pool; the stack shows three at a time and cycles through it. */
  items: ToastItem[]
  height?: number
  peek?: number
  gap?: number
  corner?: number
  /** ms between arrivals; 0 keeps the stack still. */
  every?: number
  label: string
  /** Where the gathered stack rests in its frame; the open list always fills it. */
  anchor?: 'middle' | 'bottom'
  /** Told the running count of arrivals, starting at three. */
  onArrive?: (count: number) => void
  className?: string
}) {
  const H = height
  const reduce = useReducedMotion()
  const root = useRef<HTMLDivElement | null>(null)
  const seen = useInView(root, { amount: 0.3 })
  const [head, setHead] = useState(0)
  const [open, setOpen] = useState(false)

  /* a new arrival every beat while it is on screen and not being read */
  useEffect(() => {
    if (!every || reduce || !seen || open || items.length <= SHOWN) return
    const id = window.setInterval(() => setHead((h) => h + 1), every)
    return () => window.clearInterval(id)
  }, [every, reduce, seen, open, items.length])
  useEffect(() => { onArrive?.(head + SHOWN) }, [head, onArrive])

  /* front first; the serial keeps a returning item a new element */
  const stack = Array.from({ length: Math.min(SHOWN, items.length) }, (_, k) => {
    const serial = head - k
    const item = items[((serial % items.length) + items.length) % items.length]
    return { ...item, serial }
  })

  const listH = SHOWN * H + (SHOWN - 1) * gap
  const stackH = H + (SHOWN - 1) * peek
  const FH = listH

  const place = (k: number) => {
    if (open) {
      const top = (FH - listH) / 2
      return { y: top + (SHOWN - 1 - k) * (H + gap), scale: 1 }
    }
    const top = anchor === 'bottom' ? FH - stackH : (FH - stackH) / 2
    const d = Math.min(k, SHOWN - 1)
    return { y: top + (SHOWN - 1 - d) * peek, scale: 1 - d * 0.05 }
  }

  return (
    <div
      ref={root}
      className={`tst ${className}`}
      role="region"
      aria-label={label}
      data-open={open || undefined}
      style={{ height: FH, ['--tst-r' as string]: `${corner}px` } as CSSProperties}
      onPointerOver={() => setOpen(true)}
      onPointerOut={(e) => {
        const to = e.relatedTarget as Node | null
        if (!to || !root.current?.contains(to)) setOpen(false)
      }}
    >
      {stack.map((t, k) => {
        const p = place(k)
        const front = k === 0
        return (
          <motion.div
            key={`${t.key}-${t.serial}`}
            className="tst-toast"
            data-front={front || undefined}
            style={{ height: H, zIndex: SHOWN - k }}
            initial={reduce ? false : { y: place(0).y + 24, scale: 1, opacity: 0 }}
            animate={{ y: p.y, scale: p.scale, opacity: 1 }}
            transition={SPRING}
            aria-hidden={!open && !front ? true : undefined}
          >
            <span className="tst-icon">{t.icon}</span>
            <span className="tst-text">
              <b>{t.title}</b>
              <span>{t.body}</span>
            </span>
            {t.aside && <span className="tst-aside">{t.aside}</span>}
          </motion.div>
        )
      })}
    </div>
  )
}
