import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCallback, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { captureAttribution, getGa4Context, trackAcademyConversion, trackEvent, trackLeadConversion } from '../lib/analytics'
import { recordAcademyPopup } from '../lib/academy-popup'
import SuccessCheck from './brand/SuccessCheck'
import Burst from './brand/forms/Burst'
import Field from './brand/forms/Field'
import FormProgress from './brand/forms/FormProgress'
import SubmitButton from './brand/forms/SubmitButton'
import { formatPhone, validEmail, validName, validPhone } from './brand/forms/validate'

const FIELDS = ['naam', 'email', 'telefoon'] as const

export default function HeroRequestForm({ kind, onSuccess }: { kind: 'plan' | 'lesson'; onSuccess?: (name: string) => void }) {
  const { lang } = useLang()
  const reduce = useReducedMotion()
  const nl = lang === 'nl'
  const lesson = kind === 'lesson'
  const formId = lesson ? 'academy-free-lesson' : 'home-free-plan'
  const [status, setStatus] = useState<'idle' | 'pending' | 'success'>('idle')
  const [error, setError] = useState('')
  const [attempted, setAttempted] = useState(false)
  const [valid, setValid] = useState<Record<string, boolean>>({})
  const submissionId = useRef('')
  const pending = useRef(false)
  const started = useRef(false)
  const title = lesson ? (nl ? 'Vraag je gratis les aan.' : 'Request your free lesson.') : (nl ? 'Krijg je gratis groeiplan.' : 'Get your free growth plan.')
  const success = lesson ? (nl ? 'Stef neemt contact op om je gratis les in te plannen.' : 'Stef will contact you to schedule your free lesson.') : (nl ? 'We nemen contact op om jouw bedrijf te bespreken en je gratis groeiplan uit te werken.' : 'We’ll contact you to discuss your business and prepare your free growth plan.')
  const onValidChange = useCallback((name: string, ok: boolean) => setValid((prev) => (prev[name] === ok ? prev : { ...prev, [name]: ok })), [])
  const done = FIELDS.filter((name) => valid[name]).length
  const ready = done === FIELDS.length

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending.current) return
    const data = new FormData(event.currentTarget)
    const naam = String(data.get('naam') || '').trim()
    const email = String(data.get('email') || '').trim()
    const telefoon = String(data.get('telefoon') || '').trim()
    if (!naam || !telefoon || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setAttempted(true)
      // Each field shows what to fix; the summary stays one line and focus goes to the first field to fix.
      setError(nl ? 'Vul de drie velden in om verder te gaan.' : 'Fill in the three fields to continue.')
      const first = FIELDS.find((name) => !valid[name])
      if (first) event.currentTarget.querySelector<HTMLInputElement>(`input[name="${first}"]`)?.focus()
      return
    }
    pending.current = true; setStatus('pending'); setError('')
    try {
      submissionId.current ||= crypto.randomUUID()
      const attribution = captureAttribution()
      const ga4 = await getGa4Context()
      const response = await fetch(lesson ? '/api/academy' : '/api/lead', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(25_000),
        body: JSON.stringify({ naam, email, telefoon, form_id: formId, submission_id: submissionId.current,
          company_website: data.get('company_website'), lang, attribution, ga4,
          ...(lesson ? { request_type: 'free_lesson' } : {
            doel: 'Gratis groeiplan', uitdaging: 'Aanvraag voor een gratis groeiplan; bedrijfsdoelen te bespreken tijdens de opvolging.',
          }),
        }),
      })
      const receipt = await response.json()
      if (!response.ok || receipt.ok !== true) throw new Error('capture_failed')
      trackEvent('form_submitted', { form_id: formId, ...attribution })
      if (lesson) trackAcademyConversion(receipt, submissionId.current, formId)
      else trackLeadConversion(receipt, submissionId.current, formId)
      recordAcademyPopup(true)
      setStatus('success'); onSuccess?.(naam.split(/\s+/)[0])
    } catch {
      setError(nl ? 'Versturen lukt even niet. Je gegevens staan er nog. Probeer opnieuw of mail stef@verkoop.studio.' : 'We couldn’t send your request. Your details are still here. Try again or email stef@verkoop.studio.')
      setStatus('idle')
    } finally { pending.current = false }
  }

  return (
    <section className="hero-request" aria-labelledby={`${formId}-title`}>
      <AnimatePresence mode="wait" initial={false}>
        {status === 'success' ? (
          <motion.div
            key="success"
            className="vs-form-success"
            initial={reduce ? false : { rotateX: -70, opacity: 0, y: 10 }}
            animate={{ rotateX: 0, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 160, damping: 18 }}
          >
            <Burst />
            <SuccessCheck />
            <h2 id={`${formId}-title`}>{nl ? 'Je aanvraag is binnen.' : 'Your request is in.'}</h2>
            <p role="status">{success}</p>
          </motion.div>
        ) : (
          <motion.div key="form" exit={reduce ? undefined : { rotateX: 70, opacity: 0, y: -10 }} transition={{ duration: 0.3 }} style={{ transformOrigin: '50% 100%' }}>
            <h2 id={`${formId}-title`}>{title}</h2>
            <form noValidate onSubmit={submit} aria-busy={status === 'pending'} data-clarity-mask="true" onInput={() => {
              if (!started.current) { started.current = true; trackEvent('form_started', { form_id: formId }) }
            }}>
              <FormProgress done={done} total={FIELDS.length} lang={lang} />
              <Field
                name="naam" label={nl ? 'Naam' : 'Name'} autoComplete="name" disabled={status === 'pending'}
                validate={validName} message={nl ? 'Vul je naam in.' : 'Enter your name.'}
                showError={attempted} onValidChange={onValidChange}
              />
              <Field
                name="email" type="email" inputMode="email" label={nl ? 'E-mailadres' : 'Email address'} autoComplete="email" disabled={status === 'pending'}
                validate={validEmail} message={nl ? 'Dit e-mailadres klopt niet helemaal.' : 'This email address doesn’t look quite right.'}
                showError={attempted} onValidChange={onValidChange}
              />
              <Field
                name="telefoon" type="tel" inputMode="tel" label={nl ? 'Telefoonnummer' : 'Phone number'} autoComplete="tel" maxLength={60} disabled={status === 'pending'}
                validate={validPhone} format={formatPhone} prefix="BE"
                message={nl ? 'Vul een telefoonnummer in, bijvoorbeeld 0470 12 34 56.' : 'Enter a phone number, for example 0470 12 34 56.'}
                showError={attempted} onValidChange={onValidChange}
              />
              <div className="hero-request-trap" aria-hidden="true"><label>Website<input name="company_website" tabIndex={-1} autoComplete="off" /></label></div>
              {error && <p className="hero-request-error" role="alert">{error}</p>}
              <SubmitButton
                state={status === 'pending' ? 'pending' : ready ? 'ready' : 'locked'}
                label={lesson ? (nl ? 'Vraag mijn gratis les aan' : 'Request my free lesson') : (nl ? 'Vraag mijn gratis plan aan' : 'Request my free plan')}
                pendingLabel={nl ? 'Even geduld…' : 'Sending…'}
              />
            </form>
            <p className="hero-request-note">{lesson ? (nl ? 'Stef contacteert je om je gratis les te plannen.' : 'Stef will contact you to schedule your free lesson.') : (nl ? 'We contacteren je om je gratis groeiplan uit te werken.' : 'We’ll contact you to prepare your free growth plan.')} <Link to="/privacy">{nl ? 'Privacybeleid' : 'Privacy policy'}</Link></p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
