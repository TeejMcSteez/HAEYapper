import "dotenv/config";
import { outputError, LOGGER_TYPES } from "../logger.js";
const imports = {
    postgres: () => import("../postgres/postgresDisplay.js"),
    sqlite: () => import("../sqlite/sqliteDisplay.js")
}

const lt = LOGGER_TYPES.displayAdapter;

/**
 * Outputs log to console
 * @param {string} ans
 * @param {string} filename
 */
async function DisplayAdapter(ans, filename) {
    const db = process.env.DB_TYPE ?? "sqlite";
    const loader = imports[db];
    if (!loader) {
        outputError(lt, "Unsupported DB_TYPE");
    }
    const { default: Display } = await loader();
    if (typeof Display !== "function") {
        outputError(lt, "Failed to load adapter");
    }
    return await Display(ans, filename);
}

export default DisplayAdapter;