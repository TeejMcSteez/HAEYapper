import { Client } from "pg";
import "dotenv/config"
/**
 * Generates client object to use for components.
 * Get's information from environment variables (.env)
 */
const client = new Client({
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   host: process.env.DB_HOST,
   port: process.env.DB_PORT,
   database: process.env.DB_DB,
});

await client.connect();

await client.query("CREATE TABLE IF NOT EXISTS logs(logId SERIAL PRIMARY KEY, logInfo TEXT UNIQUE, datetime TIMESTAMP);");

export default client;