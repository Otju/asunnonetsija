import apartmentInfo from './data/apartmentInfos.json'
import allPointsOfIntrest from './data/pointsOfIntrest.json'
//import schools from './data/schools.json'
//import schooLDistricts from './data/schoolDistricts.json'
import { ApartmentInfo, PointOfIntrest, RawPointOfIntrest } from './sharedTypes/typesFromRuntypes'
import { RawPointOfIntrest as RawPointOfIntrestRunType } from './sharedTypes/runtypes'
import { writeToFile } from './fileEditor'
import calcDistance from 'haversine-distance'

const getPointsOfIntrest = async () => {
  //@ts-ignore
  const withPointsOfInterst = apartmentInfo.map(
    ({ coordinates, ...otherFields }: ApartmentInfo) => {
      const pointsOfIntrest: PointOfIntrest[] = Object.values(allPointsOfIntrest).map(
        (rawPointsOfIntrest) => {
          const rawPoints: RawPointOfIntrest[] = rawPointsOfIntrest.map((item) =>
            RawPointOfIntrestRunType.check(item)
          )
          let closestPlace: PointOfIntrest = { ...rawPoints[0], directDistance: Infinity }
          rawPoints.forEach((point) => {
            const directDistance = calcDistance(coordinates, point.coordinates)
            if (directDistance < closestPlace.directDistance) {
              closestPlace = { ...point, directDistance }
            }
          })
          return closestPlace
        }
      )
      return { coordinates, ...otherFields, pointsOfIntrest }
    }
  )
  writeToFile('apartmentInfoWithPointsOfInterst.json', withPointsOfInterst, 'JSON')
}

export default getPointsOfIntrest
