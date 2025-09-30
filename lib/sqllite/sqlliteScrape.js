import getLogs from "../getLogs.js";
import splitLogs from "../splitLogs.js";
import { getPastLogs, insertNewLog } from "./models.js";

async function sqlliteScrape() {
    const logs = await getLogs();

    const logArr = splitLogs(logs);

    const pastLogs = getPastLogs.get();

    for (const log of logArr) {
        try {
            console.log(pastLogs);
            if (log === '\n' || log === '') {
                throw new Error("log is blank\n");
            }

            if (pastLogs) {
                pastLogs.forEach(pastLog => {
                    if (pastLog === log) {
                        throw new Error("This log is already contained in past logs\n");
                    }
                });
            }

            const res = insertNewLog.get(log);
            console.log(`Log ${res.log} insert completed\n`);
            
        } catch (e) {
            console.log(e);
        }
    }
    
}

export default sqlliteScrape;