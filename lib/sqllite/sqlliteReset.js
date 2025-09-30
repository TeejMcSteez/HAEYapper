import { dropTable } from "./models.js";

function DropSqlliteTable() {
    const res = dropTable.run();

    console.log("Table deleted");
} 

export default DropSqlliteTable;