import test from 'node:test'
import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'

const routes = JSON.parse(await readFile('dist/routes.json', 'utf8'))
const families = ['Geist Variable', 'Funnel Display Variable', 'Caveat Variable', 'Bebas Neue']

test('every production page self-hosts its fonts without blocking initial rendering', async () => {
  for (const route of [...routes, '/404']) {
    const html = await readFile(`dist${route === '/' ? '' : route}/index.html`, 'utf8')
    const head = html.split('</head>')[0]
    assert(!head.includes('fonts.googleapis.com'), `${route}: no third-party font stylesheet`)
    assert(!head.includes('fonts.gstatic.com'), `${route}: no third-party font files`)

    const css = [...head.matchAll(/<style data-home-styles="[^"]+">([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n')
    const faces = [...css.matchAll(/@font-face\s*\{([^}]*)\}/g)].map(m => m[1])
    for (const family of families) {
      const face = faces.find(body => body.includes(`font-family:${family}`) || body.includes(`font-family:"${family}"`) || body.includes(`font-family: '${family}'`))
      assert(face, `${route}: @font-face for ${family}`)
      assert.match(face, /font-display:\s*swap/, `${route}: ${family} renders with the fallback first`)
    }

    const files = new Set([...css.matchAll(/url\((\/assets\/[^)]+\.woff2)\)/g)].map(m => m[1]))
    assert(files.size > 0, `${route}: font files are served from /assets/`)
    for (const file of files) await access(`dist${file}`)
  }
})
