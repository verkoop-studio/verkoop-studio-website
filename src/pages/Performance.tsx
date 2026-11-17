import { useEffect } from 'react'
import Seo from '../components/Seo'
import PerformanceSignupForm from '../components/PerformanceSignupForm'
import ResponsiveImage from '../components/ResponsiveImage'
import CheckList from '../components/CheckList'
import { performance as p } from '../data/performance'
import { trackEvent, trackLandingView } from '../lib/analytics'
import { useLang } from '../i18n/LanguageContext'
import overviewShot from '../assets/performance/overview.webp'
import adsShot from '../assets/performance/ads.webp'
import customersShot from '../assets/performance/customers.webp'
import adviceShot from '../assets/performance/advice.webp'

/** One content rail for the whole page, so every heading starts on the same line. */
const RAIL = 'mx-auto w-full max-w-6xl px-5 sm:px-8'

const SHOTS = { ads: adsShot, customers: customersShot, advice: adviceShot } as const

export default function Performance() {
  const { lang } = useLang()

  useEffect(() => { trackLandingView('Verkoop Studio Performance') }, [])

  return (
    <div>
      <Seo title={p.seo.title[lang]} description={p.seo.description[lang]} path={p.path} />

      {/* The offer, the price and the product on the first screen. On a phone the
          screenshot sits between the lead and the facts, above the fold. */}
      <section className="performance-hero bg-surface/40">
        <div className={`${RAIL} reveal grid items-center gap-x-14 gap-y-8 py-12 sm:py-20 lg:grid-cols-[0.9fr_1.2fr]`}>
          <div className="order-1 lg:col-start-1 lg:row-start-1">
            <p className="text-sm font-semibold text-accent">Verkoop Studio Performance</p>
            <h1 className="mt-3 font-display text-4xl text-paper text-balance sm:text-5xl">{p.hero.title[lang]}</h1>
            <p className="mt-4 max-w-xl text-lg text-bone">{p.hero.lead[lang]}</p>
          </div>

          <figure className="order-2 m-0 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-center">
            <ResponsiveImage
              src={overviewShot}
              alt={p.hero.figureAlt[lang]}
              sizes="(max-width: 1024px) 100vw, 680px"
              loading="eager"
              fetchPriority="high"
              className="w-full rounded-2xl border border-line object-cover object-top shadow-sm"
            />
            <figcaption className="mt-3 text-sm text-mute">{p.sampleNote[lang]}</figcaption>
          </figure>

          <div className="order-3 lg:col-start-1 lg:row-start-2">
            <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-3">
              {p.hero.facts[lang].map(fact => (
                <div key={fact.label} className="border-t border-line pt-3">
                  <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-mute">{fact.label}</dt>
                  <dd className="mt-1 text-sm font-medium text-paper">{fact.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8">
              <a href="#starten" className="button-dark"
                onClick={() => trackEvent('audit_cta_clicked', { placement: 'performance_hero' })}>
                {p.hero.cta[lang]} <span aria-hidden="true">↗</span>
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-line" aria-labelledby="probleem-titel">
        <div className={`${RAIL} reveal py-16 sm:py-20`}>
          <h2 id="probleem-titel" className="max-w-3xl font-display text-3xl text-paper text-balance sm:text-4xl">{p.problem.title[lang]}</h2>
          <p className="mt-4 max-w-2xl text-lg text-bone">{p.problem.body[lang]}</p>
        </div>
      </section>

      {/* Real screens from the product, each once, text beside the picture. */}
      <section className="border-t border-line bg-surface/40" aria-labelledby="schermen-titel">
        <div className={`${RAIL} py-16 sm:py-20`}>
          <h2 id="schermen-titel" className="font-display text-3xl text-paper text-balance sm:text-4xl">{p.screens.title[lang]}</h2>
          <div className="mt-12 grid gap-16 sm:gap-20">
            {p.screens.items[lang].map((item, index) => (
              <div key={item.key} className="reveal grid items-center gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-14">
                <div className={index % 2 ? 'lg:order-2' : undefined}>
                  <h3 className="font-display text-2xl text-paper text-balance">{item.title}</h3>
                  <p className="mt-3 text-bone">{item.body}</p>
                </div>
                <figure className={`m-0 ${index % 2 ? 'lg:order-1' : ''}`}>
                  <ResponsiveImage
                    src={SHOTS[item.key]}
                    alt={item.alt}
                    sizes="(max-width: 1024px) 100vw, 680px"
                    loading="lazy"
                    className="w-full rounded-2xl border border-line object-cover object-top"
                  />
                  <figcaption className="mt-3 text-sm text-mute">{p.sampleNote[lang]}</figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line" aria-labelledby="inhoud-titel">
        <div className={`${RAIL} reveal py-16 sm:py-20`}>
          <h2 id="inhoud-titel" className="font-display text-3xl text-paper text-balance sm:text-4xl">{p.features.title[lang]}</h2>
          <CheckList items={[...p.features.items[lang]]} className="mt-10" />
        </div>
      </section>

      <section className="border-t border-line bg-surface/40" aria-labelledby="voorwie-titel">
        <div className={`${RAIL} reveal py-16 sm:py-20`}>
          <h2 id="voorwie-titel" className="font-display text-3xl text-paper text-balance sm:text-4xl">{p.audience.title[lang]}</h2>
          <ul className="mt-10 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {p.audience.items[lang].map(item => (
              <li key={item.title} className="border-t-2 border-accent pt-5">
                <h3 className="text-base font-semibold text-paper">{item.title}</h3>
                <p className="mt-2 text-sm text-bone">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="prijzen" className="border-t border-line" aria-labelledby="prijzen-titel">
        <div className={`${RAIL} reveal py-16 sm:py-20`}>
          <h2 id="prijzen-titel" className="font-display text-3xl text-paper text-balance sm:text-4xl">{p.pricing.title[lang]}</h2>
          <p className="mt-4 max-w-2xl text-bone">{p.pricing.intro[lang]}</p>
          <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            <div className="overflow-x-auto rounded-2xl border border-line">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface text-xs uppercase tracking-[0.08em] text-mute">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-semibold">{p.pricing.head[lang].plan}</th>
                    <th scope="col" className="px-5 py-3 font-semibold">{p.pricing.head[lang].spend}</th>
                    <th scope="col" className="px-5 py-3 text-right font-semibold">{p.pricing.head[lang].price}</th>
                  </tr>
                </thead>
                <tbody>
                  {p.pricing.plans.map(plan => (
                    <tr key={plan.name} className="border-t border-line">
                      <th scope="row" className="px-5 py-4 font-semibold text-paper">{plan.name}</th>
                      <td className="px-5 py-4 text-bone">{plan.spend[lang]}</td>
                      <td className="px-5 py-4 text-right font-display text-lg text-paper tabular-nums">{plan.price[lang]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <CheckList items={[...p.pricing.terms[lang]]} columns={1} />
          </div>
        </div>
      </section>

      {/* The page ends on the action. */}
      <section id="starten" className="border-t border-line bg-surface/40" aria-labelledby="starten-titel">
        <div className={`${RAIL} py-16 sm:py-20`}>
          <h2 id="starten-titel" className="font-display text-3xl text-paper text-balance sm:text-4xl">{p.form.title[lang]}</h2>
          <p className="mt-3 max-w-2xl text-bone">{p.form.body[lang]}</p>
          <div className="mt-10">
            <PerformanceSignupForm />
          </div>
        </div>
      </section>
    </div>
  )
}
