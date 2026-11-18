import type { ReactNode } from 'react'

/** The same message style as a field's own error: warning icon, plain words, read out by screen readers. */
export default function FieldError({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p id={id} className="vs-field-message vs-field-message--on" role="alert">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="6.25" stroke="currentColor" strokeWidth="1.5" /><path d="M7 3.8v3.6M7 9.6v.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
      {children}
    </p>
  )
}
