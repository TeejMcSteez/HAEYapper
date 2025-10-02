import postgresGetLogs from "../postgres/postgresGetLogs.js";
import sqlliteGetLogs from "../sqllite/sqlliteGetLogs.js";
import "dotenv/config";

async function GetDatabaseLogs() {
    if (process.env.DB_TYPE === "postgres") {
        return await postgresGetLogs();
    } else if (process.env.DB_TYPE === "sqllite") {
        return sqlliteGetLogs();
    } else {
        throw new Error("Database type not set in environment variables!");
    }
}

export default GetDatabaseLogs;