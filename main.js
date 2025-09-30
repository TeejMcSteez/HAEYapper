// User input on console
import readline from "node:readline";
import { stdin, stdout } from "node:process";
// Database interfaces
import Display from "./lib/database/Display.js";
import Scrape from "./lib/database/Scrape.js";
import DropTable from "./lib/database/DropTable.js";
import Purge from "./lib/database/Purge.js";

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
        case "1":
            await Scrape();
            break;
        case "2":
            await DropTable();
            break;
        case "3":
            await Display();
            break;
        case "4":
            const timespan = await ask("Choose to delete 'day'(s) or 'hour'(s)\n> ");
            switch (timespan) {
                case "day":
                    const days = await ask("Choose number of days, logs older than this will be deleted\n> ");
         
                    await Purge(timespan, days)

                    break;
                case "hour":
                    const hours = await ask("Choose number of hours, logs older than this will be deleted\n> ");
         
                    await Purge(timespan, hours);

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
