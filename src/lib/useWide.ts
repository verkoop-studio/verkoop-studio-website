import { useEffect, useState } from 'react'

/** True on screens of 900px and wider, where pinned scroll sections run; phones get plain lists. */
export function useWide() {
  const [wide, setWide] = useState(true)
  useEffect(() => {
    const query = window.matchMedia('(min-width: 900px)')
    const update = () => setWide(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return wide
}
