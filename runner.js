/**
 * Main event loop will
 * 1. If prune is setup Prune database
 * 2. Load cron schedule if available
 * 3. Sit and listen for error or interrupt 
 */
import Prune from "./lib/database/Prune.js";
import { Cron } from "./lib/cron/Scraper.js";
import "dotenv/config";

async function runner() {
    // Prunes table if needed
    if (process.env.PRUNE) {
        try {
            await Prune();
        } catch (e) {
            throw new Error(`Error on runner: ${e}`);
        }
    }
    // Loads scrape schedule
    try {
        await Cron();
    } catch (e) {
        throw new Error(`Error on runner: ${e}`);
    }
}  
// Runs on loop till error or sigterm/sigint
while (true) {
    await runner();
}