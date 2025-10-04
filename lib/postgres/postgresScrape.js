import "dotenv/config";
import client from "./postgresClient.js";
import getLogs from "../getLogs.js";
import splitLogs from "../splitLogs.js";

/**
 * Fetches HA Error logs from REST endpoint and stores each in postgres. 
 * Alogside error timestamp info of when it was stored on database is also generated on postgres.
 */
async function Scrape() {
    try {
        const logs = await getLogs();

        const logArr = splitLogs(logs);

        console.log("Filtering fetched logs with past ones and inserting the new ones . . .\n");
        for (const log of logArr) {
            try {
                if (log === '\n' || log === '') {
                    // do nothing bad log capture
                    throw new Error("log is blank\n");
                }
                
                const res = await client.query(`INSERT INTO logs(loginfo, datetime) VALUES($1, NOW()) ON CONFLICT (loginfo) DO NOTHING;`, [log]);
                console.log(`Command ${res.command} completed\n`);
                
            } catch (e) {
                console.log(e);
            }
        }
    } catch (e) {
        console.log(e);
    } finally {
        await client.end();
    }

}

export default Scrape;