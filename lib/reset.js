import client from "./client.js";

try {
    const res = await client.query("DROP TABLE logs;");
    console.log(res);
} catch (e) {
    console.log(e);
} finally {
    client.end();
}

process.exit(1);