import { caseContent } from '../data/caseContent'
import type { CaseStudy } from '../data/types'
import CaseTemplate from './CaseTemplate'

export default function PinacelloCase({ project }: { project: CaseStudy }) {
  return <CaseTemplate c={project} content={caseContent.pinacello!} />
}
