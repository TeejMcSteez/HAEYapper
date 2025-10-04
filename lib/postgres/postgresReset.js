import client from "./postgresClient.js";

/**
 * Deletes table from database for reset
 */
async function Drop() {
    const conn = await client.connect();
    try {
        const res = await conn.query("DROP TABLE logs;");
        console.log(res);
    } catch (e) {
        console.log(e);
    } finally {
        conn.release();
    }

}

export default Drop;