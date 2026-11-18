import { AnimatePresence, motion } from 'motion/react'
import { EASE } from './motion'

const PIPELINE = [
  [30, 55, 80],
  [30, 55],
  [30],
  [30, 55],
]
const BARS = [38, 62, 96, 50, 72]

/** Tiny drawn preview of the two products: a pipeline with one lead moving up, or the ad that sells. */
export default function SoftwarePreview({ kind, reduce }: { kind: 'crm' | 'performance'; reduce: boolean }) {
  const soft = { fill: 'var(--vs-ink)', opacity: 0.16 }
  const card = { fill: 'var(--vs-card)', stroke: 'var(--vs-line)' }
  return (
    <div aria-hidden="true" className="vs-sw-preview">
      <AnimatePresence mode="wait" initial={false}>
        <motion.svg
          key={kind}
          viewBox="0 0 220 150"
          width="100%"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.18 }}
        >
          {kind === 'crm' ? (
            <>
              {PIPELINE.map((cards, column) => (
                <g key={column} transform={`translate(${14 + column * 50} 0)`}>
                  <rect y={16} width={22} height={5} rx={2.5} style={soft} />
                  {cards.map((y) => (
                    <g key={y} transform={`translate(0 ${y})`}>
                      <rect width={42} height={20} rx={5} style={card} />
                      <rect x={7} y={8.5} width={20} height={3} rx={1.5} style={soft} />
                    </g>
                  ))}
                </g>
              ))}
              <motion.g
                initial={reduce ? false : { x: -50, y: 25 }}
                animate={{ x: 0, y: 0 }}
                transition={{ type: 'spring', bounce: 0.25, duration: 0.7, delay: 0.35 }}
              >
                <rect x={114} y={55} width={42} height={20} rx={5} style={{ fill: 'var(--vs-blue)' }} />
                <rect x={121} y={63.5} width={20} height={3} rx={1.5} fill="#fff" opacity={0.85} />
              </motion.g>
            </>
          ) : (
            <>
              {BARS.map((height, i) => (
                <motion.rect
                  key={i}
                  x={22 + i * 38}
                  y={126 - height}
                  width={24}
                  height={height}
                  rx={5}
                  style={{ ...(i === 2 ? { fill: 'var(--vs-blue)' } : card), originY: 1 }}
                  initial={reduce ? false : { scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.5, delay: 0.05 + i * 0.05, ease: EASE }}
                />
              ))}
              <rect x={14} y={128} width={192} height={2} rx={1} style={soft} />
            </>
          )}
        </motion.svg>
      </AnimatePresence>
    </div>
  )
}
