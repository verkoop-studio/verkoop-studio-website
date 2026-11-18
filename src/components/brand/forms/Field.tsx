import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useId, useState, type HTMLInputTypeAttribute, type KeyboardEvent } from 'react'
import { trackSpotlight } from '../spotlight'
import './forms.css'

/**
 * Text field with a label that lifts on focus, a border that draws itself round the
 * field, a tick once the value is good, and a plain-language message when it is not.
 * Enter moves to the next field. The input keeps its `name`, so FormData works as before.
 */
export default function Field({
  name,
  label,
  type = 'text',
  autoComplete,
  inputMode,
  maxLength = 200,
  disabled,
  validate,
  format,
  message,
  showError,
  prefix,
  onValidChange,
  onFirstFocus,
  className = '',
}: {
  name: string
  label: string
  type?: HTMLInputTypeAttribute
  autoComplete?: string
  inputMode?: 'text' | 'email' | 'tel' | 'numeric'
  maxLength?: number
  disabled?: boolean
  validate: (value: string) => boolean
  format?: (value: string) => string
  /** Shown when the value is not good: what to fix, in plain words. */
  message: string
  /** Show the message even before the visitor leaves the field (after a submit attempt). */
  showError?: boolean
  /** Small chip at the start of the field, e.g. the country code. */
  prefix?: string
  onValidChange?: (name: string, valid: boolean) => void
  onFirstFocus?: () => void
  className?: string
}) {
  const id = useId()
  const messageId = `${id}-message`
  const reduce = useReducedMotion()
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const [touched, setTouched] = useState(false)
  const [shake, setShake] = useState(0)
  const valid = validate(value)
  const invalid = !valid && (showError || (touched && value.length > 0))

  useEffect(() => { onValidChange?.(name, valid) }, [name, valid, onValidChange])
  useEffect(() => { if (showError && !valid) setShake((n) => n + 1) }, [showError, valid])

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    const form = event.currentTarget.form
    if (!form) return
    const fields = Array.from(form.querySelectorAll<HTMLInputElement>('.vs-field input:not([disabled])'))
    const next = fields[fields.indexOf(event.currentTarget) + 1]
    if (next) { event.preventDefault(); next.focus() }
  }

  return (
    <motion.div
      key={shake}
      className={`vs-field ${className}`.trim()}
      data-focus={focused || undefined}
      data-filled={value.length > 0 || undefined}
      data-valid={valid || undefined}
      data-invalid={invalid || undefined}
      data-prefix={prefix ? true : undefined}
      onPointerMove={trackSpotlight}
      animate={shake && invalid && !reduce ? { x: [0, -8, 8, -6, 6, -2, 0] } : undefined}
      transition={{ duration: 0.42 }}
    >
      <svg className="vs-field-ring" aria-hidden="true" preserveAspectRatio="none">
        <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="13" pathLength={1} />
      </svg>
      {prefix && <span className="vs-field-prefix" aria-hidden="true">{prefix}</span>}
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        autoCapitalize={type === 'email' ? 'none' : undefined}
        inputMode={inputMode}
        required
        maxLength={maxLength}
        disabled={disabled}
        placeholder=" "
        value={value}
        aria-invalid={invalid || undefined}
        aria-describedby={messageId}
        onChange={(event) => setValue(format ? format(event.target.value) : event.target.value)}
        onFocus={() => { setFocused(true); onFirstFocus?.() }}
        onBlur={() => { setFocused(false); setTouched(true) }}
        onKeyDown={onKeyDown}
      />
      <label htmlFor={id}>{label}</label>
      <svg className="vs-field-tick" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M3.5 9.5 7.5 13.5 14.5 5" pathLength={1} />
      </svg>
      <p id={messageId} className="vs-field-message" aria-live="polite">{invalid ? message : ''}</p>
    </motion.div>
  )
}
