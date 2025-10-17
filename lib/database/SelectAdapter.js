import "dotenv/config";
const imports = {
    postgres: () => import("../postgres/postgresGetLogs.js"),
    sqlite: () => import("../sqlite/sqliteGetLogs.js")
}

import { outputError, LOGGER_TYPES } from "../logger.js";

const lt = LOGGER_TYPES.selectAdapter;

async function GetDatabaseLogsAdapter() {
    const db = process.env.DB_TYPE ?? "sqlite";
    const loader = imports[db];
    if (!loader) {
        outputError(lt, "Unsupported DB_TYPE");
    }
    const { default: GetLogs } = await loader();
    if (typeof GetLogs !== "function") {
        outputError(lt, "Failed to load adapter");
    }
    return await GetLogs();
}

export default GetDatabaseLogsAdapter;