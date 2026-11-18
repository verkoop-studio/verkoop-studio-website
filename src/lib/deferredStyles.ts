import belowFold from '../below.css?url'

/**
 * URL of the below-the-fold stylesheet. Prerendered pages link it without blocking
 * the first paint; the inlined critical CSS (brand.css and friends) covers the first screen.
 */
export const DEFERRED_STYLES = belowFold

/** Adds the stylesheet when the page was not prerendered with it (dev server, client-only render). */
export function loadDeferredStyles() {
  if (typeof document === 'undefined' || document.querySelector('link[data-deferred-styles]')) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = DEFERRED_STYLES
  link.dataset.deferredStyles = ''
  document.head.append(link)
}
