import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false },
});

export async function migrate() {
  const __dir = dirname(fileURLToPath(import.meta.url));
  const sql = readFileSync(join(__dir, 'schema.sql'), 'utf8');
  await pool.query(sql);
  console.log('Database migrated');
}

export default pool;
