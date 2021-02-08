import { TravelFilterField, GeneralFilterField } from '../../../types'

interface GenerateTrueMaxInput {
  filterField: TravelFilterField | GeneralFilterField
  min: number
  max: number
}

const generateTrueMax = ({ filterField, min, max }: GenerateTrueMaxInput) => {
  let defaultMax = filterField.defaultMax

  let noTrueMax = false

  if (defaultMax / max >= 0.7) {
    defaultMax = max
    noTrueMax = true
  }

  return {
    defaultMax: defaultMax,
    defaultMin: min,
    trueMax: noTrueMax ? undefined : max,
  }
}

export default generateTrueMax
