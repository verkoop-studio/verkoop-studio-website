import type { Lang } from '../data/types'

/**
 * The languages the site is written in, in the order the picker lists them.
 * Each one carries its own name and a greeting, both in that language.
 * A new language is one more row here, once its copy exists.
 */
export const LANGUAGES: { code: Lang; name: string; hello: string }[] = [
  { code: 'nl', name: 'Nederlands', hello: 'Hallo' },
  { code: 'en', name: 'English', hello: 'Hello' },
]
