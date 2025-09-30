import { dropTable } from "./models";

function DropSqlliteTable() {
    const res = dropTable.all();

    console.log(`Dropped ${res.length} rows`);
} 

export default DropSqlliteTable;