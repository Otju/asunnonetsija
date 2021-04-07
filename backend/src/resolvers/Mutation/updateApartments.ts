import { ApolloError } from 'apollo-server'
import { getClient } from '../../db'

interface Args {
  apartments: ApartmentInfo[]
}

interface TravelTime {
  destination: string
  duration: number
}

interface Coordinates {
  lat: number
  lon: number
}

interface Renovation {
  type: string
  cost: number
  timeTo: number
  monthlyCost?: number
}

interface ApartmentInfo {
  link: string
  address: string
  district: string
  sqrMeters: number
  loanFreePrice: number
  sellingPrice?: number
  pricePerSqrMeter?: number
  rooms?: string
  roomAmount?: number
  condition?: string //'Erinomainen' | 'Hyvä' | 'Tyydyttävä' | 'Välttävä' | 'Huono' | 'Uusi'
  houseType?: string //'Kerrostalo' | 'Rivitalo' | 'Paritalo' | 'Omakotitalo' | 'Puutalo-osake'
  livingType?: string //'Omistus' | 'Osaomistus' | 'Asumisoikeus'
  plotType?: string //'Oma' | 'Vuokralla' | 'Valinnainen vuokratontti'
  newBuilding?: boolean
  buildYear?: number
  loanFee?: number
  maintananceFee?: number
  waterFee?: number
  otherFees?: number
  bigRenovations: Renovation[]
  renovationsDoneString?: string
  renovationsComingString?: string
  coordinates: Coordinates
  imageLink: string
  travelTimes: TravelTime[]
  smallDistrict: string
  bigDistrict: string
}

const updateApartments = async (_root: any, args: Args) => {
  const client = await getClient()
  try {
    const apartments = args.apartments.map(({ bigRenovations, ...otherFields }) => ({
      ...otherFields,
      bigRenovations: JSON.stringify(bigRenovations),
    }))
    console.log(apartments[1])
    const rowNames = [
      ['link', 'text'],
      ['address', 'text'],
      ['district', 'text'],
      ['sqrMeters', 'numeric'],
      ['loanFreePrice', 'numeric'],
      ['sellingPrice', 'numeric'],
      ['pricePerSqrMeter', 'numeric'],
      ['rooms', 'text'],
      ['roomAmount', 'integer'],
      ['condition', 'text'],
      ['houseType', 'text'],
      ['livingType', 'text'],
      ['newBuilding', 'boolean'],
      ['buildYear', 'integer'],
      ['loanFee', 'numeric'],
      ['maintananceFee', 'numeric'],
      ['waterFee', 'numeric'],
      ['otherFees', 'numeric'],
      ['imageLink', 'text'],
      ['smallDistrict', 'text'],
      ['bigDistrict', 'text'],
      ['bigRenovations', 'text'],
      ['coordinates', 'json'],
    ]
    const rowNameString = rowNames.map((rowName) => `"${rowName[0]}"`).join(', ')
    const rowParamsString = rowNames.map((rowName, i) => `$${i + 1}::${rowName[1]}[]`).join(', ')
    // @ts-ignore
    const values = rowNames.map((rowName) => apartments.map((apartment) => apartment[rowName[0]]))
    const queryString = `INSERT INTO apartments (${rowNameString}) SELECT * FROM UNNEST (${rowParamsString})`
    await client.query('BEGIN')
    await client.query(`
    CREATE TABLE IF NOT EXISTS "apartments"(
      "id" SERIAL PRIMARY KEY,
      "link" TEXT NOT NULL,
      "address" TEXT NOT NULL,
      "district" TEXT NOT NULL,
      "sqrMeters" NUMERIC NOT NULL,
      "loanFreePrice" NUMERIC NOT NULL,
      "sellingPrice" NUMERIC,
      "pricePerSqrMeter" INT,
      "rooms" TEXT,
      "roomAmount" INT,
      "condition" TEXT,
      "houseType" TEXT,
      "livingType" TEXT,
      "plotType" TEXT,
      "newBuilding" BOOLEAN,
      "buildYear" INT,
      "loanFee" NUMERIC,
      "maintananceFee" NUMERIC,
      "waterFee" NUMERIC,
      "otherFees" NUMERIC,
      "imageLink" TEXT NOT NULL,
      "smallDistrict" TEXT NOT NULL,
      "bigDistrict" TEXT NOT NULL,
      "bigRenovations" TEXT NOT NULL,
      "coordinates" JSON NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS "travelTimes"(
      "id" SERIAL PRIMARY KEY,
      "address" TEXT NOT NULL,
      "destination" TEXT NOT NULL,
      "duration" INT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS "destinations"(
      "destination" TEXT PRIMARY KEY,
      "lon" NUMERIC NOT NULL,
      "lat" NUMERIC NOT NULL
    );
    `)

    await client.query('TRUNCATE apartments')
    await client.query(queryString, values)
    await client.query('COMMIT')
    return 'Succesfully wrote Aparments to DB'
  } catch (e) {
    await client.query('ROLLBACK')
    console.log('DB ERROR: ', e.message)
    throw new ApolloError('Error when writing info to DB')
  }
}

export default updateApartments
