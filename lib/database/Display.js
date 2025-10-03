import postgresDisplay from "../postgres/postgresDisplay.js";
import sqlliteDisplay from "../sqllite/sqlliteDisplay.js";

/**
 * Outputs log to console
 * @param {string} ans
 * @param {string?} filename - name to the given log file
 */
async function Display(ans, filename) {
    if (process.env.DB_TYPE === "postgres") {
        await postgresDisplay(ans, filename);
    } else if (process.env.DB_TYPE === "sqllite") {
        sqlliteDisplay(ans, filename);
    } else {
        throw new Error("Database type is not set in environment!");
    }
}

export default Display;