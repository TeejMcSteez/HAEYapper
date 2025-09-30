import ScrapePostgres from "../postgres/postgresScrape.js";

import sqlliteScrape from "../sqllite/sqlliteScrape.js";

/**
 * Scrapes HA REST endpoint and inserts logs into database
 */
async function Scrape() {
    if (process.env.DB_TYPE === "postgres") {
        await ScrapePostgres();
    } else if (process.env.DB_TYPE === "sqllite") {
        await sqlliteScrape();
    } else {
        throw new Error("Invalid database environment");
    }
}

export default Scrape;