import { deleteFromTimespan } from "./models.js";

/**
 * Deletes data older than given day(s) or hours(s) from database.
 * @param {string} timespan - span of time to be deleted (day(s)/hours(s))
 * @param {string} interval - number of day(s)/hours(s) to be deleted.
 * @returns {void}
 */
function Purge(timespan, interval) {
    const res = deleteFromTimespan.all(`-${interval} ${timespan + 's'}`);
    console.log(`[sqlite] Deleted ${res.length} logs`);
}

export default Purge;