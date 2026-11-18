import type { CalmPattern } from '../components/home/CalmPoster'
import type { Bi } from './types'
export interface LyteCase {
  name: string
  category: string
  image: string
  logo?: string
  /** The calm poster ground used on the cases page. */
  pattern: CalmPattern
  url: string
  description: Bi<string>
}
export const lyteCases: LyteCase[] = [
  {
    name: 'EONLOG',
    category: 'Website',
    pattern: 'rows',
    url: 'https://lytestudios.be/projects/eonlog-website/',
    image: '/partners/eonlog-website.webp',
    description: {
      nl: 'Een website die de investeringsaanpak van een family office uitlegt.',
      en: 'A website explaining the investment approach of a family office.',
    },
  },
]
