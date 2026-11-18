import type { Bi, CaseSlug } from './types'

export type CaseScreen = 'ad' | 'page' | 'route'

export interface CaseStat {
  /** A rolling figure, or `text` for a word such as "Doorlopend". */
  value?: number
  prefix?: string
  suffix?: string
  text?: Bi<string>
  label: Bi<string>
  icon: 'spark' | 'play' | 'pulse'
}

export interface CaseContent {
  seoTitle: Bi<string>
  headline: Bi<[string, string]>
  lead: Bi<string>
  stats: CaseStat[]
  challenge: { title: Bi<string>; body: Bi<string> }
  windowLabel: Bi<string>
  stepsTitle: Bi<string>
  steps: { title: Bi<string>; body: Bi<string>; tags: Bi<string[]>; link: string; screen: CaseScreen }[]
  proof?: { lead: Bi<string>; figure: Bi<string>; body: Bi<string>; note: Bi<string> }
  evidence: Bi<string>
  closing: { title: Bi<string>; body: Bi<string>; cta: Bi<string> }
}

/** Page copy for the rebuilt case pages. Figures are the published ones in cases.ts; nothing else is claimed. */
export const caseContent: Partial<Record<CaseSlug, CaseContent>> = {
  pinacello: {
    seoTitle: { nl: 'Pinacello case: +120% online omzet', en: 'Pinacello case: +120% online revenue' },
    headline: { nl: ['Van aandacht naar', 'aankoop.'], en: ['From attention to', 'purchase.'] },
    lead: {
      nl: 'Campagnes, content en een webshop die samenwerken. Voor Pinacello leverde dat +120% online omzet op.',
      en: 'Campaigns, content and a webshop working together. For Pinacello that meant +120% online revenue.',
    },
    stats: [
      { value: 120, prefix: '+', suffix: '%', label: { nl: 'online omzet', en: 'online revenue' }, icon: 'spark' },
      { value: 20, label: { nl: 'verkopen uit één organische video', en: 'sales from one organic video' }, icon: 'play' },
      { text: { nl: 'Doorlopend', en: 'Ongoing' }, label: { nl: 'samenwerking', en: 'collaboration' }, icon: 'pulse' },
    ],
    challenge: {
      title: { nl: 'Aandacht is pas het begin.', en: 'Attention is only the beginning.' },
      body: {
        nl: 'Pinacello had aandacht voor het merk. Die moest omzet worden. Wie via een campagne binnenkomt, heeft een korte, duidelijke weg naar de aankoop nodig, met het juiste aanbod op het juiste moment.',
        en: 'Pinacello had attention for the brand. That had to become revenue. People who arrive from a campaign need a short, clear path to buying, with the right offer at the right moment.',
      },
    },
    windowLabel: { nl: 'campagne-landingspagina', en: 'campaign landing page' },
    stepsTitle: { nl: 'Drie schakels. Eén klantreis.', en: 'Three links. One customer journey.' },
    steps: [
      {
        title: { nl: 'Aandacht die bij het product past', en: 'Attention that fits the product' },
        body: { nl: 'Meta Ads en content brengen het product bij mogelijke kopers.', en: 'Meta Ads and content put the product in front of likely buyers.' },
        tags: { nl: ['Meta Ads', 'Organische content'], en: ['Meta Ads', 'Organic content'] },
        link: '/meta-ads', screen: 'ad',
      },
      {
        title: { nl: 'Een pagina die de keuze makkelijk maakt', en: 'A page that makes choosing easy' },
        body: { nl: 'Aanbod, productinfo en de bestelknop op één pagina, met bundels erbij.', en: 'Offer, product details and the order button on one page, with bundles.' },
        tags: { nl: ['Landingspagina’s', 'Aanbod en bundels'], en: ['Landing pages', 'Offers and bundles'] },
        link: '/landing-pages', screen: 'page',
      },
      {
        title: { nl: 'De weg naar de aankoop afmaken', en: 'Finishing the path to purchase' },
        body: { nl: 'Retargeting haalt wie twijfelde terug naar de kassa.', en: 'Retargeting brings people who hesitated back to the checkout.' },
        tags: { nl: ['Retargeting', 'Ecommerce'], en: ['Retargeting', 'Ecommerce'] },
        link: '/ecommerce-conversie', screen: 'route',
      },
    ],
    proof: {
      lead: { nl: 'Eén organische video.', en: 'One organic video.' },
      figure: { nl: '20 verkopen.', en: '20 sales.' },
      body: {
        nl: 'Naast de campagnes werkt ook gewone content. Deze video over het product leverde twintig verkopen op, zonder advertentiebudget.',
        en: 'Ordinary content works alongside the campaigns. This video about the product brought in twenty sales, without ad budget.',
      },
      note: { nl: 'dit leverde 20 verkopen op :)', en: 'this brought in 20 sales :)' },
    },
    evidence: {
      nl: 'Gepubliceerd resultaat: +120% online omzet en 20 verkopen uit één organische video. Meetperiode, vergelijkingsbasis en attributie zijn nog niet gepubliceerd.',
      en: 'Published result: +120% online revenue and 20 sales from one organic video. Reporting period, baseline and attribution are not yet published.',
    },
    closing: {
      title: { nl: 'Waar laat jouw webshop kansen liggen?', en: 'Where could your webshop do more?' },
      body: { nl: 'We bekijken je aanbod, campagnes en bestelroute, en zeggen waar de grootste kans zit.', en: 'We look at your offer, campaigns and ordering route, and tell you where the biggest opportunity is.' },
      cta: { nl: 'Bespreek je webshop', en: 'Discuss your webshop' },
    },
  },
}
