import "dotenv/config";
import { Logger, LOGGER_TYPES } from "../logger.js";
const imports =  {
    postgres: () => import("../postgres/postgresReset.js"),
    sqlite: () => import("../sqlite/sqliteReset.js")
}

const logger = new Logger(LOGGER_TYPES.dropAdapter);

/**
 * Drops the log table from the database (used for reset)
 */
async function DropTableAdapter() {
    const db = process.env.DB_TYPE ?? "sqlite";
    const loader = imports[db];
    if (!loader) {
        logger.outputError("Unsupported DB_TYPE");
    }
    const { default: Drop } = await loader();
    if (typeof Drop !== "function") {
        logger.outputError("Failed to load apapter");
    }
    return await Drop();
}

export default DropTableAdapter;