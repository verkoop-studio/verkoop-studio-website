import type { Lang } from './types'

/** What the growth analysis looks at, as listed on /funnel-audit. */
export const AUDIT_SCOPE: Record<Lang, string[]> = {
  nl: ['Website structuur', 'Campagne-landingspagina’s', 'Meta Ads', 'Google Ads', 'Ecommerce-klantreis', 'Checkout-flow', 'Leadflow', 'Boekingsflow', 'E-mailopvolging', 'Tracking', 'Kansen voor AI-automatisering'],
  en: ['Website structure', 'Campaign landing pages', 'Meta Ads', 'Google Ads', 'Ecommerce journey', 'Checkout flow', 'Lead flow', 'Booking flow', 'Email follow-up', 'Tracking', 'Opportunities for AI automation'],
}
