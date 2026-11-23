import type { CSSProperties } from 'react'
import type { HeadlinePart } from '../components/brand/SplitHeadline'

/**
 * The longest run a headline cannot break: a marked phrase stays on one line, other parts break between words.
 * Set as `--h1-n` so the CSS can size the headline to fit its column.
 */
export function headlineFit(parts: HeadlinePart[]): CSSProperties {
  const n = Math.max(...parts.flatMap((p) => (p.tone === 'accent' ? [p.text.length] : p.text.split(/\s+/).map((w) => w.length))))
  return { '--h1-n': n } as CSSProperties
}
