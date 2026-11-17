
/**
 * The Sales CRM landing page for paid Meta traffic, in one place.
 *
 * Every claim here is what the CRM on `main` of verkoop-studio/verkoop-studio-crm
 * does today. The prices are the studio's decision of 12 November 2026 and match
 * `src/lib/billing.ts` in that repository. The screenshots are the real app on a
 * local database filled with its invented demo workspace, never a customer's.
 */
export const crmLanding = {
  path: '/crm',
  /** Where "Start je CRM" goes: step 1 of the CRM's own sign-up. */
  signupUrl: 'https://crm.verkoop.studio/onboarding/account',

  seo: {
    title: { nl: 'Sales CRM voor je hele team', en: 'A sales CRM for your whole team' },
    description: {
      nl: 'Het sales CRM van Verkoop Studio. Al je leads, je pipeline en je offertes op één plek. Gratis tot 500 leads, daarna één prijs voor het hele bedrijf.',
      en: 'The Verkoop Studio sales CRM. Every lead, your pipeline and your quotes in one place. Free up to 500 leads, then one price for the whole company.',
    },
  },

  cta: { nl: 'Start je CRM', en: 'Start your CRM' },

  hero: {
    title: { nl: 'Weet altijd wie je vandaag moet opvolgen.', en: 'Always know who to follow up today.' },
    lead: {
      nl: 'Het sales CRM van Verkoop Studio zet je leads, je pipeline en je offertes op één plek. Gratis tot 500 leads.',
      en: 'The Verkoop Studio sales CRM puts your leads, your pipeline and your quotes in one place. Free up to 500 leads.',
    },
    facts: {
      nl: [
        { label: 'Prijs', value: 'Gratis tot 500 leads' },
        { label: 'Per', value: 'Bedrijf, niet per gebruiker' },
        { label: 'Om te starten', value: 'Geen kaart nodig' },
      ],
      en: [
        { label: 'Price', value: 'Free up to 500 leads' },
        { label: 'Per', value: 'Company, not per user' },
        { label: 'To start', value: 'No card needed' },
      ],
    },
    figureAlt: {
      nl: 'Prospectflow in het Sales CRM: open prospects per fase, met waarde en laatste contact',
      en: 'Prospectflow in the Sales CRM: open prospects by stage, with value and last contact',
    },
  },

  /** One caption for every screen: the data is invented, the software is not. */
  demoNote: {
    nl: 'Echte schermen uit het CRM, met een verzonnen voorbeeldbedrijf.',
    en: 'Real screens from the CRM, with an invented example company.',
  },

  screens: {
    title: { nl: 'Wat je ermee doet', en: 'What you do with it' },
    items: {
      nl: [
        {
          key: 'dashboard',
          title: 'Zie wat vandaag aandacht vraagt.',
          body: 'Het dashboard toont je open pipeline, je winpercentage en de leads die al een week niets hoorden. Daaronder staat wat je vandaag kan doen: eerste contact leggen, een waarde invullen, een voorstel opvolgen.',
          alt: 'Het dashboard van het Sales CRM met open pipeline, winpercentage en opvolging',
        },
        {
          key: 'prospectflow',
          title: 'Sleep je prospects door de fases.',
          body: 'Nieuw, gecontacteerd, interesse, afspraak, voorstel. Elke kolom telt zijn waarde op. Een kaart die te lang stil ligt, kleurt rood.',
          alt: 'Prospectflow met een kolom per verkoopfase',
        },
        {
          key: 'leads',
          title: 'Al je leads in één lijst.',
          body: 'Zoek op bedrijf, contactpersoon of e-mail. Filter op eigenaar, kanaal en fase. Importeer een bestaande lijst als CSV, of voeg een lead met de hand toe.',
          alt: 'De leadlijst met fase, waarde, laatste contact en eigenaar',
        },
      ],
      en: [
        {
          key: 'dashboard',
          title: 'See what needs attention today.',
          body: 'The dashboard shows your open pipeline, your win rate and the leads nobody contacted for a week. Below it is what you can do today: make first contact, add a value, follow up a proposal.',
          alt: 'The Sales CRM dashboard with open pipeline, win rate and follow-up',
        },
        {
          key: 'prospectflow',
          title: 'Drag prospects through the stages.',
          body: 'New, contacted, engaged, meeting, closing. Every column adds up its value. A card that sits still too long turns red.',
          alt: 'Prospectflow with a column per sales stage',
        },
        {
          key: 'leads',
          title: 'Every lead in one list.',
          body: 'Search by company, contact or email. Filter by owner, channel and stage. Import an existing list as CSV, or add a lead by hand.',
          alt: 'The lead list with stage, value, last contact and owner',
        },
      ],
    },
  },

  more: {
    title: { nl: 'Ook in het CRM', en: 'Also in the CRM' },
    items: {
      nl: [
        'Offertes en contracten bij de lead waar ze bij horen',
        'Koppel je websiteformulier: aanvragen komen binnen als lead',
        'Rollen voor je team: admin, teamleider en verkoper',
        'Elke lead een eigenaar, en een filter op "van mij"',
        'Een geschiedenis per lead van elk contact',
        'In het Nederlands of het Engels',
      ],
      en: [
        'Quotes and contracts on the lead they belong to',
        'Connect your website form: enquiries arrive as leads',
        'Roles for your team: admin, team leader and sales rep',
        'Every lead has an owner, and a "mine" filter',
        'A history per lead of every contact',
        'In Dutch or English',
      ],
    },
  },

  audience: {
    title: { nl: 'Voor wie', en: 'Who it is for' },
    body: {
      nl: 'Voor bedrijven die verkopen met een gesprek en een offerte, en die vandaag hun leads bijhouden in een Excel, een mailbox of iemands hoofd. Van een zaakvoerder alleen tot een team met een paar verkopers.',
      en: 'For businesses that sell with a conversation and a quote, and today keep their leads in a spreadsheet, an inbox or someone’s head. From one owner on their own to a team with a few sales people.',
    },
    items: {
      nl: [
        'Je verliest aanvragen omdat niemand ze opvolgde',
        'Je weet niet welke offertes nog openstaan',
        'Je team werkt elk in een eigen lijst',
      ],
      en: [
        'You lose enquiries because nobody followed them up',
        'You do not know which quotes are still open',
        'Everyone on your team keeps their own list',
      ],
    },
  },

  pricing: {
    title: { nl: 'Wat het kost', en: 'What it costs' },
    body: {
      nl: 'De prijs hangt af van één getal: hoeveel leads er in je contactenbestand zitten. Eén prijs per maand voor het hele bedrijf, hoeveel mensen er ook mee werken.',
      en: 'The price depends on one number: how many leads are in your contact base. One monthly price for the whole company, however many people use it.',
    },
    tiers: {
      nl: [
        { leads: 'Tot 500 leads', price: 'Gratis', note: 'Zonder einddatum' },
        { leads: '501 tot 5.000 leads', price: '€14,99', note: 'per maand, excl. btw' },
        { leads: 'Meer dan 5.000 leads', price: '€39,99', note: 'per maand, excl. btw' },
      ],
      en: [
        { leads: 'Up to 500 leads', price: 'Free', note: 'No end date' },
        { leads: '501 to 5,000 leads', price: '€14.99', note: 'per month, excl. VAT' },
        { leads: 'More than 5,000 leads', price: '€39.99', note: 'per month, excl. VAT' },
      ],
    },
    clients: {
      nl: 'Klant van Verkoop Studio met een maandpakket? Dan zit het CRM in je pakket.',
      en: 'A Verkoop Studio client on a monthly plan? Then the CRM is part of your plan.',
    },
  },

  final: {
    title: { nl: 'Zet je eerste lead erin.', en: 'Put your first lead in.' },
    body: {
      nl: 'Je maakt een account, geeft je bedrijf een naam en nodigt je team uit. Tot 500 leads betaal je niets.',
      en: 'You create an account, name your company and invite your team. Up to 500 leads you pay nothing.',
    },
  },
} as const

export type CrmScreenKey = (typeof crmLanding.screens.items.nl)[number]['key']

/** Only these query keys travel to the CRM sign-up, so the CRM can attribute the ad click later. */
const FORWARDED = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid'] as const

export function signupHref(search = '') {
  const from = new URLSearchParams(search)
  const url = new URL(crmLanding.signupUrl)
  for (const key of FORWARDED) {
    const value = from.get(key)
    if (value) url.searchParams.set(key, value)
  }
  return url.toString()
}
