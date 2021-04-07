const mutations = `
type Mutation {
  addDestination(destination: String!): String
  updateApartments(apartments: [ApartmentInput!]!): String
}
`

export default mutations
