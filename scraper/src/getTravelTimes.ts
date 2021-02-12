import { request, gql } from 'graphql-request'
import fetch from 'node-fetch'
import { TravelTime, Coordinates, Destination } from '../../types'

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
  console.log(from, to)
  const query = gql`
  {
    plan(
      from: {lat: ${from.lat}, lon: ${from.lon}}
      to: {lat: ${to.lat}, lon: ${to.lon}},
      date: "2021-01-21",
      time: "08:00:00",
    ) {
      itineraries {
        duration
      }
    }
  }
`
  const data = await request(
    'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
    query
  )
  interface durationObject {
    duration: number
  }
  console.log(data)
  const durations = data.plan.itineraries.map((item: durationObject) => item.duration)
  const bestDuration = Math.round(Math.min(...durations) / 60)
  return bestDuration
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
