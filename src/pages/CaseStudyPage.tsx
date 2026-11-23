import CaseTemplate from './CaseTemplate'
import { caseContent } from '../data/caseContent'
import { getCase } from '../data/cases'
import type { CaseSlug } from '../data/types'
import { trackEvent } from '../lib/analytics'
import { useInView } from '../lib/useInView'

/** One case page: the shared template with the case's own content. */
export default function CaseStudyPage({ slug }: { slug: CaseSlug }) {
  const c = getCase(slug)
  const { ref } = useInView<HTMLDivElement>(() => trackEvent('case_viewed', { case: slug, placement: 'page' }))
  if (!c) return null
  return <div ref={ref}><CaseTemplate c={c} content={caseContent[slug]} /></div>
}
