import got from 'got'
import cheerio from 'cheerio'
import { readFromFile, writeToFile } from './fileEditor'
import progressBar from './progressBar'

interface InfoTableRow {
  title: string
  value: string
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
    //console.error(e.message, link)
    return []
  }
}

interface RawApartmentInfo {
  link: string
  infoTableRows: InfoTableRow[]
}

const getRawApartmentInfos = async () => {
  const links: string[] = readFromFile('apartmentLinks.csv', 'CSV')
  const oldInfos: RawApartmentInfo[] = readFromFile('rawApartmentInfo.json', 'JSON')
  const oldInfosStillOnWebsite = oldInfos.filter(({ link }) => links.includes(link))
  const oldLinks = oldInfos.map((info) => info.link)
  const newLinks = links.filter((link) => !oldLinks.includes(link))
  console.log('Reusable raw info', oldInfosStillOnWebsite.length)
  console.log('New raw info', newLinks.length)
  progressBar.start(newLinks.length, 0)
  const rawApartmentInfo: RawApartmentInfo[] = []
  for (const link of newLinks) {
    progressBar.increment()
    const infoTableRowsForLink = await getInfoTableRows(link)
    rawApartmentInfo.push({ link, infoTableRows: infoTableRowsForLink })
  }
  const newAndOldInfo = [...oldInfosStillOnWebsite, ...rawApartmentInfo]
  progressBar.stop()
  writeToFile('rawApartmentInfo.json', newAndOldInfo, 'JSON')
}

export default getRawApartmentInfos
