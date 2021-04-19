import fetch from 'node-fetch'
import { Coordinates } from './sharedTypes/typesFromRuntypes'
import { writeToFile } from './fileEditor'

export interface PreInfo {
  link: string
  imageLink: string
  coordinates: Coordinates
}

const getPreInfo = async () => {
  const link = (offset: number) =>
    `https://asunnot.oikotie.fi/api/cards?cardType=100&habitationType%5B%5D=1&limit=5000&locations=%5B%5B64,6,%22Helsinki%22%5D,%5B39,6,%22Espoo%22%5D,%22Kauniainen%22,%22Vantaa%22%5D&offset=${offset}&onlineOffer=0&sortBy=published_sort_desc`
  const headers = {
    'ota-loaded': '1618765401',
    'ota-token': '993e102a262e0fbd3f69c49cf5a93aa45a4e8030cf30c937b82bf3ae1d84bb21',
    'ota-cuid': '82e693ce0670dd366ddbdf6534be2c97f4ff0b60',
  }
  const getCards = async (offset: number) => {
    const response = await fetch(link(offset), { headers })
    const data = await response.json()
    return data.cards
  }
  const infos = [...(await getCards(0)), ...(await getCards(5000))]
  const parsedInfo: PreInfo[] = infos.map((info) => ({
    link: info.url,
    imageLink: info.images.wide,
    coordinates: { lat: info.coordinates.latitude, lon: info.coordinates.longitude },
  }))
  writeToFile('preApartmentInfo.json', parsedInfo, 'JSON')
  return parsedInfo
}

export default getPreInfo
