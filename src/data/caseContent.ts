import type { Bi, CaseSlug } from './types'

export type CaseScreen = 'ad' | 'page' | 'route' | 'booking' | 'group' | 'goal' | 'creator' | 'presale' | 'repeat' | 'subtitle' | 'tiles' | 'metrics'

export interface CaseStat {
  /** A rolling figure, or `text` for a word such as "Doorlopend". */
  value?: number
  prefix?: string
  suffix?: string
  text?: Bi<string>
  label: Bi<string>
  icon: 'spark' | 'play' | 'pulse' | 'people' | 'pin' | 'check'
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
  /** `video` plays the case video in a phone; `stamp` shows the result as a stamp. */
  proof?: { media?: 'video' | 'stamp'; lead: Bi<string>; figure: Bi<string>; body: Bi<string>; note: Bi<string> }
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
  'e-kart': {
    seoTitle: { nl: 'E-Kart case: indoor karting in Gent', en: 'E-Kart case: indoor karting in Ghent' },
    headline: { nl: ['Van zin in een race', 'naar een boeking.'], en: ['From wanting to race', 'to a booking.'] },
    lead: {
      nl: 'Indoor karting in Gent, met twee soorten klanten: wie zelf wil rijden en wie een groep organiseert. Wij werken aan beide routes.',
      en: 'Indoor karting in Ghent, with two kinds of customer: people who want to race and people organising a group. We work on both routes.',
    },
    stats: [
      { text: { nl: 'B2C + B2B', en: 'B2C + B2B' }, label: { nl: 'twee soorten klanten', en: 'two kinds of customer' }, icon: 'people' },
      { text: { nl: 'Gent', en: 'Ghent' }, label: { nl: 'indoor karting', en: 'indoor karting' }, icon: 'pin' },
      { text: { nl: 'Doorlopend', en: 'Ongoing' }, label: { nl: 'samenwerking', en: 'collaboration' }, icon: 'pulse' },
    ],
    challenge: {
      title: { nl: 'Twee klanten, twee routes.', en: 'Two customers, two routes.' },
      body: {
        nl: 'Een rijder wil snel weten wanneer hij kan rijden. Een organisator wil zeker zijn dat zijn groep een goede dag heeft. Allebei moeten ze makkelijk tot een boeking komen.',
        en: 'A driver wants to know quickly when they can race. An organiser wants to be sure the group has a good day. Both need an easy way to a booking.',
      },
    },
    windowLabel: { nl: 'website', en: 'website' },
    stepsTitle: { nl: 'Twee routes. Eén doel.', en: 'Two routes. One goal.' },
    steps: [
      {
        title: { nl: 'Rijders snel naar een tijdslot', en: 'Drivers straight to a time slot' },
        body: { nl: 'Wie wil rijden, ziet meteen wanneer en hoe hij boekt.', en: 'People who want to race see right away when and how to book.' },
        tags: { nl: ['B2C', 'Boekingen'], en: ['B2C', 'Bookings'] },
        link: '/landing-pages', screen: 'booking',
      },
      {
        title: { nl: 'Groepen de juiste antwoorden geven', en: 'Giving groups the right answers' },
        body: { nl: 'Organisatoren krijgen wat ze moeten weten voor een groepsactiviteit.', en: 'Organisers get what they need to know for a group activity.' },
        tags: { nl: ['B2B', 'Groepsaanvragen'], en: ['B2B', 'Group requests'] },
        link: '/funnels', screen: 'group',
      },
      {
        title: { nl: 'Gevolgd op klanten en boekingen', en: 'Tracked on customers and bookings' },
        body: { nl: 'Het doel is meer boekingen, apart gevolgd voor rijders en groepen.', en: 'The goal is more bookings, tracked separately for drivers and groups.' },
        tags: { nl: ['Meting', 'Doel'], en: ['Measurement', 'Goal'] },
        link: '/data-analytics', screen: 'goal',
      },
    ],
    evidence: {
      nl: 'Het doel is meer klanten en boekingen. Voor deze case zijn nog geen gemeten resultaten gepubliceerd.',
      en: 'The goal is more customers and bookings. No measured results have been published for this case yet.',
    },
    closing: {
      title: { nl: 'Wil jij meer boekingen?', en: 'Want more bookings?' },
      body: { nl: 'We bekijken hoe klanten nu bij je boeken en waar ze afhaken.', en: 'We look at how customers book with you now and where they drop off.' },
      cta: { nl: 'Bespreek je boekingen', en: 'Discuss your bookings' },
    },
  },
  nooms: {
    seoTitle: { nl: 'Nooms case: pre-sale uitverkocht', en: 'Nooms case: pre-sale sold out' },
    headline: { nl: ['Een pre-sale die', 'uitverkocht raakte.'], en: ['A pre-sale that', 'sold out.'] },
    lead: {
      nl: 'Nooms is het eigen supplementenmerk van Stef. De pre-sale via influencers raakte volledig uitverkocht. Nu bouwen we de route naar herhaalaankopen.',
      en: 'Nooms is Stef’s own supplements brand. The pre-sale through influencers sold out completely. Now we are building the route to repeat purchases.',
    },
    stats: [
      { text: { nl: 'Uitverkocht', en: 'Sold out' }, label: { nl: 'pre-sale via influencers', en: 'pre-sale through influencers' }, icon: 'check' },
      { text: { nl: 'Eigen merk', en: 'Own brand' }, label: { nl: 'door Stef opgebouwd', en: 'built by Stef' }, icon: 'people' },
      { text: { nl: 'Doorlopend', en: 'Ongoing' }, label: { nl: 'naar herhaalaankopen', en: 'towards repeat purchases' }, icon: 'pulse' },
    ],
    challenge: {
      title: { nl: 'Van eerste koop naar vaste klant.', en: 'From first order to regular customer.' },
      body: {
        nl: 'Ontdekking via influencers, de eerste aankoop, herhaalaankopen en later winkels en bedrijven. Dat moet als één route werken.',
        en: 'Discovery through influencers, the first purchase, repeat purchases and later shops and businesses. It all has to work as one route.',
      },
    },
    windowLabel: { nl: 'webshop', en: 'webshop' },
    stepsTitle: { nl: 'Drie stappen. Eén merk.', en: 'Three steps. One brand.' },
    steps: [
      {
        title: { nl: 'Ontdekt via influencers', en: 'Discovered through influencers' },
        body: { nl: 'Creators brengen het product bij hun volgers: het begin van de funnel.', en: 'Creators bring the product to their followers: the start of the funnel.' },
        tags: { nl: ['Influencers', 'Funnel'], en: ['Influencers', 'Funnel'] },
        link: '/funnels', screen: 'creator',
      },
      {
        title: { nl: 'Een pre-sale met een helder aanbod', en: 'A pre-sale with a clear offer' },
        body: { nl: 'Landingspagina en pre-sale flow maken meteen bestellen makkelijk.', en: 'The landing page and pre-sale flow make ordering right away easy.' },
        tags: { nl: ['Landingspagina’s', 'Pre-sale'], en: ['Landing pages', 'Pre-sale'] },
        link: '/landing-pages', screen: 'presale',
      },
      {
        title: { nl: 'Terugkomen en opnieuw kopen', en: 'Coming back and buying again' },
        body: { nl: 'E-mail en abonnementen helpen klanten terug te keren.', en: 'Email and subscriptions help customers come back.' },
        tags: { nl: ['E-mail', 'Abonnementen'], en: ['Email', 'Subscriptions'] },
        link: '/email-marketing', screen: 'repeat',
      },
    ],
    proof: {
      media: 'stamp',
      lead: { nl: 'Pre-sale.', en: 'Pre-sale.' },
      figure: { nl: 'Uitverkocht.', en: 'Sold out.' },
      body: {
        nl: 'De volledige voorraad voor de lancering ging via influencer marketing de deur uit.',
        en: 'The full stock for the launch went out the door through influencer marketing.',
      },
      note: { nl: 'alles weg :)', en: 'all gone :)' },
    },
    evidence: {
      nl: 'Nooms is een eigen merk van Stef. Uitverkocht gaat over de voorraad voor de lancering; aantallen en omzet zijn niet gepubliceerd.',
      en: 'Nooms is Stef’s own brand. Sold out refers to the stock for the launch; quantities and revenue are not published.',
    },
    closing: {
      title: { nl: 'Een product lanceren?', en: 'Launching a product?' },
      body: { nl: 'We bekijken je aanbod en de route van eerste klik tot herhaalaankoop.', en: 'We look at your offer and the route from first click to repeat purchase.' },
      cta: { nl: 'Bespreek je lancering', en: 'Discuss your launch' },
    },
  },
  healthfactor: {
    seoTitle: { nl: 'Healthfactor case: een persoonlijke videoadvertentie', en: 'Healthfactor case: a personal video ad' },
    headline: { nl: ['Een gezicht', 'bij de gym.'], en: ['A face', 'behind the gym.'] },
    lead: {
      nl: 'Healthfactor stelt zich voor met een persoonlijke videoadvertentie, gefilmd tussen de toestellen.',
      en: 'Healthfactor introduces itself with a personal video ad, filmed among the equipment.',
    },
    stats: [
      { text: { nl: 'Persoonlijk', en: 'Personal' }, label: { nl: 'iemand spreekt je rechtstreeks aan', en: 'someone speaks to you directly' }, icon: 'people' },
      { text: { nl: 'Op locatie', en: 'On location' }, label: { nl: 'gefilmd in de gym', en: 'filmed in the gym' }, icon: 'pin' },
      { text: { nl: 'Verticaal', en: 'Vertical' }, label: { nl: 'met ondertitels', en: 'with subtitles' }, icon: 'play' },
    ],
    challenge: {
      title: { nl: 'Hoe voelt deze gym?', en: 'What does this gym feel like?' },
      body: {
        nl: 'Wie een gym kiest, wil weten hoe het er is. In een korte video moet dat meteen duidelijk worden: wie je er ziet, hoe het eruitziet en wat je kunt verwachten.',
        en: 'People choosing a gym want to know what it is like. A short video has to show that right away: who you will see, what it looks like and what to expect.',
      },
    },
    windowLabel: { nl: 'website', en: 'website' },
    stepsTitle: { nl: 'Drie keuzes in één video.', en: 'Three choices in one video.' },
    steps: [
      {
        title: { nl: 'Iemand die je aanspreekt', en: 'Someone who talks to you' },
        body: { nl: 'Rechtstreeks in de camera vertellen, zoals in een persoonlijk gesprek.', en: 'Speaking straight to camera, like a personal conversation.' },
        tags: { nl: ['Videoadvertentie', 'Persoonlijk'], en: ['Video ad', 'Personal'] },
        link: '/meta-ads', screen: 'subtitle',
      },
      {
        title: { nl: 'De gym zelf in beeld', en: 'The gym itself on screen' },
        body: { nl: 'Beelden van de toestellen en trainingsplekken tonen de sfeer.', en: 'Shots of the equipment and training spaces show the atmosphere.' },
        tags: { nl: ['Op locatie', 'Sfeer'], en: ['On location', 'Atmosphere'] },
        link: '/landing-pages', screen: 'tiles',
      },
      {
        title: { nl: 'Gevolgd op aanvragen', en: 'Tracked on enquiries' },
        body: { nl: 'We kijken naar aanvragen en kennismakingen, naast weergaven en kliks.', en: 'We look at enquiries and intro appointments, alongside views and clicks.' },
        tags: { nl: ['Aanvragen', 'Kennismakingen'], en: ['Enquiries', 'Intro calls'] },
        link: '/data-analytics', screen: 'metrics',
      },
    ],
    proof: {
      lead: { nl: 'Bekijk de', en: 'Watch the' },
      figure: { nl: 'advertentie.', en: 'ad.' },
      body: { nl: 'Een persoonlijk verhaal, rechtstreeks vanuit de gym.', en: 'A personal story, straight from the gym.' },
      note: { nl: 'druk maar op play :)', en: 'go on, press play :)' },
    },
    evidence: {
      nl: 'De video toont de persoonlijke stijl: in de camera spreken, de gym laten zien, ondertitels. Voor deze case zijn geen resultaatcijfers gepubliceerd.',
      en: 'The video shows the personal style: speaking to camera, showing the gym, subtitles. No result figures are published for this case.',
    },
    closing: {
      title: { nl: 'Je zaak persoonlijk voorstellen?', en: 'Introduce your business in person?' },
      body: { nl: 'We bekijken welk verhaal bij jouw klanten past en hoe je het in beeld brengt.', en: 'We look at which story suits your customers and how to put it on screen.' },
      cta: { nl: 'Bespreek je video', en: 'Discuss your video' },
    },
  },
}
