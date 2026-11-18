/** The studio's phone line, used for calls and WhatsApp. */
export const STUDIO_PHONE = '+32478731138'

/** A WhatsApp link to the studio, optionally with an opening message. */
export const whatsappHref = (message?: string) => `https://wa.me/${STUDIO_PHONE.slice(1)}${message ? `?text=${encodeURIComponent(message)}` : ''}`
