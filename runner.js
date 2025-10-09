import Prune from "./lib/database/Prune.js";
import { Cron, GetActive } from "./lib/cron/Scraper.js";
import "dotenv/config";
/**
 * Setup for main, Prune's old log's then loads cron schedule
 * will output currently active task. 
 */
async function setup() {
    try {
        await Prune();
        await Cron();

        const currentlyActive = await GetActive();
        currentlyActive.forEach(key => {
            console.log(`[runner] Active task: ${key.name}`);
        });
    } catch (e) {
        console.log(`[runner] Setup failed with error: ${e}`);
    }
    
}
/**
 * Simply sits on event loop closing on anonymous promise 
 * and listening for interrupt or termination signals.
 */
async function main() {

    process.on("SIGINT", async () => {
        console.log(`[runner] Interrupt received closing`);
    });

    process.on("SIGTERM", async () => {
        console.log(`[runner] Termination received closing`);
    });
    
    // Awaits forevever
    await new Promise(() => {});
}  

await setup().catch((e) => {
    console.log(`[runner] Uncaught error in setup: ${e}`);
    process.exit(1);
});

await main().catch((e) => {
    console.log(`[runner] Uncaught error in main: ${e}`);
    process.exit(1);
});