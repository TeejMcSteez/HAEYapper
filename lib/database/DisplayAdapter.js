import "dotenv/config";
import { Logger, LOGGER_TYPES } from "../logger.js";
const imports = {
    postgres: () => import("../postgres/postgresDisplay.js"),
    sqlite: () => import("../sqlite/sqliteDisplay.js")
}

const logger = new Logger(LOGGER_TYPES.displayAdapter);

/**
 * Outputs log to console
 * @param {string} ans
 * @param {string} filename
 */
async function DisplayAdapter(ans, filename) {
    const db = process.env.DB_TYPE ?? "sqlite";
    const loader = imports[db];
    if (!loader) {
        logger.outputError( "Unsupported DB_TYPE");
    }
    const { default: Display } = await loader();
    if (typeof Display !== "function") {
        logger.outputError( "Failed to load adapter");
    }
    return await Display(ans, filename);
}

export default DisplayAdapter;