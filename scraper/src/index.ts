import getPreInfo from './getPreInfo'
import getRawApartmentInfo from './getRawApartmentInfo'
import parseApartmentInfo from './parseApartmentInfo'
import getAllTravelTimes from './getAllTravelTimes'
import { request } from 'graphql-request'
import { readFromFile } from './fileEditor'
import { ApartmentInfo } from '../../types'
import { ApartmentInfo as ApartmentInfoGuard } from './runtypes'

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

const getTravelTimes = async () => {
  console.log('Getting travel times')
  await getAllTravelTimes()
  console.log('Got travel times')
}

const writeToDB = async () => {
  const parsedApartments: ApartmentInfo[] = readFromFile('apartmentInfos.json', 'JSON')
  const apartments = parsedApartments
    .map(
      ({
        renovationsComingString,
        renovationsDoneString,
        bigRenovations,
        travelTimes,
        ...otherFields
      }) => {
        bigRenovations = bigRenovations.length
          ? bigRenovations
          : [{ type: 'Putkiremontti', cost: 5000, timeTo: 10 }]
        return { bigRenovations, ...otherFields }
      }
    )
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
    const response = await request('http://localhost:4000/', query, variables)
    console.log(response)
    console.log('Wrote info to DB')
  } catch (e) {
    console.log(e.message.slice(0, 2000))
  }
}

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
    case 'travel':
      console.log('Only travel times')
      await getTravelTimes()
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
      //await getTravelTimes()
      break
  }
}

main()
