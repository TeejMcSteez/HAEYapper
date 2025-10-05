import PurgeAdapter from "./PurgeAdapter.js"
import "dotenv/config";

async function Prune() {
    const set = process.env.PRUNE;
    if (set) {
        console.log("\n[Prune] Pruning logs\n")
        const reg = set.split(" ");
        const timespan = reg[1];
        const interval = reg[0];
        await PurgeAdapter(timespan, interval);
    } else {
        console.log("[Prune] No prune set, continuing.\n");
    }
}

export default Prune;