import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import "dotenv/config";

if (!fs.existsSync("./lib/sqllite/storage")) {
  console.log("Making SQLLite local directory . . .\n");
  fs.mkdirSync("./lib/sqllite/storage", () => {
    console.log("Directory has been made . . .\n");
  });
  console.log("Done");
}

const db = new DatabaseSync("./lib/sqllite/storage/database.db");

const initDatabase = `
  CREATE TABLE IF NOT EXISTS logs (
  id INTEGER PRIMARY KEY,
  log TEXT,
  datetime TEXT
);`;

db.exec(initDatabase);

export default db;