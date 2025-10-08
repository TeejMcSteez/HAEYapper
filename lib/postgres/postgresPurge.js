import client from "./postgresClient.js";

/**
 * Purges any logs older than x days/hours
 * @param {string} timespan Span of time (day/hour)
 * @param {number} interval Interval (31 days/24 hours)
 * @throws Error Interval is not a number!
 * @throws Error Invalid timespan
 */
async function Purge(timespan, interval) {
    const conn = await client.connect();
    const tl = timespan.toLocaleLowerCase();
    const it = Number.parseInt(interval);

    if (it === NaN) {
        conn.release();
        throw new Error("[postgres] Interval is not a number!");
    }

    let res;

    // tl: 'hour' | 'day', it: number
    const invl = `${it} ${tl}${it === 1 ? '' : 's'}`; // e.g. '5 hour(s)' or '2 day(s)'

    const sql = `
      DELETE FROM logs
      WHERE datetime < NOW() - $1::interval
    `;


    switch (tl) {
        case "hour":
            res = await client.query(sql, [invl]);
            break;
        case "day":
            res = await client.query(sql, [invl]);
            break;
        default:
            console.log("[postgres] Invalid timespan")
            break;
    }

    console.log(`[postgres] Deleted ${JSON.stringify(res.rowCount)} rows`);
    conn.release();
}

export default Purge;