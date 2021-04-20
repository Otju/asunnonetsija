import apartmentInfo from './data/apartmentInfos.json'
import allPointsOfIntrest from './data/pointsOfIntrest.json'
import schools from './data/schools.json'
import schoolDistricts from './data/schoolDistricts.json'
import {
  ApartmentInfo,
  Coordinates,
  PointOfIntrest,
  RawPointOfIntrest,
  SchoolDistrictType,
} from './sharedTypes/typesFromRuntypes'
import {
  RawPointOfIntrest as RawPointOfIntrestRunType,
  SchoolDistrictType as SchoolDistrictTypeRunType,
  School,
} from './sharedTypes/runtypes'
import { writeToFile } from './fileEditor'
import calcDistance from 'haversine-distance'
import { isInPolygon } from './coordinateCalc'

const getPointsOfIntrest = async () => {
  //@ts-ignore
  const withPointsOfInterst = apartmentInfo.map(
    ({ coordinates, ...otherFields }: ApartmentInfo) => {
      let pointsOfIntrest: PointOfIntrest[] = getMostPointsOfIntrest(coordinates)
      pointsOfIntrest = [...pointsOfIntrest, ...getSchoolPointsOfIntrest(coordinates)]
      return { coordinates, ...otherFields, pointsOfIntrest }
    }
  )
  writeToFile('apartmentInfoWithPointsOfInterst.json', withPointsOfInterst, 'JSON')
}

const findClosestPoint = (apartmentCoordinates: Coordinates, points: RawPointOfIntrest[]) => {
  let closestPlace: PointOfIntrest = { ...points[0], directDistance: Infinity }
  points.forEach((point) => {
    const directDistance = calcDistance(apartmentCoordinates, point.coordinates)
    if (directDistance < closestPlace.directDistance) {
      closestPlace = { ...point, directDistance }
    }
  })
  return closestPlace
}

const getMostPointsOfIntrest = (coordinates: Coordinates) => {
  return Object.values(allPointsOfIntrest).map((rawPointsOfIntrest) => {
    const rawPoints: RawPointOfIntrest[] = rawPointsOfIntrest.map((item) =>
      RawPointOfIntrestRunType.check(item)
    )
    return findClosestPoint(coordinates, rawPoints)
  })
}

const getSchoolPointsOfIntrest = (coordinates: Coordinates) => {
  const schoolsForApartment: PointOfIntrest[] = Object.entries(schoolDistricts).map(
    ([rawType, districtsOfType]) => {
      const schoolDistrictType: SchoolDistrictType = SchoolDistrictTypeRunType.check(rawType)
      const districtForAparment = districtsOfType.find((district) =>
        isInPolygon(coordinates, district.coordinates)
      )
      const schoolsInDistrcit = schools.filter(
        (school) =>
          school?.districts[schoolDistrictType] === districtForAparment?.name &&
          school.type === schoolDistrictType
      )
      const nearestSchool = findClosestPoint(
        coordinates,
        schoolsInDistrcit.map((school) => {
          const schoolAsType = School.check(school)
          const { coordinates, type, name } = schoolAsType
          return { coordinates, type, name }
        })
      )
      return nearestSchool
    }
  )
  const lukios: RawPointOfIntrest[] = []
  schools.forEach(({ coordinates, type, name }) => {
    if (type === 'lukio') {
      lukios.push({ coordinates, type, name })
    }
  })
  const closestLukio = findClosestPoint(coordinates, lukios)
  return [...schoolsForApartment, closestLukio]
}

export default getPointsOfIntrest
