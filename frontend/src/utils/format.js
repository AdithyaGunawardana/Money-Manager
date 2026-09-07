const amountFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})

export function formatAmount(value) {
  const amount = Number(value)
  return Number.isFinite(amount) ? amountFormatter.format(amount) : '0.00'
}
