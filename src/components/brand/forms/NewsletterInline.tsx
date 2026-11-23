import { useRef, useState, type FormEvent } from 'react'
import { useLang } from '../../../i18n/LanguageContext'
import { trackNewsletterConversion } from '../../../lib/analytics'
import Field from './Field'
import { validEmail } from './validate'

const COPY = {
  nl: {
    email: 'E-mailadres',
    consent: 'Ja, ik ontvang graag marketingtips en nieuws van Verkoop Studio per e-mail.',
    submit: 'Inschrijven',
    pending: 'Even geduld…',
    done: 'Je bent ingeschreven. Nieuwe tips komen in je inbox.',
    invalid: 'Dit e-mailadres klopt niet helemaal.',
    consentNeeded: 'Vink het vakje aan om je in te schrijven.',
    unsubscribed: 'Je hebt je eerder uitgeschreven. Mail ons als je weer berichten wilt ontvangen.',
    busy: 'Even te veel pogingen. Probeer het over enkele minuten opnieuw.',
    failed: 'Inschrijven lukte niet. Probeer het later opnieuw.',
  },
  en: {
    email: 'Email address',
    consent: 'Yes, I’d like to receive marketing tips and news from Verkoop Studio by email.',
    submit: 'Subscribe',
    pending: 'One moment…',
    done: 'You’re subscribed. New tips will land in your inbox.',
    invalid: 'This email address doesn’t look quite right.',
    consentNeeded: 'Tick the box to subscribe.',
    unsubscribed: 'You unsubscribed earlier. Email us if you’d like to receive messages again.',
    busy: 'Too many attempts. Try again in a few minutes.',
    failed: 'We couldn’t subscribe you. Please try again later.',
  },
}

/** The newsletter sign-up in one row: email, consent and a button. Same endpoint and payload as before. */
export default function NewsletterInline({ id }: { id: string }) {
  const { lang } = useLang()
  const t = COPY[lang]
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<'idle' | 'pending' | 'success'>('idle')
  const [error, setError] = useState('')
  const [tried, setTried] = useState(false)
  const submissionId = useRef('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'pending') return
    if (!validEmail(email) || !consent) { setTried(true); setError(consent ? '' : t.consentNeeded); return }
    setStatus('pending')
    setError('')
    const data = new FormData(event.currentTarget)
    try {
      submissionId.current ||= crypto.randomUUID()
      const response = await fetch('/api/newsletter', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(20_000),
        body: JSON.stringify({ email, company_website: data.get('company_website'), consent, consent_version: 'website-newsletter-v1', lang }),
      })
      const result = await response.json()
      if (!response.ok || result.ok !== true) {
        setError(result.error === 'subscription_preferences' ? t.unsubscribed : response.status === 429 ? t.busy : t.failed)
        setStatus('idle')
        return
      }
      trackNewsletterConversion(result, submissionId.current)
      setStatus('success')
    } catch {
      setError(t.failed)
      setStatus('idle')
    }
  }

  if (status === 'success') return <p className="vs-news-done" role="status">{t.done}</p>
  return (
    <form className="vs-news" onSubmit={submit} noValidate data-clarity-mask="true">
      {/* One pill: the field with the button inside it on the right, both the same height. */}
      <div className="vs-news-pill">
        <Field name="email" type="email" inputMode="email" label={t.email} autoComplete="email" icon="mail" maxLength={254}
          value={email} onValueChange={setEmail} validate={validEmail} message={t.invalid} showError={tried} disabled={status === 'pending'} />
        <button type="submit" className="vs-news-submit" disabled={status === 'pending'}>{status === 'pending' ? t.pending : t.submit}</button>
      </div>
      <input className="hero-request-trap" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <label className="vs-check-box vs-check-row" data-checked={consent || undefined} htmlFor={`${id}-consent`}>
        <input id={`${id}-consent`} type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="1" y="1" width="18" height="18" rx="5" /><path d="M5.5 10.5 8.5 13.5 14.5 6.5" pathLength={1} /></svg>
        <span>{t.consent}</span>
      </label>
      {error && <p className="hero-request-error" role="alert">{error}</p>}
    </form>
  )
}
