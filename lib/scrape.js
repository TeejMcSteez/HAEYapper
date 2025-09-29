import "dotenv/config";
import client from "./client.js";

/**
 * Fetches HA Error logs from REST endpoint and stores each in postgres. 
 * Alogside error timestamp info of when it was stored on database is also generated on postgres.
 */
async function Scrape() {
    try {
        const res = await fetch(`http://${process.env.HA_HOST}/api/error_log`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${process.env.HA_TOKEN}`,
                "content-Type": "application/json"
            },
        });
        // Captures YYYY-DD-DD HH:MM:SS.MIL then the rest and then does negative look ahead to make sure future capture group isn't a new log.   
        const regex = /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}.*?)$(?:\n(?!\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}).*)*/gm;

        const logs = await res.text();
        const logArr = logs.split(regex);

        const pastLogs = await client.query("SELECT * FROM logs;");

        for (const log of logArr) {
            try {
                console.log("Running scrape query . . .");
                pastLogs.rows.forEach(pastLog => {
                    if (pastLog.loginfo === log) {
                        throw new Error("This log is already contained in past logs");
                    }
                });
                if (log === '\n' || log === '') {
                    // do nothing bad log capture
                    console.log("Bad log capture continuing\n")
                } else {
                    const res = await client.query(`INSERT INTO logs(loginfo, datetime) VALUES($1, NOW());`, [log]);
                    console.log(`Command ${res.command} completed\n`);
                }
            } catch (e) {
                console.log(e);
            }
        }
    } catch (e) {
        console.log(e);
    } finally {
        client.end();
    }

    process.exit(1);
}

export default Scrape;