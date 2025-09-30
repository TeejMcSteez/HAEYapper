import client from "./postgresClient.js";

/**
 * Deletes table from database for reset
 */
async function DropPostgresTable() {
    try {
        const res = await client.query("DROP TABLE logs;");
        console.log(res);
    } catch (e) {
        console.log(e);
    } finally {
        client.end();
    }

}

export default DropPostgresTable;