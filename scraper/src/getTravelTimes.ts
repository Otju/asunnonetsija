import { request, gql } from 'graphql-request'
import fetch from 'node-fetch'
import { TravelTime, Coordinates } from './sharedTypes/typesFromRuntypes'
import { Destination } from './sharedTypes/types'

export const getCoordinates = async (address: string): Promise<Coordinates> => {
  const response = await fetch(
    `https://api.digitransit.fi/geocoding/v1/search?text=${address.replace(' ', '+')}&size=1`
  )

  const json = await response.json()

  const coordinates = json.bbox

  return {
    lat: coordinates[1],
    lon: coordinates[0],
  }
}

const getTravelTimeFromCoordinates = async (from: Coordinates, to: Coordinates) => {
  const query = gql`
  {
    plan(
      from: {lat: ${from.lat}, lon: ${from.lon}}
      to: {lat: ${to.lat}, lon: ${to.lon}},
    ) {
      itineraries {
        duration
      }
    }
  }
`
  try {
    const data = await request('http://localhost:4000/otp/routers/hsl/index/graphql', query)
    interface durationObject {
      duration: number
    }
    const durations = data.plan.itineraries.map((item: durationObject) => item.duration)
    const bestDuration = Math.round(Math.min(...durations) / 60)
    console.log(bestDuration)
    return bestDuration
  } catch (e) {
    console.log(e.message)
    return 0
  }
}

const getTravelTimes = async (from: Coordinates, toDestinations: Destination[]) => {
  const travelTimes: TravelTime[] = []
  try {
    for (const { destination, coordinates } of toDestinations) {
      const duration = await getTravelTimeFromCoordinates(from, coordinates)
      travelTimes.push({ destination, duration })
    }
  } catch (e) {
    console.error(e.message)
  }
  return travelTimes
}

export default getTravelTimes
