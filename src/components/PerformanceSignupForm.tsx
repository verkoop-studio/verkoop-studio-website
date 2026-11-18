import { motion, useReducedMotion } from 'motion/react'
import { useRef, useState, type FormEvent } from 'react'
import SuccessCheck from './brand/SuccessCheck'
import Burst from './brand/forms/Burst'
import Field from './brand/forms/Field'
import FieldError from './brand/forms/FieldError'
import FormProgress from './brand/forms/FormProgress'
import SubmitButton from './brand/forms/SubmitButton'
import { formatPhone, validEmail, validName, validPhone } from './brand/forms/validate'
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
  const reduce = useReducedMotion()
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

  const required = {
    naam: validName(values.naam),
    bedrijf: values.bedrijf.trim().length > 0,
    email: validEmail(values.email),
    telefoon: validPhone(values.telefoon),
    spend: Boolean(values.spend),
    model: Boolean(values.model),
  }
  const done = Object.values(required).filter(Boolean).length
  const total = Object.keys(required).length
  const attempted = Object.keys(errors).length > 0

  if (status === 'done' || status === 'redirecting') {
    return (
      <motion.div
        ref={ref}
        className="hero-request vs-form-success vs-qform-done"
        initial={reduce ? false : { rotateX: -70, opacity: 0, y: 10 }}
        animate={{ rotateX: 0, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 160, damping: 18 }}
      >
        <Burst />
        <SuccessCheck />
        <h2>{t.doneTitle}</h2>
        <p role="status">{status === 'redirecting' ? t.redirecting : t.doneBody}</p>
      </motion.div>
    )
  }

  const busy = status === 'submitting'

  const choices = (key: 'spend' | 'model', legend: string, options: readonly string[], error?: string) => (
    <fieldset className="vs-goals" disabled={busy} aria-describedby={error ? `${id}-${key}-error` : undefined}>
      <legend>{legend}</legend>
      <div className="vs-goals-options vs-goals-options--tight">
        {options.map((option) => {
          const checked = values[key] === option
          return (
            <label key={option} className="vs-goal" data-checked={checked || undefined}>
              <input type="radio" name={`${id}-${key}`} value={option} checked={checked} onChange={() => update(key, option)} className="sr-only" aria-invalid={Boolean(error)} />
              {checked && <motion.span layoutId={`${id}-${key}-pill`} className="vs-goal-pill" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
              <strong>{option}</strong>
            </label>
          )
        })}
      </div>
      {error && <FieldError id={`${id}-${key}-error`}>{error}</FieldError>}
    </fieldset>
  )

  return (
    <div ref={ref} id={id} className="hero-request vs-qform">
      <form onSubmit={handleSubmit} noValidate aria-busy={busy} data-clarity-mask="true">
        <FormProgress done={done} total={total} lang={lang} />
        <div className="vs-qform-grid">
          <Field name="naam" label={t.naam} autoComplete="name" disabled={busy} value={values.naam} onValueChange={(v) => update('naam', v)}
            validate={validName} message={t.errors.naam} showError={attempted} />
          <Field name="bedrijf" label={t.bedrijf} autoComplete="organization" disabled={busy} value={values.bedrijf} onValueChange={(v) => update('bedrijf', v)}
            message={t.errors.bedrijf} showError={attempted} />
          <Field name="email" type="email" inputMode="email" label={t.email} autoComplete="email" disabled={busy} value={values.email} onValueChange={(v) => update('email', v)}
            validate={validEmail} message={lang === 'nl' ? 'Dit e-mailadres klopt niet helemaal.' : 'This email address doesn’t look quite right.'} showError={attempted} />
          <Field name="telefoon" type="tel" inputMode="tel" label={t.telefoon} autoComplete="tel" maxLength={60} prefix="BE" format={formatPhone} disabled={busy}
            value={values.telefoon} onValueChange={(v) => update('telefoon', v)} validate={validPhone}
            message={lang === 'nl' ? 'Vul een telefoonnummer in, bijvoorbeeld 0470 12 34 56.' : 'Enter a phone number, for example 0470 12 34 56.'} showError={attempted} />
        </div>
        {choices('spend', t.spend, SPEND[lang], errors.spend)}
        {choices('model', t.model, MODEL[lang], errors.model)}
        <Field name="website" inputMode="url" label={t.website} maxLength={300} required={false} disabled={busy}
          value={values.website} onValueChange={(v) => update('website', v)} />

        <label className="vs-check-box vs-check-row" data-checked={setup || undefined}>
          <input type="checkbox" checked={setup} disabled={busy} onChange={e => setSetup(e.target.checked)} />
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="1" y="1" width="18" height="18" rx="5" /><path d="M5.5 10.5 8.5 13.5 14.5 6.5" pathLength={1} /></svg>
          <span>{t.setup}</span>
        </label>

        {/* Honeypot: hidden from users, visible to bots. */}
        <div aria-hidden className="hero-request-trap">
          <label htmlFor={`${id}-company_website`}>Company website</label>
          <input id={`${id}-company_website`} type="text" tabIndex={-1} autoComplete="off"
            onChange={e => { honeypotRef.current = e.target.value }} />
        </div>

        {sendError && <p className="hero-request-error" role="alert">{t.sendError}</p>}
        <SubmitButton state={busy ? 'pending' : done === total ? 'ready' : 'locked'} label={t.submit} pendingLabel={t.submitting} />
        <p className="hero-request-note">{t.note} <Link to="/privacy">{t.privacy}</Link></p>
      </form>
    </div>
  )
}
