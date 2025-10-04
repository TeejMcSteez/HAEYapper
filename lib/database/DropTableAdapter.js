import "dotenv/config";
const imports =  {
    postgres: () => import("../postgres/postgresReset.js"),
    sqlite: () => import("../sqlite/sqliteReset.js")
}

/**
 * Drops the log table from the database (used for reset)
 */
async function DropTableAdapter() {
    const db = process.env.DB_TYPE ?? "sqlite";
    const loader = imports[db];
    if (!loader) {
        throw new Error("Unsupported DB_TYPE");
    }
    const { default: Drop } = await loader();
    if (typeof Drop !== "function") {
        throw new Error("Failed to load adataper");
    }
    return await Drop();
}

export default DropTableAdapter;