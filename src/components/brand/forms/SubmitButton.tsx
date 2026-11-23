import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import Arrow from '../Arrow'
import { ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type State = 'locked' | 'ready' | 'pending'

function useSlide() {
  const [slide, setSlide] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(pointer: coarse) and (max-width: 640px)')
    const update = () => setSlide(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return slide
}

/** Phones: drag the thumb to the end to send. Keyboard and screen readers can still press it. */
function SlideToConfirm({ label, state }: { label: string; state: State }) {
  const track = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const fill = useTransform(x, (value) => `${value + 52}px`)
  /* the trail only shows once the thumb moves, so at rest there is no dark ring around it */
  const fillOpacity = useTransform(x, [0, 12], [0, 1])
  const textOpacity = useTransform(x, [0, 120], [1, 0])
  const [max, setMax] = useState(0)

  useEffect(() => {
    const measure = () => setMax(Math.max(0, (track.current?.clientWidth ?? 0) - 56))
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])
  useEffect(() => { if (state !== 'pending') animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 }) }, [state, x])

  const release = () => {
    if (x.get() > max * 0.85 && state === 'ready') {
      animate(x, max, { duration: 0.15 })
      track.current?.closest('form')?.requestSubmit()
    } else {
      animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 })
    }
  }

  return (
    <div ref={track} className="vs-slide-confirm" data-state={state}>
      <motion.span className="vs-slide-fill" style={{ width: fill, opacity: fillOpacity }} aria-hidden="true" />
      <motion.span className="vs-slide-text" style={{ opacity: textOpacity }} aria-hidden="true">{label}</motion.span>
      <motion.button
        type="submit"
        className="vs-slide-thumb"
        aria-label={label}
        disabled={state !== 'ready'}
        drag={state === 'ready' ? 'x' : false}
        dragConstraints={{ left: 0, right: max }}
        dragElastic={0.05}
        dragMomentum={false}
        style={{ x }}
        onDragEnd={release}
        onClick={(event) => { if (event.detail !== 0) event.preventDefault() }}
      >
        {state === 'pending' ? <span className="vs-submit-spinner" aria-hidden="true" /> : <ChevronRight size={22} strokeWidth={2.4} aria-hidden="true" />}
      </motion.button>
    </div>
  )
}

/**
 * Submit button that looks asleep until the form is valid, wakes with a small bounce,
 * and turns into a round spinner while sending. On phones it becomes slide-to-confirm.
 */
export default function SubmitButton({ label, pendingLabel, state, confirm = true }: { label: string; pendingLabel: string; state: State; /** false keeps a plain button on phones, for steps that only move on. */ confirm?: boolean }) {
  const reduce = useReducedMotion()
  const slide = useSlide()
  if (slide && confirm) return <SlideToConfirm label={label} state={state} />
  const pending = state === 'pending'
  return (
    <motion.button
      type="submit"
      className="vs-submit"
      data-state={state}
      aria-disabled={state === 'locked' || undefined}
      disabled={pending}
      animate={reduce ? undefined : state === 'ready' ? { scale: [1, 1.04, 1] } : { scale: 1 }}
      transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
      whileTap={reduce || state !== 'ready' ? undefined : { scale: 0.96 }}
    >
      <span className="vs-submit-label">{pending ? pendingLabel : label}</span>
      <span className="vs-submit-icon" aria-hidden="true">
        {pending ? <span className="vs-submit-spinner" /> : <Arrow size={18} />}
      </span>
    </motion.button>
  )
}
