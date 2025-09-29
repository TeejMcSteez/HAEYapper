import client from "./client.js";

/**
 * Creates table with needed columns
 */
async function Init() {
    const query = "CREATE TABLE logs(logId SERIAL PRIMARY KEY, logInfo TEXT, datetime TIMESTAMP);";

    try {
        const res = await client.query(query);
        console.log(res);
    } catch (e) {
        console.log(e);
    } finally {
        await client.end()
    }

}

export default Init;