import "dotenv/config";
const imports = {
    postgres: () => import("../postgres/postgresGetLogs.js"),
    sqlite: () => import("../sqlite/sqliteGetLogs.js")
}

async function GetDatabaseLogsAdapter() {
    const db = process.env.DB_TYPE ?? "sqlite";
    const loader = imports[db];
    if (!loader) {
        throw new Error("[Select Adapter] Unsupported DB_TYPE");
    }
    const { default: GetLogs } = await loader();
    if (typeof GetLogs !== "function") {
        throw new Error("[Select Adapter] Failed to load adapter");
    }
    return await GetLogs();
}

export default GetDatabaseLogsAdapter;