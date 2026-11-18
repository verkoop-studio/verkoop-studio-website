import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { randomBytes } from 'node:crypto'
import { inlineHomepageStyles } from '../scripts/inline-home-styles.mjs'

test('homepage styling keeps compiled rules, order and unrelated tags intact', async () => {
  const css = '.sample{background:url(/assets/bg.svg);content:"$&"}'
  const before = '<link href="https://fonts.googleapis.com/example" rel="stylesheet" media="print">'
  const template = `${before}<link crossorigin rel="stylesheet" href="/assets/one.css"><script src="/app.js"></script><link href="/assets/two.css" rel="stylesheet">`
  const seen = []
  const html = await inlineHomepageStyles(template, async href => { seen.push(href); return css })
  assert.deepEqual(seen, ['/assets/one.css', '/assets/two.css'])
  assert.equal(html, `${before}<style data-home-styles="/assets/one.css">${css}</style><script src="/app.js"></script><style data-home-styles="/assets/two.css">${css}</style>`)
})

test('homepage styling fails closed for missing or unsafe CSS and oversized payloads', async () => {
  const template = '<link rel="stylesheet" href="/assets/test.css">'
  await assert.rejects(inlineHomepageStyles('<head></head>', async () => ''), /Expected/)
  await assert.rejects(inlineHomepageStyles(template, async () => { throw new Error('missing asset') }), /missing asset/)
  for (const css of ['a{background:url(../photo.webp)}', '@import "other.css";', 'a{content:"</style>"}']) {
    await assert.rejects(inlineHomepageStyles(template, async () => css), /Relative CSS URL|Unsafe inline/)
  }
  await assert.rejects(inlineHomepageStyles(template, async () => `/*${randomBytes(70000).toString('hex')}*/`), /32 KiB/)
})

test('every page embeds the shared CSS and deprioritizes hydration download', async () => {
  const routes = JSON.parse(await readFile('dist/routes.json', 'utf8'))
  for (const route of [...routes, '/404']) {
    const html = await readFile(`dist${route === '/' ? '' : route}/index.html`, 'utf8')
    const styles = [...html.matchAll(/<style data-home-styles="([^"]+)">([\s\S]*?)<\/style>/g)]
    const appScript = html.match(/<script\b(?=[^>]*type="module")(?=[^>]*src="\/assets\/)[^>]*>/)?.[0]
    assert(appScript, route)
    assert(styles.length > 0, `${route}: styles are in the document, not a blocking request`)
    assert.match(appScript, /fetchpriority="low"/)
    assert(!html.includes('rel="modulepreload"'), route)
    for (const [tag, href, css] of styles) {
      assert.equal(css, await readFile(`dist${href}`, 'utf8'))
      assert(html.indexOf(tag) < html.indexOf('</head>'))
      assert(!html.includes(`href="${href}"`), `${route} still requests ${href} separately`)
    }
    // Below-the-fold CSS is the one stylesheet requested separately, and it never blocks the first paint.
    const head = html.split('</head>')[0]
    const deferred = [...head.matchAll(/<link\b[^>]*data-deferred-styles[^>]*>/g)].map(m => m[0])
    assert.equal(deferred.length, 1, `${route}: one deferred stylesheet`)
    const href = deferred[0].match(/href="(\/assets\/[^"]+\.css)"/)?.[1]
    assert(href, route)
    assert.match(deferred[0], /media="print"/, `${route}: deferred stylesheet does not block rendering`)
    assert.match(deferred[0], /onload="this\.onload=null;this\.media='all'"/, route)
    assert(head.includes(`<noscript><link rel="stylesheet" href="${href}"></noscript>`), `${route}: deferred stylesheet applies without JavaScript`)
    await readFile(`dist${href}`, 'utf8')
    if (route === '/') {
      const scripted = html.replace(/<noscript>[\s\S]*?<\/noscript>/g, '')
      const blocking = [...scripted.matchAll(/<link\b(?=[^>]*rel="stylesheet")(?=[^>]*href="\/assets\/)[^>]*>/g)].map(m => m[0])
        .filter(tag => !tag.includes('data-deferred-styles'))
      assert.equal(blocking.length, 0, 'homepage has no render-blocking stylesheet request')
    }
  }
})

test('home and academy heroes show the video without loading a player before interaction', async () => {
  for (const [file, heroClass] of [['dist/index.html', 'studio-hero'], ['dist/academy/index.html', 'ac-hero ac-wrap']]) {
    const html = await readFile(file, 'utf8')
    const hero = html.match(new RegExp(`<section class="${heroClass}"[\\s\\S]*?<\\/section>`))?.[0]
    assert(hero, file)
    assert.match(hero, /<button[^>]+aria-label="Speel video af:/)
    assert.match(hero, /https:\/\/i\.ytimg\.com\/vi\/tSjPY9J6ynk\/maxresdefault\.jpg/)
    assert.doesNotMatch(hero, /<iframe\b/)
    assert.match(hero, /<noscript><a href="https:\/\/www\.youtube\.com\/watch\?v=tSjPY9J6ynk"/)
  }
})

test('homepage retains all existing tracking scripts verbatim', async () => {
  const source = (await readFile('index.html', 'utf8')).replace(/<!--[\s\S]*?-->/g, '')
  const html = await readFile('dist/index.html', 'utf8')
  const scripts = [...source.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/g)].map(m => m[0]).filter(tag => !tag.includes('type="module"'))
  assert(scripts.length >= 2)
  for (const script of scripts) assert(html.includes(script), 'Tracking source must not be changed by prerendering')
})

test('Meta Pixel starts first, fonts are self-hosted, and the other trackers wait until load', async () => {
  const heroPoster = 'https://i.ytimg.com/vi/tSjPY9J6ynk/maxresdefault.jpg'
  const routes = JSON.parse(await readFile('dist/routes.json', 'utf8'))
  for (const route of [...routes, '/404']) {
    const html = await readFile(`dist${route === '/' ? '' : route}/index.html`, 'utf8')
    const head = html.split('</head>')[0]
    const pixel = head.indexOf('https://connect.facebook.net/en_US/fbevents.js')
    assert(pixel > -1, `${route}: pixel request in the head`)
    assert(!head.includes('https://fonts.googleapis.com/'), `${route}: no third-party font request`)
    assert(head.includes("fbq('init'"), route)
    assert(head.includes("fbq('track', 'PageView')"), route)
    assert(head.includes("t.fetchPriority='high'"), route)
    assert(!/<script\b[^>]*\bsrc="https:\/\/www\.googletagmanager\.com\/gtag\/js/.test(head), route)
    assert(!/<script\b[^>]*\bsrc="https:\/\/perfomance\.verkoop\.studio\/t\.js/.test(head), route)
    assert(!/<script\b[^>]*\bsrc="https:\/\/www\.clarity\.ms\//.test(head), route)
    assert(head.includes('https://www.googletagmanager.com/gtag/js?id=G-VRKJP8K3SD'), route)
    assert(head.includes('https://perfomance.verkoop.studio/t.js'), route)
    assert(head.includes('https://www.clarity.ms/tag/'), route)
    assert(head.includes("addEventListener('load', loadDeferredTrackers"), route)
    if (html.includes(heroPoster)) {
      const preload = head.search(/<link rel="preload" as="image" href="https:\/\/i\.ytimg\.com\/vi\/tSjPY9J6ynk\/maxresdefault\.jpg" fetchpriority="high"/i)
      assert(preload > pixel, `${route}: hero image preload follows the pixel`)
      assert.equal(head.match(/rel="preload" as="image"/gi)?.length, 1, route)
    }
  }
})
