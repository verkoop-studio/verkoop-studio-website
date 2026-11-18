import { useAcademyTranslation } from '../i18n/academy'
import { useCallback, useRef, useState } from 'react'
import Field from './brand/forms/Field'
import SubmitButton from './brand/forms/SubmitButton'
import { formatPhone, validEmail, validName, validPhone } from './brand/forms/validate'
import type { FormEvent } from 'react'
import { captureAttribution, getGa4Context, trackAcademyConversion, trackEvent } from '../lib/analytics'

interface AcademySignupProps {
  formId: string
  /** "compact" asks name, email and phone; "full" also asks company, webshop, experience and ad budget. */
  variant?: 'compact' | 'full'
  requestType?: 'intro' | 'free_lesson'
  submitLabel?: string
  onSuccess: (firstName: string) => void
}

function Choices({ legend, options, value, onChange }: { legend: string; options: readonly (readonly [string, string])[]; value: string; onChange: (value: string) => void }) {
  const { t } = useAcademyTranslation()
  return <fieldset className="ac-level-picker"><legend>{legend} <em>{t("optioneel")}</em></legend><div>{options.map(([key, text]) => <button type="button" key={key} className={value === key ? 'is-active' : ''} aria-pressed={value === key} onClick={() => onChange(value === key ? '' : key)}>{text}</button>)}</div></fieldset>
}

export default function AcademySignup({ formId, variant = 'compact', requestType = 'intro', submitLabel, onSuccess }: AcademySignupProps) {
  const { lang, t } = useAcademyTranslation()
  const levels = [['start', t("Nog niet gestart")], ['basis', t("Draait al campagnes")], ['actief', t("Wil opschalen")]] as const
  const budgets = [['klein', t("Tot €1.000 / maand")], ['middel', t("€1.000 – €5.000 / maand")], ['groot', t("€5.000 – €20.000 / maand")], ['schaal', t("Meer dan €20.000 / maand")]] as const

  const full = variant === 'full'
  const [status, setStatus] = useState<'idle' | 'pending'>('idle')
  const [error, setError] = useState('')
  const [niveau, setNiveau] = useState('')
  const [budget, setBudget] = useState('')
  const [valid, setValid] = useState<Record<string, boolean>>({})
  const [newsletter, setNewsletter] = useState(false)
  const onValidChange = useCallback((name: string, ok: boolean) => setValid((prev) => (prev[name] === ok ? prev : { ...prev, [name]: ok })), [])
  const nl = lang === 'nl'
  const ready = Boolean(valid.naam && valid.email && valid.telefoon)
  const submissionId = useRef('')
  const started = useRef(false)

  function start() {
    if (started.current) return
    started.current = true
    trackEvent('form_started', { form_id: formId })
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'pending') return
    const data = new FormData(event.currentTarget)
    const naam = String(data.get('naam') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const telefoon = String(data.get('telefoon') ?? '').trim()
    if (!naam || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Vul je naam en een geldig e-mailadres in.")
    if (!telefoon) return setError("Laat je telefoonnummer achter, zodat Stef je kan bereiken.")
    setStatus('pending')
    setError('')
    try {
      submissionId.current ||= crypto.randomUUID()
      const attribution = captureAttribution()
      const ga4 = await getGa4Context()
      const response = await fetch('/api/academy', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(25_000),
        body: JSON.stringify({
          naam, email, telefoon, request_type: requestType, bedrijf: data.get('bedrijf') ?? '', website: data.get('website') ?? '', niveau, budget,
          nieuwsbrief: data.get('nieuwsbrief') === 'on', form_id: formId, submission_id: submissionId.current,
          company_website: data.get('company_website'), attribution, ga4, lang,
        }),
      })
      const receipt = await response.json()
      if (!response.ok || receipt.ok !== true) {
        setError(response.status === 400 ? "Controleer je gegevens en probeer opnieuw." : response.status === 429 ? "Even te veel pogingen. Probeer het over enkele minuten opnieuw." : "Versturen lukte niet. Probeer opnieuw of mail stef@verkoop.studio.")
        setStatus('idle')
        return
      }
      trackEvent('form_submitted', { form_id: formId, ...attribution })
      trackAcademyConversion(receipt, submissionId.current, formId)
      onSuccess(naam.split(/\s+/)[0])
    } catch {
      setError("Versturen lukte niet. Probeer opnieuw of mail stef@verkoop.studio.")
      setStatus('idle')
    }
  }

  return <form className={`ac-signup ${full ? 'ac-signup-full' : 'ac-signup-compact'}`} onSubmit={submit} onInput={start} noValidate data-clarity-mask="true">
    <div className="ac-signup-fields">
      <Field name="naam" label={t("Naam")} autoComplete="name" className={full ? '' : 'ac-field-wide'} disabled={status === 'pending'}
        validate={validName} message={nl ? 'Vul je naam in.' : 'Enter your name.'} onValidChange={onValidChange} />
      <Field name="email" type="email" inputMode="email" label={t("E-mailadres")} autoComplete="email" disabled={status === 'pending'}
        validate={validEmail} message={nl ? 'Dit e-mailadres klopt niet helemaal.' : 'This email address doesn’t look quite right.'} onValidChange={onValidChange} />
      <Field name="telefoon" type="tel" inputMode="tel" label={t("Telefoon")} autoComplete="tel" maxLength={60} prefix="BE" format={formatPhone} disabled={status === 'pending'}
        validate={validPhone} message={nl ? 'Vul een telefoonnummer in, bijvoorbeeld 0470 12 34 56.' : 'Enter a phone number, for example 0470 12 34 56.'} onValidChange={onValidChange} />
      {full && <Field name="bedrijf" label={t("Bedrijf") + " " + t("optioneel")} autoComplete="organization" required={false} disabled={status === 'pending'} />}
      {full && <Field name="website" type="url" inputMode="url" label={t("Website of webshop") + " " + t("optioneel")} maxLength={300} required={false} className="ac-field-wide" disabled={status === 'pending'} />}
    </div>
    {full && <Choices legend={t("Waar sta je met adverteren?")} options={levels} value={niveau} onChange={value => { start(); setNiveau(value) }} />}
    {full && <Choices legend={t("Maandelijks advertentiebudget")} options={budgets} value={budget} onChange={value => { start(); setBudget(value) }} />}
    <input className="ac-honeypot" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
    {full && <label className="ac-consent vs-check-box" data-checked={newsletter || undefined}><input type="checkbox" name="nieuwsbrief" checked={newsletter} onChange={(event) => setNewsletter(event.target.checked)} /><svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="1" y="1" width="18" height="18" rx="5" /><path d="M5.5 10.5 8.5 13.5 14.5 6.5" pathLength={1} /></svg><span>{t("Ja, ik ontvang graag marketingtips en nieuws van Verkoop Studio per e-mail.")}</span></label>}
    <SubmitButton state={status === 'pending' ? 'pending' : ready ? 'ready' : 'locked'} label={submitLabel ?? t('Plan een kennismaking')} pendingLabel={t("Even geduld…")} />
    {error && <p className="ac-form-error" role="alert">{t(error)}</p>}
  </form>
}
