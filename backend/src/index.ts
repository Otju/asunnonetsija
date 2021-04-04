require('dotenv').config()
import { ApolloServer } from 'apollo-server'
import typeDefs from './typedefs'
import resolvers from './resolvers'

const serverConfig = { typeDefs, resolvers }

const server = new ApolloServer(serverConfig)

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
