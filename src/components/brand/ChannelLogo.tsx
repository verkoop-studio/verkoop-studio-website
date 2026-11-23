import { logoForName } from '../../data/platforms'

/** A channel's own logo before its name, for names that have a logo file. Decorative: the name is always written beside it. */
export default function ChannelLogo({ name, className = 'vs-clogo' }: { name: string; className?: string }) {
  const src = logoForName(name)
  return src ? <img className={className} src={src} alt="" width={16} height={16} loading="lazy" decoding="async" /> : null
}
