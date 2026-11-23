import ekartShot from '../assets/cases/ekart-640.webp'
import healthfactorShot from '../assets/cases/healthfactor-website-640.webp'
import noomsShot from '../assets/cases/nooms-640.webp'
import pinacelloShot from '../assets/cases/pinacello-640.webp'
import type { CaseSlug } from './types'

/** Each case's real site, at thumbnail size. */
export const CASE_SHOTS: Record<CaseSlug, string> = { pinacello: pinacelloShot, 'e-kart': ekartShot, nooms: noomsShot, healthfactor: healthfactorShot }
