import { gql } from 'apollo-server'
import types from './types'
import queries from './queries'
import mutations from './mutations'

const typeDefs = gql`
  ${types}
  ${queries}
  ${mutations}
`

export default typeDefs
