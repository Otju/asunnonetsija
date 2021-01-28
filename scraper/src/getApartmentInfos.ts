import got from 'got'
import cheerio from 'cheerio'
import { readFromFile, writeToFile } from './fileEditor'
import getTravelTimes from './getTravelTimes'
import { Destination, ApartmentInfo, Renovation } from '../../types'
import getDestinations from './getDestinations'

const getLinksFromFile = () => {
  const links = readFromFile('apartmentLinks.csv', 'CSV')
  return links
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
    if (asNumber) {
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
  let timeToRenovation: number | undefined
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
        timeToRenovation = toNumber(matchingPart)
      }
      hasTag = true
    }
  })
  return { hasTag, timeToRenovation }
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
        parts: ['viermär', 'putki', 'vesijohto', 'linjasan'],
      },
    },
  ]
  let timeTo: number | null = null
  let renovationComing = false
  let renovationDone = false

  if (renovationsComingString) {
    const { hasTag, timeToRenovation } = searchTags(
      renovationsComingString,
      renovationTypes[0].tags
    )
    if (hasTag) {
      timeTo = timeToRenovation || 1
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
    const currentYear = new Date().getFullYear()
    const buildingAge = currentYear - buildYear
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
  additionalFields: string[][],
  destinations: Destination[]
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
  apartmentInfo.travelTimes = await getTravelTimes(apartmentInfo.address, destinations)
  return apartmentInfo
}

const getInfoTableRows = async (link: string): Promise<InfoTableRow[]> => {
  try {
    const response = await got(link)
    const $ = cheerio.load(response.body)
    const infoTableRows: InfoTableRow[] = []
    $('.info-table__row').each((_i, item) => {
      const title = $(item).find('.info-table__title').text()
      const value = $(item).find('.info-table__value').text()
      if (title && value) {
        infoTableRows.push({ title, value })
      }
    })
    return infoTableRows
  } catch (e) {
    console.error(e.message, link)
    return []
  }
}

const getApartmentInfos = async () => {
  const destinations = await getDestinations()
  const links = getLinksFromFile()
  const apartmentInfos: ApartmentInfo[] = []
  for (const link of links) {
    const infoTableRows = await getInfoTableRows(link)
    apartmentInfos.push(await parseAllInfoTableRows(infoTableRows, [['link', link]], destinations))
  }
  writeToFile('apartmentInfos.json', apartmentInfos, 'JSON')
}

export default getApartmentInfos
