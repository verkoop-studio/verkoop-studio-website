import type { Platform } from './platforms'
import type { Bi, ServiceSlug } from './types'

export interface ServiceExtra {
  /** Who it is for, worded from the service's own includes, problem and process copy. */
  audiences: Bi<[string, string]>[]
  /** The faq.ts entry that answers a question about this service. */
  faq: number
  /** Platforms the service copy names. Empty when it names none. */
  platforms: Platform[]
}

const a = (nl: [string, string], en: [string, string]): Bi<[string, string]> => ({ nl, en })

export const serviceExtras: Record<ServiceSlug, ServiceExtra> = {
  'meta-ads': {
    audiences: [
      a(['Webshops', 'Campagnes gemeten op omzet, niet op bereik.'], ['Webshops', 'Campaigns measured on revenue, not reach.']),
      a(['Dienstverleners', 'Aanvragen uit advertenties, met een pagina die bij de boodschap past.'], ['Service businesses', 'Enquiries from ads, with a page that matches the message.']),
      a(['Zaken met boekingen', 'Van advertentie naar boeking, met retargeting voor wie twijfelt.'], ['Booking businesses', 'From ad to booking, with retargeting for those who hesitate.']),
    ],
    faq: 4,
    platforms: ['meta'],
  },
  'google-ads': {
    audiences: [
      a(['Lokale bedrijven', 'Gevonden worden door wie in de buurt zoekt.'], ['Local businesses', 'Found by people searching nearby.']),
      a(['Bedrijven met een merk', 'Merk- en niet-merkzoekwoorden elk in hun eigen campagne.'], ['Businesses with a brand', 'Brand and non-brand searches each in their own campaign.']),
      a(['Wie aanvragen wil meten', 'Conversiemeting die toont welke zoekterm klanten oplevert.'], ['Anyone who measures enquiries', 'Conversion tracking that shows which search term brings customers.']),
    ],
    faq: 4,
    platforms: ['google', 'ga4', 'gtm'],
  },
  'landing-pages': {
    audiences: [
      a(['B2B-bedrijven', 'Een leadpagina rond één aanbod en één actie.'], ['B2B businesses', 'A lead page around one offer and one action.']),
      a(['B2C met boekingen', 'Een boekingspagina die meteen tot de stap leidt.'], ['B2C with bookings', 'A booking page that leads straight to the step.']),
      a(['Webshops', 'Productpagina’s die bij de campagne passen.'], ['Webshops', 'Product pages that match the campaign.']),
    ],
    faq: 3,
    platforms: [],
  },
  funnels: {
    audiences: [
      a(['B2B-bedrijven', 'Van eerste klik tot gesprek, met opvolging in het CRM.'], ['B2B businesses', 'From first click to a conversation, with follow-up in the CRM.']),
      a(['B2C met boekingen', 'Een boekingsfunnel met bevestiging en herinnering.'], ['B2C with bookings', 'A booking funnel with confirmation and reminders.']),
      a(['Webshops', 'Retargeting en opvolging na de aankoop.'], ['Webshops', 'Retargeting and follow-up after the purchase.']),
    ],
    faq: 3,
    platforms: [],
  },
  'ecommerce-conversie': {
    audiences: [
      a(['Webshops met bezoekers', 'Maar die vóór de checkout afhaken.'], ['Webshops with visitors', 'Who drop off before checkout.']),
      a(['Webshops met verlaten mandjes', 'Flows die klanten terug naar de kassa brengen.'], ['Webshops with abandoned carts', 'Flows that bring customers back to checkout.']),
      a(['Merken met vaste klanten', 'Bundels, upsells en een abonnementsstrategie.'], ['Brands with regular customers', 'Bundles, upsells and a subscription strategy.']),
    ],
    faq: 6,
    platforms: [],
  },
  'ai-automatiseringen': {
    audiences: [
      a(['Teams die leads overtypen', 'Kwalificeren en het CRM bijwerken, vanzelf.'], ['Teams retyping leads', 'Qualifying and updating the CRM, automatically.']),
      a(['Bedrijven met offertes', 'De voorbereiding gebeurt, jij keurt goed.'], ['Businesses that send quotes', 'The preparation is done, you approve.']),
      a(['Teams met veel klantvragen', 'Vragen komen meteen bij de juiste persoon.'], ['Teams with many questions', 'Questions reach the right person right away.']),
    ],
    faq: 8,
    platforms: [],
  },
  distributie: {
    audiences: [
      a(['B2B-bedrijven', 'Outreach per e-mail en via Sales Navigator.'], ['B2B businesses', 'Outreach by email and through Sales Navigator.']),
      a(['B2C-merken', 'Advertenties op Meta, Google en social.'], ['B2C brands', 'Ads on Meta, Google and social.']),
      a(['Lokale zaken', 'Offline campagnes en lokale zichtbaarheid.'], ['Local businesses', 'Offline campaigns and local visibility.']),
    ],
    faq: 5,
    platforms: ['meta', 'google', 'navigator'],
  },
  'email-marketing': {
    audiences: [
      a(['Webshops', 'Verlaten mandjes en herhaalaankopen opvolgen.'], ['Webshops', 'Following up abandoned carts and repeat purchases.']),
      a(['Bedrijven met inschrijvers', 'Een welkomstflow die meteen vertrouwen opbouwt.'], ['Businesses with subscribers', 'A welcome flow that builds trust from the start.']),
      a(['Dienstverleners', 'Opvolging na een aanvraag, met één volgende stap.'], ['Service businesses', 'Follow-up after an enquiry, with one next step.']),
    ],
    faq: 5,
    platforms: [],
  },
  'data-analytics': {
    audiences: [
      a(['Wie adverteert', 'En wil weten welke campagnes goede aanvragen opleveren.'], ['Anyone who advertises', 'And wants to know which campaigns bring good enquiries.']),
      a(['Wie GA4 al heeft', 'Maar twijfelt aan de cijfers en dubbele tellingen.'], ['Anyone already on GA4', 'But unsure about the numbers and double counts.']),
      a(['Zaakvoerders', 'Eén overzicht met kosten, conversies en omzet.'], ['Owners', 'One overview with cost, conversions and revenue.']),
    ],
    faq: 12,
    platforms: ['ga4', 'gtm', 'looker'],
  },
  websites: {
    audiences: [
      a(['Een site die niet converteert', 'Te veel tegelijk, en de knop is zoek.'], ['A site that does not convert', 'Too much at once, and the button is hard to find.']),
      a(['Webshops', 'Een winkel waar bezoekers ook afrekenen.'], ['Webshops', 'A shop where visitors also check out.']),
      a(['Een nieuwe site', 'Van structuur tot oplevering, getest op elk scherm.'], ['A new site', 'From structure to handover, tested on every screen.']),
    ],
    faq: 1,
    platforms: [],
  },
  software: {
    audiences: [
      a(['Bedrijven met een eigen proces', 'Software rond hoe jouw team echt werkt.'], ['Businesses with their own process', 'Software around how your team really works.']),
      a(['Teams op locatie', 'Apps voor iOS en Android.'], ['Teams on site', 'Apps for iOS and Android.']),
      a(['Wie systemen wil koppelen', 'API-integraties tussen je tools.'], ['Anyone connecting systems', 'API integrations between your tools.']),
    ],
    faq: 1,
    platforms: [],
  },
}
