import "dotenv/config";
const imports = {
    postgres: () => import("../postgres/postgresPurge.js"),
    sqlite: () => import("../sqlite/sqlitePurge.js")
}

/**
 * Purges logs from a database that are older than the given timespan and interval
 * @param {string} timespan - span of time (day(s)/hour(s))
 * @param {string} interval - number of day(s)/hour(s)
 */
async function PurgeAdapter(timespan, interval) {
    const db = process.env.DB_TYPE ?? "sqlite";
    const loader = imports[db];
    if (!loader) {
        throw new Error("[Purge Adapter] Unsupported DB_TYPE");
    }
    const { default: Purge } = await loader();
    if (typeof Purge !== "function") {
        throw new Error("[Purge Adapter] Failed to load adapter");
    }
    return await Purge(timespan, interval);
}

export default PurgeAdapter;

