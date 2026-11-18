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
import { captureAttribution, getGa4Context, trackEvent, trackLeadConversion } from '../lib/analytics'
import { useInView } from '../lib/useInView'
import { useLang } from '../i18n/LanguageContext'
import { giveaway } from '../data/giveaway'

const COPY = {
  nl: {
    naam: 'Naam',
    bedrijf: 'Bedrijf',
    email: 'Zakelijk e-mailadres',
    telefoon: 'Telefoonnummer',
    website: 'Huidige website',
    websiteHint: 'Optioneel. Laat leeg als je er nog geen hebt.',
    motivatie: 'Waarom zou een nieuwe site bij jullie het verschil maken?',
    motivatieHint: 'Een paar lijnen is genoeg. Dit is waar we op kiezen.',
    consent: 'Ik ga akkoord met de actievoorwaarden en met contact over deze actie en de diensten van Verkoop Studio.',
    rulesLink: 'Lees de actievoorwaarden',
    privacy: 'Privacybeleid',
    submit: 'Verstuur mijn deelname',
    submitting: 'Even geduld…',
    doneTitle: 'Je deelname is binnen.',
    doneBody: `We lezen elke inzending zelf. Na ${giveaway.closes.nl} kiezen we één bedrijf en contacteren we de winnaar persoonlijk. Ook als je niet gekozen wordt, laten we van ons horen.`,
    errors: {
      naam: 'Vul je naam in.',
      bedrijf: 'Vul de naam van je bedrijf in.',
      email: 'Vul een geldig zakelijk e-mailadres in.',
      telefoon: 'Vul je telefoonnummer in.',
      motivatie: 'Vertel kort waarom een nieuwe site het verschil zou maken.',
      consent: 'Je kan alleen meedoen als je akkoord gaat met de actievoorwaarden.',
    },
    sendError: 'Versturen lukt even niet. Probeer opnieuw of mail stef@verkoop.studio.',
  },
  en: {
    naam: 'Name',
    bedrijf: 'Company',
    email: 'Business email',
    telefoon: 'Phone number',
    website: 'Current website',
    websiteHint: 'Optional. Leave it empty if you do not have one yet.',
    motivatie: 'Why would a new site make the difference for you?',
    motivatieHint: 'A few lines is enough. This is what we choose on.',
    consent: 'I agree to the campaign rules and to being contacted about this campaign and the services of Verkoop Studio.',
    rulesLink: 'Read the campaign rules',
    privacy: 'Privacy policy',
    submit: 'Send my entry',
    submitting: 'One moment…',
    doneTitle: 'Your entry is in.',
    doneBody: `We read every entry ourselves. After ${giveaway.closes.en} we pick one business and contact the winner personally. Even if you are not picked, you will hear from us.`,
    errors: {
      naam: 'Please enter your name.',
      bedrijf: 'Please enter your company name.',
      email: 'Please enter a valid business email address.',
      telefoon: 'Please enter your phone number.',
      motivatie: 'Briefly tell us why a new site would make the difference.',
      consent: 'You can only enter if you agree to the campaign rules.',
    },
    sendError: 'We couldn’t send your entry. Try again or email stef@verkoop.studio.',
  },
}

interface FormState {
  naam: string
  bedrijf: string
  email: string
  telefoon: string
  website: string
  motivatie: string
}

const initialState: FormState = { naam: '', bedrijf: '', email: '', telefoon: '', website: '', motivatie: '' }

export default function GiveawayEntryForm({ id = giveaway.formId }: { id?: string }) {
  const { lang } = useLang()
  const t = COPY[lang]
  const reduce = useReducedMotion()
  const [values, setValues] = useState<FormState>(initialState)
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState | 'consent', string>>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done'>('idle')
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
    const next: Partial<Record<keyof FormState | 'consent', string>> = {}
    if (!values.naam.trim()) next.naam = t.errors.naam
    if (!values.bedrijf.trim()) next.bedrijf = t.errors.bedrijf
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = t.errors.email
    if (!values.telefoon.trim()) next.telefoon = t.errors.telefoon
    if (!values.motivatie.trim()) next.motivatie = t.errors.motivatie
    if (!consent) next.consent = t.errors.consent
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (status === 'submitting' || !validate()) return
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
          // The server reads form_id to tag the CRM campaign; these two lines
          // are what the studio reads in the lead notification and the CRM note.
          doel: lang === 'nl' ? 'Gratis website actie: deelname' : 'Free website campaign: entry',
          uitdaging: values.motivatie,
          extra: `Actievoorwaarden aanvaard: ja (${giveaway.campaign})`,
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
      trackLeadConversion(receipt, submissionRef.current, id)
      setStatus('done')
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
    motivatie: values.motivatie.trim().length > 0,
    consent,
  }
  const done = Object.values(required).filter(Boolean).length
  const total = Object.keys(required).length
  const attempted = Object.keys(errors).length > 0

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

  const busy = status === 'submitting'

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
          <div className="vs-qform-wide">
            <Field name="website" inputMode="url" label={t.website} maxLength={300} required={false} disabled={busy}
              value={values.website} onValueChange={(v) => update('website', v)} />
            <p className="vs-field-hint">{t.websiteHint}</p>
          </div>
        </div>
        <div>
          <Field name="motivatie" multiline rows={4} label={t.motivatie} maxLength={2000} disabled={busy}
            value={values.motivatie} onValueChange={(v) => update('motivatie', v)} message={t.errors.motivatie} showError={attempted} />
          <p className="vs-field-hint">{t.motivatieHint}</p>
        </div>

        <div>
          <label className="vs-check-box vs-check-row" data-checked={consent || undefined}>
            <input type="checkbox" checked={consent} disabled={busy} onChange={e => setConsent(e.target.checked)} aria-invalid={Boolean(errors.consent)} />
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="1" y="1" width="18" height="18" rx="5" /><path d="M5.5 10.5 8.5 13.5 14.5 6.5" pathLength={1} /></svg>
            <span>{t.consent}</span>
          </label>
          {errors.consent && <FieldError>{errors.consent}</FieldError>}
          <p className="hero-request-note"><a href="#voorwaarden">{t.rulesLink}</a>{' · '}<Link to="/privacy">{t.privacy}</Link></p>
        </div>

        {/* Honeypot: hidden from users, visible to bots. */}
        <div aria-hidden className="hero-request-trap">
          <label htmlFor={`${id}-company_website`}>Company website</label>
          <input id={`${id}-company_website`} type="text" tabIndex={-1} autoComplete="off"
            onChange={e => { honeypotRef.current = e.target.value }} />
        </div>

        {sendError && <p className="hero-request-error" role="alert">{t.sendError}</p>}
        <SubmitButton state={busy ? 'pending' : done === total ? 'ready' : 'locked'} label={t.submit} pendingLabel={t.submitting} />
      </form>
    </div>
  )
}
