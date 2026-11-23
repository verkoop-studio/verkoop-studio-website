import { useEffect } from 'react'
import belowFold from '../below.css?url'
import productStyles from '../pages/product.css?url'
import pagesStyles from '../pages/pages.css?url'
import { crmLanding } from '../data/crmLanding'
import { performance } from '../data/performance'
import { services } from '../data/services'
import { cases } from '../data/cases'
import { articles } from '../data/articles'

/**
 * URL of the below-the-fold stylesheet. Prerendered pages link it without blocking
 * the first paint; the inlined critical CSS (brand.css and friends) covers the first screen.
 */
export const DEFERRED_STYLES = belowFold

/** The product landing pages' own styles. Needed at first paint, so linked normally, on those routes only. */
export const PRODUCT_STYLES = productStyles

/** The rebuilt inner pages (cases, services, agency, legal…): one shared stylesheet, linked on those routes. */
export const PAGES_STYLES = pagesStyles

/** Route → stylesheet the prerendered page links in its head. Keeps page styles out of the inlined budget. */
export const PAGE_STYLES: Record<string, string> = {
  [crmLanding.path]: PRODUCT_STYLES,
  [performance.path]: PRODUCT_STYLES,
  '/cases': PAGES_STYLES,
  '/agency': PAGES_STYLES,
  '/contact': PAGES_STYLES,
  '/prijzen': PAGES_STYLES,
  '/blog': PAGES_STYLES,
  '/funnel-audit': PAGES_STYLES,
  '/gratis-website': PAGES_STYLES,
  '/privacy': PAGES_STYLES,
  '/voorwaarden': PAGES_STYLES,
  ...Object.fromEntries(articles.map((item) => [`/blog/${item.slug}`, PAGES_STYLES])),
  ...Object.fromEntries(cases.map((item) => [`/cases/${item.slug}`, PAGES_STYLES])),
  ...Object.fromEntries(services.map((service) => [`/${service.slug}`, PAGES_STYLES])),
}

function ensureLink(href: string, marker: 'deferredStyles' | 'pageStyles') {
  if (typeof document === 'undefined' || document.querySelector(`link[rel="stylesheet"][href="${href}"]`)) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = href
  link.dataset[marker] = ''
  document.head.append(link)
}

/** Adds the below-the-fold stylesheet when the page was not prerendered with it (dev server, client-only render). */
export function loadDeferredStyles() {
  ensureLink(DEFERRED_STYLES, 'deferredStyles')
}

/** Loads a page's own stylesheet when the visitor arrives through client-side navigation. */
export function usePageStyles(href: string) {
  useEffect(() => { ensureLink(href, 'pageStyles') }, [href])
}
