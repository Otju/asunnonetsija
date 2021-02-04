export interface TravelTime {
  destination: string
  duration: number
}

export interface Coordinates {
  lat: number
  lon: number
}

export interface Destination {
  destination: string
  coordinates: Coordinates
}

export interface Renovation {
  type: string //'Putkiremontti'
  cost: number
  timeTo: number
  monthlyCost?: number
}

export interface ApartmentInfo {
  link: string
  address: string
  district: string
  sqrMeters: number
  loanFreePrice?: number
  sellingPrice?: number
  pricePerSqrMeter?: number
  rooms?: string
  roomAmount?: number
  condition?: string //'Erinomainen' | 'Hyvä' | 'Tyydyttävä' | 'Välttävä' | 'Huono' | 'Uusi'
  houseType?: string //'Kerrostalo' | 'Rivitalo' | 'Paritalo' | 'Omakotitalo' | 'Puutalo-osake'
  livingType?: string //'Omistus' | 'Osaomistus' | 'Asumisoikeus'
  plotType?: string //'Oma' | 'Vuokralla' | 'Valinnainen vuokratontti'
  newBuilding?: boolean
  buildYear?: number
  loanFee?: number
  maintananceFee?: number
  waterFee?: number
  otherFees?: number
  bigRenovations: Renovation[]
  renovationsDoneString?: string
  renovationsComingString?: string
  travelTimes: TravelTime[]
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

export type PossibleDestinations =
  | 'Aalto Yliopisto'
  | 'Helsingin Yliopisto'
  | 'Papinmäentie 15 B'
  | 'Helsingin rautatieasema'

export interface SearchOption {
  field: 'totalFees' | 'pricePerSqrMeter' | 'sqrMeters' | 'travelTime'
  destination?: PossibleDestinations
  displayName: string
  min?: number
  max?: number
  defaultMin?: number
  defaultMax: number
  trueMax?: number
  unit?: string
}
