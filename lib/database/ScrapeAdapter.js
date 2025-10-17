import "dotenv/config";
const imports = {
    postgres: () => import("../postgres/postgresScrape.js"),
    sqlite: () => import("../sqlite/sqliteScrape.js")
};

import { outputError, LOGGER_TYPES } from "../logger.js";

const lt = LOGGER_TYPES.scrapeAdapter;

/**
 * Scrapes HA REST endpoint and inserts logs into database
 * @throws Error
 */
async function ScrapeAdapter() {
    const db = process.env.DB_TYPE ?? "sqlite";
    const loader = imports[db]
    if (!loader) {
        outputError(lt, "Unsupported DB Type");
    }
    const { default: Scrape } = await loader();
    if (typeof Scrape !== "function") {
        outputError(lt, "Failed to load adapter");
    }
    return await Scrape();
}

export default ScrapeAdapter;