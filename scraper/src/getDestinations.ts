import { getCoordinates } from './getTravelTimes'
import { Destination } from '../../types'

const getDestinations = async () => {
  const destinations = ['Aalto Yliopisto', 'Helsingin rautatieasema']
  const destinationsWithCoordinates: Destination[] = []
  for (const destination of destinations) {
    const coordinates = await getCoordinates(destination)
    destinationsWithCoordinates.push({ destination, coordinates })
  }
  return destinationsWithCoordinates
}

export default getDestinations
