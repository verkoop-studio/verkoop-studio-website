import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './fonts.css'
import './index.css'
import './motion.css'
import './pinacello.css'
import './mobile.css'
import './brand.css'
import App from './App.tsx'
import { LanguageProvider } from './i18n/LanguageContext.tsx'
import { loadDeferredStyles } from './lib/deferredStyles'

loadDeferredStyles()

// Pages are prerendered at their path without a trailing slash. A static host that serves
// /contact/ would hand the router a different path than the HTML was built for.
const { pathname, search, hash } = window.location
if (pathname.length > 1 && pathname.endsWith('/')) window.history.replaceState(window.history.state, '', pathname.replace(/\/+$/, '') + search + hash)

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>
)

if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
