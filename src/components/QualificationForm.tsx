import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { captureAttribution, trackEvent, trackLeadConversion, getGa4Context } from '../lib/analytics'
import { useInView } from '../lib/useInView'
import { useLang } from '../i18n/LanguageContext'
import SuccessCheck from './brand/SuccessCheck'
import Burst from './brand/forms/Burst'
import Field from './brand/forms/Field'
import FieldError from './brand/forms/FieldError'
import FormTrail from './brand/forms/FormTrail'
import PreviewCard from './brand/forms/PreviewCard'
import StepRail from './brand/forms/StepRail'
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
    steps: ['Wie je bent', 'Wat je nodig hebt', 'Details'],
    stepOf: (n: number, total: number) => `Stap ${n} van ${total}`,
    rail: 'Stappen van het formulier',
    next: 'Volgende',
    back: 'Terug',
    detailsHint: 'Alles hier is optioneel. Het helpt ons om beter voorbereid te bellen.',
    card: { band: 'Jouw aanvraag', title: (name: string) => `Aanvraag van ${name}`, placeholder: 'Jouw aanvraag', company: 'Bedrijf', goal: 'Doel', challenge: 'Uitdaging', ring: 'Ingevulde velden', back: 'Wat er nu gebeurt', toBack: 'Wat er nu gebeurt', toFront: 'Terug naar je aanvraag',
      next: ['We lezen je aanvraag', 'We bespreken de kansen en prioriteiten', 'Je krijgt een voorstel met scope en budget', 'Je hoort binnen 24 uur van ons'] },
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
    steps: ['Who you are', 'What you need', 'Details'],
    stepOf: (n: number, total: number) => `Step ${n} of ${total}`,
    rail: 'Form steps',
    next: 'Next',
    back: 'Back',
    detailsHint: 'Everything here is optional. It helps us prepare for the call.',
    card: { band: 'Your enquiry', title: (name: string) => `Enquiry from ${name}`, placeholder: 'Your enquiry', company: 'Company', goal: 'Goal', challenge: 'Challenge', ring: 'Fields filled in', back: 'What happens next', toBack: 'What happens next', toFront: 'Back to your enquiry',
      next: ['We read your enquiry', 'We discuss opportunities and priorities', 'You get a proposal with scope and budget', 'You hear from us within 24 hours'] },
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
  /** Leaves out the optional details step. */
  compact?: boolean
  inquiryContext?: string
  /** Shows the live preview card and the margin trail beside the form (wide layouts only). */
  preview?: boolean
}

/** Which required fields each step asks for; the last step only holds optional ones. */
const STEP_FIELDS: (keyof FormState)[][] = [['naam', 'email', 'telefoon'], ['doel', 'uitdaging'], []]

export default function QualificationForm({ id = 'audit-formulier', compact = false, inquiryContext, preview = false }: QualificationFormProps) {
  const { lang } = useLang()
  const t = COPY[lang]
  const reduce = useReducedMotion()
  const [values, setValues] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done'>('idle')
  const [submitError, setSubmitError] = useState(false)
  const [step, setStep] = useState(0)
  const [tried, setTried] = useState<boolean[]>([])
  const formRef = useRef<HTMLFormElement>(null)
  const arrived = useRef(false)
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

  // After a step change, focus moves to the first field of the new step.
  useEffect(() => {
    if (!arrived.current) { arrived.current = true; return }
    formRef.current?.querySelector<HTMLElement>('.vs-step-panel input:not([type=radio]), .vs-step-panel textarea, .vs-step-panel input[type=radio]')?.focus()
  }, [step])

  function update<K extends keyof FormState>(key: K, value: string) {
    if (!startedRef.current) {
      startedRef.current = true
      trackEvent('form_started', { form_id: id })
    }
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const required = {
    naam: validName(values.naam),
    email: validEmail(values.email),
    telefoon: validPhone(values.telefoon),
    doel: Boolean(values.doel),
    uitdaging: values.uitdaging.trim().length > 0,
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

  const lastStep = compact ? 1 : 2

  function stepValid(index: number) {
    return STEP_FIELDS[index].every((key) => required[key as keyof typeof required])
  }

  function goNext() {
    if (!stepValid(step)) {
      setTried((prev) => { const next = [...prev]; next[step] = true; return next })
      if (STEP_FIELDS[step].includes('doel') && !values.doel) setErrors((prev) => ({ ...prev, doel: t.errors.doel }))
      return
    }
    setStep((n) => Math.min(lastStep, n + 1))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (step < lastStep) { goNext(); return }
    if (status === 'submitting') return
    if (!validate()) {
      // Send the visitor back to the first step that still needs something.
      const back = STEP_FIELDS.findIndex((keys) => keys.some((key) => !required[key as keyof typeof required]))
      if (back >= 0) { setTried((prev) => { const next = [...prev]; next[back] = true; return next }); setStep(back) }
      return
    }
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

  const done = Object.values(required).filter(Boolean).length
  const total = Object.keys(required).length
  const busy = status === 'submitting'
  const shown = (index: number) => Boolean(tried[index]) || Object.keys(errors).length > 0
  const goal = GOALS.find((item) => item.key === values.doel)?.[lang][0] ?? ''
  const firstName = values.naam.trim().split(/\s+/)[0]

  const success = (
    <motion.div
      ref={ref}
      className="hero-request vs-form-success vs-qform-done"
      initial={reduce ? false : { rotateX: -70, opacity: 0, y: 10 }}
      animate={{ rotateX: 0, opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 160, damping: 18, delay: preview ? 0.35 : 0 }}
    >
      <Burst />
      <SuccessCheck />
      <h2>{t.doneTitle}</h2>
      <p role="status">{t.doneBody}</p>
    </motion.div>
  )

  const form = (
    <div ref={ref} id={id} className="hero-request vs-qform">
      <form ref={formRef} onSubmit={handleSubmit} noValidate data-clarity-mask="true">
        <StepRail steps={t.steps.slice(0, lastStep + 1)} current={step} label={t.rail} stepOf={t.stepOf(step + 1, lastStep + 1)} />

        {step === 0 && (
          <div className="vs-step-panel vs-qform-grid" key="who">
            <Field name="naam" label={t.labels.naam} autoComplete="name" disabled={busy} icon="person"
              value={values.naam} onValueChange={(v) => update('naam', v)} validate={validName}
              message={t.errors.naam} showError={shown(0)} />
            <Field name="bedrijf" label={t.labels.bedrijf} autoComplete="organization" disabled={busy} required={false} icon="building"
              value={values.bedrijf} onValueChange={(v) => update('bedrijf', v)} />
            <Field name="email" type="email" inputMode="email" label={t.labels.email} autoComplete="email" disabled={busy} icon="mail"
              hint={lang === 'nl' ? 'We antwoorden op dit adres.' : 'We reply to this address.'}
              value={values.email} onValueChange={(v) => update('email', v)} validate={validEmail}
              message={lang === 'nl' ? 'Dit e-mailadres klopt niet helemaal.' : 'This email address doesn’t look quite right.'} showError={shown(0)} />
            <Field name="telefoon" type="tel" inputMode="tel" label={t.labels.telefoon} autoComplete="tel" maxLength={60} disabled={busy} prefix="BE" icon="phone"
              value={values.telefoon} onValueChange={(v) => update('telefoon', v)} validate={validPhone} format={formatPhone}
              message={lang === 'nl' ? 'Vul een telefoonnummer in, bijvoorbeeld 0470 12 34 56.' : 'Enter a phone number, for example 0470 12 34 56.'} showError={shown(0)} />
            <Field name="website" inputMode="url" label={t.labels.website} disabled={busy} required={false} className="vs-qform-wide" icon="globe"
              value={values.website} onValueChange={(v) => update('website', v)} />
          </div>
        )}

        {step === 1 && (
          <div className="vs-step-panel" key="need">
            <fieldset className="vs-goals" aria-describedby={`${id}-goal-hint${errors.doel ? ` ${id}-goal-error` : ''}`} disabled={busy}>
              <legend>{t.labels.doel}</legend>
              <p id={`${id}-goal-hint`} className="vs-goals-hint">{lang === 'nl' ? 'Kies wat het best past. De details bekijken we samen.' : 'Choose the closest fit. We’ll work out the details together.'}</p>
              <div className="vs-goals-options">
                {GOALS.map((item) => {
                  const checked = values.doel === item.key
                  return (
                    <label key={item.key} className="vs-goal" data-checked={checked || undefined}>
                      <input type="radio" name={`${id}-goal`} value={item.key} checked={checked} onChange={() => { update('doel', item.key); setErrors((prev) => ({ ...prev, doel: undefined })) }} className="sr-only" required aria-invalid={Boolean(errors.doel)} />
                      {checked && <motion.span layoutId={`${id}-goal-pill`} className="vs-goal-pill" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
                      <strong>{item[lang][0]}</strong>
                      <span>{item[lang][1]}</span>
                    </label>
                  )
                })}
              </div>
              {errors.doel && <FieldError id={`${id}-goal-error`}>{t.errors.doel}</FieldError>}
            </fieldset>
            <Field name="uitdaging" multiline rows={3} label={t.labels.uitdaging} disabled={busy} maxLength={2000} icon="chat"
              hint={lang === 'nl' ? 'Een paar zinnen is genoeg.' : 'A few sentences is enough.'}
              value={values.uitdaging} onValueChange={(v) => update('uitdaging', v)}
              message={t.errors.uitdaging} showError={shown(1)} />
          </div>
        )}

        {step === 2 && !compact && (
          <div className="vs-step-panel" key="details">
            <p className="vs-goals-hint">{t.detailsHint}</p>
            <div className="vs-qform-grid">
              <Field name="investering" label={t.labels.investering} required={false} disabled={busy} icon="euro" value={values.investering} onValueChange={(v) => update('investering', v)} />
              <Field name="kanalen" label={t.labels.kanalen} required={false} disabled={busy} icon="globe" value={values.kanalen} onValueChange={(v) => update('kanalen', v)} />
              <Field name="timing" label={t.labels.timing} required={false} disabled={busy} value={values.timing} onValueChange={(v) => update('timing', v)} />
              <Field name="extra" label={t.labels.extra} required={false} disabled={busy} icon="chat" value={values.extra} onValueChange={(v) => update('extra', v)} />
            </div>
          </div>
        )}

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
        <div className="vs-step-actions">
          {step > 0 && (
            <button type="button" className="vs-step-back" onClick={() => setStep((n) => Math.max(0, n - 1))} disabled={busy}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>{t.back}
            </button>
          )}
          {step < lastStep ? (
            <div className="vs-step-next">
              <SubmitButton state={stepValid(step) ? 'ready' : 'locked'} label={t.next} pendingLabel={t.next} confirm={false} />
            </div>
          ) : (
            <div className="vs-step-next vs-step-next--send">
              <SubmitButton state={busy ? 'pending' : done === total ? 'ready' : 'locked'} label={t.submit} pendingLabel={t.submitting} />
            </div>
          )}
        </div>
      </form>
    </div>
  )

  const body = status === 'done' ? success : form
  if (!preview) return body
  const c = t.card
  return (
    <div className="vs-form-duo">
      {body}
      <aside className="vs-form-side" aria-label={c.band}>
        <PreviewCard
          band={c.band}
          title={firstName ? c.title(firstName) : ''}
          placeholder={c.placeholder}
          rows={[
            { label: c.company, value: values.bedrijf.trim() },
            { label: c.goal, value: goal },
            { label: c.challenge, value: values.uitdaging.trim().length > 70 ? `${values.uitdaging.trim().slice(0, 68)}…` : values.uitdaging.trim() },
          ]}
          done={done}
          total={total}
          ringLabel={c.ring}
          showBack={done === total && status !== 'done'}
          settled={status === 'done'}
          backTitle={c.back}
          backItems={c.next}
          flipLabels={{ toBack: c.toBack, toFront: c.toFront }}
        />
        <FormTrail happy={status === 'done'} thinking={busy} />
      </aside>
    </div>
  )
}
