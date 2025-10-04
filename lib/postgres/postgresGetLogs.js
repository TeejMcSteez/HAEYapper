import client from "./postgresClient.js";

async function GetLogs() {
    const conn = await client.connect();
    const res = await conn.query("SELECT * FROM logs;");
    conn.release();

    return res;
}

export default GetLogs;