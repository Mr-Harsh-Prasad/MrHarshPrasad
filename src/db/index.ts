import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

type Database = ReturnType<typeof drizzle<typeof schema>>;

// Lazy initialization to ensure env vars are loaded
let _db: Database | null = null;

function getDb(): Database {
  if (!_db) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    const sql = neon(process.env.DATABASE_URL);
    _db = drizzle(sql, { schema });
  }
  return _db;
}

// Export a proxy that initializes on first use with proper typing
export const db = new Proxy({} as Database, {
  get(target, prop, receiver) {
    const dbInstance = getDb();
    return Reflect.get(dbInstance, prop, receiver);
  },
}) as Database;

export * from './schema';