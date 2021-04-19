import { query } from '../../db'

interface ApartmentInfoRows {
  bigRenovations: string
  address: string
  pointsOfIntrest: string
}

const allApartments = async () => {
  const res = await query(`SELECT * FROM apartments;`)
  // @ts-ignore
  const info = res.rows.map(
    ({ bigRenovations, address, pointsOfIntrest, ...otherFields }: ApartmentInfoRows) => ({
      address,
      ...otherFields,
      pointsOfIntrest: JSON.parse(pointsOfIntrest),
      bigRenovations: JSON.parse(bigRenovations),
    })
  )
  return info
}

export default allApartments
