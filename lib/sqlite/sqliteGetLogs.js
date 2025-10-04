import { getPastLogs } from "./models.js";

function GetLogs() {
    const res = getPastLogs.all();

    return res;
}

export default GetLogs;