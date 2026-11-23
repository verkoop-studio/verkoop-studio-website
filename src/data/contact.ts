/** The studio's phone line, used for calls and WhatsApp. */
export const STUDIO_PHONE = '+32478731138'

/** The same number as people in Belgium write it. */
export const STUDIO_PHONE_LOCAL = '0478 73 11 38'

/** A WhatsApp link to the studio, optionally with an opening message. */
export const whatsappHref = (message?: string) => `https://wa.me/${STUDIO_PHONE.slice(1)}${message ? `?text=${encodeURIComponent(message)}` : ''}`
