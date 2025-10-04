/**
 * Get's error logs from Home Assistant's REST endpoint.
 * Returns the JSON body as a string or Error
 * @returns string logs
 * @throws Error
 */
async function getLogs() {
    const res = await fetch(`http://${process.env.HA_HOST}/api/error_log`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${process.env.HA_TOKEN}`,
                "content-Type": "application/json"
            },
    });

    if (res.ok) {
        return await res.text();
    } else {
        throw new Error("[Log Fetcher] Home Assistant response was invalid");
    }
} 

export default getLogs;