import client from "./client.js";

/**
 * Deletes table from database for reset
 */
async function DropTable() {
    try {
        const res = await client.query("DROP TABLE logs;");
        console.log(res);
    } catch (e) {
        console.log(e);
    } finally {
        client.end();
    }

    process.exit(1);
}

export default DropTable;