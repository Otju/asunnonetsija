import { ApolloError } from 'apollo-server'
import { getClient } from '../../db'
import { ApartmentInfo } from '../../sharedTypes/typesFromRuntypes'

interface Args {
  apartments: ApartmentInfo[]
}

const updateApartments = async (_root: any, args: Args) => {
  const client = await getClient()
  try {
    const apartments = args.apartments.map(
      ({ bigRenovations, pointsOfIntrest, ...otherFields }) => ({
        ...otherFields,
        bigRenovations: JSON.stringify(bigRenovations),
        pointsOfIntrest: JSON.stringify(pointsOfIntrest),
      })
    )
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
      ['pointsOfIntrest', 'text'],
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
      "pointsOfIntrest" TEXT NOT NULL,
      "coordinates" JSON NOT NULL
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
