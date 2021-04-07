import { ApolloError } from 'apollo-server'
import { getClient } from '../../db'

const updateApartments = async (_root, args) => {
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
    const values = rowNames.map((rowName) => apartments.map((apartment) => apartment[rowName[0]]))
    const queryString = `INSERT INTO apartments (${rowNameString}) SELECT * FROM UNNEST (${rowParamsString})`
    await client.query('BEGIN')
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
