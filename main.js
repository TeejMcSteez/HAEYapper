/**
 * Author: Tommy Hall
 * Link: https://github.com/teejMcSteez/HAEYapper
 */
// Postgres
import DropPostgresTable from "./lib/postgres/postgresReset.js";
import ScrapePostgres from "./lib/postgres/postgresScrape.js";
import PostgresOutputLogs from "./lib/postgres/postgresDisplay.js";
import PostgresPurge from "./lib/postgres/postgresPurge.js";
// User input on console
import readline from "node:readline";
import { stdin, stdout } from "node:process";
// SQLLite
import sqlliteScrape from "./lib/sqllite/sqlliteScrape.js";
import sqlliteOutputLogs from "./lib/sqllite/sqlliteDisplay.js";
import sqllitePurge from "./lib/sqllite/sqllitePurge.js";
import DropSqlliteTable from "./lib/sqllite/sqlliteReset.js";
// User input interface
const rl = readline.createInterface({
    input: stdin,
    output: stdout
});
/**
 * Handles user input for main
 * @param {string} question - question to ask user before waiting on stdin
 * 
 */
function ask(question) {
    return new Promise(resolve => rl.question(question, resolve));
}
/**
 * Entrypoint
 */
async function main() {
    const choice = await ask(
        "1) Scrape New Logs\n2) Reset Table\n3) Output Current Logs\n4) Purge Logs from Database\n> "
    );

    switch (choice.trim()) {
        // Scrape logs
        case "1":
            if (process.env.DB_TYPE === "postgres") {
                await ScrapePostgres();
            } else if (process.env.DB_TYPE === "sqllite") {
                await sqlliteScrape();
            } else {
                throw new Error("Invalid database environment");
            }
            break;
        // Reset table
        case "2":
            if (process.env.DB_TYPE === "postgres") {
                await DropPostgresTable();
            } else if (process.env.DB_TYPE === "sqllite") {
                DropSqlliteTable();
            } else {
                throw new Error("Invalid database environment");
            }

            break;
        // Output logs to console
        case "3": 
            if (process.env.DB_TYPE === "postgres") {
                await PostgresOutputLogs();
            } else if (process.env.DB_TYPE === "sqllite") {
                sqlliteOutputLogs();
            } else {
                throw new Error("Invalid database environment");
            }

            break;
        // Deletes log within a given timespan and interval
        case "4":
            const timespan = await ask("Choose to delete 'day'(s) or 'hour'(s)\n> ");
            switch (timespan) {
                case "day":
                    const days = await ask("Choose number of days, logs older than this will be deleted\n> ");
         
                    if (process.env.DB_TYPE === "postgres") {
                        await PostgresPurge(timespan, days);
                    } else if (process.env.DB_TYPE === "sqllite") {
                        sqllitePurge(days, timespan);
                    } else {
                        throw new Error("Invalid database environment");
                    }

                    break;
                case "hour":
                    const hours = await ask("Choose number of hours, logs older than this will be deleted\n> ");
         
                    if (process.env.DB_TYPE === "postgres") {
                        await PostgresPurge(timespan, hours);
                    } else if (process.env.DB_TYPE === "sqllite") {
                        sqllitePurge(hours, timespan);
                    } else {
                        throw new Error("Invalid database environment");
                    }

                    break;
                default:
                    throw new Error("Invalid timespan choice");
            }
            break;
        default:
            console.log("Bad choice");
            break;
    }
    // Close user input
    rl.close();
    process.exit(0);
}

main();
