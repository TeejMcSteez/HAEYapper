import "dotenv/config";
import client from "./postgresClient.js";
import getLogs from "../getLogs.js";
import splitLogs from "../splitLogs.js";

/**
 * Fetches HA Error logs from REST endpoint and stores each in postgres. 
 * Alogside error timestamp info of when it was stored on database is also generated on postgres.
 */
async function ScrapePostgres() {
    try {
        const logs = await getLogs();

        const logArr = splitLogs(logs);

        const pastLogs = await client.query("SELECT * FROM logs;");

        console.log("Filtering fetched logs with past ones and inserting the new ones . . .\n");
        for (const log of logArr) {
            try {
                if (pastLogs) {
                    pastLogs.rows.forEach(pastLog => {
                        if (pastLog.loginfo === log) {
                            throw new Error("This log is already contained in past logs\n");
                        }
                    });
                }
                if (log === '\n' || log === '') {
                    // do nothing bad log capture
                    throw new Error("log is blank\n");
                }
                
                const res = await client.query(`INSERT INTO logs(loginfo, datetime) VALUES($1, NOW());`, [log]);
                console.log(`Command ${res.command} completed\n`);
                
            } catch (e) {
                console.log(e);
            }
        }
    } catch (e) {
        console.log(e);
    } finally {
        client.end();
    }

}

export default ScrapePostgres;