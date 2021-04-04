const mutations = `
type Mutation {
  addEndLocation(address: String!): String!
  updateApartments(apartments: [ApartmentInput!]!): String
}
`

export default mutations
