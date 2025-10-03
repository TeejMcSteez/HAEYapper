import sqllitePurge from "../sqllite/sqllitePurge.js";
import PostgresPurge from "../postgres/postgresPurge.js";

/**
 * Purges logs from a database that are older than the given timespan and interval
 * @param {string} timespan - span of time (day(s)/hour(s))
 * @param {string} interval - number of day(s)/hour(s)
 */
async function Purge(timespan, interval) {
    if (process.env.DB_TYPE === "postgres") {
        await PostgresPurge(timespan, interval);
    } else if (process.env.DB_TYPE === "sqllite") {
        sqllitePurge(timespan, interval)
    } else {
        throw new Error("Database type is not set in environment variables!");
    }
}

export default Purge;

