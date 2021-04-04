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

const types = `
type Apartment {
  ${apartmentFields}
  travelTimes: [TravelTime!]!
}

input ApartmentInput {
  ${apartmentFields}
}

type TravelTime {
  destination: String!
  duration: Int!
}
`

/*
bigRenovations: [Renovation!]!
    coordinates: Coordinates!
*/

export default types
