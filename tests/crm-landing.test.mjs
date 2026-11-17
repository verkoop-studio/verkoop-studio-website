import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'

function load(path) {
  const source = readFileSync(new URL(path, import.meta.url), 'utf8')
  return ts.transpileModule(source.replace('import.meta.env.DEV', 'false'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
}

const analytics = load('../src/lib/analytics.ts')
const landing = load('../src/data/crmLanding.ts')

function fixture({ noPixel = false } = {}) {
  const meta = [], google = [], storage = new Map()
  const window = { gtag: (...args) => google.push(args), current: (...args) => google.push(args) }
  if (!noPixel) window.fbq = (...args) => meta.push(args)
  const context = vm.createContext({ exports: {}, window, sessionStorage: {
    getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value),
  } })
  vm.runInContext(analytics, context)
  return { meta, google, window, click: context.exports.trackCrmSignupClick }
}

test('the CRM sign-up click is one Meta Lead per session, labelled as a click', () => {
  const f = fixture()
  f.click('crm_hero')
  f.click('crm_final')
  assert.equal(f.meta.length, 1)
  const [command, pixel, event, params, options] = JSON.parse(JSON.stringify(f.meta[0]))
  assert.equal(command, 'trackSingle')
  assert.equal(pixel, '29297541076513579')
  assert.equal(event, 'Lead')
  assert.deepEqual(params, { content_name: 'Sales CRM sign-up click', form_id: 'crm-landing' })
  assert.match(options.eventID, /^crm_signup_/)
})

test('a click is not counted as a confirmed enquiry in GA4 or Current', () => {
  const f = fixture()
  f.click('crm_hero')
  assert.equal(f.google.length, 0)
  assert.deepEqual(JSON.parse(JSON.stringify(f.window.dataLayer.map(item => item.event))), ['crm_signup_clicked'])
})

test('a blocked pixel does not break the click', () => {
  assert.doesNotThrow(() => fixture({ noPixel: true }).click('crm_hero'))
})

test('sign-up link forwards only the ad parameters', () => {
  const context = vm.createContext({ exports: {}, URL, URLSearchParams })
  vm.runInContext(landing, context)
  const { signupHref, crmLanding } = context.exports
  assert.equal(signupHref(''), crmLanding.signupUrl)
  const href = new URL(signupHref('?utm_source=meta&utm_campaign=crm-retarget&fbclid=abc&email=private@example.com'))
  assert.equal(href.origin + href.pathname, 'https://crm.verkoop.studio/onboarding/account')
  assert.equal(href.searchParams.get('utm_source'), 'meta')
  assert.equal(href.searchParams.get('utm_campaign'), 'crm-retarget')
  assert.equal(href.searchParams.get('fbclid'), 'abc')
  assert.equal(href.searchParams.get('email'), null)
})

test('the published tiers match the decided CRM prices', () => {
  const context = vm.createContext({ exports: {}, URL, URLSearchParams })
  vm.runInContext(landing, context)
  const tiers = context.exports.crmLanding.pricing.tiers.nl.map(tier => tier.price)
  assert.deepEqual(JSON.parse(JSON.stringify(tiers)), ['Gratis', '€14,99', '€39,99'])
})
