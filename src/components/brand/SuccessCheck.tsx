/** Confirmation mark: the ring fades and settles in, then the tick draws itself. */
export default function SuccessCheck() {
  return (
    <svg className="vs-check" width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <circle className="vs-check-ring" cx="22" cy="22" r="20" />
      <path className="vs-check-tick" d="M13.5 22.5l6 6 11-12.5" pathLength={1} />
    </svg>
  )
}
