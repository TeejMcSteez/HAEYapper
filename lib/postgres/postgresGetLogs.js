import client from "./postgresClient.js";

async function GetLogs() {
    const res = await client.query("SELECT * FROM logs;").catch((e) => {
        client.end();
        throw e;
    });

    await client.end();

    return res;
}

export default GetLogs;