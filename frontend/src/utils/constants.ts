import { PossibleDestination, FilterField } from '../../../types'

export const possibleDestinations: PossibleDestination[] = [
  'Aalto Yliopisto',
  'Helsingin rautatieasema',
]

export const generalFilterFields: FilterField[] = [
  {
    name: 'totalFees',
    displayName: 'Kokonaiskulut',
    defaultMax: 1200,
    unit: '€/kk',
  },
  {
    name: 'pricePerSqrMeter',
    displayName: 'Neliöhinta',
    defaultMax: 6000,
    unit: '€/m²',
  },
  { name: 'sqrMeters', displayName: 'Pinta-ala', defaultMax: 200, unit: 'm²' },
]

export const travelFilterFields: FilterField[] = possibleDestinations.map((destination) => ({
  displayName: destination,
  defaultMax: 120,
  unit: 'min',
  name: destination,
}))
