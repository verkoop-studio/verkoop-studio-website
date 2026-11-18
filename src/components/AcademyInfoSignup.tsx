import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAcademyTranslation } from '../i18n/academy'
import Field from './brand/forms/Field'
import SubmitButton from './brand/forms/SubmitButton'
import { validEmail } from './brand/forms/validate'

export default function AcademyInfoSignup({ onSuccess }: { onSuccess: () => void }) {
  const { lang, t } = useAcademyTranslation()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [emailOk, setEmailOk] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    const data = new FormData(event.currentTarget)
    setPending(true); setError('')
    try {
      const response = await fetch('/api/academy-info', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(25_000),
        body: JSON.stringify({ email: data.get('email'), company_website: data.get('company_website'), lang }),
      })
      const receipt = await response.json()
      if (!response.ok || receipt.ok !== true) throw new Error(response.status === 429 ? 'rate_limit' : 'delivery')
      onSuccess()
    } catch (error) {
      setError(error instanceof Error && error.message === 'rate_limit' ? 'Even te veel pogingen. Probeer het over enkele minuten opnieuw.' : 'Versturen lukte niet. Probeer opnieuw of mail stef@verkoop.studio.')
    } finally { setPending(false) }
  }
  return <form className="ac-info-form" onSubmit={submit} data-clarity-mask="true">
    <Field name="email" type="email" inputMode="email" label={t('E-mailadres')} autoComplete="email" disabled={pending}
      validate={validEmail} message={lang === 'nl' ? 'Dit e-mailadres klopt niet helemaal.' : 'This email address doesn’t look quite right.'} onValidChange={(_, ok) => setEmailOk(ok)} />
    <input className="ac-honeypot" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
    <SubmitButton state={pending ? 'pending' : emailOk ? 'ready' : 'locked'} label={t('Stuur mij de info')} pendingLabel={t('Even geduld…')} />
    {error && <p className="ac-form-error" role="alert">{t(error)}</p>}
  </form>
}
