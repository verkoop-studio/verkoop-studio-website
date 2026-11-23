import type { Lang } from './types'

/* The sample people and deals on the site's sample screens. Every name and figure is invented; each screen says "Voorbeeld". */

/** Each sample person is a small character: shape and colour. */
export const PEOPLE: Record<string, [string, string]> = { SP: ['mug', '#ff9fd0'], TD: ['controller', '#7d93ff'], LV: ['sprout', '#c9f26a'], JM: ['lightbulb', '#ffd23f'], EC: ['chat', '#ff7a59'] }

export const SOURCE: Record<string, string> = { Meta: '#1877f2', Facebook: '#1877f2', Google: '#ea4335', Website: '#111110', TikTok: '#111110' }

/** The sample deals: initials, name, value, source, when to call. */
export type Deal = [string, string, string, string, string]
export const DEALS: Record<Lang, Deal[]> = {
  nl: [['SP', 'Sarah Peeters', '€ 2.400', 'Facebook', 'vandaag'], ['TD', 'Tom De Wit', '€ 1.800', 'Google', 'morgen'], ['LV', 'Lien Vos', '€ 3.100', 'Website', 'do'], ['JM', 'Jonas Maes', '€ 4.500', 'Facebook', 'vr'], ['EC', 'Eva Claes', '€ 5.100', 'Google', 'ma']],
  en: [['SP', 'Sarah Peeters', '€ 2,400', 'Facebook', 'today'], ['TD', 'Tom De Wit', '€ 1,800', 'Google', 'tomorrow'], ['LV', 'Lien Vos', '€ 3,100', 'Website', 'Thu'], ['JM', 'Jonas Maes', '€ 4,500', 'Facebook', 'Fri'], ['EC', 'Eva Claes', '€ 5,100', 'Google', 'Mon']],
}

/** The company behind each sample lead, as in the teardown's lead table. */
export const COMPANY: Record<Lang, Record<string, string>> = {
  nl: { SP: 'Bakkerij', TD: 'Garage', LV: 'Tuinen', JM: 'Bouw', EC: 'Kliniek' },
  en: { SP: 'Bakery', TD: 'Garage', LV: 'Gardens', JM: 'Building', EC: 'Clinic' },
}
