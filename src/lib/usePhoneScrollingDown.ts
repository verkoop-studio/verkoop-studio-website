import { useEffect, useState } from 'react'

/**
 * True on phones while the visitor scrolls down; false again as soon as they scroll up.
 * Pinned pills use it to step out of the way of the text being read.
 */
export function usePhoneScrollingDown() {
  const [down, setDown] = useState(false)
  useEffect(() => {
    const phone = window.matchMedia('(max-width: 767px)')
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      if (!phone.matches) { setDown(false); last = y; return }
      if (Math.abs(y - last) < 8) return
      setDown(y > last)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return down
}
