import type { Bi, ServiceSlug } from './types'

/** The sample screens a service page can show; each is drawn in components/service/ServiceScreens. */
export type ServiceScreen =
  | 'campaigns' | 'creatives' | 'report'
  | 'search' | 'keywords' | 'tracking' | 'page' | 'sources'
  | 'funnel' | 'followup' | 'dashboard'
  | 'product' | 'checkout' | 'cart'
  | 'tasks' | 'automation' | 'review'
  | 'offer' | 'channels' | 'channelResults'
  | 'flows' | 'mail' | 'mailStats'
  | 'audit'
  | 'sitemap' | 'devices'
  | 'users' | 'roadmap' | 'app'

export interface ServiceStep { title: Bi<string>; body: Bi<string>; screen: ServiceScreen }

export interface ServiceStory {
  /** The live object in the hero, and the small notice that pops up beside it. */
  hero: ServiceScreen
  toast: Bi<[string, string]>
  steps: ServiceStep[]
}

const step = (screen: ServiceScreen, nl: [string, string], en: [string, string]): ServiceStep => ({ screen, title: { nl: nl[0], en: en[0] }, body: { nl: nl[1], en: en[1] } })

/** Three steps per service, written from the process in services.ts. Websites keep their own hero. */
export const serviceStories: Record<ServiceSlug, ServiceStory> = {
  'meta-ads': {
    hero: 'creatives',
    toast: { nl: ['Nieuwe verkoop', 'via Instagram'], en: ['New sale', 'from Instagram'] },
    steps: [
      step('campaigns', ['Doelgroep en structuur', 'We bouwen je campagnes rond één doel: aanvragen, boekingen of verkopen.'], ['Audience and structure', 'We build your campaigns around one goal: enquiries, bookings or sales.']),
      step('creatives', ['Creatives per fase', 'Wie je nog niet kent, krijgt een ander bericht dan wie al twijfelt.'], ['Creatives per stage', 'People who don’t know you yet get a different message from people who are close to buying.']),
      step('report', ['Meten op verkopen', 'Elke maand zie je wat een euro advertentie opbracht. Niet alleen kliks.'], ['Measured on sales', 'Every month you see what a euro of ads brought in. Not just clicks.']),
    ],
  },
  'google-ads': {
    hero: 'search',
    toast: { nl: ['Nieuwe aanvraag', 'via Google'], en: ['New enquiry', 'from Google'] },
    steps: [
      step('keywords', ['Gebouwd rond zoekintentie', 'Merk, niet-merk en lokaal zoeken krijgen elk hun eigen campagne.'], ['Built around search intent', 'Brand, non-brand and local searches each get their own campaign.']),
      step('tracking', ['Elke actie gemeten', 'Conversiemeting staat goed, zodat je ziet welke zoekterm klanten oplevert.'], ['Every action measured', 'Conversion tracking is set up properly, so you see which search term brings customers.']),
      step('page', ['Een pagina die past', 'De landingspagina beantwoordt de zoekvraag. Remarketing haalt twijfelaars terug.'], ['A page that fits', 'The landing page answers the search. Remarketing brings back people who hesitated.']),
    ],
  },
  'landing-pages': {
    hero: 'page',
    toast: { nl: ['Formulier verstuurd', 'via Meta'], en: ['Form sent', 'from Meta'] },
    steps: [
      step('sources', ['Eerst de campagne', 'We kijken naar doelgroep, doel en hoe de bezoeker binnenkomt, voor er copy is.'], ['The campaign first', 'We look at the audience, the goal and how visitors arrive, before any copy is written.']),
      step('page', ['Eén boodschap, één actie', 'Geen concurrerende keuzes: de pagina leidt naar één knop.'], ['One message, one action', 'No competing choices: the page leads to one button.']),
      step('tracking', ['Gedrag wordt meetbaar', 'We meten wat bezoekers doen op de pagina, niet alleen het bezoek.'], ['Behaviour becomes measurable', 'We measure what visitors do on the page, not just the visit.']),
    ],
  },
  funnels: {
    hero: 'funnel',
    toast: { nl: ['Nieuwe lead', 'in je CRM'], en: ['New lead', 'in your CRM'] },
    steps: [
      step('funnel', ['De hele klantreis in kaart', 'Van eerste klik tot klant en herhaalaankoop. Elke stap krijgt een doel.'], ['The whole journey mapped', 'From first click to customer and repeat purchase. Every step gets a purpose.']),
      step('followup', ['Opvolging die aansluit', 'E-mail, CRM of AI-automatisering pakt elke lead meteen op.'], ['Follow-up that connects', 'Email, CRM or AI automation picks up every lead right away.']),
      step('dashboard', ['Elke stap meetbaar', 'Je ziet waar mensen doorgaan en waar ze afhaken.'], ['Every step measurable', 'You see where people continue and where they drop off.']),
    ],
  },
  'ecommerce-conversie': {
    hero: 'checkout',
    toast: { nl: ['Bestelling geplaatst', 'na een herinnering'], en: ['Order placed', 'after a reminder'] },
    steps: [
      step('product', ['Een productpagina die overtuigt', 'Aanbod en bundels sluiten aan op de koopbeslissing.'], ['A product page that convinces', 'Offers and bundles match the buying decision.']),
      step('checkout', ['Afrekenen zonder wrijving', 'We halen de drempels uit de checkout en zetten upsells op de juiste plek.'], ['Checkout without friction', 'We remove the hurdles from checkout and put upsells in the right place.']),
      step('cart', ['Verlaten mandjes terughalen', 'E-mails vangen verlaten mandjes op en brengen klanten terug.'], ['Bringing back abandoned carts', 'Emails catch abandoned carts and bring customers back.']),
    ],
  },
  'ai-automatiseringen': {
    hero: 'automation',
    toast: { nl: ['Samenvatting klaar', 'ter goedkeuring'], en: ['Summary ready', 'for approval'] },
    steps: [
      step('tasks', ['Waar gaat je tijd naartoe?', 'We zoeken de terugkerende taken die het meeste tijd kosten.'], ['Where does your time go?', 'We find the recurring tasks that take the most time.']),
      step('automation', ['Rond je eigen tools', 'Workflows werken met wat je al hebt: CRM, e-mail, formulieren, agenda.'], ['Around your own tools', 'Workflows use what you already have: CRM, email, forms, calendar.']),
      step('review', ['Een mens beslist', 'AI kwalificeert, vat samen en bereidt voor. Jij keurt goed.'], ['A person decides', 'AI qualifies, summarises and prepares. You approve.']),
    ],
  },
  distributie: {
    hero: 'channels',
    toast: { nl: ['Nieuwe aanvraag', 'via LinkedIn'], en: ['New enquiry', 'from LinkedIn'] },
    steps: [
      step('offer', ['Een scherp aanbod', 'Je aanbod draait rond één duidelijke actie.'], ['A sharp offer', 'Your offer revolves around one clear action.']),
      step('channels', ['De juiste mix van kanalen', 'B2B-outreach, advertenties, offline en SEO/GEO, als trackbare campagne.'], ['The right mix of channels', 'B2B outreach, ads, offline and SEO/GEO, as one trackable campaign.']),
      step('channelResults', ['Meten wat werkt', 'Per kanaal zie je wat het oplevert.'], ['Measuring what works', 'For each channel you see what it brings in.']),
    ],
  },
  'email-marketing': {
    hero: 'mail',
    toast: { nl: ['Nieuwe inschrijving', 'welkomstmail onderweg'], en: ['New subscriber', 'welcome email on its way'] },
    steps: [
      step('flows', ['De juiste flows eerst', 'Welkom, opvolging, verlaten mandje of herhaalaankoop: we kiezen wat eerst telt.'], ['The right flows first', 'Welcome, follow-up, abandoned cart or repeat purchase: we pick what matters first.']),
      step('mail', ['Eén boodschap per mail', 'Herkenbare e-mails met één duidelijke volgende stap, getest voor ze live gaan.'], ['One message per email', 'Recognisable emails with one clear next step, tested before they go live.']),
      step('mailStats', ['Verbeteren op cijfers', 'Kliks, conversies en uitschrijvingen sturen de volgende versie.'], ['Improving on the numbers', 'Clicks, conversions and unsubscribes shape the next version.']),
    ],
  },
  'data-analytics': {
    hero: 'dashboard',
    toast: { nl: ['Rapport klaar', 'voor deze maand'], en: ['Report ready', 'for this month'] },
    steps: [
      step('tracking', ['Bepalen wat telt', 'Aanvragen, boekingen, aankopen en goede leads: we spreken af wat waardevol is.'], ['Deciding what counts', 'Enquiries, bookings, purchases and good leads: we agree what is valuable.']),
      step('audit', ['Meetfouten eruit', 'We controleren GA4, tags en conversies op fouten en dubbele tellingen.'], ['Measurement errors out', 'We check GA4, tags and conversions for errors and double counts.']),
      step('dashboard', ['Rapportage rond je doelen', 'Eén overzicht, met prioriteiten voor campagnes en conversie.'], ['Reporting around your goals', 'One overview, with priorities for campaigns and conversion.']),
    ],
  },
  websites: {
    hero: 'devices',
    toast: { nl: ['Site opgeleverd', 'getest op elk scherm'], en: ['Site handed over', 'tested on every screen'] },
    steps: [
      step('sitemap', ['Eén actie die telt', 'We bepalen wie de site bezoekt en welke ene actie telt.'], ['One action that counts', 'We decide who visits and which single action matters.']),
      step('page', ['Ontwerp rond die actie', 'Structuur en ontwerp leiden naar die ene knop.'], ['Design around that action', 'Structure and design lead to that one button.']),
      step('devices', ['Gebouwd en getest', 'Wij bouwen en testen de site op elk scherm, en leveren ze op.'], ['Built and tested', 'We build and test the site on every screen, and hand it over.']),
    ],
  },
  software: {
    hero: 'app',
    toast: { nl: ['Nieuwe versie', 'klaar om te testen'], en: ['New version', 'ready to test'] },
    steps: [
      step('users', ['Gebruikers en processen', 'We brengen in kaart wie het gebruikt, hoe ze werken en wat technisch nodig is.'], ['Users and workflows', 'We map who uses it, how they work and what is technically needed.']),
      step('roadmap', ['Een eerste versie', 'We bepalen wat in versie één zit en werken de ervaring uit.'], ['A first version', 'We decide what goes in version one and design the experience.']),
      step('app', ['Ontwikkeld en gelanceerd', 'Wij ontwikkelen de applicatie en stemmen ze af op de lancering.'], ['Built and launched', 'We develop the application and align it with the launch.']),
    ],
  },
}
