import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import "dotenv/config";

if (!fs.existsSync("./lib/sqllite/storage")) {
  console.log("Making SQLLite local directory . . .");
  fs.mkdirSync("./lib/sqllite/storage");
  fs.appendFile("./lib/sqllite/storage/info.db");
  console.log("Done");
}

const db = new DatabaseSync("./lib/sqllite/storage/info.db");

const initDatabase = `
CREATE TABLE IF NOT EXISTS logs (
  id INTEGER PRIMARY KEY,
  log TEXT,
  datetime TEXT
);`

db.exec(initDatabase);

export default db;