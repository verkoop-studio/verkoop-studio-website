/**
 * The Verkoop Studio Performance landing page, in one place.
 *
 * The page is the landing page for the paid ads (Meta, cold and retargeting).
 * Everything it claims comes from the product itself (verkoop-studio-performance,
 * main): the navigation, the connections, the attribution models and the
 * conversion sending. The screenshots are the product running on its own
 * labelled sample data, not a client's numbers.
 *
 * The prices are the package prices from the decision of 13 November 2026
 * (knowledge repo: decisions/2026-11-13-package-pricing.md). The same tiers
 * live in the product, in lib/plans.ts. Change them in both places.
 */
export const performance = {
  /** Also the CRM campaign name. Keep it in step with PERFORMANCE_CAMPAIGN in server-crm.js. */
  campaign: 'Verkoop Studio Performance',
  /** Posted with every sign-up, so the server can tag the lead. Keep it in step with PERFORMANCE_FORM_ID. */
  formId: 'performance-aanmelding',
  path: '/performance',
  /**
   * Where the visitor goes after the form to create their own workspace.
   * Empty until the self-serve sign-up of Verkoop Studio Performance is live:
   * the visitor then sees a thank-you and the studio sends the access.
   */
  signupUrl: '',

  seo: {
    title: {
      nl: 'Performance: zie welke advertentie verkoopt',
      en: 'Performance: see which ad sells',
    },
    description: {
      nl: 'Je advertenties, je verkopen en de weg van eerste klik tot aankoop in één dashboard. Meta, Google, TikTok, Shopify en je CRM. Vanaf €49 per maand, zonder contract.',
      en: 'Your ads, your sales and the path from first click to purchase in one dashboard. Meta, Google, TikTok, Shopify and your CRM. From €49 a month, no contract.',
    },
  },

  hero: {
    title: {
      nl: 'Zie welke advertentie echt verkoopt.',
      en: 'See which ad actually sells.',
    },
    lead: {
      nl: 'Verkoop Studio Performance legt je advertentiekosten naast je echte bestellingen en leads, en toont welke klik de verkoop bracht.',
      en: 'Verkoop Studio Performance puts your ad spend next to your real orders and leads, and shows which click brought the sale.',
    },
    cta: { nl: 'Start met Performance', en: 'Start with Performance' },
    facts: {
      nl: [
        { label: 'Prijs', value: 'Vanaf €49 per maand' },
        { label: 'Contract', value: 'Geen, maandelijks opzegbaar' },
        { label: 'Koppelt met', value: 'Meta, Google, TikTok, Shopify' },
      ],
      en: [
        { label: 'Price', value: 'From €49 a month' },
        { label: 'Contract', value: 'None, cancel monthly' },
        { label: 'Connects', value: 'Meta, Google, TikTok, Shopify' },
      ],
    },
    figureAlt: {
      nl: 'Het overzicht van Verkoop Studio Performance: omzet, advertentiekosten, ROAS en bestellingen per kanaal',
      en: 'The Verkoop Studio Performance overview: revenue, ad spend, ROAS and orders per channel',
    },
  },

  /** Said once under every screenshot: these are not a client's results. */
  sampleNote: {
    nl: 'Voorbeelddata uit het product, geen cijfers van een klant.',
    en: 'Sample data from the product, not a client’s numbers.',
  },

  problem: {
    title: {
      nl: 'Elk platform zegt dat het de verkoop bracht.',
      en: 'Every platform says it brought the sale.',
    },
    body: {
      nl: 'Meta telt de aankoop, Google telt dezelfde aankoop, en je webshop ziet maar één bestelling. Performance telt elke bestelling één keer en geeft ze aan de klik die ze bracht, met je eigen pixel op je eigen site.',
      en: 'Meta counts the purchase, Google counts the same purchase, and your shop sees one order. Performance counts every order once and credits it to the click that brought it, with your own pixel on your own site.',
    },
  },

  screens: {
    title: { nl: 'Wat je ziet', en: 'What you see' },
    items: {
      nl: [
        {
          key: 'ads',
          title: 'Wat het platform meldt, en wat je echt verkocht',
          body: 'Per campagne, advertentieset en advertentie: de kosten en kliks van Meta, Google, TikTok en ChatGPT naast de bestellingen en winst die in je eigen winkel binnenkwamen.',
          alt: 'Het Ads-scherm: campagnes met kosten, kliks en ROAS van het platform naast omzet en winst uit de eigen winkel',
        },
        {
          key: 'customers',
          title: 'Wie begint en wie sluit',
          body: 'Welke kanalen de eerste klik brengen en welke de laatste, en de paden die klanten echt volgen tot de aankoop. Kies eerste klik, laatste klik, gelijk verdeeld of time decay, over 7 tot 365 dagen.',
          alt: 'Het Klanten-scherm: eerste en laatste klik per kanaal en de meest gevolgde paden tot aankoop',
        },
        {
          key: 'advice',
          title: 'Wat je eerst doet',
          body: 'Advies uit je eigen cijfers: wat de metingen onbetrouwbaar maakt, waar je budget heen kan en welk product je in je advertenties zet.',
          alt: 'Het Advies-scherm: een samenvatting van de periode, wat eerst te herstellen en waar het budget heen kan',
        },
      ],
      en: [
        {
          key: 'ads',
          title: 'What the platform reports, and what you actually sold',
          body: 'Per campaign, ad set and ad: the cost and clicks from Meta, Google, TikTok and ChatGPT next to the orders and profit that reached your own shop.',
          alt: 'The Ads screen: campaigns with platform cost, clicks and ROAS next to revenue and profit from the shop',
        },
        {
          key: 'customers',
          title: 'Who starts it, who closes it',
          body: 'Which channels bring the first click and which the last, and the paths customers really take to a purchase. Pick first click, last click, split evenly or time decay, over 7 to 365 days.',
          alt: 'The Customers screen: first and last touch per channel and the most common paths to purchase',
        },
        {
          key: 'advice',
          title: 'What to do first',
          body: 'Advice from your own numbers: what makes the measurement unreliable, where your budget can go and which product to put in your ads.',
          alt: 'The Advice screen: a summary of the period, what to fix first and where the budget can go',
        },
      ],
    },
  },

  features: {
    title: { nl: 'Wat erin zit', en: 'What is in it' },
    items: {
      nl: [
        'Een eigen pixel voor je site of Shopify-winkel, ook over toestellen heen',
        'Verkopen terug naar Meta en Google, server-side, zodat hun algoritme op echte bestellingen leert',
        'Advertenties van Meta, Google, TikTok en ChatGPT naast elkaar',
        'Webshop: Shopify, Wix of je eigen winkel. B2B: leads en pipeline uit je CRM',
        'E-mailresultaten uit Klaviyo, Mailchimp of Resend',
        'Verkeer, SEO en zichtbaarheid in AI-assistenten zoals ChatGPT en Perplexity',
        'Een mail als een koppeling stopt of de cijfers niet kloppen',
        'Rapporten voor je team of je klanten, met kijk- of beheerrechten',
      ],
      en: [
        'Your own pixel for your site or Shopify store, across devices too',
        'Sales sent back to Meta and Google, server-side, so their algorithms learn from real orders',
        'Ads from Meta, Google, TikTok and ChatGPT side by side',
        'Shops: Shopify, Wix or your own store. B2B: leads and pipeline from your CRM',
        'Email results from Klaviyo, Mailchimp or Resend',
        'Traffic, SEO and visibility in AI assistants such as ChatGPT and Perplexity',
        'An email when a connection stops or the numbers stop adding up',
        'Reports for your team or your clients, with view or full access',
      ],
    },
  },

  audience: {
    title: { nl: 'Voor wie', en: 'Who it is for' },
    items: {
      nl: [
        { title: 'Webshops', body: 'Je verkoopt online en adverteert op meer dan één platform. Je wil weten welke campagne winst maakt, niet welke het meeste claimt.' },
        { title: 'B2B en dienstverleners', body: 'Je advertenties brengen leads, geen bestellingen. Performance volgt de lead tot het getekende contract in je CRM.' },
        { title: 'Bureaus', body: 'Je beheert advertenties voor klanten. Elk bedrijf apart, met een eigen rapport, in één account.' },
      ],
      en: [
        { title: 'Online shops', body: 'You sell online and advertise on more than one platform. You want to know which campaign makes a profit, not which one claims the most.' },
        { title: 'B2B and services', body: 'Your ads bring leads, not orders. Performance follows the lead to the signed contract in your CRM.' },
        { title: 'Agencies', body: 'You run ads for clients. Every business separate, with its own report, in one account.' },
      ],
    },
  },

  pricing: {
    title: { nl: 'Eén prijs per bedrijf', en: 'One price per business' },
    intro: {
      nl: 'De prijs hangt af van wat je per maand aan advertenties uitgeeft op de gekoppelde platformen. In het pakket zitten Verkoop Studio Performance en de Sales CRM.',
      en: 'The price depends on what you spend on ads per month across the connected platforms. The package includes Verkoop Studio Performance and the Sales CRM.',
    },
    head: {
      nl: { plan: 'Plan', spend: 'Advertentiebudget per maand', price: 'Per maand, excl. btw' },
      en: { plan: 'Plan', spend: 'Ad spend per month', price: 'Per month, excl. VAT' },
    },
    /** Mirrors PACKAGE.plans in the product's lib/plans.ts. */
    plans: [
      { name: 'Start', spend: { nl: 'tot €5.000', en: 'up to €5,000' }, price: { nl: '€49', en: '€49' } },
      { name: 'Grow', spend: { nl: 'tot €15.000', en: 'up to €15,000' }, price: { nl: '€99', en: '€99' } },
      { name: 'Scale', spend: { nl: 'tot €50.000', en: 'up to €50,000' }, price: { nl: '€199', en: '€199' } },
      { name: 'Pro', spend: { nl: 'tot €150.000', en: 'up to €150,000' }, price: { nl: '€399', en: '€399' } },
      { name: 'Custom', spend: { nl: 'boven €150.000', en: 'above €150,000' }, price: { nl: 'op offerte', en: 'quote' } },
    ],
    terms: {
      nl: [
        'Geen contract. Je zegt maandelijks op.',
        'Jaarlijks betalen geeft twee maanden gratis.',
        'Geen advertentiebudget? Dan zit je op Start.',
        'Geef je twee maanden na elkaar meer uit dan je plan, dan ga je de maand erna een plan hoger. Je krijgt eerst een mail.',
        'Niets wordt geblokkeerd of trager als je over je plan gaat.',
      ],
      en: [
        'No contract. You cancel monthly.',
        'Paying yearly gives two months free.',
        'No ad spend? Then you are on Start.',
        'Spend more than your plan two months in a row and you move up a plan the month after. You get an email first.',
        'Nothing is locked or slowed down when you go over your plan.',
      ],
    },
  },

  form: {
    title: { nl: 'Start met Performance', en: 'Start with Performance' },
    body: {
      nl: 'Een paar gegevens, dan zetten we je workspace klaar. Liever dat wij de koppelingen voor je maken? Vink het aan.',
      en: 'A few details and we get your workspace ready. Rather have us make the connections for you? Tick the box.',
    },
  },
} as const

