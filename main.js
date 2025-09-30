import DropPostgresTable from "./lib/postgres/postgresReset.js";
import ScrapePostgres from "./lib/postgres/postgresScrape.js";
import PostgresInit from "./lib/postgres/postgresInit.js";
import PostgresOutputLogs from "./lib/postgres/postgresDisplay.js";
import PostgresPurge from "./lib/postgres/postgresPurge.js";
import readline from "node:readline";
import { stdin, stdout } from "node:process";
import sqlliteScrape from "./lib/sqllite/sqlliteScrape.js";

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
        "1) Scrape New Logs\n2) Reset Table\n3) Init after reset or new (postgres only)\n4) Output Current Logs\n5) Purge Logs from Database\n> "
    );

    switch (choice.trim()) {
        case "1":
            if (process.env.DB_TYPE === "postgres") {
                await ScrapePostgres();
            } else if (process.env.DB_TYPE === "sqllite") {
                await sqlliteScrape();
            } else {
                throw new Error("Invalid database environment");
            }
            break;
        case "2":

            // Add specific env logic
            if (process.env.DB_TYPE === "postgres") {
                await DropPostgresTable();
            } else if (process.env.DB_TYPE === "sqllite") {
                // TODO: implement for sqllite
            } else {
                throw new Error("Invalid database environment");
            }

            break;
        case "3":

            // Add specific env logic
            if (process.env.DB_TYPE === "postgres") {
                await PostgresInit();
            } else if (process.env.DB_TYPE === "sqllite") {
                console.log("SQLLite client auto inits db");
            } else {
                throw new Error("Invalid database environment"); 
            }

            break;
        case "4":

            // Add specific env logic
            if (process.env.DB_TYPE === "postgres") {
                await PostgresOutputLogs();
            } else if (process.env.DB_TYPE === "sqllite") {
                // TODO: implement for sqllite
            } else {
                throw new Error("Invalid database environment");
            }

            break;
        case "5":
            const timespan = await ask("Choose to delete 'day'(s) or 'hour'(s)\n> ");
            switch (timespan) {
                case "day":
                    const days = await ask("Choose number of days, logs older than this will be deleted\n> ");

                    // Add specific env logic
                    if (process.env.DB_TYPE === "postgres") {
                        await PostgresPurge(timespan, days);
                    } else if (process.env.DB_TYPE === "sqllite") {
                        // TODO: implement for sqllite
                    } else {
                        throw new Error("Invalid database environment");
                    }

                    break;
                case "hour":
                    const hours = await ask("Choose number of hours, logs older than this will be deleted\n> ");

                    // Add specific env logic
                    if (process.env.DB_TYPE === "postgres") {
                        await PostgresPurge(timespan, hours);
                    } else if (process.env.DB_TYPE === "sqllite") {
                        // TODO: implement for sqllite
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
    rl.close();
    process.exit(0);
}

main();
