import getLogs from "../getLogs.js";
import splitLogs from "../splitLogs.js";
import { insertNewLog } from "./models.js";
import client from "./sqliteClient.js";

/**
 * Scrape function for sqlite
 * @throws Error
 */
async function Scrape() {
    const logs = await getLogs();

    const logArr = splitLogs(logs);
    client.exec("BEGIN");
    try {
        for (const log of logArr) {
            try {
                insertNewLog.run(log);
                console.log(`[sqlite] Log insert completed\n`);

            } catch (e) {
                throw new Error(`[sqlite] Failed to scrape logs with error: ${e}`);
            }
        }
        client.exec("COMMIT");
    } catch (e) {
        client.exec("ROLLBACK");
        throw e;
    }
    
}

export default Scrape;