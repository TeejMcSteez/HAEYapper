import PurgeAdapter from "./PurgeAdapter.js"
import "dotenv/config";
import { outputLog, LOGGER_TYPES } from "../logger.js";

const lt = LOGGER_TYPES.prune;

async function Prune() {
    const set = process.env.PRUNE;
    if (set) {
        outputLog(lt, "Pruning logs\n");
        const reg = set.split(" ");
        const timespan = reg[1];
        const interval = reg[0];
        await PurgeAdapter(timespan, interval);
    } else {
        outputLog(lt, "No prune set, continuing.\n");
    }
}

export default Prune;