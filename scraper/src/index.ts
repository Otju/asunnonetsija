import getPreInfo from './getPreInfo'
import getRawApartmentInfo from './getRawApartmentInfo'
import parseApartmentInfo from './parseApartmentInfo'
import getAllTravelTimes from './getAllTravelTimes'

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
