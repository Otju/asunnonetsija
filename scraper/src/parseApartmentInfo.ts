import { readFromFile, writeToFile } from './fileEditor'
import { ApartmentInfo, Renovation } from '../../types'
import { PreInfo } from './getPreInfo'

const getRawApartmentInfo = () => {
  return readFromFile('rawApartmentInfos.json', 'JSON')
}

interface InfoTableRow {
  title: string
  value: string
}

const toNumber = (string: string): number => {
  return parseFloat(
    string
      .replace(',', '.')
      .replace('m2', '')
      .replace(/[^0-9.]/g, '')
  )
}

const toBoolean = (string: string): boolean => {
  const lcstring = string.toLowerCase()
  return lcstring === 'kyllä' || lcstring === 'kylla'
}

const parseOtherFees = (string: string): number => {
  const matching = string.match(/[0-9.,]+(e|"EUR"| |€)/g)
  const fees: number[] = []
  matching?.forEach((match) => {
    const asNumber = toNumber(match)
    if (asNumber && asNumber < 2000) {
      fees.push(asNumber)
    }
  })
  const feesum = fees?.reduce((acc, cur) => acc + cur, 0)
  return feesum
}

const parseInfoTableRow = ({ title, value }: InfoTableRow) => {
  const fields = [
    { fin: 'Sijainti', eng: 'address' },
    { fin: 'Kaupunginosa', eng: 'district' },
    { fin: 'Asuinpinta-ala', eng: 'sqrMeters', operation: toNumber },
    { fin: 'Velaton hinta', eng: 'loanFreePrice', operation: toNumber },
    { fin: 'Myyntihinta', eng: 'sellingPrice', operation: toNumber },
    { fin: 'Neliöhinta', eng: 'pricePerSqrMeter', operation: toNumber },
    { fin: 'Huoneiston kokoonpano', eng: 'rooms' },
    { fin: 'Huoneita', eng: 'roomAmount', operation: toNumber },
    { fin: 'Kunto', eng: 'condition' },
    { fin: 'Rakennuksen tyyppi', eng: 'houseType' },
    { fin: 'Asumistyyppi', eng: 'livingType' },
    { fin: 'Uudiskohde', eng: 'newBuilding', operation: toBoolean },
    { fin: 'Rakennusvuosi', eng: 'buildYear', operation: toNumber },
    { fin: 'Rahoitusvastike', eng: 'loanFee', operation: toNumber },
    { fin: 'Hoitovastike', eng: 'maintananceFee', operation: toNumber },
    { fin: 'Vesimaksu', eng: 'waterFee', operation: toNumber },
    { fin: 'Muut kustannukset', eng: 'otherFees', operation: parseOtherFees },
    { fin: 'Tehdyt remontit', eng: 'renovationsDoneString' },
    { fin: 'Tulevat remontit', eng: 'renovationsComingString' },
  ]
  const field = fields.find((field) => field.fin === title)
  if (field) {
    const newValue = field?.operation ? field.operation(value) : value
    return [field.eng, newValue]
  }
  return null
}

interface Tags {
  strict: string[]
  parts: string[]
}

interface ParsedTag {
  tag: string
  strict: boolean
}

const searchTags = (string: string, tags: Tags) => {
  let hasTag = false
  let timeOfRenovation: number | undefined
  const lowerCaseString = string.toLowerCase()
  const parsedTags: ParsedTag[] = []
  tags.strict.forEach((tag) => parsedTags.push({ tag, strict: true }))
  tags.parts.forEach((tag) => parsedTags.push({ tag, strict: false }))
  parsedTags.forEach(({ tag, strict }) => {
    const regex = strict ? new RegExp(`(^|[ -])${tag}($|[ -])`) : new RegExp(`${tag}`)
    const matches = lowerCaseString.match(regex)
    if (matches) {
      const firstMatch = matches[0]
      const stringParts = lowerCaseString.split(/[,.]/)
      const matchingPart = stringParts.find((part) => part.includes(firstMatch))
      if (matchingPart) {
        if (matchingPart.includes('-')) {
          timeOfRenovation = matchingPart
            .split('-')
            .map((item) => toNumber(item))
            .reduce((prev, curr) => {
              if (!curr || curr === 0) {
                return prev
              }
              return curr < prev ? curr : prev
            })
        } else {
          timeOfRenovation = toNumber(matchingPart)
        }
      }
      hasTag = true
    }
  })
  return { hasTag, timeOfRenovation }
}

const parseRenovations = ({
  sqrMeters,
  renovationsComingString,
  renovationsDoneString,
  buildYear,
}: ApartmentInfo): Renovation[] => {
  const renovations: Renovation[] = []
  const renovationTypes = [
    {
      type: 'Putkiremontti',
      costPerSqrMeter: 1000,
      tags: {
        strict: ['lvi', 'lvis', 'lvisa', 'vevi', 'lvvias'],
        parts: ['viermär', 'putki', 'vesijohto', 'linjasan', 'kylpy'],
      },
    },
  ]
  let timeTo: number | null = null
  let renovationComing = false
  let renovationDone = false
  const currentYear = new Date().getFullYear()

  if (renovationsComingString) {
    const { hasTag, timeOfRenovation } = searchTags(
      renovationsComingString,
      renovationTypes[0].tags
    )
    if (hasTag) {
      timeTo = timeOfRenovation ? timeOfRenovation - currentYear : 1
      renovationComing = true
    }
  }

  if (renovationsDoneString && !renovationComing) {
    const { hasTag } = searchTags(renovationsDoneString, renovationTypes[0].tags)
    if (hasTag) {
      renovationDone = true
    }
  }

  if (!renovationComing && !renovationDone) {
    const buildingAge = currentYear - (buildYear || 0)
    const timeToRenovation = 50 - buildingAge
    if (timeToRenovation > 0) {
      timeTo = timeToRenovation
      renovationComing = true
    }
  }

  if (renovationComing && timeTo) {
    const cost = renovationTypes[0].costPerSqrMeter * sqrMeters

    renovations.push({
      type: 'Putkiremontti',
      cost,
      timeTo,
    })
  }
  return renovations
}

const parseAllInfoTableRows = async (
  infoTableRows: InfoTableRow[],
  additionalFields: string[][]
) => {
  const parsedRows: (string | boolean | number)[][] = []
  infoTableRows.forEach((row) => {
    const parsedRow = parseInfoTableRow(row)
    if (parsedRow) {
      parsedRows.push(parsedRow)
    }
  })
  if (parsedRows.length === 0) {
    return
  }
  const apartmentInfo = Object.fromEntries([...parsedRows, ...additionalFields])
  apartmentInfo.bigRenovations = parseRenovations(apartmentInfo)
  apartmentInfo.travelTimes = []
  return apartmentInfo
}

const checkApartmentInfoValidity = (info: ApartmentInfo): boolean => {
  if ((!info.loanFreePrice && !info.sellingPrice) || info.loanFreePrice < 1000) {
    return false
  }
  return true
}

const getApartmentInfos = async () => {
  const rawApartmentInfo = getRawApartmentInfo()
  const preInfo: PreInfo[] = readFromFile('preApartmentInfo.json', 'JSON')
  const apartmentInfos: ApartmentInfo[] = []
  let invalidCount = 0
  for (const { link, infoTableRows } of rawApartmentInfo) {
    if (infoTableRows.length !== 0) {
      const { imageLink, coordinates } = preInfo.find((info) => info.link === link) || {}
      const info = await parseAllInfoTableRows(infoTableRows, [
        ['link', link],
        ['imageLink', imageLink],
        ['coordinates', coordinates],
      ])
      const valid = checkApartmentInfoValidity(info)
      if (valid) {
        apartmentInfos.push(info)
      } else {
        invalidCount++
      }
    }
  }
  console.log('Invalid apartments', invalidCount)
  writeToFile('apartmentInfos.json', apartmentInfos, 'JSON', true)
}

export default getApartmentInfos
