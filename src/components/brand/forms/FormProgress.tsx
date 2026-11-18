import { motion } from 'motion/react'

/** "2 van 3" with a thin line that fills as fields become valid. */
export default function FormProgress({ done, total, lang }: { done: number; total: number; lang: 'nl' | 'en' }) {
  return (
    <div className="vs-form-progress" aria-hidden="true">
      <span>{done} {lang === 'nl' ? 'van' : 'of'} {total}</span>
      <i><motion.b initial={false} animate={{ scaleX: done / total }} transition={{ type: 'spring', stiffness: 180, damping: 24 }} /></i>
    </div>
  )
}
