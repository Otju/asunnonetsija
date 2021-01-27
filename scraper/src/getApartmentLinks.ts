import puppeteer from 'puppeteer'
import { writeToFile } from './fileEditor'

const getApartmentLinksForPage = async (pageNumber: number) => {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.goto(
    `https://asunnot.oikotie.fi/myytavat-asunnot?pagination=${pageNumber}&locations=%5B%5B64,6,%22Helsinki%22%5D,%5B39,6,%22Espoo%22%5D,%22Kauniainen%22,%22Vantaa%22%5D&cardType=100`,
    { timeout: 0 }
  )
  const links = await page.evaluate(() => {
    const items = document.querySelectorAll('.ot-card')
    const links: Array<string> = []
    items.forEach((item) => {
      const link = item.getAttribute('href')
      if (link) {
        links.push(link)
      }
    })

    return links
  })
  return links
}

const writeApartmentsToFile = (valuesToWrite: Array<string>) => {
  writeToFile('apartmentLinks.csv', valuesToWrite, 'CSV')
}

const getApartmentLinks = async () => {
  const apartmentLinks: Array<string> = []
  //let isLastPage = false
  for (let i = 1; i < 10; i++) {
    const linksForPage = await getApartmentLinksForPage(i)
    if (linksForPage.length === 0) {
      //isLastPage = true
      return
    }
    apartmentLinks.push(...linksForPage)
  }
  writeApartmentsToFile(apartmentLinks)
  return
}

export default getApartmentLinks
