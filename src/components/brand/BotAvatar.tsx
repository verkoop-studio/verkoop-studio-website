import { useEffect, useRef } from 'react'
import type { AvatarMotion } from 'open-bot-avatar'
import { AVATARS } from '../../data/avatars'

type Mounted = { update: (o: Record<string, unknown>) => void; destroy: () => void }

/**
 * A small character with eyes (open-bot-avatar). The library loads on first use, in its own chunk,
 * so pages without an avatar never pay for it. `live` makes it look at the pointer and breathe;
 * otherwise it is one still drawing. Decorative unless a label is given.
 */
export default function BotAvatar({
  shape,
  size = 48,
  color = '#2b4bf2',
  eyeColor,
  mood = 'idle',
  live = false,
  label = '',
  className = '',
}: {
  shape: keyof typeof AVATARS | string
  size?: number
  color?: string
  eyeColor?: string
  mood?: AvatarMotion
  live?: boolean
  label?: string
  className?: string
}) {
  const host = useRef<HTMLSpanElement>(null)
  const avatar = useRef<Mounted | null>(null)
  const definition = AVATARS[shape]

  useEffect(() => {
    let gone = false
    Promise.all([import('open-bot-avatar/dom'), import('open-bot-avatar')]).then(([{ mountAvatar }, lib]) => {
      if (gone || !host.current) return
      const def = definition ?? lib.getExample(shape) ?? AVATARS.verkoop
      avatar.current = mountAvatar(host.current, { definition: def, color, eyeColor, mood, followPointer: live, still: !live, depth: 7, label }) as unknown as Mounted
    })
    return () => { gone = true; avatar.current?.destroy(); avatar.current = null }
    // a new shape or a switch between live and still needs a fresh mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shape, live])

  useEffect(() => { avatar.current?.update({ mood, color, eyeColor }) }, [mood, color, eyeColor])

  return <span ref={host} className={`vs-bot ${className}`.trim()} style={{ width: size, height: size }} aria-hidden={label ? undefined : true} />
}
