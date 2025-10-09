// postgresPool.js
import { Pool } from "pg";
import "dotenv/config";

export const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),   // ensure number
  database: process.env.DB_DB,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Optional: ensure table exists (no need to connect() first)
await pool.query(`
  CREATE TABLE IF NOT EXISTS logs(
    logId    SERIAL PRIMARY KEY,
    logDate TEXT,
    logLevel TEXT,
    logCaller TEXT,
    logComponent TEXT,
    logInfo  TEXT UNIQUE,
    datetime TIMESTAMP
  );
`);

process.on("SIGINT", async () => {
  try { await pool.end(); console.log("[postgres] Pool disconnected") } finally { process.exit(0); }
});

process.on("SIGTERM", async () => {
  try { await pool.end(); console.log("[postgres] Pool disconnected") } finally { process.exit(0); }
});

export default pool;
