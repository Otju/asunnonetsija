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

const pointOfIntrestFields = `
type: String!
name: String!
directDistance: Float!
`

const types = `
type Renovation{
  ${renovationFields}
}

type Coordinates{
  ${coordinateFields}
}

type PointOfIntrest{
  ${pointOfIntrestFields}
  coordinates:Coordinates!
}

input RenovationInput{
  ${renovationFields}
}

input CoordinatesInput{
  ${coordinateFields}
}

input PointOfIntrestInput{
  ${pointOfIntrestFields}
  coordinates:CoordinatesInput!
}


type Apartment {
  ${apartmentFields}
  pointsOfIntrest: [PointOfIntrest!]!
  coordinates: Coordinates!
  bigRenovations: [Renovation!]!
}

input ApartmentInput {
  ${apartmentFields}
  pointsOfIntrest: [PointOfIntrestInput!]!
  coordinates: CoordinatesInput!
  bigRenovations: [RenovationInput!]!
}

`

export default types
