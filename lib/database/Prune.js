import PurgeAdapter from "./PurgeAdapter.js"
import "dotenv/config";
import { Logger, LOGGER_TYPES } from "../logger.js";

const logger = new Logger(LOGGER_TYPES.prune);

async function Prune() {
    const set = process.env.PRUNE;
    if (set) {
        logger.outputLog("Pruning logs\n");
        const reg = set.split(" ");
        const timespan = reg[1];
        const interval = reg[0];
        await PurgeAdapter(timespan, interval);
    } else {
        logger.outputLog("No prune set, continuing.\n");
    }
}

export default Prune;