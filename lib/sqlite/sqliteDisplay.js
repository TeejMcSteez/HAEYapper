import sqlliteGetLogs from "./sqliteGetLogs.js";
import fs from "node:fs";

/**
 * Displays all logs in sqllite database or says their are no logs to display
 * @param {string} ans - Whether or not to write output to file
 * @param {string?} filename - given name to the log file
 */
function Output(ans, filename) {
    const logs = sqlliteGetLogs();
    if (logs) {
        if (ans.toLowerCase() === "n") {
            logs.forEach(log => {
                console.log(log);
            });
        } else if (ans.toLocaleLowerCase() === "y") {
            const json = JSON.stringify(logs, null, 2);
            fs.writeFileSync(`./${filename === ''? 'log': filename}_${Date.now()}.txt`, json);            
        }
    } else {
        console.log("Their are no logs to display!");
    }
}

export default Output;