// User input on console
import readline from "node:readline";
import { stdin, stdout } from "node:process";
// Database interfaces
import Display from "./lib/database/Display.js";
import Scrape from "./lib/database/Scrape.js";
import DropTable from "./lib/database/DropTable.js";
import Purge from "./lib/database/Purge.js";
import { Cron, SetupScrapeSchedule, isSetup } from "./lib/cron/Scraper.js";

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
        "1) Scrape New Logs\n2) Reset Table\n3) Output Current Logs\n4) Purge Logs from Database\n5) Setup Scrape Schedule\nEnter anything else to exit\n> "
    );

    switch (choice.trim()) {
        case "1":
            await Scrape();
            break;
        case "2":
            await DropTable();
            break;
        case "3":
            const ans = await ask("Output logs to file? (Y/N)\n> ");
            const filename = await ask("Name of file (Leave blank for log)\n> ");
            await Display(ans, filename);
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
        case "5":
            console.log("Welcome to setting up scheduling a scrape cron job\n");
            if (isSetup()) {
                const a = await ask("Would you like to use the saved schedule or over-write it? (Y/N)\n> ");
                if (a.toLowerCase() === "y") {
                    await Cron();
                } else if (a.toLowerCase() === "n") {
                    const second = await ask("Second? (Use * for wildcard)\n> ");
                    const minute = await ask("Minute? (Use * for wildcard)\n> ");
                    const hour = await ask("Hour? (Use * for wildcard)\n> ");
                    const dom = await ask("Day of Month? (Use * for wildcard)\n> ");
                    const mon = await ask("Month? (Use * for wildcard)\n> ");
                    const dow = await ask("Day of Week? (Use * for wildcard)\n> ");

                    await SetupScrapeSchedule({second, minute, hour, dom, mon, dow});
                } else {
                    throw new Error("Invlaid input");
                }

            } else {
                console.log("No pre-saved crontab setting one up now . . .");
                const second = await ask("Second? (Use * for wildcard)\n> ");
                const minute = await ask("Minute? (Use * for wildcard)\n> ");
                const hour = await ask("Hour? (Use * for wildcard)\n> ");
                const dom = await ask("Day of Month? (Use * for wildcard)\n> ");
                const mon = await ask("Month? (Use * for wildcard)\n> ");
                const dow = await ask("Day of Week? (Use * for wildcard)\n> ");

                await SetupScrapeSchedule({second, minute, hour, dom, mon, dow});

            }
            console.log("Finished setting up crontab");
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
