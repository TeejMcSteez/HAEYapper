import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import "dotenv/config";

if (!fs.existsSync("./lib/sqlite/storage")) {
  console.log("Making SQLLite local directory . . .\n");
  fs.mkdirSync("./lib/sqlite/storage", () => {
    console.log("Directory has been made . . .\n");
  });
  console.log("Done");
}

const client = new DatabaseSync("./lib/sqlite/storage/database.db");

const initDatabase = `
  CREATE TABLE IF NOT EXISTS logs (
  id INTEGER PRIMARY KEY,
  log TEXT UNIQUE ON CONFLICT IGNORE,
  datetime TEXT
);`;

client.exec(initDatabase);

export default client;