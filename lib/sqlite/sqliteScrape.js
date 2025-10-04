import getLogs from "../getLogs.js";
import splitLogs from "../splitLogs.js";
import { insertNewLog } from "./models.js";
import client from "./sqliteClient.js";

async function Scrape() {
    const logs = await getLogs();

    const logArr = splitLogs(logs);
    client.exec("BEGIN");
    try {
        for (const log of logArr) {
            try {
                if (log === '\n' || log === '') {
                    throw new Error("log is blank\n");
                }

                insertNewLog.run(log);
                console.log(`Log insert completed\n`);

            } catch (e) {
                console.log(e);
            }
        }
        client.exec("COMMIT");
    } catch (e) {
        client.exec("ROLLBACK");
        throw e;
    }
    
}

export default Scrape;