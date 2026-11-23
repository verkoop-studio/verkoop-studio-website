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
import FormTrail from './brand/forms/FormTrail'
import PreviewCard from './brand/forms/PreviewCard'
import SubmitButton from './brand/forms/SubmitButton'
import { formatPhone, validEmail, validName, validPhone } from './brand/forms/validate'

const FIELDS = ['naam', 'email', 'telefoon'] as const
const FREE_MAIL = /^(gmail|googlemail|hotmail|outlook|live|msn|yahoo|icloud|me|telenet|skynet|proximus|scarlet|proton|protonmail|gmx|web)\./i

/** The company behind a work address, for the preview card. Free mail providers say nothing about a company. */
function companyFrom(email: string) {
  const domain = email.split('@')[1]?.trim().toLowerCase() ?? ''
  return domain.includes('.') && !FREE_MAIL.test(domain) ? domain : ''
}

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
  const [values, setValues] = useState({ naam: '', email: '', telefoon: '' })
  const setValue = (name: keyof typeof values) => (value: string) => setValues((prev) => ({ ...prev, [name]: value }))
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

  const first = values.naam.trim().split(/\s+/)[0]
  const company = companyFrom(values.email)
  const card = (
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
                icon="person" hint={nl ? 'Je voornaam is genoeg.' : 'Your first name is enough.'}
                value={values.naam} onValueChange={setValue('naam')}
                validate={validName} message={nl ? 'Vul je naam in.' : 'Enter your name.'}
                showError={attempted} onValidChange={onValidChange}
              />
              <Field
                name="email" type="email" inputMode="email" label={nl ? 'E-mailadres' : 'Email address'} autoComplete="email" disabled={status === 'pending'}
                icon="mail" hint={nl ? 'Hier sturen we je groeiplan naartoe.' : 'We send your growth plan here.'}
                value={values.email} onValueChange={setValue('email')}
                validate={validEmail} message={nl ? 'Dit e-mailadres klopt niet helemaal.' : 'This email address doesn’t look quite right.'}
                showError={attempted} onValidChange={onValidChange}
              />
              <Field
                name="telefoon" type="tel" inputMode="tel" label={nl ? 'Telefoonnummer' : 'Phone number'} autoComplete="tel" maxLength={60} disabled={status === 'pending'}
                icon="phone" hint={nl ? 'We bellen kort om je bedrijf te bespreken.' : 'We call briefly to discuss your business.'}
                value={values.telefoon} onValueChange={setValue('telefoon')}
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
  if (lesson) return card
  return (
    <div className="vs-form-duo">
      {card}
      <aside className="vs-form-side" aria-label={nl ? 'Voorbeeld van je groeiplan' : 'Preview of your growth plan'}>
        <PreviewCard
          band={nl ? 'Jouw gratis groeiplan' : 'Your free growth plan'}
          title={first ? (nl ? `Groeiplan voor ${first}` : `Growth plan for ${first}`) : ''}
          placeholder={nl ? 'Groeiplan voor jou' : 'Growth plan for you'}
          rows={[
            { label: nl ? 'Bedrijf' : 'Company', value: company },
            { label: nl ? 'E-mail' : 'Email', value: valid.email ? values.email.trim() : '' },
            { label: nl ? 'Telefoon' : 'Phone', value: valid.telefoon ? values.telefoon.trim() : '' },
          ]}
          done={done}
          total={FIELDS.length}
          ringLabel={nl ? 'Ingevulde velden' : 'Fields filled in'}
          showBack={ready && status !== 'success'}
          settled={status === 'success'}
          backTitle={nl ? 'Wat je krijgt' : 'What you get'}
          backItems={nl
            ? ['We bespreken jouw bedrijf', 'We werken je groeiplan uit', 'Je hoort binnen 24 uur van ons', 'Helemaal gratis']
            : ['We discuss your business', 'We work out your growth plan', 'You hear from us within 24 hours', 'Completely free']}
          flipLabels={nl ? { toBack: 'Wat je krijgt', toFront: 'Terug naar je plan' } : { toBack: 'What you get', toFront: 'Back to your plan' }}
        />
        <FormTrail happy={status === 'success'} thinking={status === 'pending'} />
      </aside>
    </div>
  )
}
