import BotAvatar from '../BotAvatar'

/**
 * A hand-drawn line in the margin beside a form that draws itself, with the mascot at its
 * end watching the pointer. It turns happy once the form is sent. Decorative.
 */
export default function FormTrail({ happy = false, thinking = false }: { happy?: boolean; thinking?: boolean }) {
  return (
    <div className="vs-trail" aria-hidden="true">
      <svg viewBox="0 0 160 220" fill="none" className="vs-trail-line">
        <path d="M14 206c22-14 8-40 30-56s44 4 52-22-26-36-8-58 44-12 52-38" pathLength={1} />
        <circle cx="14" cy="206" r="4" />
      </svg>
      <span className="vs-trail-bot">
        <BotAvatar shape="verkoop" size={64} live mood={happy ? 'happy' : thinking ? 'thinking' : 'idle'} />
      </span>
    </div>
  )
}
