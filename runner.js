/**
 * Main event loop will
 * 1. If prune is setup Prune database
 * 2. Load cron schedule if available
 * 3. Sit and listen for error or interrupt 
 */
import Prune from "./lib/database/Prune.js";
import { Cron, GetActive } from "./lib/cron/Scraper.js";
import "dotenv/config";

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