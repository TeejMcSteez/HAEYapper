import Prune from "../lib/database/Prune.js";
import { Cron, GetActive } from "../lib/cron/Scraper.js";
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
    // Awaits forevever
    await new Promise(() => {
        // Process interrupt
        process.on("SIGINT", async () => {
            console.log(`[runner] Interrupt received closing`);
        });
        // Process termination
        process.on("SIGTERM", async () => {
            console.log(`[runner] Termination received closing`);
        });
    });
}  

try {
    console.log("[runner] Pruning logs and activating cron job . . .");
    await setup();
    console.log("[runner] Done\nStarting main loop . . .\n");
    await main();
} catch (e) {
    console.error("[runner] ", e);
}