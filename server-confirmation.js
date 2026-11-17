import { confirmationTemplate } from './server-templates.js'
import { resendRequest } from './server-lead.js'
import { GIVEAWAY_FORM_ID, PERFORMANCE_FORM_ID } from './server-crm.js'

export async function sendConfirmation(resend, form, {from, replyTo, idempotencyKey}) {
  // A giveaway entrant is not an enquiry: tell them what happens next instead
  // of promising a call within 24 hours.
  if (form.form_id === GIVEAWAY_FORM_ID) {
    const en = form.lang === 'en'
    return resendRequest(() => resend.emails.send({
      from, to: [form.email], replyTo,
      subject: en ? 'Your entry for a free website' : 'Je deelname aan de gratis website-actie',
      text: en
        ? 'Thank you for entering. We read every entry ourselves. After 19 November 2026 we pick one business and contact the winner personally, within a week of closing. Even if we do not pick you, we will let you know. Have a question? Reply to this email.\n\nStef — Verkoop Studio'
        : 'Bedankt voor je deelname. We lezen elke inzending zelf. Na 19 november 2026 kiezen we één bedrijf en contacteren we de winnaar persoonlijk, binnen een week na de sluiting. Word je niet gekozen, dan laten we dat ook weten. Heb je een vraag? Antwoord op deze mail.\n\nStef — Verkoop Studio',
    }, { idempotencyKey }))
  }
  // A Performance sign-up asked for the product, not for a call about growth.
  if (form.form_id === PERFORMANCE_FORM_ID) {
    const en = form.lang === 'en'
    return resendRequest(() => resend.emails.send({
      from, to: [form.email], replyTo,
      subject: en ? 'Your Verkoop Studio Performance workspace' : 'Je workspace in Verkoop Studio Performance',
      text: en
        ? 'Thank you for signing up for Verkoop Studio Performance. We are getting your workspace ready and will send you the link to sign in. If you asked us to make the connections, we will contact you to plan that. Have a question? Reply to this email.\n\nStef — Verkoop Studio'
        : 'Bedankt voor je aanmelding bij Verkoop Studio Performance. We zetten je workspace klaar en sturen je de link om in te loggen. Vroeg je ons om de koppelingen te maken, dan nemen we contact op om dat in te plannen. Heb je een vraag? Antwoord op deze mail.\n\nStef — Verkoop Studio',
    }, { idempotencyKey }))
  }
  if (form.form_id === 'home-free-plan') {
    const en = form.lang === 'en'
    return resendRequest(() => resend.emails.send({
      from, to: [form.email], replyTo,
      subject: en ? 'Your free growth plan request' : 'Je aanvraag voor een gratis groeiplan',
      text: en
        ? 'Thank you for requesting your free growth plan. We will contact you to discuss your business and prepare your plan. Have a question? Reply to this email.\n\nStef — Verkoop Studio'
        : 'Bedankt voor je aanvraag voor een gratis groeiplan. We nemen contact op om je bedrijf te bespreken en je plan uit te werken. Heb je een vraag? Antwoord op deze mail.\n\nStef — Verkoop Studio',
    }, { idempotencyKey }))
  }
  return resendRequest(() => resend.emails.send({
    from, to:[form.email], replyTo, template:confirmationTemplate(form),
  }, {idempotencyKey}))
}
