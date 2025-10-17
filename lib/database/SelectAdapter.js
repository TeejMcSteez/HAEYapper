import "dotenv/config";
const imports = {
    postgres: () => import("../postgres/postgresGetLogs.js"),
    sqlite: () => import("../sqlite/sqliteGetLogs.js")
}

import { Logger, LOGGER_TYPES } from "../logger.js";

const logger = new Logger(LOGGER_TYPES.selectAdapter);

async function GetDatabaseLogsAdapter() {
    const db = process.env.DB_TYPE ?? "sqlite";
    const loader = imports[db];
    if (!loader) {
        logger.outputError("Unsupported DB_TYPE");
    }
    const { default: GetLogs } = await loader();
    if (typeof GetLogs !== "function") {
        logger.outputError("Failed to load adapter");
    }
    return await GetLogs();
}

export default GetDatabaseLogsAdapter;