import { PossibleDestination, ParsedApartmentInfo, ApartmentInfoField } from '../../../types'

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

export const generalFilterMinMax = (
  apartmentInfos: ParsedApartmentInfo[],
  field: ApartmentInfoField
) => {
  return NumberArrayMinMax(apartmentInfos.map((info) => info[field]))
}

export const travelFilterMinMax = (
  apartmentInfos: ParsedApartmentInfo[],
  destination: PossibleDestination
) => {
  const numberArray = apartmentInfos.map(
    (info) => info.travelTimes.find((item) => item.destination === destination)?.duration
  )
  return NumberArrayMinMax(numberArray)
}
