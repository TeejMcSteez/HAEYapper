import ScrapePostgres from "../postgres/postgresScrape.js";

import sqlliteScrape from "../sqllite/sqlliteScrape.js";

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