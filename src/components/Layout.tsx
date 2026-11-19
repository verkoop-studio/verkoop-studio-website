import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import SiteHeader from './brand/SiteHeader'
import ContactDock from './brand/ContactDock'
import Footer from './Footer'
import BackToTop from './BackToTop'
import { usePageMotion } from '../lib/usePageMotion'
import { usePrimaryButtonMotion } from '../lib/usePrimaryButtonMotion'
import { captureAttribution } from '../lib/analytics'

export default function Layout() {
  const location = useLocation()
  const motionRef = usePageMotion(location.pathname)
  usePrimaryButtonMotion()

  useEffect(() => {
    captureAttribution()
  }, [])

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1))
      if (el) {
        const instant = window.matchMedia('(max-width: 1023px), (prefers-reduced-motion: reduce)').matches
        el.scrollIntoView({ behavior: instant ? 'instant' : 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0 })
  }, [location.pathname, location.hash, location.key])

  return (
    <div ref={motionRef} className="site-shell min-h-screen">
      <SiteHeader />
      <main>
        <Outlet />
      </main>
      <Footer />
      {location.pathname !== '/' && <BackToTop />}
      <ContactDock />
    </div>
  )
}
