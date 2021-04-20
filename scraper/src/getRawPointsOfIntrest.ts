import fetch from 'node-fetch'
import { getBoundaries, isInBoundaries } from './getBoundaries'
import { RawPointOfIntrest, PointOfIntrestType } from './sharedTypes/typesFromRuntypes'
import { writeToFile } from './fileEditor'

interface Boundaries {
  maxLat: number
  minLat: number
  maxLon: number
  minLon: number
}

const getPlaceSearchUrl = (search: string, { minLat, maxLat, minLon, maxLon }: Boundaries) => {
  return `http://api.digitransit.fi/geocoding/v1/search?text=${search.replace(
    ' ',
    '+'
  )}&size=40&boundary.rect.min_lat=${minLat}&boundary.rect.max_lat=${maxLat}&boundary.rect.min_lon=${minLon}&boundary.rect.max_lon=${maxLon}&lang=fi`
}

interface DestinationObject {
  gid: string
  name: string
  coordinates: number[]
}

const doSearch = async (search: string, threshold?: number) => {
  const allNames: DestinationObject[] = []

  const { maxLat, minLat, maxLon, minLon } = getBoundaries()

  const partCount = 5

  const latAdd = (maxLat - minLat) / partCount
  const lonAdd = (maxLon - minLon) / partCount

  for (let latI = 0; latI < partCount; latI++) {
    for (let lonI = 0; lonI < partCount; lonI++) {
      const boundaries = {
        minLat: minLat + latI * latAdd,
        maxLat: minLat + (latI + 1) * latAdd,
        minLon: minLon + lonI * lonAdd,
        maxLon: maxLon + (lonI + 1) * lonAdd,
      }
      const res = await fetch(getPlaceSearchUrl(search, boundaries))
      const data = await res.json()
      //@ts-ignore
      const names: DestinationObject[] = []
      data.features
        //@ts-ignore
        .forEach((item) => {
          threshold = threshold || 1
          if (item.properties.layer === 'venue' && item.properties.confidence >= threshold) {
            const { name, gid } = item.properties
            const { coordinates } = item.geometry
            names.push({ name, gid, coordinates })
          }
        })
      //@ts-ignore
      allNames.push(...names)
    }
  }
  return allNames
}

const removeDuplicates = (names: DestinationObject[]) => {
  const filteredNames: DestinationObject[] = []
  names.forEach((item) => {
    if (!filteredNames.find(({ gid }) => gid === item.gid)) {
      filteredNames.push(item)
    }
  })
  return filteredNames
}

const getRawPointsOfIntrest = async () => {
  const stores = await searchAllOfType('store', [
    'K-market',
    'K-Supermarket',
    'K-Citymarket',
    'Lidl',
    'S-market',
    'Alepa',
    'Prisma',
  ])
  const bigStores = stores
    .filter(({ name }) => {
      const lwCase = name.toLowerCase()
      return (
        lwCase.includes('k-supermarket') ||
        lwCase.includes('k-citymarket') ||
        lwCase.includes('s-market') ||
        lwCase.includes('prisma') ||
        lwCase.includes('lidl')
      )
    })
    .map((item) => ({ ...item, type: 'bigStore' }))
  const alkos = await searchAllOfType('alko', ['Alko'])
  const universities = await searchAllOfType('university', ['Yliopisto'])
  const daycares = await searchAllOfType('daycare', ['Päiväkoti'], 0.9)
  writeToFile('pointsOfIntrest.json', { stores, bigStores, universities, daycares, alkos }, 'JSON')
}

const searchAllOfType = async (
  type: PointOfIntrestType,
  seachStrings: string[],
  threshold?: number
): Promise<RawPointOfIntrest[]> => {
  let names = []
  for (const string of seachStrings) {
    names.push(...(await doSearch(string, threshold)))
  }
  names = removeDuplicates(names)
  const items = names
    .map(({ name, coordinates }) => {
      const formattedCoordinates = { lon: coordinates[0], lat: coordinates[1] }
      return { name, type, coordinates: formattedCoordinates }
    })
    .filter(({ coordinates }) => isInBoundaries(coordinates))
  console.log(`Found ${items.length} of type "${type}"`)
  return items
}

export default getRawPointsOfIntrest
