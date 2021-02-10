import getTravelTimes from './getTravelTimes'
import getDestinations from './getDestinations'
import { ApartmentInfo } from '../../types'
import { readFromFile, writeToFile } from './fileEditor'
import progressBar from './progressBar'

const getAllTravelTimes = async () => {
  const apartmentInfos: ApartmentInfo[] = readFromFile('apartmentInfos.json', 'JSON')
  const destinations = await getDestinations()
  const apartmentInfosWithTravelTimes: ApartmentInfo[] = []
  progressBar.start(apartmentInfos.length, 0)
  for (const apartmentInfo of apartmentInfos) {
    progressBar.increment()
    const travelTimes = await getTravelTimes(apartmentInfo.address, destinations)
    apartmentInfosWithTravelTimes.push({ ...apartmentInfo, travelTimes })
  }
  progressBar.stop()
  writeToFile('apartmentInfos.json', apartmentInfosWithTravelTimes, 'JSON')
}

export default getAllTravelTimes
