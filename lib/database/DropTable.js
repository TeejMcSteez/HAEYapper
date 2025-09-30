import DropPostgresTable from "../postgres/postgresReset.js";
import sqlliteDropTable from "../sqllite/sqlliteDropTable.js"

/**
 * Drops the log table from the database (used for reset)
 */
async function DropTable() {
    if (process.env.DB_TYPE === "postgres") {
        await DropPostgresTable();
    } else if (process.env.DB_TYPE === "sqllite") {
        sqlliteDropTable();
    } else {
        throw new Error("Invalid database environment");
    }
}

export default DropTable;