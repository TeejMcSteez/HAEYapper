import { getPastLogs } from "./models.js";

function sqlliteGetLogs() {
    const res = getPastLogs.all();

    return res;
}

export default sqlliteGetLogs;