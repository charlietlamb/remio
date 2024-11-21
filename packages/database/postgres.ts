import { env } from '@dubble/env'
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import * as schema from '@dubble/database/schema'

declare global {
  var db: PostgresJsDatabase<typeof schema> | undefined
}

let db: PostgresJsDatabase<typeof schema>

if (env.NODE_ENV === 'production') {
  db = drizzle(env.DATABASE_URL)
} else {
  if (!global.db) global.db = drizzle(env.DATABASE_URL)
  db = global.db
}

export { db }
