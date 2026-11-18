/** House easings. Reveals use EASE, wipes and drawn outlines use EASE_WIPE. */
export const EASE = [0.22, 1, 0.36, 1] as const
export const EASE_WIPE = [0.58, 0.14, 0.06, 0.97] as const
export const EASE_LETTER = [0.2, 0.58, 0.43, 1] as const

/** Reveals replay in both directions so the page keeps moving on the way back up. */
export const VIEWPORT = { once: false, margin: '-120px' } as const
