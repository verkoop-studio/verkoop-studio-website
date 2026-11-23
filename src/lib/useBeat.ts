import { useEffect, useState } from 'react'

/** A small, steady beat while `on`, for the screens that play out on a loop. Stands still with reduced motion. */
export function useBeat(on: boolean, ms: number) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!on || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setN((x) => x + 1), ms)
    return () => window.clearInterval(id)
  }, [on, ms])
  return n
}
