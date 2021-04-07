import { query } from '../../db'
import { getCoordinates, getTravelTimeFromCoordinates } from '../../utils/travelTimeCalculation'
import { ApolloError } from 'apollo-server'

const addDestination = async (_root, args) => {
  const { destination } = args
  const { lat, lon } = await getCoordinates(destination)
  if (!lat || !lon) {
    throw new ApolloError(`Couln't find coordinates for destination ${destination}`)
  }
  //const client = await getClient()
  try {
    //await client.query('BEGIN')
    await query('INSERT INTO destinations(destination, lat, lon) VALUES($1, $2, $3)', [
      destination,
      lat,
      lon,
    ])
    const res = await query(`SELECT * FROM apartments;`)
    const apartments = res.rows.slice(0, 20)
    const addresses = []
    const destinations = []
    const travelTimes = []
    let i = 1
    for await (const { address, coordinates } of apartments) {
      const travelTime = await getTravelTimeFromCoordinates({ lat, lon }, coordinates)
      console.log(i)
      i++
      addresses.push(address)
      destinations.push(destination)
      travelTimes.push(travelTime)
    }
    /*
    await Promise.all(
      apartments.map(async ({ address, coordinates }, i: number) => {
        const travelTime = await getTravelTimeFromCoordinates({ lat, lon }, coordinates)
        addresses.push(address)
        destinations.push(destination)
        travelTimes.push(travelTime)
      })
    )
    */
    await query(
      'INSERT INTO "travelTimes" (address, destination, duration) SELECT * FROM UNNEST ($1::text[], $2::text[], $3::integer[])',
      [addresses, destinations, travelTimes]
    )
    //await client.query('COMMIT')
    return `Added ${destination} to destinations and calculated travelTimes for it`
  } catch (e) {
    //await client.query('ROLLBACK')
    throw new ApolloError(e.message)
  }
}

export default addDestination
