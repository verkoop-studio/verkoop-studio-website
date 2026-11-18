import { useEffect, useState } from 'react'

/**
 * Progress through a short form as a trail: dots joined by one line. Done steps are ink,
 * the current one is ringed, and on arrival the line fills from the previous step.
 */
export default function StepRail({ steps, current, label, stepOf }: { steps: string[]; current: number; label: string; stepOf: string }) {
  const [shown, setShown] = useState(Math.max(0, current - 1))
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setShown(current))
    return () => window.cancelAnimationFrame(id)
  }, [current])
  const share = steps.length > 1 ? shown / (steps.length - 1) : 0
  return (
    <nav className="vs-rail" aria-label={label}>
      <p className="vs-rail-sr" aria-live="polite">{stepOf}</p>
      <ol>
        <span className="vs-rail-line" aria-hidden="true" />
        <span className="vs-rail-fill" aria-hidden="true" style={{ transform: `scaleX(${share})` }} />
        {steps.map((step, i) => (
          <li key={step} aria-current={i === current ? 'step' : undefined} data-state={i < shown ? 'done' : i === shown ? 'now' : 'next'}>
            <span className="vs-rail-dot" aria-hidden="true" />
            <span className="vs-rail-label">{step}</span>
          </li>
        ))}
      </ol>
    </nav>
  )
}
