import getApartmentLinks from './getApartmentLinks'
import getRawApartmentInfo from './getRawApartmentInfo'
import parseApartmentInfo from './parseApartmentInfo'
import getAllTravelTimes from './getAllTravelTimes'

const getLinks = async () => {
  console.log('Getting links')
  await getApartmentLinks()
  console.log('Got links')
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

const scriptToRun = process.argv[2]

switch (scriptToRun) {
  case 'links':
    console.log('Only links')
    getLinks()
    break
  case 'raw':
    console.log('Only raw')
    getRaw()
    break
  case 'parse':
    console.log('Only parse')
    parse()
    break
  case 'travel':
    console.log('Only travel times')
    getTravelTimes()
    break
  default:
    console.log('All')
    getLinks()
    getRaw()
    parse()
    getTravelTimes()
    break
}
