import { useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { captureAttribution, getGa4Context, trackEvent, trackPerformanceConversion } from '../lib/analytics'
import { useInView } from '../lib/useInView'
import { useLang } from '../i18n/LanguageContext'
import { performance } from '../data/performance'

const SPEND = {
  nl: ['Nog geen advertenties', 'Tot €5.000', '€5.000 – €15.000', '€15.000 – €50.000', '€50.000 – €150.000', 'Meer dan €150.000'],
  en: ['No ads yet', 'Up to €5,000', '€5,000 – €15,000', '€15,000 – €50,000', '€50,000 – €150,000', 'More than €150,000'],
} as const

const MODEL = {
  nl: ['Webshop op Shopify', 'Webshop op Wix', 'Eigen webshop', 'B2B of diensten: ik verkoop via leads', 'Bureau: ik beheer advertenties voor klanten'],
  en: ['Shop on Shopify', 'Shop on Wix', 'My own shop', 'B2B or services: I sell through leads', 'Agency: I run ads for clients'],
} as const

const COPY = {
  nl: {
    naam: 'Naam',
    bedrijf: 'Bedrijf',
    email: 'Zakelijk e-mailadres',
    telefoon: 'Telefoonnummer',
    website: 'Website',
    spend: 'Advertentiebudget per maand',
    model: 'Hoe verkoop je?',
    choose: 'Kies…',
    setup: 'Maak de koppelingen voor mij. De studio zet het op als eenmalige opstart; we bespreken dat eerst met je.',
    note: 'We gebruiken je gegevens om je workspace klaar te zetten en je op te volgen over Performance.',
    privacy: 'Privacybeleid',
    submit: 'Start met Performance',
    submitting: 'Even geduld…',
    doneTitle: 'Je aanmelding is binnen.',
    doneBody: 'We zetten je workspace klaar en sturen je de link om in te loggen. Je krijgt ook een bevestiging per mail.',
    redirecting: 'Je aanmelding is binnen. We sturen je door om je account aan te maken…',
    errors: {
      naam: 'Vul je naam in.',
      bedrijf: 'Vul de naam van je bedrijf in.',
      email: 'Vul een geldig zakelijk e-mailadres in.',
      telefoon: 'Vul je telefoonnummer in.',
      spend: 'Kies je advertentiebudget.',
      model: 'Kies hoe je verkoopt.',
    },
    sendError: 'Versturen lukt even niet. Probeer opnieuw of mail stef@verkoop.studio.',
  },
  en: {
    naam: 'Name',
    bedrijf: 'Company',
    email: 'Business email',
    telefoon: 'Phone number',
    website: 'Website',
    spend: 'Ad spend per month',
    model: 'How do you sell?',
    choose: 'Choose…',
    setup: 'Make the connections for me. The studio sets it up as a one-off setup; we discuss that with you first.',
    note: 'We use your details to get your workspace ready and to follow up with you about Performance.',
    privacy: 'Privacy policy',
    submit: 'Start with Performance',
    submitting: 'One moment…',
    doneTitle: 'Your sign-up is in.',
    doneBody: 'We are getting your workspace ready and will send you the link to sign in. You will also get a confirmation by email.',
    redirecting: 'Your sign-up is in. Taking you to create your account…',
    errors: {
      naam: 'Please enter your name.',
      bedrijf: 'Please enter your company name.',
      email: 'Please enter a valid business email address.',
      telefoon: 'Please enter your phone number.',
      spend: 'Please choose your ad spend.',
      model: 'Please choose how you sell.',
    },
    sendError: 'We couldn’t send your sign-up. Try again or email stef@verkoop.studio.',
  },
}

interface FormState {
  naam: string
  bedrijf: string
  email: string
  telefoon: string
  website: string
  spend: string
  model: string
}

const initialState: FormState = { naam: '', bedrijf: '', email: '', telefoon: '', website: '', spend: '', model: '' }

/** Where the sign-up continues, with the email so the visitor does not type it twice. */
function signupDestination(base: string, email: string, lang: string): string | null {
  if (!base) return null
  try {
    const url = new URL(base)
    if (url.protocol !== 'https:') return null
    url.searchParams.set('email', email)
    url.searchParams.set('lang', lang)
    return url.toString()
  } catch {
    return null
  }
}

export default function PerformanceSignupForm({ id = performance.formId }: { id?: string }) {
  const { lang } = useLang()
  const t = COPY[lang]
  const [values, setValues] = useState<FormState>(initialState)
  const [setup, setSetup] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'redirecting'>('idle')
  const [sendError, setSendError] = useState(false)
  const submissionRef = useRef('')
  const honeypotRef = useRef('')
  const startedRef = useRef(false)

  const { ref } = useInView<HTMLDivElement>(() => trackEvent('form_viewed', { form_id: id }))

  function update<K extends keyof FormState>(key: K, value: string) {
    if (!startedRef.current) {
      startedRef.current = true
      trackEvent('form_started', { form_id: id })
    }
    setValues(prev => ({ ...prev, [key]: value }))
  }

  function validate() {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!values.naam.trim()) next.naam = t.errors.naam
    if (!values.bedrijf.trim()) next.bedrijf = t.errors.bedrijf
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = t.errors.email
    if (!values.telefoon.trim()) next.telefoon = t.errors.telefoon
    if (!values.spend) next.spend = t.errors.spend
    if (!values.model) next.model = t.errors.model
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (status !== 'idle' || !validate()) return
    submissionRef.current ||= crypto.randomUUID()
    setStatus('submitting')
    setSendError(false)
    const attribution = captureAttribution()

    try {
      const ga4 = await getGa4Context()
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(25_000),
        body: JSON.stringify({
          naam: values.naam,
          bedrijf: values.bedrijf,
          email: values.email,
          telefoon: values.telefoon,
          website: values.website,
          // The server reads form_id to tag the CRM campaign. These lines are
          // what the studio reads in the lead notification and the CRM note.
          doel: lang === 'nl' ? 'Verkoop Studio Performance: aanmelding' : 'Verkoop Studio Performance: sign-up',
          uitdaging: `${t.model}: ${values.model}`,
          investering: values.spend,
          kanalen: values.model,
          extra: setup
            ? (lang === 'nl' ? 'Wil dat de studio de koppelingen maakt (opstart).' : 'Wants the studio to make the connections (setup).')
            : (lang === 'nl' ? 'Zet het zelf op.' : 'Sets it up themselves.'),
          form_id: id,
          submission_id: submissionRef.current,
          lang,
          company_website: honeypotRef.current, // Honeypot. Bots fill this.
          attribution,
          ga4,
        }),
      })
      const receipt = await response.json()
      if (!response.ok || receipt.ok !== true) throw new Error('capture_failed')
      trackEvent('form_submitted', { form_id: id, ...attribution })
      // Meta Lead, GA4 generate_lead and the Performance pixel, after the server stored the lead.
      trackPerformanceConversion(receipt, submissionRef.current, id)
      const next = signupDestination(performance.signupUrl, values.email.trim().toLowerCase(), lang)
      if (next) {
        setStatus('redirecting')
        // A short pause so the Lead beacons leave before the page does.
        window.setTimeout(() => window.location.assign(next), 600)
      } else {
        setStatus('done')
      }
    } catch {
      setSendError(true)
      setStatus('idle')
    }
  }

  if (status === 'done' || status === 'redirecting') {
    return (
      <div ref={ref} className="rounded-2xl border border-line bg-surface p-8 text-center reveal sm:p-12">
        <p className="font-display text-2xl text-paper text-balance">{t.doneTitle}</p>
        <p className="mx-auto mt-3 max-w-md text-bone" role="status">{status === 'redirecting' ? t.redirecting : t.doneBody}</p>
      </div>
    )
  }

  const busy = status === 'submitting'

  return (
    <div ref={ref} id={id} className="rounded-2xl border border-line bg-surface p-6 reveal sm:p-10">
      <form onSubmit={handleSubmit} noValidate aria-busy={busy} data-clarity-mask="true" className="grid gap-5 sm:grid-cols-2">
        <Field label={t.naam} htmlFor={`${id}-naam`} error={errors.naam}>
          <input id={`${id}-naam`} className="input" autoComplete="name" maxLength={200} disabled={busy}
            value={values.naam} onChange={e => update('naam', e.target.value)} aria-invalid={Boolean(errors.naam)} />
        </Field>
        <Field label={t.bedrijf} htmlFor={`${id}-bedrijf`} error={errors.bedrijf}>
          <input id={`${id}-bedrijf`} className="input" autoComplete="organization" maxLength={200} disabled={busy}
            value={values.bedrijf} onChange={e => update('bedrijf', e.target.value)} aria-invalid={Boolean(errors.bedrijf)} />
        </Field>
        <Field label={t.email} htmlFor={`${id}-email`} error={errors.email}>
          <input id={`${id}-email`} className="input" type="email" autoComplete="email" autoCapitalize="none" spellCheck={false}
            maxLength={200} disabled={busy} placeholder={lang === 'nl' ? 'jij@bedrijf.be' : 'you@company.com'}
            value={values.email} onChange={e => update('email', e.target.value)} aria-invalid={Boolean(errors.email)} />
        </Field>
        <Field label={t.telefoon} htmlFor={`${id}-telefoon`} error={errors.telefoon}>
          <input id={`${id}-telefoon`} className="input" type="tel" autoComplete="tel" maxLength={60} disabled={busy}
            placeholder="+32 …" value={values.telefoon} onChange={e => update('telefoon', e.target.value)} aria-invalid={Boolean(errors.telefoon)} />
        </Field>
        <Field label={t.spend} htmlFor={`${id}-spend`} error={errors.spend}>
          <select id={`${id}-spend`} className="input" disabled={busy} value={values.spend}
            onChange={e => update('spend', e.target.value)} aria-invalid={Boolean(errors.spend)}>
            <option value="" disabled>{t.choose}</option>
            {SPEND[lang].map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </Field>
        <Field label={t.model} htmlFor={`${id}-model`} error={errors.model}>
          <select id={`${id}-model`} className="input" disabled={busy} value={values.model}
            onChange={e => update('model', e.target.value)} aria-invalid={Boolean(errors.model)}>
            <option value="" disabled>{t.choose}</option>
            {MODEL[lang].map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </Field>
        <Field label={t.website} htmlFor={`${id}-website`} full>
          <input id={`${id}-website`} className="input" inputMode="url" autoCapitalize="none" spellCheck={false}
            maxLength={300} disabled={busy} placeholder="https://"
            value={values.website} onChange={e => update('website', e.target.value)} />
        </Field>

        <div className="sm:col-span-2">
          <label className="flex items-start gap-3 text-sm text-bone">
            <input type="checkbox" className="mt-1 size-4 shrink-0 accent-accent" checked={setup} disabled={busy}
              onChange={e => setSetup(e.target.checked)} />
            <span>{t.setup}</span>
          </label>
        </div>

        {/* Honeypot: hidden from users, visible to bots. */}
        <div aria-hidden className="hidden">
          <label htmlFor={`${id}-company_website`}>Company website</label>
          <input id={`${id}-company_website`} type="text" tabIndex={-1} autoComplete="off"
            onChange={e => { honeypotRef.current = e.target.value }} />
        </div>

        <div className="sm:col-span-2 pt-2">
          <button type="submit" className="button-dark" disabled={busy}>
            {busy ? t.submitting : <>{t.submit} <span aria-hidden="true">↗</span></>}
          </button>
          {sendError && <p className="mt-3 text-sm text-rose-400" role="alert">{t.sendError}</p>}
          <p className="mt-4 text-xs text-mute">
            {t.note} <Link to="/privacy">{t.privacy}</Link>
          </p>
        </div>
      </form>
    </div>
  )
}

function Field({ label, htmlFor, error, full, children }: {
  label: string
  htmlFor: string
  error?: string
  full?: boolean
  children: React.ReactNode
}) {
  return (
    <div className={full ? 'sm:col-span-2' : undefined}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm text-bone">{label}</label>
      {children}
      {error && <p className="mt-1 text-sm text-accent-2" role="alert">{error}</p>}
    </div>
  )
}
