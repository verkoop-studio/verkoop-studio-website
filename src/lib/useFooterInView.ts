import { useEffect, useState } from 'react'

/** True while the site footer is on screen. Floating actions step aside so they never cover its links. */
export function useFooterInView() {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const footer = document.querySelector('.vs-footer')
    if (!footer || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting))
    io.observe(footer)
    return () => io.disconnect()
  }, [])
  return inView
}
