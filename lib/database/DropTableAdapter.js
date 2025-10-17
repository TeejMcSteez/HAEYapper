import "dotenv/config";
import { outputError, LOGGER_TYPES } from "../logger.js";
const imports =  {
    postgres: () => import("../postgres/postgresReset.js"),
    sqlite: () => import("../sqlite/sqliteReset.js")
}

const lt = LOGGER_TYPES.dropAdapter;

/**
 * Drops the log table from the database (used for reset)
 */
async function DropTableAdapter() {
    const db = process.env.DB_TYPE ?? "sqlite";
    const loader = imports[db];
    if (!loader) {
        outputError(lt, "Unsupported DB_TYPE");
    }
    const { default: Drop } = await loader();
    if (typeof Drop !== "function") {
        outputError(lt, "Failed to load apapter");
    }
    return await Drop();
}

export default DropTableAdapter;