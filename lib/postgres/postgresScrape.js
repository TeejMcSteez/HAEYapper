import client from "./postgresClient.js";
import getLogs from "../getLogs.js";
import splitLogs from "../splitLogs.js";

/**
 * Fetches HA Error logs from REST endpoint and stores each in postgres. 
 * Alogside error timestamp info of when it was stored on database is also generated on postgres.
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
                if (log === '\n' || log === '') {
                    // do nothing bad log capture
                    throw new Error("[postgres] log is blank\n");
                }
                
                const res = await conn.query(`INSERT INTO logs(loginfo, datetime) VALUES($1, NOW()) ON CONFLICT (loginfo) DO NOTHING;`, [log]);
                console.log(`[postgres] Command ${res.command} completed\n`);
                
            } catch (e) {
                console.log(e);
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