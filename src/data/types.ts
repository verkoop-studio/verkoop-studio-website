export type Lang = 'nl' | 'en'
export type Bi<T> = Record<Lang, T>

export type ServiceSlug =
  | 'email-marketing'
  | 'data-analytics'
  | 'websites'
  | 'software'
  | 'landing-pages'
  | 'funnels'
  | 'meta-ads'
  | 'google-ads'
  | 'ecommerce-conversie'
  | 'ai-automatiseringen'
  | 'distributie'

export interface Service {
  slug: ServiceSlug
  number: string
  title: Bi<string>
  summary: Bi<string>
  includes: Bi<string[]>
  problem: Bi<string>
  process: Bi<string[]>
  deliverables: Bi<string[]>
  relatedCase?: CaseSlug
  partnerCase?: { name: string; url: string; description: Bi<string> }
}

export type CaseSlug = 'pinacello' | 'e-kart' | 'nooms' | 'healthfactor' | 'olearys'

export interface CaseStudy {
  slug: CaseSlug
  name: string
  sector: Bi<string>
  /** The one published result, shown wherever the case is listed. Cases without one show their sector. */
  result?: Bi<string>
  status: 'ongoing' | 'afgerond' | 'showcase'
  summary: Bi<string>
  situation: Bi<string>
  challenge: Bi<string>
  role: Bi<string>
  builtLabel?: Bi<string>
  built: Bi<string[]>
  measurement: Bi<string>
  objective: Bi<string>
  image?: string
  video?: string
  videoPoster?: string
  videoCaption?: Bi<string>
  comingSoon?: boolean
  unavailable?: boolean
  liveUrl?: string
}

export interface ProcessStep {
  number: string
  title: Bi<string>
  description: Bi<string>
}

export interface FaqItem {
  question: Bi<string>
  answer: Bi<string>
}
