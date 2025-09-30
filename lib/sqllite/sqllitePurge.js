import { deleteFromTimespan } from "./models.js";

/**
 * Deletes data older than given day(s) or hours(s) from database.
 * @param {string} timespan - number of days/hours ot be deleted
 * @param {string} interval - interval of time to be deleted (days/hours)
 * @returns {void}
 */
function sqllitePurge(timespan, interval) {
    const res = deleteFromTimespan.all(`-${timespan} ${interval + 's'}`);
    console.log(`Deleted ${res.length} logs`);
}

export default sqllitePurge;