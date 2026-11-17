import type { MouseEvent } from 'react'
import Seo from '../components/Seo'
import ResponsiveImage from '../components/ResponsiveImage'
import CheckList from '../components/CheckList'
import { crmLanding, signupHref, type CrmScreenKey } from '../data/crmLanding'
import { trackCrmSignupClick } from '../lib/analytics'
import { useLang } from '../i18n/LanguageContext'
import crmDashboard from '../assets/crm/crm-dashboard.webp'
import crmProspectflow from '../assets/crm/crm-prospectflow.webp'
import crmLeads from '../assets/crm/crm-leads.webp'
import crmHero from '../assets/crm/crm-hero.webp'

/** The same rail as the giveaway page, the width the rest of the site uses. */
const RAIL = 'mx-auto w-full max-w-6xl px-5 sm:px-8'

const SCREENS: Record<CrmScreenKey, string> = {
  dashboard: crmDashboard,
  prospectflow: crmProspectflow,
  leads: crmLeads,
}

/** The page's one action. The ad parameters are added at click time, so the
 *  prerendered HTML and the hydrated page carry the same href. */
function SignupButton({ placement, label }: { placement: string; label: string }) {
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.href = signupHref(window.location.search)
    trackCrmSignupClick(placement)
  }
  return (
    <a href={crmLanding.signupUrl} className="button-dark crm-signup" onClick={onClick}>
      {label} <span aria-hidden="true">↗</span>
    </a>
  )
}

export default function SalesCrm() {
  const { lang } = useLang()
  const c = crmLanding

  return (
    <div>
      <Seo title={c.seo.title[lang]} description={c.seo.description[lang]} path={c.path} />

      {/* On a phone the product sits between the lead and the facts, so the
          screen is visible before the first scroll. */}
      <section className="bg-surface/40">
        <div className={`${RAIL} reveal grid items-center gap-x-14 gap-y-8 py-12 sm:py-20 lg:grid-cols-[1fr_1.05fr]`}>
          <div className="order-1 lg:col-start-1 lg:row-start-1">
            <h1 className="font-display text-4xl text-paper text-balance sm:text-5xl">{c.hero.title[lang]}</h1>
            <p className="mt-4 max-w-xl text-lg text-bone">{c.hero.lead[lang]}</p>
          </div>

          <figure className="order-2 m-0 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-center">
            <ResponsiveImage
              src={crmHero}
              alt={c.hero.figureAlt[lang]}
              sizes="(max-width: 1024px) 100vw, 640px"
              loading="eager"
              fetchPriority="high"
              className="w-full rounded-2xl border border-line object-cover object-left-top shadow-sm"
            />
            <figcaption className="mt-3 text-sm text-mute">{c.demoNote[lang]}</figcaption>
          </figure>

          <div className="order-3 lg:col-start-1 lg:row-start-2">
            <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-3">
              {c.hero.facts[lang].map(fact => (
                <div key={fact.label} className="border-t border-line pt-3">
                  <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-mute">{fact.label}</dt>
                  <dd className="mt-1 text-sm font-medium text-paper">{fact.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8">
              <SignupButton placement="crm_hero" label={c.cta[lang]} />
            </p>
          </div>
        </div>
      </section>

      {/* Three screens, each with the one thing it is for. */}
      <section className="border-t border-line" aria-labelledby="schermen-titel">
        <div className={`${RAIL} py-16 sm:py-20`}>
          <h2 id="schermen-titel" className="font-display text-3xl text-paper text-balance sm:text-4xl">{c.screens.title[lang]}</h2>
          <div className="mt-12 grid gap-16 sm:gap-20">
            {c.screens.items[lang].map((screen, index) => (
              <div key={screen.key} className={`reveal grid items-center gap-8 lg:gap-14 ${index % 2 === 1 ? 'lg:grid-cols-[1.25fr_0.75fr]' : 'lg:grid-cols-[0.75fr_1.25fr]'}`}>
                <div className={index % 2 === 1 ? 'lg:order-2' : undefined}>
                  <h3 className="text-xl font-semibold text-paper text-balance">{screen.title}</h3>
                  <p className="mt-3 text-bone">{screen.body}</p>
                </div>
                <figure className={`m-0 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <ResponsiveImage
                    src={SCREENS[screen.key]}
                    alt={screen.alt}
                    sizes="(max-width: 1024px) 100vw, 700px"
                    loading="lazy"
                    className="w-full rounded-2xl border border-line object-cover object-left-top"
                  />
                </figure>
              </div>
            ))}
          </div>
          <p className="mt-10 text-sm text-mute">{c.demoNote[lang]}</p>
        </div>
      </section>

      <section className="border-t border-line bg-surface/40" aria-labelledby="meer-titel">
        <div className={`${RAIL} reveal grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:gap-14`}>
          <div>
            <h2 id="voor-wie-titel" className="font-display text-3xl text-paper text-balance sm:text-4xl">{c.audience.title[lang]}</h2>
            <p className="mt-4 text-bone">{c.audience.body[lang]}</p>
            <CheckList items={[...c.audience.items[lang]]} columns={1} className="mt-6" />
          </div>
          <div>
            <h2 id="meer-titel" className="font-display text-3xl text-paper text-balance sm:text-4xl">{c.more.title[lang]}</h2>
            <CheckList items={[...c.more.items[lang]]} columns={1} className="mt-6" />
          </div>
        </div>
      </section>

      {/* Three tiers are peers, so this is the page's one card treatment. */}
      <section className="border-t border-line" aria-labelledby="prijs-titel">
        <div className={`${RAIL} reveal py-16 sm:py-20`}>
          <h2 id="prijs-titel" className="font-display text-3xl text-paper text-balance sm:text-4xl">{c.pricing.title[lang]}</h2>
          <p className="mt-4 max-w-2xl text-bone">{c.pricing.body[lang]}</p>
          <ul className="mt-10 grid gap-5 sm:grid-cols-3">
            {c.pricing.tiers[lang].map((tier, index) => (
              <li key={tier.leads} className={`rounded-2xl border bg-surface-2 p-6 ${index === 0 ? 'border-accent' : 'border-line'}`}>
                <p className="text-sm font-medium text-bone">{tier.leads}</p>
                <p className="mt-3 font-display text-3xl text-paper">{tier.price}</p>
                <p className="mt-1 text-sm text-mute">{tier.note}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-mute">{c.pricing.clients[lang]}</p>
        </div>
      </section>

      {/* The page ends on the action. */}
      <section className="border-t border-line bg-surface/40" aria-labelledby="start-titel">
        <div className={`${RAIL} py-16 sm:py-20`}>
          <h2 id="start-titel" className="font-display text-3xl text-paper text-balance sm:text-4xl">{c.final.title[lang]}</h2>
          <p className="mt-3 max-w-2xl text-bone">{c.final.body[lang]}</p>
          <p className="mt-8">
            <SignupButton placement="crm_final" label={c.cta[lang]} />
          </p>
        </div>
      </section>
    </div>
  )
}
