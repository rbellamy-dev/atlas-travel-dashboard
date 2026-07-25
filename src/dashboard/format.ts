export const num = new Intl.NumberFormat('en-US')
export const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })
export const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})
export const pct = (n: number) => `${Math.round(n)}%`
