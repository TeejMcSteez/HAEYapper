import "dotenv/config";
const imports = {
    postgres: () => import("../postgres/postgresScrape.js"),
    sqlite: () => import("../sqlite/sqliteScrape.js")
};

/**
 * Scrapes HA REST endpoint and inserts logs into database
 */
async function ScrapeAdapter() {
    const db = process.env.DB_TYPE ?? "sqlite";
    const loader = imports[db]
    if (!loader) {
        throw new Error("[Scrape Adapter] Unsupported DB_TYPE");
    }
    const { default: Scrape } = await loader();
    if (typeof Scrape !== "function") {
        throw new Error("[Scrape Adapter] Failed to load adapter");
    }
    return await Scrape();
}

export default ScrapeAdapter;