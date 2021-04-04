import getTravelTimes from './getTravelTimes'
import getDestinations from './getDestinations'
import { ApartmentInfo } from '../../types'
import { readFromFile, writeToFile } from './fileEditor'
import progressBar from './progressBar'

const getAllTravelTimes = async () => {
  let apartmentInfos: ApartmentInfo[] = readFromFile('apartmentInfos.json', 'JSON')
  const destinations = await getDestinations()
  apartmentInfos = apartmentInfos.slice(0, 10)
  const apartmentInfosWithTravelTimes: ApartmentInfo[] = []
  progressBar.start(apartmentInfos.length, 0)
  await Promise.all(
    apartmentInfos.map(async (apartmentInfo) => {
      const travelTimes = await getTravelTimes(apartmentInfo.coordinates, destinations)
      apartmentInfosWithTravelTimes.push({ ...apartmentInfo, travelTimes })
      progressBar.increment()
      return null
    })
  )

  progressBar.stop()
  writeToFile('apartmentInfosWithTravelTimes.json', apartmentInfosWithTravelTimes, 'JSON')
}

export default getAllTravelTimes
