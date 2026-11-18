import type { CSSProperties } from 'react'
import BotAvatar from './BotAvatar'
import Reveal from './Reveal'

const SHAPES = ['cat', 'bunny', 'star', 'sprout', 'lightbulb']
const COLORS = ['#ff9fd0', '#ffd23f', '#7d93ff', '#c9f26a', '#ff7a59']

/** Who it is for, one row each: a character, the audience in bold, what it gets on the right. The row tints and the character slides on hover. */
export default function AudienceRows({ rows }: { rows: [string, string][] }) {
  return (
    <ul className="vs-who">
      {rows.map(([who, what], i) => (
        <Reveal as="li" key={who} delay={i * 0.08} y={20}>
          <div className="vs-who-row" style={{ '--tint': COLORS[i % COLORS.length] } as CSSProperties}>
            <span className="vs-who-ava"><BotAvatar shape={SHAPES[i % SHAPES.length]} size={44} color={COLORS[i % COLORS.length]} /></span>
            <b>{who}</b>
            <span>{what}</span>
          </div>
        </Reveal>
      ))}
    </ul>
  )
}
