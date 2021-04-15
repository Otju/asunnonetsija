import fetch from 'node-fetch'
import { request, gql } from 'graphql-request'
import { Coordinates } from '../sharedTypes/typesFromRuntypes'

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

export const getTravelTimeFromCoordinates = async (from: Coordinates, to: Coordinates) => {
  const query = gql`
  query {
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
    const data = await request(`http://routefinder:8080/otp/routers/hsl/index/graphql`, query)
    interface durationObject {
      duration: number
    }
    const durations = data.plan.itineraries.map((item: durationObject) => item.duration)
    const bestDuration = Math.round(Math.min(...durations) / 60)
    return bestDuration
  } catch (e) {
    console.log(e.message)
    return 0
  }
}
