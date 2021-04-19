import bigDistricts from './data/bigDistricts.json'
import { Coordinates } from './sharedTypes/typesFromRuntypes'
const allDistrictEdgeCoordinates = [].concat.apply(
  [],
  bigDistricts.map(({ coordinates }: any) => coordinates)
)

export const getBoundaries = () => {
  const allLats = allDistrictEdgeCoordinates.map((item) => item[1])
  const allLons = allDistrictEdgeCoordinates.map((item) => item[0])

  const maxLat = Math.max(...allLats) //60.4182
  const minLat = Math.min(...allLats) //60.0837
  const maxLon = Math.max(...allLons) //25.1977
  const minLon = Math.min(...allLons) //24.5717
  return { maxLat, minLat, maxLon, minLon }
}

export const isInBoundaries = ({ lat, lon }: Coordinates): boolean => {
  const { maxLat, minLat, maxLon, minLon } = getBoundaries()
  return lat <= maxLat && lat >= minLat && lon <= maxLon && lon >= minLon
}
