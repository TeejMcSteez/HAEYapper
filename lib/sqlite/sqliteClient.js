import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import "dotenv/config";

if (!fs.existsSync("./lib/sqlite/storage")) {
  console.log("[sqlite] Making SQLLite local directory . . .\n");
  fs.mkdirSync("./lib/sqlite/storage", () => {
    console.log("[sqlite] Directory has been made . . .\n");
  });
  console.log("Done");
}

const client = new DatabaseSync("./lib/sqlite/storage/database.db");

const initDatabase = `
  CREATE TABLE IF NOT EXISTS logs (
  logId INTEGER PRIMARY KEY,
  logDate TEXT,
  logLevel TEXT,
  logCaller TEXT,
  logComponent TEXT,
  logInfo TEXT UNIQUE ON CONFLICT IGNORE,
  datetime TEXT
);`;

client.exec(initDatabase);

export default client;