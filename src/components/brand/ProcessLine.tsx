import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { processSteps } from '../../data/process'
import Reveal from './Reveal'

/** The five steps on one line that draws itself as the section scrolls past. */
export default function ProcessLine({ lang }: { lang: 'nl' | 'en' }) {
  const ref = useRef<HTMLOListElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 55%'] })
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])
  return (
    <div className="ag-process">
      <motion.span className="ag-process-line" aria-hidden="true" style={reduce ? undefined : { scaleX }} />
      <ol ref={ref} className="ag-process-list">
        {processSteps.map((step, i) => (
          <Reveal as="li" key={step.number} delay={i * 0.08} y={30}>
            <span className="ag-process-dot" aria-hidden="true">{step.number}</span>
            <h3 className="ag-process-title">{step.title[lang]}</h3>
            <p className="ag-process-body">{step.description[lang]}</p>
          </Reveal>
        ))}
      </ol>
    </div>
  )
}
