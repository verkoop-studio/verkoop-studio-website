import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { render, routes, SITE_URL, DEFERRED_STYLES, PAGE_STYLES } from '../dist-ssr/entry-server.js'
import { inlineHomepageStyles } from './inline-home-styles.mjs'
const builtTemplate = await readFile('dist/index.html', 'utf8')
const template = (await inlineHomepageStyles(builtTemplate, href => readFile(`dist${href}`, 'utf8')))
  .replace(/<link\b(?=[^>]*\brel="modulepreload")(?=[^>]*\bhref="\/assets\/[^"]+\.js")[^>]*>\n?/g, '')
  .replace(/<script\b(?=[^>]*\btype="module")(?=[^>]*\bsrc="\/assets\/[^"/]+\.js")[^>]*>/g,
    tag => tag.includes('fetchpriority=') ? tag : tag.replace('<script', '<script fetchpriority="low"'))
// Below-the-fold CSS is its own file: linked without blocking paint, so it never counts
// against the inlined budget. Fail the build if the file is missing.
if (!/^\/assets\/[^"/]+\.css$/.test(DEFERRED_STYLES)) throw new Error(`Unexpected deferred stylesheet URL: ${DEFERRED_STYLES}`)
await readFile(`dist${DEFERRED_STYLES}`, 'utf8')
const deferredStyles = `<link rel="stylesheet" href="${DEFERRED_STYLES}" media="print" onload="this.onload=null;this.media='all'" data-deferred-styles>
<noscript><link rel="stylesheet" href="${DEFERRED_STYLES}"></noscript>`
for (const href of new Set(Object.values(PAGE_STYLES))) {
  if (!/^\/assets\/[^"/]+\.css$/.test(href)) throw new Error(`Unexpected page stylesheet URL: ${href}`)
  await readFile(`dist${href}`, 'utf8')
}
const origin = new URL(SITE_URL)
if (!['http:', 'https:'].includes(origin.protocol) || origin.pathname !== '/') throw new Error('VITE_SITE_URL must be an HTTP(S) origin')
for (const route of [...routes, '/404']) {
  let markup = render(route)
  const head = []
  markup = markup.replace(/<title>[\s\S]*?<\/title>|<meta\s[^>]*\/>|<link\s[^>]*\/>/g, tag => { head.push(tag); return '' })
  const html = template.replace('<!--seo-head-->', head.join('\n')).replace('</head>', () => `${PAGE_STYLES[route] ? `<link rel="stylesheet" href="${PAGE_STYLES[route]}" data-page-styles>\n` : ''}${deferredStyles}\n</head>`).replace('<div id="root"></div>', `<div id="root">${markup}</div>`)
  const directory = route === '/' ? 'dist' : `dist${route}`
  await mkdir(directory, { recursive: true })
  await writeFile(`${directory}/index.html`, html)
}
const xml = s => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;')
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(route => `<url><loc>${xml(SITE_URL + route)}</loc></url>`).join('\n')}</urlset>`)
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nDisallow: /api/\n\nUser-agent: OAI-SearchBot\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n# ${SITE_URL}/llms.txt\n`)
await writeFile('dist/routes.json', JSON.stringify(routes))
console.log(`Pre-rendered ${routes.length} indexable pages and a 404 page for ${SITE_URL}`)
