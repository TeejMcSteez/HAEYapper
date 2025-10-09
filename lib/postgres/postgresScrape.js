import client from "./postgresClient.js";
import getLogs from "../getLogs.js";
import splitLogs from "../splitLogs.js";

/**
 * Fetches HA Error logs from REST endpoint and stores each in postgres. 
 * Alogside error timestamp info of when it was stored on database is also generated on postgres.
 * @throws Error
 */
async function Scrape() {
    const conn = await client.connect();
    try {
        const logs = await getLogs();

        const logArr = splitLogs(logs);

        console.log("[postgres] Filtering fetched logs with past ones and inserting the new ones . . .\n");
        conn.query("BEGIN");
        for (const log of logArr) {
            try {    
                console.log(log)
                const res = await conn.query(`INSERT INTO logs(logDate, logLevel, logCaller, logComponent, logInfo, datetime) VALUES($1, $2, $3, $4, $5, NOW()) ON CONFLICT (loginfo) DO NOTHING;`,
                    [log.ts, log.level, log.worker, log.component, log.message]);
                console.log(`[postgres] Command ${JSON.stringify(res.command)} completed\n`);
            } catch (e) {
                throw new Error(`[postgres] Failed to scrape with error: ${e}`);
            }
        }
        await conn.query("COMMIT");
    } catch (e) {
        await conn.query("ROLLBACK");
        throw e;
    } finally {
        conn.release();
    }

}

export default Scrape;