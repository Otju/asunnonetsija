import getPreInfo from './getPreInfo'
import getRawApartmentInfo from './getRawApartmentInfo'
import parseApartmentInfo from './parseApartmentInfo'
import { request } from 'graphql-request'
import { readFromFile } from './fileEditor'
import { RawApartmentInfo } from './sharedTypes/types'
import { ApartmentInfo as ApartmentInfoGuard } from './sharedTypes/runtypes'
import getPointsOfIntrest from './getPointsOfIntrest'
import getRawPointsOfIntrest from './getRawPointsOfIntrest'
import getSchoolsAndDistricts from './getSchools'

const getPre = async () => {
  console.log('Getting pre-info')
  await getPreInfo()
  console.log('Got pre-info')
}

const getRaw = async () => {
  console.log('Getting raw apartment info')
  await getRawApartmentInfo()
  console.log('Got raw apartment info')
}

const parse = async () => {
  console.log('Parsing')
  await parseApartmentInfo()
  console.log('Parsed')
}

const writeToDB = async () => {
  const parsedApartments: RawApartmentInfo[] = readFromFile(
    'apartmentInfoWithPointsOfInterst.json',
    'JSON'
  )
  console.log(parsedApartments[0])
  const apartments = parsedApartments
    .map(({ renovationsComingString, renovationsDoneString, bigRenovations, ...otherFields }) => {
      bigRenovations = bigRenovations.length
        ? bigRenovations
        : [{ type: 'Putkiremontti', cost: 5000, timeTo: 10 }]
      return { bigRenovations, ...otherFields }
    })
    .filter((apartment) => ApartmentInfoGuard.guard(apartment))
  console.log('Aparmentcount', apartments.length)
  const query = `
  mutation updateApartments ($apartments: [ApartmentInput!]!) {
    updateApartments(apartments: $apartments)
  }`
  const variables = {
    apartments,
  }
  try {
    const writeToProd = process.argv[3]
    const response = await request(
      writeToProd ? 'https://asunnonetsija-backend.herokuapp.com/' : 'http://localhost:4000/',
      query,
      variables
    )
    console.log(response)
    console.log('Wrote info to DB')
  } catch (e) {
    console.log(e.message.slice(0, 2000))
  }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const scriptToRun = process.argv[2]

const main = async () => {
  switch (scriptToRun) {
    case 'pre':
      console.log('Only pre-info')
      await getPre()
      break
    case 'raw':
      console.log('Only raw')
      await getRaw()
      break
    case 'parse':
      console.log('Only parse')
      await parse()
      break
    case 'points':
      console.log('Only pointsOfIntrest (and db)')
      await getRawPointsOfIntrest()
      await getSchoolsAndDistricts()
      await delay(5000)
      await getPointsOfIntrest()
      await delay(5000)
      await writeToDB()
      break
    case 'db':
      console.log('Only write to db')
      await writeToDB()
      break
    default:
      console.log('All')
      await getPre()
      await getRaw()
      await parse()
      break
  }
}

main()
