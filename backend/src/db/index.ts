import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
})

export const query = async (text: string, params?: any) => {
  const start = Date.now()
  const res = await pool.query(text, params)
  const duration = Date.now() - start
  console.log('executed query', { text, duration, rows: res.rowCount })
  return res
}

export const getClient = async () => {
  const client = await pool.connect()
  const query = client.query
  const release = client.release
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!')
    // @ts-ignore
    console.error(`The last executed query on this client was: ${client.lastQuery}`)
  }, 5000)
  // @ts-ignore
  client.query = (...args) => {
    // @ts-ignore
    client.lastQuery = args
    // @ts-ignore
    return query.apply(client, args)
  }
  client.release = () => {
    clearTimeout(timeout)
    client.query = query
    client.release = release
    return release.apply(client)
  }
  return client
}
