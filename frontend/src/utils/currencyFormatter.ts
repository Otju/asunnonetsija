import roundTo from 'round-to'

const formatCurrency = (value: number, roundDigit: number = 0): string => {
  const roundedValue = roundTo(value, roundDigit)
  return new Intl.NumberFormat('fi-FI', {
    style: 'currency',
    currency: 'EUR',
  })
    .format(roundedValue)
    .replace(',00', '')
}

export default formatCurrency
