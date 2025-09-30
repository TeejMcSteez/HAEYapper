import postgresDisplay from "../postgres/postgresDisplay.js";
import sqlliteDisplay from "../sqllite/sqlliteDisplay.js";

async function Display() {
    if (process.env.DB_TYPE === "postgres") {
        await postgresDisplay();
    } else if (process.env.DB_TYPE === "sqllite") {
        sqlliteDisplay();
    } else {
        throw new Error("Database type is not set in environment!");
    }
}

export default Display;