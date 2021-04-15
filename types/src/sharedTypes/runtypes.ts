import { Boolean, Number, String, Record, Optional, Array } from 'runtypes'

export const Renovation = Record({
  type: String,
  cost: Number,
  timeTo: Number.withConstraint((number) => number <= 70),
  monthlyCost: Optional(Number),
})

export const Coordinates = Record({
  lat: Number,
  lon: Number,
})

export const TravelTime = Record({
  destination: String,
  duration: Number,
})

export const ApartmentInfo = Record({
  link: String,
  address: String,
  district: String,
  sqrMeters: Number,
  loanFreePrice: Number,
  sellingPrice: Optional(Number),
  pricePerSqrMeter: Optional(Number),
  rooms: Optional(String),
  roomAmount: Optional(Number),
  condition: Optional(String), //'Erinomainen' | 'Hyvä' | 'Tyydyttävä' | 'Välttävä' | 'Huono' | 'Uusi'
  houseType: Optional(String), //'Kerrostalo' | 'Rivitalo' | 'Paritalo' | 'Omakotitalo' | 'Puutalo-osake'
  livingType: Optional(String), //'Omistus' | 'Osaomistus' | 'Asumisoikeus'
  plotType: Optional(String), //'Oma' | 'Vuokralla' | 'Valinnainen vuokratontti'
  newBuilding: Optional(Boolean),
  buildYear: Optional(Number),
  loanFee: Optional(Number),
  maintananceFee: Optional(Number),
  waterFee: Optional(Number),
  otherFees: Optional(Number),
  bigRenovations: Array(Renovation),
  coordinates: Coordinates,
  imageLink: String,
  smallDistrict: String,
  bigDistrict: String,
  travelTimes: Array(TravelTime),
})
