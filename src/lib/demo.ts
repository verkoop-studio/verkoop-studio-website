import { useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

/**
 * Steps through `durations` (ms per phase) and starts over, while `on` and not `paused`.
 * Reduced motion parks on the last phase.
 */
export function usePhase(on: boolean, paused: boolean, durations: number[]) {
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState(0)
  const last = durations.length - 1
  useEffect(() => {
    if (reduce || !on || paused) return
    const id = window.setTimeout(() => setPhase((p) => (p + 1) % durations.length), durations[phase])
    return () => window.clearTimeout(id)
  }, [reduce, on, paused, phase, durations])
  useEffect(() => { if (!on) setPhase(0) }, [on])
  return reduce ? last : phase
}

/** Hover handlers that pause a demo, so people can read it. */
export function useHoverPause() {
  const [paused, setPaused] = useState(false)
  return { paused, bind: { onPointerEnter: () => setPaused(true), onPointerLeave: () => setPaused(false) } }
}
