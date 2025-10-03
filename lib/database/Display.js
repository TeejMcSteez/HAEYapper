import postgresDisplay from "../postgres/postgresDisplay.js";
import sqlliteDisplay from "../sqllite/sqlliteDisplay.js";

/**
 * Outputs log to console
 * @param {string} ans
 */
async function Display(ans) {
    if (process.env.DB_TYPE === "postgres") {
        await postgresDisplay(ans);
    } else if (process.env.DB_TYPE === "sqllite") {
        sqlliteDisplay(ans);
    } else {
        throw new Error("Database type is not set in environment!");
    }
}

export default Display;