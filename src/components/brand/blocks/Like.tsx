// From Bencho (bencho.dev), MIT licence, (c) 2026 Lorenzo Cabra.
import { type CSSProperties, useState } from 'react'
import { Heart } from 'lucide-react'

/* ══ Like ═════════════════════════════════════════════════
   Press the heart and it vanishes, a disc blooms where it was and
   hollows out into a ring, seven pairs of coloured dots burst off
   the ring, and the heart springs back in red and past its size.
   Press again and it empties.

   Here without the count: the site shows no like numbers it cannot
   stand behind. Every burst plays once per press from a layer keyed
   by the press, and every number in it is fixed rather than random. */

const CONFETTI = ['#f48ea7', '#cc8ef5', '#8ce8c3', '#91d2fa', '#f5a524', '#e5484d', '#9fc7fa']

export function Like({ label, size = 22 }: { label: string; size?: number }) {
  const [liked, setLiked] = useState(false)
  const [beat, setBeat] = useState(0)
  const press = () => {
    if (!liked) setBeat((b) => b + 1)
    setLiked(!liked)
  }
  return (
    <button type="button" className="lk" data-liked={liked || undefined} aria-pressed={liked} aria-label={label} onClick={press}>
      <span className="lk-heart" style={{ width: size, height: size }}>
        <span key={liked ? `on${beat}` : 'off'} className="lk-glyph" data-on={liked || undefined}>
          <Heart size={size} strokeWidth={2} fill={liked ? 'currentColor' : 'none'} />
        </span>
        {liked && (
          <span key={beat} className="lk-burst" aria-hidden="true">
            <span className="lk-bloom" />
            {Array.from({ length: 7 }, (_, k) => (
              <span key={k} className="lk-spoke" style={{ '--a': `${k * (360 / 7) - 90}deg` } as CSSProperties}>
                <i style={{ '--c': CONFETTI[k % CONFETTI.length] } as CSSProperties} />
                <i style={{ '--c': CONFETTI[(k + 3) % CONFETTI.length] } as CSSProperties} />
              </span>
            ))}
          </span>
        )}
      </span>
    </button>
  )
}
