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
