import fetch from 'node-fetch'
import { Coordinates } from '.././sharedTypes/typesFromRuntypes'
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
    'ota-loaded': '1613066866',
    'ota-token': '132821c8501fc9cba85fab32b2b7bb25dd900a2e8fdd092200fa5d40ad454a67',
    'ota-cuid': '0f004345a74f04448860aafce2061458bd496a83',
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
