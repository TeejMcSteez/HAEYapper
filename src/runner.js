import Prune from "../lib/database/Prune.js";
import { Cron, GetActive } from "../lib/cron/Scraper.js";
import { Logger, LOGGER_TYPES } from "../lib/logger.js";
import "dotenv/config";

const logger = new Logger(LOGGER_TYPES.runner);
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
            logger.outputLog(`Active task: ${key.name}`);
        });
    } catch (e) {
        logger.outputLog(`Setup failed with error: ${e}`);
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
            logger.outputLog(`Interrupt received closing`);
        });
        // Process termination
        process.on("SIGTERM", async () => {
            logger.outputLog(`Termination received closing`);
        });
    });
}  

try {
    logger.outputLog("Pruning logs and activating cron job . . .");
    await setup();
    logger.outputLog("Done\nStarting main loop . . .\n");
    await main();
} catch (e) {
    logger.outputError(e);
}