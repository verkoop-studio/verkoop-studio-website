import { PLATFORM_LOGOS, PLATFORMS, type Platform } from '../../data/platforms'

/**
 * A platform as its own logo and name. Logos that already spell the name (a wordmark) stand alone;
 * a platform without a logo file shows its name only.
 */
export default function PlatformMark({ platform }: { platform: Platform }) {
  const logo = PLATFORM_LOGOS[platform]
  const name = PLATFORMS[platform]
  if (logo?.wordmark) return <img className="vs-pmark-word" src={logo.src} alt={name} width={logo.width} height={logo.height} loading="lazy" decoding="async" />
  return (
    <>
      {logo && <img className="vs-pmark-icon" src={logo.src} alt="" width={24} height={24} loading="lazy" decoding="async" />}
      {name}
    </>
  )
}
