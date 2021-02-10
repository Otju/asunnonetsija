import got from 'got'
import cheerio from 'cheerio'
import { readFromFile, writeToFile } from './fileEditor'
import progressBar from './progressBar'

interface InfoTableRow {
  title: string
  value: string
}

const sleep = (waitTime: number) => new Promise((resolve) => setTimeout(resolve, waitTime * 1000))

const getInfoTableRows = async (link: string): Promise<InfoTableRow[] | null> => {
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
    const message = e.message
    if (message.includes('410')) {
      return null
    } else if (message.includes('403')) {
      //console.log('Too many requests, waiting for 2 minutes')
      await sleep(120)
    } else {
      console.error(e.message, link)
    }
  }
  return null
}

interface RawApartmentInfo {
  link: string
  infoTableRows: InfoTableRow[]
}

const getRawApartmentInfos = async () => {
  const links: string[] = readFromFile('apartmentLinks.csv', 'CSV')
  const oldInfos: RawApartmentInfo[] = readFromFile('rawApartmentInfos.json', 'JSON')
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
    if (infoTableRowsForLink) {
      rawApartmentInfo.push({ link, infoTableRows: infoTableRowsForLink })
    }
  }
  const newAndOldInfo = [...oldInfosStillOnWebsite, ...rawApartmentInfo]
  progressBar.stop()
  writeToFile('rawApartmentInfos.json', newAndOldInfo, 'JSON')
}

export default getRawApartmentInfos
