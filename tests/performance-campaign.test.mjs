import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import {
  GIVEAWAY_CAMPAIGN,
  GIVEAWAY_FORM_ID,
  PERFORMANCE_CAMPAIGN,
  PERFORMANCE_FORM_ID,
  WEBSITE_CAMPAIGN,
  campaignForForm,
  crmPayload,
} from '../server-crm.js'
import { sendConfirmation } from '../server-confirmation.js'
import { captureLead } from '../server-lead.js'

const signup = {
  naam: 'Alex Example',
  bedrijf: 'Example Co',
  email: 'alex@example.com',
  telefoon: '+32 470 00 00 00',
  doel: 'Verkoop Studio Performance: aanmelding',
  uitdaging: 'Hoe verkoop je?: Webshop op Shopify',
  investering: '€5.000 – €15.000',
  kanalen: 'Webshop op Shopify',
  extra: 'Zet het zelf op.',
  form_id: PERFORMANCE_FORM_ID,
  lang: 'nl',
}

test('a Performance sign-up reaches the CRM under its own campaign', () => {
  const payload = crmPayload(signup)
  assert.equal(payload.campaign, PERFORMANCE_CAMPAIGN)
  assert.match(payload.notes, /Maandelijkse investering: €5\.000 – €15\.000/)
  assert.match(payload.notes, /Formulier: performance-aanmelding/)
  // The other campaigns are untouched.
  assert.equal(campaignForForm(GIVEAWAY_FORM_ID), GIVEAWAY_CAMPAIGN)
  assert.equal(campaignForForm('audit-formulier'), WEBSITE_CAMPAIGN)
})

test('the campaign is decided by the form id, never by a name the visitor sends', () => {
  assert.equal(campaignForForm(` ${PERFORMANCE_FORM_ID} `), PERFORMANCE_CAMPAIGN)
  assert.equal(campaignForForm(`${PERFORMANCE_FORM_ID}-nep`), WEBSITE_CAMPAIGN)
  assert.equal(crmPayload({ ...signup, form_id: 'contact', campaign: PERFORMANCE_CAMPAIGN }).campaign, WEBSITE_CAMPAIGN)
})

test('the landing page posts the form id the server tags on', () => {
  const data = readFileSync(new URL('../src/data/performance.ts', import.meta.url), 'utf8')
  assert.match(data, new RegExp(`formId: '${PERFORMANCE_FORM_ID}'`))
  assert.match(data, new RegExp(`campaign: '${PERFORMANCE_CAMPAIGN}'`))
  const form = readFileSync(new URL('../src/components/PerformanceSignupForm.tsx', import.meta.url), 'utf8')
  assert.match(form, /trackPerformanceConversion\(receipt, submissionRef\.current, id\)/)
})

test('the page prices match the package decision and the product', () => {
  const data = readFileSync(new URL('../src/data/performance.ts', import.meta.url), 'utf8')
  for (const [name, price] of [['Start', '€49'], ['Grow', '€99'], ['Scale', '€199'], ['Pro', '€399']]) {
    assert.match(data, new RegExp(`name: '${name}'.*price: \\{ nl: '${price}'`))
  }
})

test('the studio notification names the product, not a growth analysis', async () => {
  const sent = []
  const resend = {
    contacts: {
      get: async () => ({ data: { id: 'contact-1', properties: {} } }),
      segments: { add: async () => ({ data: { id: 'segment-1' } }) },
    },
    emails: { send: async payload => { sent.push(payload); return { data: { id: 'email-1' } } } },
    events: { send: async () => ({ data: { object: 'event', event: 'website.enquiry_received' } }) },
  }
  const result = await captureLead({ resend, body: signup, from: 'studio@example.com', to: 'studio@example.com' })
  assert.equal(result.ok, true)
  assert.match(sent[0].subject, /Nieuwe aanmelding Verkoop Studio Performance van Example Co/)
})

test('the sign-up confirmation talks about the workspace, in both languages', async () => {
  for (const [lang, expected] of [['nl', /workspace/], ['en', /workspace/]]) {
    const sent = []
    const resend = { emails: { send: async payload => { sent.push(payload); return { data: { id: 'email-1' } } } } }
    await sendConfirmation(resend, { ...signup, lang }, {
      from: 'studio@example.com', replyTo: 'studio@example.com', idempotencyKey: 'performance/test',
    })
    assert.equal(sent.length, 1)
    assert.match(sent[0].subject, /Verkoop Studio Performance/)
    assert.match(sent[0].text, expected)
    assert.doesNotMatch(sent[0].text, /24 ?(uur|hours)|groeianalyse|growth analysis/)
    assert.equal(sent[0].template, undefined)
  }
})

const analytics = ts.transpileModule(
  readFileSync(new URL('../src/lib/analytics.ts', import.meta.url), 'utf8').replace('import.meta.env.DEV', 'false'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS } },
).outputText
function tags() {
  const calls = { ga: [], meta: [] }, storage = new Map()
  const window = { gtag: (...args) => calls.ga.push(args), fbq: (...args) => calls.meta.push(args) }
  const context = { exports: {}, window, sessionStorage: { getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value) } }
  vm.runInNewContext(analytics, context)
  return { calls, ...context.exports }
}

test('a stored sign-up fires one Meta Lead with its own label and no contact data', () => {
  const t = tags()
  const receipt = { ok: true, captured: ['resend_contact'], email: 'private@example.com' }
  t.trackPerformanceConversion(receipt, 'sub-1', PERFORMANCE_FORM_ID)
  t.trackPerformanceConversion(receipt, 'sub-1', PERFORMANCE_FORM_ID)
  assert.deepEqual(JSON.parse(JSON.stringify(t.calls.meta)), [
    ['trackSingle', '29297541076513579', 'Lead',
      { content_name: 'Verkoop Studio Performance aanmelding', form_id: PERFORMANCE_FORM_ID },
      { eventID: 'website_lead_performance_sub-1' }],
  ])
  assert.equal(t.calls.ga[0][2].method, 'performance_signup')
})

test('a honeypot or failed receipt fires nothing', () => {
  const t = tags()
  for (const r of [{ ok: true }, { ok: false, captured: ['resend_contact'] }, { ok: true, captured: [] }]) {
    t.trackPerformanceConversion(r, 'x', PERFORMANCE_FORM_ID)
  }
  assert.equal(t.calls.meta.length + t.calls.ga.length, 0)
})

test('the page sends ViewContent for audiences built on in-site visits', () => {
  const t = tags()
  t.trackLandingView('Verkoop Studio Performance')
  assert.deepEqual(JSON.parse(JSON.stringify(t.calls.meta)), [
    ['trackSingle', '29297541076513579', 'ViewContent', { content_name: 'Verkoop Studio Performance' }],
  ])
})
