const apartmentFields = `link: String!
address: String!
district: String
sqrMeters: Float!
loanFreePrice: Float!
sellingPrice: Float
pricePerSqrMeter: Float
rooms: String
roomAmount: Int
condition: String
houseType: String
livingType: String
plotType: String
newBuilding: Boolean
buildYear: Int
loanFee: Float
maintananceFee: Float
waterFee: Float
otherFees: Float
imageLink: String!
smallDistrict: String
bigDistrict: String
`

const renovationFields = `
type: String!
cost: Float!
timeTo: Int!
monthlyCost: Float
`

const coordinateFields = `
lat: Float!
lon: Float!
`

const types = `
type Renovation{
  ${renovationFields}
}

type Coordinates{
  ${coordinateFields}
}

input RenovationInput{
  ${renovationFields}
}

input CoordinatesInput{
  ${coordinateFields}
}

type Apartment {
  ${apartmentFields}
  travelTimes: [TravelTime!]!
  coordinates: Coordinates!
  bigRenovations: [Renovation!]!
}

input ApartmentInput {
  ${apartmentFields}
  coordinates: CoordinatesInput!
  bigRenovations: [RenovationInput!]!
}

type TravelTime {
  destination: String!
  duration: Int!
}
`

export default types
