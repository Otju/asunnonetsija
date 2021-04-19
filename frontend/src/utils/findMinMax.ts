import { PossibleDestination, ParsedApartmentInfo, ApartmentInfoField } from '../sharedTypes/types'
import { possibleDestinations } from '../utils/constants'

const NumberArrayMinMax = (numberArray: (number | undefined)[]) => {
  const min =
    numberArray.reduce((prev, current) => ((prev || 0) < (current || 0) ? prev : current)) || 0
  const max =
    numberArray.reduce((prev, current) => ((prev || 0) > (current || 0) ? prev : current)) || 0
  return {
    min: Math.floor(min),
    max: Math.ceil(max),
  }
}

export const findMinMax = (
  apartmentInfos: ParsedApartmentInfo[],
  name: ApartmentInfoField | PossibleDestination
) => {
  const numberArray = apartmentInfos.map((info) => {
    return possibleDestinations.includes(name as PossibleDestination)
      ? info.pointsOfIntrest.find((item) => item.name === name)?.directDistance
      : info[name as ApartmentInfoField]
  })
  return NumberArrayMinMax(numberArray)
}
