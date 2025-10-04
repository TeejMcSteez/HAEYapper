import client from "./postgresClient.js";

/**
 * Deletes table from database for reset
 */
async function Drop() {
    try {
        const res = await client.query("DROP TABLE logs;");
        console.log(res);
    } catch (e) {
        console.log(e);
    } finally {
        await client.end();
    }

}

export default Drop;