import { Coordinates, ApartmentInfo, Renovation } from './typesFromRuntypes'

export interface Destination {
  destination: string
  coordinates: Coordinates
}

export interface ParsedApartmentInfo extends ApartmentInfo {
  city: string
  loanFee: number
  maintananceFee: number
  otherFees: number
  totalFees: number
  ownLoanFee: number
  bathroomRenovation: Renovation
  housingBenefit: number
}

export type DistrictType = 'ruotsiAla' | 'ruotsiYla' | 'suomiAla' | 'suomiYla'

export interface RawApartmentInfo extends ApartmentInfo {
  renovationsComingString: string
  renovationsDoneString: string
  bigRenovations: Renovation[]
}

export type PossibleDestination =
  | 'Aalto Yliopisto'
  | 'Helsingin Yliopisto'
  | 'Papinmäentie 10'
  | 'Helsingin rautatieasema'

export type ApartmentInfoField = 'totalFees' | 'pricePerSqrMeter' | 'sqrMeters'

export interface FilterField {
  name: ApartmentInfoField | PossibleDestination
  displayName: string
  defaultMin?: number
  defaultMax: number
  unit?: string
}

export interface FilterSetting {
  name: ApartmentInfoField | PossibleDestination
  min: number
  max: number
}

export interface LoanSettings {
  loanYears: number
  yearlyIntrest: number
  savings: number
}

export interface SearchOptions {
  filterSettings: FilterSetting[]
  loanSettings?: LoanSettings
}

export interface District {
  name: string
  coordinates: number[][]
}
