import puppeteer from 'puppeteer'
import { writeToFile } from './fileEditor'
import progressBar from './progressBar'
import retry from 'async-retry'

const getApartmentLinksForPage = async (pageNumber: number) => {
  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    if (pageNumber % 90 === 0) {
      await page.waitForTimeout(120000)
    }
    await page.goto(
      `https://asunnot.oikotie.fi/myytavat-asunnot?pagination=${pageNumber}&locations=%5B%5B64,6,%22Helsinki%22%5D,%5B39,6,%22Espoo%22%5D,%22Kauniainen%22,%22Vantaa%22%5D&onlineOffer=0&cardType=100&habitationType%5B%5D=1`,
      { timeout: 0 }
    )
    await page.waitForSelector('.ot-card')
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
    await browser.close()
    return links
  } catch (e) {
    throw e
  }
}

const writeApartmentsToFile = (valuesToWrite: Array<string>) => {
  writeToFile('apartmentLinks.csv', valuesToWrite, 'CSV')
}

const getPageCount = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(
    `https://asunnot.oikotie.fi/myytavat-asunnot?pagination=1&locations=%5B%5B64,6,%22Helsinki%22%5D,%5B39,6,%22Espoo%22%5D,%22Kauniainen%22,%22Vantaa%22%5D&onlineOffer=0&cardType=100&habitationType%5B%5D=1`
  )
  await page.waitForSelector('.search-result-controls__group')
  const pageNumbers = await page.evaluate(() => {
    const items = document.querySelectorAll('.search-result-controls__group')
    return items[1].textContent?.match(/\d+/g)
  })
  return pageNumbers ? Number.parseInt(pageNumbers[2]) : 260
}

const getApartmentLinks = async () => {
  const apartmentLinks: Array<string> = []
  const pageCount = await retry(async () => await getPageCount(), {
    retries: 5,
    onRetry: (e) => console.log(e.message),
  })
  progressBar.start(pageCount, 0)

  for (let i = 1; i <= pageCount; i++) {
    progressBar.increment()
    const linksForPage = await retry(async () => getApartmentLinksForPage(i), { retries: 3 })
    apartmentLinks.push(...linksForPage)
  }
  writeApartmentsToFile(apartmentLinks)
  progressBar.stop()
  return apartmentLinks
}

export default getApartmentLinks
