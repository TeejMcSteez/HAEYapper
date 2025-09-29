import DropTable from "./lib/reset.js";
import Scrape from "./lib/scrape.js";
import Init from "./lib/init.js";
import OutputLogs from "./lib/display.js";
import Purge from "./lib/purge.js";
import readline from "node:readline";
import { stdin, stdout } from "node:process";

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
        "1) Scrape New Logs\n2) Reset Table\n3) Init after reset or new\n4) Output Current Logs\n5) Purge Logs from Database\n> "
    );

    switch (choice.trim()) {
        case "1":
            await Scrape();
            break;
        case "2":
            await DropTable();
            break;
        case "3":
            await Init();
            break;
        case "4":
            await OutputLogs();
            break;
        case "5":
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
    rl.close();
    process.exit(0);
}

main();
