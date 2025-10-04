import { dropTable } from "./models.js";

function Drop() {
    const res = dropTable.run();

    console.log("Table deleted");
} 

export default Drop;