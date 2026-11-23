import type { Lang } from './types'

/** Where growth gets stuck, written from the services' own "Waar het vastloopt" copy; no figures. */
export const PAINS: Record<Lang, [string, string][]> = {
  nl: [
    ['Advertenties die bereik kopen, niet verkopen', 'Gemeten op kliks en bereik, terwijl het doel leads of omzet is.'],
    ['Een site die niet overtuigt', 'De pagina zegt te veel tegelijk. Bezoekers moeten zelf de knop zoeken.'],
    ['Leads die niemand opvolgt', 'Wie niet snel wordt opgevolgd, is omzet die op tafel blijft liggen.'],
    ['Geen idee welke advertentie werkte', 'Je ziet niet welke campagnes goede aanvragen opleveren.'],
    ['Cijfers die niets zeggen', 'Je dashboard toont verkeer, terwijl je wilt weten wat klanten en omzet brengt.'],
    ['Klanten die je daarna vergeet', 'Na een inschrijving of aankoop blijft het stil.'],
  ],
  en: [
    ['Ads that buy reach, not sales', 'Measured on clicks and reach, while the goal is leads or revenue.'],
    ['A site that does not convince', 'The page says too much at once. Visitors have to hunt for the button.'],
    ['Leads nobody follows up', 'Anyone not followed up quickly is revenue left on the table.'],
    ['No idea which ad worked', 'You cannot see which campaigns bring good enquiries.'],
    ['Numbers that say nothing', 'Your dashboard shows traffic when you want to know what brings customers and revenue.'],
    ['Customers you forget afterwards', 'After a sign-up or purchase, things go quiet.'],
  ],
}
