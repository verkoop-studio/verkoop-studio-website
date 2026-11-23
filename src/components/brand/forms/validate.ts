/** Field rules shared by every form. Each returns true when the value is good to send. */
export const validName = (value: string) => (value.match(/\p{L}/gu)?.length ?? 0) >= 2
export const validEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
export const validPhone = (value: string) => value.replace(/\D/g, '').length >= 9

/** Groups a Belgian number as it is typed: +32 470 12 34 56, or 0470 12 34 56. Other numbers keep their own spacing. */
export function formatPhone(raw: string) {
  let value = raw.replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '')
  if (value.startsWith('00')) value = `+${value.slice(2)}`
  const group = (digits: string, sizes: number[]) => {
    const parts: string[] = []
    let rest = digits
    for (const size of sizes) {
      if (!rest) break
      parts.push(rest.slice(0, size))
      rest = rest.slice(size)
    }
    if (rest) parts.push(rest)
    return parts.join(' ')
  }
  if (value.startsWith('+32')) return `+32 ${group(value.slice(3), [3, 2, 2, 2])}`.trimEnd()
  if (value.startsWith('0')) return group(value, [4, 2, 2, 2])
  return raw
}
