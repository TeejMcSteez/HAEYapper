import client from "./postgresClient.js";

async function postgresGetLogs() {
    const res = await client.query("SELECT * FROM logs;").catch((e) => {
        client.end();
        throw e;
    });

    client.end();

    return res;
}

export default postgresGetLogs;