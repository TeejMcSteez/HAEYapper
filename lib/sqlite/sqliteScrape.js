import getLogs from "../getLogs.js";
import splitLogs from "../splitLogs.js";
import { getPastLogs, insertNewLog } from "./models.js";

async function Scrape() {
    const logs = await getLogs();

    const logArr = splitLogs(logs);

    for (const log of logArr) {
        try {
            if (log === '\n' || log === '') {
                throw new Error("log is blank\n");
            }

            insertNewLog.get(log);
            console.log(`Log insert completed\n`);
            
        } catch (e) {
            console.log(e);
        }
    }
    
}

export default Scrape;