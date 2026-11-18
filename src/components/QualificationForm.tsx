import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { captureAttribution, trackEvent, trackLeadConversion, getGa4Context } from '../lib/analytics'
import { useInView } from '../lib/useInView'
import { useLang } from '../i18n/LanguageContext'
import SuccessCheck from './brand/SuccessCheck'
import Burst from './brand/forms/Burst'
import Field from './brand/forms/Field'
import FieldError from './brand/forms/FieldError'
import FormProgress from './brand/forms/FormProgress'
import SubmitButton from './brand/forms/SubmitButton'
import { formatPhone, validEmail, validName, validPhone } from './brand/forms/validate'

const GOALS = [
  { key: 'customers', nl: ['Meer klanten', 'Meer aanvragen of boekingen.'], en: ['More customers', 'More enquiries or bookings.'] },
  { key: 'sales', nl: ['Meer online verkopen', 'Je webshop laten groeien.'], en: ['More online sales', 'Grow your online store.'] },
  { key: 'build', nl: ['Een website of app', 'Iets nieuws bouwen of verbeteren.'], en: ['A website or app', 'Build something new or improve it.'] },
  { key: 'efficiency', nl: ['Slimmer werken', 'Meer inzicht met data en automatisering.'], en: ['Work smarter', 'Clarity through data and automation.'] },
  { key: 'explore', nl: ['Ik weet het nog niet', 'Denk samen met ons na over je volgende stap.'], en: ['I’m not sure yet', 'Let’s work out your next step together.'] },
]

const COPY = {
  nl: {
    labels: {
      naam: 'Naam',
      bedrijf: 'Bedrijf (optioneel)',
      email: 'Zakelijk e-mailadres',
      telefoon: 'Telefoonnummer',
      website: 'Website (optioneel)',
      doel: 'Waar kunnen we je mee helpen?',
      uitdaging: 'Grootste uitdaging',
      investering: 'Beschikbaar project- of marketingbudget',
      kanalen: 'Huidige kanalen',
      timing: 'Gewenste timing',
      extra: 'Extra informatie',
    },
    errors: {
      naam: 'Vul je naam in.',
      email: 'Vul een geldig zakelijk e-mailadres in.',
      telefoon: 'Vul je telefoonnummer in.',
      doel: 'Kies je belangrijkste doel.',
      uitdaging: 'Beschrijf kort je grootste uitdaging.',
    },
    optioneel: 'Optioneel',
    addOptional: '+ Extra info toevoegen (optioneel)',
    submitting: 'Even geduld…',
    submit: 'Verstuur je aanvraag',
    doneTitle: 'Bedankt.',
    doneBody:
      'Je aanvraag is goed ontvangen. We contacteren je binnen 24 uur via e-mail of telefoon om je doelen en de volgende stap te bespreken.',
    errorNote:
      'Er ging iets mis bij het versturen. Probeer het opnieuw of mail rechtstreeks naar stef@verkoop.studio.',
  },
  en: {
    labels: {
      naam: 'Name',
      bedrijf: 'Company (optional)',
      email: 'Business email',
      telefoon: 'Phone number',
      website: 'Website (optional)',
      doel: 'What can we help you with?',
      uitdaging: 'Biggest challenge',
      investering: 'Available project or marketing budget',
      kanalen: 'Current channels',
      timing: 'Desired timing',
      extra: 'Additional information',
    },
    errors: {
      naam: 'Please enter your name.',
      email: 'Please enter a valid business email address.',
      telefoon: 'Please enter your phone number.',
      doel: 'Please choose your main goal.',
      uitdaging: 'Briefly describe your biggest challenge.',
    },
    optioneel: 'Optional',
    addOptional: '+ Add more info (optional)',
    submitting: 'One moment…',
    submit: 'Send your enquiry',
    doneTitle: 'Thank you.',
    doneBody: 'Your request has been received. We’ll contact you within 24 hours by email or phone to discuss your goals and the next step.',
    errorNote:
      'Something went wrong while sending. Please try again or email directly at stef@verkoop.studio.',
  },
}

interface FormState {
  naam: string
  bedrijf: string
  email: string
  telefoon: string
  website: string
  doel: string
  uitdaging: string
  investering: string
  kanalen: string
  timing: string
  extra: string
}

const initialState: FormState = {
  naam: '',
  bedrijf: '',
  email: '',
  telefoon: '',
  website: '',
  doel: '',
  uitdaging: '',
  investering: '',
  kanalen: '',
  timing: '',
  extra: '',
}

interface QualificationFormProps {
  id?: string
  compact?: boolean
  inquiryContext?: string
}

export default function QualificationForm({ id = 'audit-formulier', compact = false, inquiryContext }: QualificationFormProps) {
  const { lang } = useLang()
  const t = COPY[lang]
  const reduce = useReducedMotion()
  const [values, setValues] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done'>('idle')
  const [submitError, setSubmitError] = useState(false)
  const [showOptional, setShowOptional] = useState(false)
  const submissionRef = useRef('')
  const honeypotRef = useRef('')
  const startedRef = useRef(false)
  const abandonedRef = useRef(false)

  const { ref } = useInView<HTMLDivElement>(() => trackEvent('form_viewed', { form_id: id }))

  useEffect(() => {
    const handleLeave = () => {
      if (startedRef.current && status !== 'done' && !abandonedRef.current) {
        abandonedRef.current = true
        trackEvent('form_abandoned', { form_id: id })
      }
    }
    window.addEventListener('beforeunload', handleLeave)
    return () => window.removeEventListener('beforeunload', handleLeave)
  }, [id, status])

  function update<K extends keyof FormState>(key: K, value: string) {
    if (!startedRef.current) {
      startedRef.current = true
      trackEvent('form_started', { form_id: id })
    }
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!values.naam.trim()) next.naam = t.errors.naam
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = t.errors.email
    if (!values.telefoon.trim()) next.telefoon = t.errors.telefoon
    if (!values.doel) next.doel = t.errors.doel
    if (!values.uitdaging.trim()) next.uitdaging = t.errors.uitdaging
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (status === 'submitting' || !validate()) return
    submissionRef.current ||= crypto.randomUUID()

    setStatus('submitting')
    setSubmitError(false)
    const attribution = captureAttribution()

    try {
      const ga4 = await getGa4Context()
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          submission_id: submissionRef.current,
          doel: GOALS.find(goal => goal.key === values.doel)?.[lang][0] ?? values.doel,
          extra: [inquiryContext, values.extra].filter(Boolean).join('\n'),
          form_id: id,
          lang,
          company_website: honeypotRef.current, // Honeypot. Bots fill this.
          attribution,
          ga4,
        }),
      })
      const receipt = await res.json()
      if (!res.ok || receipt.ok !== true) throw new Error(`Request failed: ${res.status}`)
      trackEvent('form_submitted', { form_id: id, doel: values.doel, ...attribution })
      trackLeadConversion(receipt, submissionRef.current, id)
      setStatus('done')
    } catch {
      setSubmitError(true)
      setStatus('idle')
    }
  }

  const required = {
    naam: validName(values.naam),
    email: validEmail(values.email),
    telefoon: validPhone(values.telefoon),
    doel: Boolean(values.doel),
    uitdaging: values.uitdaging.trim().length > 0,
  }
  const done = Object.values(required).filter(Boolean).length
  const total = Object.keys(required).length
  const attempted = Object.keys(errors).length > 0
  const busy = status === 'submitting'

  if (status === 'done') {
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
        <p role="status">{t.doneBody}</p>
      </motion.div>
    )
  }

  return (
    <div ref={ref} id={id} className="hero-request vs-qform">
      <form onSubmit={handleSubmit} noValidate data-clarity-mask="true">
        <FormProgress done={done} total={total} lang={lang} />
        <div className="vs-qform-grid">
          <Field name="naam" label={t.labels.naam} autoComplete="name" disabled={busy}
            value={values.naam} onValueChange={(v) => update('naam', v)} validate={validName}
            message={t.errors.naam} showError={attempted} />
          <Field name="bedrijf" label={t.labels.bedrijf} autoComplete="organization" disabled={busy} required={false}
            value={values.bedrijf} onValueChange={(v) => update('bedrijf', v)} />
          <Field name="email" type="email" inputMode="email" label={t.labels.email} autoComplete="email" disabled={busy}
            value={values.email} onValueChange={(v) => update('email', v)} validate={validEmail}
            message={lang === 'nl' ? 'Dit e-mailadres klopt niet helemaal.' : 'This email address doesn’t look quite right.'} showError={attempted} />
          <Field name="telefoon" type="tel" inputMode="tel" label={t.labels.telefoon} autoComplete="tel" maxLength={60} disabled={busy} prefix="BE"
            value={values.telefoon} onValueChange={(v) => update('telefoon', v)} validate={validPhone} format={formatPhone}
            message={lang === 'nl' ? 'Vul een telefoonnummer in, bijvoorbeeld 0470 12 34 56.' : 'Enter a phone number, for example 0470 12 34 56.'} showError={attempted} />
          <Field name="website" inputMode="url" label={t.labels.website} disabled={busy} required={false} className="vs-qform-wide"
            value={values.website} onValueChange={(v) => update('website', v)} />
        </div>

        <fieldset className="vs-goals" aria-describedby={`${id}-goal-hint${errors.doel ? ` ${id}-goal-error` : ''}`} disabled={busy}>
          <legend>{t.labels.doel}</legend>
          <p id={`${id}-goal-hint`} className="vs-goals-hint">{lang === 'nl' ? 'Kies wat het best past. De details bekijken we samen.' : 'Choose the closest fit. We’ll work out the details together.'}</p>
          <div className="vs-goals-options">
            {GOALS.map((goal) => {
              const checked = values.doel === goal.key
              return (
                <label key={goal.key} className="vs-goal" data-checked={checked || undefined}>
                  <input type="radio" name={`${id}-goal`} value={goal.key} checked={checked} onChange={() => update('doel', goal.key)} className="sr-only" required aria-invalid={Boolean(errors.doel)} />
                  {checked && <motion.span layoutId={`${id}-goal-pill`} className="vs-goal-pill" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
                  <strong>{goal[lang][0]}</strong>
                  <span>{goal[lang][1]}</span>
                </label>
              )
            })}
          </div>
          {errors.doel && <FieldError id={`${id}-goal-error`}>{t.errors.doel}</FieldError>}
        </fieldset>

        <Field name="uitdaging" multiline rows={3} label={t.labels.uitdaging} disabled={busy} maxLength={2000}
          value={values.uitdaging} onValueChange={(v) => update('uitdaging', v)}
          message={t.errors.uitdaging} showError={attempted} />

        {!compact && !showOptional && (
          <button type="button" onClick={() => setShowOptional(true)} className="vs-textlink vs-qform-more">{t.addOptional}</button>
        )}

        <AnimatePresence initial={false}>
          {!compact && showOptional && (
            <motion.div
              className="vs-qform-grid"
              initial={reduce ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <Field name="investering" label={t.labels.investering} required={false} disabled={busy} value={values.investering} onValueChange={(v) => update('investering', v)} />
              <Field name="kanalen" label={t.labels.kanalen} required={false} disabled={busy} value={values.kanalen} onValueChange={(v) => update('kanalen', v)} />
              <Field name="timing" label={t.labels.timing} required={false} disabled={busy} value={values.timing} onValueChange={(v) => update('timing', v)} />
              <Field name="extra" label={t.labels.extra} required={false} disabled={busy} value={values.extra} onValueChange={(v) => update('extra', v)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Honeypot: hidden from users, visible to bots. */}
        <div aria-hidden className="hero-request-trap">
          <label htmlFor={`${id}-company-website`}>Company website</label>
          <input
            id={`${id}-company-website`}
            type="text"
            tabIndex={-1}
            autoComplete="off"
            onChange={(e) => {
              honeypotRef.current = e.target.value
            }}
          />
        </div>

        {submitError && <p className="hero-request-error" role="alert">{t.errorNote}</p>}
        <SubmitButton state={busy ? 'pending' : done === total ? 'ready' : 'locked'} label={t.submit} pendingLabel={t.submitting} />
      </form>
    </div>
  )
}
