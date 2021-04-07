import { query } from '../../db'

interface ApartmentInfoRows {
  bigRenovations: string
  address: string
}

interface TravelTimeRows {
  address: string
}

const allApartments = async () => {
  const res = await query(`
  SELECT * FROM apartments;
  SELECT * FROM "travelTimes"
  LEFT JOIN destinations ON "travelTimes"."destination" = destinations.destination`)
  // @ts-ignore
  const info = res[0].rows.map(
    ({ bigRenovations, address, ...otherFields }: ApartmentInfoRows) => ({
      address,
      ...otherFields,
      // @ts-ignore
      travelTimes: res[1].rows.filter((item: TravelTimeRows) => item.address === address),
      bigRenovations: JSON.parse(bigRenovations),
    })
  )
  return info
}

export default allApartments
