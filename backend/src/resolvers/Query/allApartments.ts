import { query } from '../../db'

const allApartments = async () => {
  const res = await query(`
  SELECT * FROM apartments;
  SELECT * FROM "travelTimes"
  LEFT JOIN destinations ON "travelTimes"."destination" = destinations.destination`)
  const info = res[0].rows.map(({ bigRenovations, address, ...otherFields }) => ({
    address,
    ...otherFields,
    travelTimes: res[1].rows.filter((item) => item.address === address),
    bigRenovations: JSON.parse(bigRenovations),
  }))
  return info
}

export default allApartments
