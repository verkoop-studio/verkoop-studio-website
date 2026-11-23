/** Only platforms the site copy already names (services.ts, performance.ts, faq.ts). */
export const PLATFORMS = {
  meta: 'Meta',
  google: 'Google Ads',
  ga4: 'GA4',
  gtm: 'Google Tag Manager',
  looker: 'Looker Studio',
  tiktok: 'TikTok',
  shopify: 'Shopify',
  wix: 'Wix',
  klaviyo: 'Klaviyo',
  mailchimp: 'Mailchimp',
  resend: 'Resend',
  chatgpt: 'ChatGPT',
  perplexity: 'Perplexity',
  navigator: 'LinkedIn Sales Navigator',
} as const
export type Platform = keyof typeof PLATFORMS

/** The logo files in public/platforms. A wordmark already spells the name, so it is shown without it. */
export const PLATFORM_LOGOS: Partial<Record<Platform, { src: string; wordmark?: boolean; width?: number; height?: number }>> = {
  meta: { src: '/platforms/meta.svg' },
  google: { src: '/platforms/google.svg' },
  ga4: { src: '/platforms/googleanalytics.svg' },
  gtm: { src: '/platforms/googletagmanager.svg' },
  looker: { src: '/platforms/lookerstudio.svg' },
  tiktok: { src: '/platforms/tiktok.svg' },
  shopify: { src: '/platforms/shopify.svg' },
  klaviyo: { src: '/platforms/klaviyo.svg', wordmark: true, width: 581, height: 172 },
  mailchimp: { src: '/platforms/mailchimp.svg' },
  resend: { src: '/platforms/resend.svg' },
  chatgpt: { src: '/platforms/openai.svg' },
}

/** Logos for channel names as sample screens and labels write them; a name without a logo file stays text only. */
const LOGO_BY_NAME: Record<string, string> = {
  meta: '/platforms/meta.svg',
  'meta ads': '/platforms/meta.svg',
  facebook: '/platforms/facebook.svg',
  instagram: '/platforms/instagram.svg',
  google: '/platforms/google.svg',
  'google ads': '/platforms/google.svg',
  ga4: '/platforms/googleanalytics.svg',
  'google analytics': '/platforms/googleanalytics.svg',
  tiktok: '/platforms/tiktok.svg',
  shopify: '/platforms/shopify.svg',
  mailchimp: '/platforms/mailchimp.svg',
  whatsapp: '/platforms/whatsapp.svg',
  youtube: '/platforms/youtube.svg',
}

export const logoForName = (name: string): string | undefined => LOGO_BY_NAME[name.trim().toLowerCase()]
