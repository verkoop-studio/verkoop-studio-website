export type FieldIconName = 'person' | 'mail' | 'phone' | 'globe' | 'euro' | 'building' | 'chat'

/** Line glyphs on a 24 grid. The parts that move on focus carry their own class (the mail flap lifts like a lid). */
const GLYPHS: Record<FieldIconName, { d: string; cls?: string }[]> = {
  person: [{ d: 'M12 4.4a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 1 0 0-7.2Z', cls: 'vs-gl-head' }, { d: 'M5 20c1.2-3.6 3.8-5.4 7-5.4s5.8 1.8 7 5.4' }],
  mail: [{ d: 'M5 6h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z' }, { d: 'M3.6 7.4 12 13l8.4-5.6', cls: 'vs-gl-flap' }],
  phone: [{ d: 'M6.6 3.5h2.9l1.5 4-2 1.3a11 11 0 0 0 5.2 5.2l1.3-2 4 1.5v2.9a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z' }],
  globe: [{ d: 'M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18Z' }, { d: 'M12 3c-2.6 2.4-3.8 5.4-3.8 9s1.2 6.6 3.8 9c2.6-2.4 3.8-5.4 3.8-9S14.6 5.4 12 3Z', cls: 'vs-gl-meridian' }, { d: 'M3.6 9h16.8M3.6 15h16.8' }],
  euro: [{ d: 'M17.5 6.4a7 7 0 1 0 0 11.2' }, { d: 'M4.5 10.4h9M4.5 13.6h9', cls: 'vs-gl-bars' }],
  building: [{ d: 'M5 21V5.5L12 3v18M12 8h7v13M4 21h16' }, { d: 'M8 8v.01M8 12v.01M8 16v.01M15.5 12v.01M15.5 16v.01', cls: 'vs-gl-windows' }],
  chat: [{ d: 'M4 5.5h16v10.5H9.5L5 19.5V16H4Z' }, { d: 'M8 10.5h.01M12 10.5h.01M16 10.5h.01', cls: 'vs-gl-dots' }],
}

/**
 * The icon at the start of a field. It nudges when the field takes focus, and a tick
 * draws itself in its place once the value is good.
 */
export default function FieldIcon({ name }: { name: FieldIconName }) {
  return (
    <span className="vs-field-icon" data-glyph={name} aria-hidden="true">
      <svg className="vs-field-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" focusable="false">
        {GLYPHS[name].map((part, i) => <path key={i} d={part.d} className={part.cls} />)}
      </svg>
      <svg className="vs-field-done" viewBox="0 0 24 24" fill="none" focusable="false">
        <path d="M5.5 12.5 10 17l8.5-9" pathLength={1} />
      </svg>
    </span>
  )
}
