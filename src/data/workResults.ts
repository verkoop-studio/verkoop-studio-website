import type { Lang } from './types'

/** The published case figures the result widgets may show: the same ones cases.ts and the case pages state. */
export type Figure = { value?: number; prefix?: string; suffix?: string; text?: Record<Lang, string>; label: Record<Lang, string> }
export const RESULTS: Record<string, Figure[]> = {
  pinacello: [
    { value: 120, prefix: '+', suffix: '%', label: { nl: 'online omzet', en: 'online revenue' } },
    { value: 20, label: { nl: 'verkopen uit één organische video', en: 'sales from one organic video' } },
  ],
  nooms: [{ text: { nl: 'Uitverkocht', en: 'Sold out' }, label: { nl: 'pre-sale via influencer marketing', en: 'pre-sale via influencer marketing' } }],
}
