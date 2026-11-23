import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('homepage connects the visible brand, search title and a single website identity', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  const title = html.match(/<title>(.*?)<\/title>/)[1]
  assert.match(title, /^Verkoop Studio \| .+/)
  // the brand is visible on the page itself, not only in the metadata: the header logo and the page text name it
  const body = html.split('<body')[1].replace(/<script\b[\s\S]*?<\/script>/g, '')
  assert.match(body, /class="vs-logo-word">verkoop</)
  assert.match(body, />[^<]*Verkoop Studio[^<]*</)
  assert.match(body, /<h1\b/)
  assert.match(html, /property="og:site_name" content="Verkoop Studio"/)
  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph']
  const websites = graph.filter(node => node['@type'] === 'WebSite')
  assert.equal(websites.length, 1, 'Keep one canonical website identity')
  const website = websites[0]
  const organization = graph.find(node => node['@id'] === website.publisher['@id'])
  for (const node of [website, organization]) {
    assert.equal(node.name, 'Verkoop Studio')
    assert.equal(node.alternateName, 'verkoop.studio')
    assert.equal(node.url, html.match(/rel="canonical" href="([^"]+)"/)[1])
  }
  assert.equal(graph.find(node => node['@type'] === 'WebPage').name, title)
})

test('service titles retain their topic before the consistent brand name', async () => {
  for (const route of ['google-ads', 'websites']) {
    const html = await readFile(`dist/${route}/index.html`, 'utf8')
    assert.match(html, /<title>[^<|]+ \| Verkoop Studio<\/title>/)
    assert.match(html, /name="robots" content="index, follow/)
  }
})
