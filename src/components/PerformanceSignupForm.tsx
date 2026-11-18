import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import SuccessCheck from './brand/SuccessCheck'
import Burst from './brand/forms/Burst'
import Field from './brand/forms/Field'
import FieldError from './brand/forms/FieldError'
import FormTrail from './brand/forms/FormTrail'
import PreviewCard from './brand/forms/PreviewCard'
import StepRail from './brand/forms/StepRail'
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
    steps: ['Je gegevens', 'Je winkel'],
    stepOf: (n: number, total: number) => `Stap ${n} van ${total}`,
    rail: 'Stappen van het formulier',
    next: 'Volgende',
    back: 'Terug',
    card: { band: 'Jouw Performance-workspace', title: (name: string) => `Workspace voor ${name}`, placeholder: 'Jouw workspace', budget: 'Budget', model: 'Verkoop', setupRow: 'Opstart', setupYes: 'De studio koppelt alles', setupNo: 'Zelf koppelen', ring: 'Ingevulde velden', back: 'Wat er nu gebeurt', toFront: 'Terug naar je workspace',
      next: ['We zetten je workspace klaar', 'Je krijgt de link om in te loggen', 'Je krijgt een bevestiging per mail'] },
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
    steps: ['Your details', 'Your shop'],
    stepOf: (n: number, total: number) => `Step ${n} of ${total}`,
    rail: 'Form steps',
    next: 'Next',
    back: 'Back',
    card: { band: 'Your Performance workspace', title: (name: string) => `Workspace for ${name}`, placeholder: 'Your workspace', budget: 'Budget', model: 'Selling', setupRow: 'Setup', setupYes: 'The studio connects it all', setupNo: 'Connect it myself', ring: 'Fields filled in', back: 'What happens next', toFront: 'Back to your workspace',
      next: ['We set up your workspace', 'You get the link to log in', 'You get a confirmation by email'] },
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

/** Required fields per step. */
const STEP_FIELDS: (keyof FormState)[][] = [['naam', 'bedrijf', 'email', 'telefoon'], ['spend', 'model']]

export default function PerformanceSignupForm({ id = performance.formId, preview = false }: { id?: string; preview?: boolean }) {
  const { lang } = useLang()
  const t = COPY[lang]
  const reduce = useReducedMotion()
  const [values, setValues] = useState<FormState>(initialState)
  const [setup, setSetup] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'redirecting'>('idle')
  const [sendError, setSendError] = useState(false)
  const [step, setStep] = useState(0)
  const [tried, setTried] = useState<boolean[]>([])
  const formRef = useRef<HTMLFormElement>(null)
  const arrived = useRef(false)
  // After a step change, focus moves to the first control of the new step.
  useEffect(() => {
    if (!arrived.current) { arrived.current = true; return }
    formRef.current?.querySelector<HTMLElement>('.vs-step-panel input')?.focus()
  }, [step])
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

  const required = {
    naam: validName(values.naam),
    bedrijf: values.bedrijf.trim().length > 0,
    email: validEmail(values.email),
    telefoon: validPhone(values.telefoon),
    spend: Boolean(values.spend),
    model: Boolean(values.model),
  }
  const stepValid = (index: number) => STEP_FIELDS[index].every((key) => required[key as keyof typeof required])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (step === 0) {
      if (stepValid(0)) setStep(1)
      else setTried([true])
      return
    }
    if (status !== 'idle') return
    if (!validate()) {
      if (!stepValid(0)) { setTried([true, true]); setStep(0) }
      return
    }
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

  const done = Object.values(required).filter(Boolean).length
  const total = Object.keys(required).length
  const attempted = Boolean(tried[0]) || Object.keys(errors).length > 0
  const finished = status === 'done' || status === 'redirecting'

  const success = (
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

  const form = (
    <div ref={ref} id={id} className="hero-request vs-qform">
      <form ref={formRef} onSubmit={handleSubmit} noValidate aria-busy={busy} data-clarity-mask="true">
        <StepRail steps={t.steps} current={step} label={t.rail} stepOf={t.stepOf(step + 1, t.steps.length)} />
        {step === 0 && (
        <div className="vs-step-panel vs-qform-grid" key="who">
          <Field name="naam" label={t.naam} autoComplete="name" disabled={busy} icon="person" value={values.naam} onValueChange={(v) => update('naam', v)}
            validate={validName} message={t.errors.naam} showError={attempted} />
          <Field name="bedrijf" label={t.bedrijf} autoComplete="organization" disabled={busy} icon="building" value={values.bedrijf} onValueChange={(v) => update('bedrijf', v)}
            message={t.errors.bedrijf} showError={attempted} />
          <Field name="email" type="email" inputMode="email" label={t.email} autoComplete="email" disabled={busy} icon="mail" value={values.email} onValueChange={(v) => update('email', v)}
            validate={validEmail} message={lang === 'nl' ? 'Dit e-mailadres klopt niet helemaal.' : 'This email address doesn’t look quite right.'} showError={attempted} />
          <Field name="telefoon" type="tel" inputMode="tel" label={t.telefoon} autoComplete="tel" maxLength={60} prefix="BE" format={formatPhone} disabled={busy} icon="phone"
            value={values.telefoon} onValueChange={(v) => update('telefoon', v)} validate={validPhone}
            message={lang === 'nl' ? 'Vul een telefoonnummer in, bijvoorbeeld 0470 12 34 56.' : 'Enter a phone number, for example 0470 12 34 56.'} showError={attempted} />
        </div>
        )}
        {step === 1 && (
        <div className="vs-step-panel" key="shop">
        {choices('spend', t.spend, SPEND[lang], errors.spend)}
        {choices('model', t.model, MODEL[lang], errors.model)}
        <Field name="website" inputMode="url" label={t.website} maxLength={300} required={false} disabled={busy} icon="globe"
          value={values.website} onValueChange={(v) => update('website', v)} />

        <label className="vs-check-box vs-check-row" data-checked={setup || undefined}>
          <input type="checkbox" checked={setup} disabled={busy} onChange={e => setSetup(e.target.checked)} />
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="1" y="1" width="18" height="18" rx="5" /><path d="M5.5 10.5 8.5 13.5 14.5 6.5" pathLength={1} /></svg>
          <span>{t.setup}</span>
        </label>
        </div>
        )}

        {/* Honeypot: hidden from users, visible to bots. */}
        <div aria-hidden className="hero-request-trap">
          <label htmlFor={`${id}-company_website`}>Company website</label>
          <input id={`${id}-company_website`} type="text" tabIndex={-1} autoComplete="off"
            onChange={e => { honeypotRef.current = e.target.value }} />
        </div>

        {sendError && <p className="hero-request-error" role="alert">{t.sendError}</p>}
        <div className="vs-step-actions">
          {step > 0 && (
            <button type="button" className="vs-step-back" onClick={() => setStep(0)} disabled={busy}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>{t.back}
            </button>
          )}
          {step === 0 ? (
            <div className="vs-step-next"><SubmitButton state={stepValid(0) ? 'ready' : 'locked'} label={t.next} pendingLabel={t.next} confirm={false} /></div>
          ) : (
            <div className="vs-step-next vs-step-next--send"><SubmitButton state={busy ? 'pending' : done === total ? 'ready' : 'locked'} label={t.submit} pendingLabel={t.submitting} /></div>
          )}
        </div>
        <p className="hero-request-note">{t.note} <Link to="/privacy">{t.privacy}</Link></p>
      </form>
    </div>
  )

  const body = finished ? success : form
  if (!preview) return body
  const c = t.card
  const who = values.bedrijf.trim() || values.naam.trim().split(/\s+/)[0]
  return (
    <div className="vs-form-duo">
      {body}
      <aside className="vs-form-side" aria-label={c.band}>
        <PreviewCard
          band={c.band}
          title={who ? c.title(who) : ''}
          placeholder={c.placeholder}
          rows={[
            { label: c.budget, value: values.spend },
            { label: c.model, value: values.model },
            { label: c.setupRow, value: values.spend || values.model ? (setup ? c.setupYes : c.setupNo) : '' },
          ]}
          done={done}
          total={total}
          ringLabel={c.ring}
          showBack={done === total && !finished}
          settled={finished}
          backTitle={c.back}
          backItems={c.next}
          flipLabels={{ toBack: c.back, toFront: c.toFront }}
        />
        <FormTrail happy={finished} thinking={busy} />
      </aside>
    </div>
  )
}
