import { query } from '../../db'

const allApartments = async () => {
  const res = await query('SELECT * FROM "apartments"')
  return res.rows
}

export default allApartments
