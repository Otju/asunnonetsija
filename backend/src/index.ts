require('dotenv').config()
import { ApolloServer } from 'apollo-server'
import typeDefs from './typedefs'
import resolvers from './resolvers'

const serverConfig = { typeDefs, resolvers }

const server = new ApolloServer(serverConfig)

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
