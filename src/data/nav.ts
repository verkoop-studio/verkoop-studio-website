import { getCase } from './cases'
import { getService } from './services'
import type { Bi, CaseSlug, ServiceSlug } from './types'

export interface NavItem {
  label: Bi<string>
  href: string
}

const academy: NavItem = { label: { nl: 'Academy', en: 'Academy' }, href: '/academy' }

export const navItems: NavItem[] = [
  { label: { nl: 'Home', en: 'Home' }, href: '/' },
  { label: { nl: 'Resultaten', en: 'Results' }, href: '/#resultaten' },
  { label: { nl: 'Diensten', en: 'Services' }, href: '/#expertise' },
  { label: { nl: 'Cases', en: 'Cases' }, href: '/cases' },
  { label: { nl: 'Agency', en: 'Agency' }, href: '/agency' },
  { label: { nl: 'Contact', en: 'Contact' }, href: '/contact' },
]

/** Academy stays reachable from the footer. It is not a top-bar item. */
const agencyIndex = navItems.findIndex((item) => item.href === '/agency')
export const footerNavItems: NavItem[] = [
  ...navItems.slice(0, agencyIndex),
  academy,
  ...navItems.slice(agencyIndex),
]

export const persistentCta: Bi<string> = { nl: 'Bespreek je project', en: 'Discuss your project' }
export const persistentCtaHref = '/contact'

/* ---------- Header menu: tabs that open a panel of grouped links ---------- */

export interface MenuLink {
  title: Bi<string>
  /** One plain line under the title. */
  note: Bi<string>
  href: string
}

export interface MenuGroup {
  label: Bi<string>
  links: MenuLink[]
}

export interface MenuTab {
  id: string
  label: Bi<string>
  /** Where a plain tab goes. For a tab with groups: the page the old flat link pointed at. */
  href: string
  groups?: MenuGroup[]
  /** Link along the bottom of the panel, to the overview behind the tab. */
  more?: Bi<string>
  /** Panel width on desktop, in px. */
  width?: number
  /** Small coded preview on the right side of the panel. */
  visual?: 'software'
}

/** Titles and routes come from the service and case data, so a renamed or removed page breaks the build here. */
const service = (slug: ServiceSlug, note: Bi<string>): MenuLink => ({ title: getService(slug)!.title, note, href: `/${slug}` })
const caseStudy = (slug: CaseSlug, note: Bi<string>): MenuLink => {
  const name = getCase(slug)!.name
  return { title: { nl: name, en: name }, note, href: `/cases/${slug}` }
}

export const menuTabs: MenuTab[] = [
  {
    id: 'cases',
    label: { nl: 'Cases', en: 'Work' },
    href: '/cases',
    width: 640,
    more: { nl: 'Alle cases', en: 'All cases' },
    groups: [
      {
        label: { nl: 'Resultaten', en: 'Results' },
        links: [
          caseStudy('pinacello', { nl: '+120% online omzet voor een webshop', en: '+120% online revenue for an online store' }),
          caseStudy('e-kart', { nl: 'Indoor karting voor rijders en bedrijven', en: 'Indoor karting for drivers and companies' }),
          caseStudy('nooms', { nl: 'Voorverkoop uitverkocht via influencers', en: 'Pre-sale sold out through influencers' }),
          caseStudy('healthfactor', { nl: 'Persoonlijke videoadvertentie voor een gym', en: 'A personal video ad for a gym' }),
        ],
      },
    ],
  },
  {
    id: 'diensten',
    label: { nl: 'Diensten', en: 'Services' },
    href: '/#expertise',
    width: 900,
    more: { nl: 'Alle diensten op een rij', en: 'All services in one list' },
    groups: [
      {
        label: { nl: 'Klanten aantrekken', en: 'Attract customers' },
        links: [
          service('meta-ads', { nl: 'Advertenties op Facebook en Instagram', en: 'Ads on Facebook and Instagram' }),
          service('google-ads', { nl: 'Gevonden worden door wie nu zoekt', en: 'Be found by people searching now' }),
          service('email-marketing', { nl: 'Mails die klanten laten terugkomen', en: 'Emails that bring customers back' }),
        ],
      },
      {
        label: { nl: 'Laten kopen', en: 'Get them to buy' },
        links: [
          service('landing-pages', { nl: 'Eén pagina met één duidelijk doel', en: 'One page with one clear goal' }),
          service('funnels', { nl: 'De weg van eerste klik tot klant', en: 'The path from first click to customer' }),
          service('websites', { nl: 'Een site of webshop die verkoopt', en: 'A site or online store that sells' }),
          service('ecommerce-conversie', { nl: 'Meer bezoekers die ook afrekenen', en: 'More visitors who also check out' }),
        ],
      },
      {
        label: { nl: 'Slimmer werken', en: 'Work smarter' },
        links: [
          service('data-analytics', { nl: 'Zie waar je klanten vandaan komen', en: 'See where your customers come from' }),
          service('ai-automatiseringen', { nl: 'Laat terugkerend werk vanzelf lopen', en: 'Let repeat work run by itself' }),
          service('software', { nl: 'Een platform of app op maat', en: 'A custom platform or app' }),
          service('distributie', { nl: 'Een sterk aanbod op de juiste plekken', en: 'A strong offer in the right places' }),
        ],
      },
    ],
  },
  {
    id: 'software',
    label: { nl: 'Software', en: 'Software' },
    href: '/#software',
    width: 600,
    visual: 'software',
    more: { nl: 'Onze software in het kort', en: 'Our software at a glance' },
    groups: [
      {
        label: { nl: 'Onze eigen software', en: 'Our own software' },
        links: [
          { title: { nl: 'Sales CRM', en: 'Sales CRM' }, note: { nl: 'Gratis tot 500 leads', en: 'Free up to 500 leads' }, href: '/crm' },
          { title: { nl: 'Performance', en: 'Performance' }, note: { nl: 'Zie welke advertentie verkoopt', en: 'See which ad sells' }, href: '/performance' },
        ],
      },
    ],
  },
  { id: 'prijzen', label: { nl: 'Prijzen', en: 'Pricing' }, href: '/#groeipakketten' },
  {
    id: 'agency',
    label: { nl: 'Agency', en: 'Agency' },
    href: '/agency',
    width: 640,
    groups: [
      {
        label: { nl: 'Over Verkoop Studio', en: 'About Verkoop Studio' },
        links: [
          { title: { nl: 'Over ons', en: 'About us' }, note: { nl: 'De mensen achter Verkoop Studio', en: 'The people behind Verkoop Studio' }, href: '/agency' },
          { title: academy.label, note: { nl: '1-op-1 lessen in Meta Ads en Google Ads', en: '1-to-1 lessons in Meta Ads and Google Ads' }, href: academy.href },
          { title: { nl: 'Blog', en: 'Blog' }, note: { nl: 'Praktische artikelen over marketing', en: 'Practical articles on marketing' }, href: '/blog' },
          { title: { nl: 'Groeianalyse', en: 'Growth analysis' }, note: { nl: 'Zie waar je onderweg klanten verliest', en: 'See where you lose customers on the way' }, href: '/funnel-audit' },
        ],
      },
    ],
  },
  { id: 'contact', label: { nl: 'Contact', en: 'Contact' }, href: '/contact' },
]
