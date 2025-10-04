import "dotenv/config";
const imports = {
    postgres: () => import("../postgres/postgresDisplay.js"),
    sqlite: () => import("../sqlite/sqliteDisplay.js")
}

/**
 * Outputs log to console
 * @param {string} ans
 * @param {string} filename
 */
async function DisplayAdapter(ans, filename) {
    const db = process.env.DB_TYPE ?? "sqlite";
    const loader = imports[db];
    if (!loader) {
        throw new Error("Unsupported DB_TYPE");
    }
    const { default: Display } = await loader();
    if (typeof Display !== "function") {
        throw new Error("Failed to load adapter");
    }
    return await Display(ans, filename);
}

export default DisplayAdapter;