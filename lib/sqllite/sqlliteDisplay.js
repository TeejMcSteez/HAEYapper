import { getPastLogs } from "./models.js";

/**
 * Displays all logs in sqllite database or says their are no logs to display
 */
function sqlliteOutputLogs() {
    const logs = getPastLogs.all();

    if (logs) {
        logs.forEach(log => {
            console.log(log);
        });
    } else {
        console.log("Their are no logs to display!");
    }
}

export default sqlliteOutputLogs;