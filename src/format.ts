export function naira(amount: string): string {
  const negative = amount.startsWith('-')
  const [whole = '0', fraction = '00'] = amount.replace('-', '').split('.')
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return `${negative ? '-' : ''}₦${grouped}.${fraction.padEnd(2, '0')}`
}

export function isZero(amount: string): boolean {
  return /^-?0+(\.0+)?$/.test(amount)
}

export function time(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export function randomKey(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`
}

export function toId(name: string, fallback: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64)
  return slug || fallback
}

export function displayName(id: string): string {
  return id
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part[0]!.toUpperCase() + part.slice(1))
    .join(' ')
}

export function cleanNaira(input: string): string {
  return input.replace(/[₦,\s]/g, '')
}
