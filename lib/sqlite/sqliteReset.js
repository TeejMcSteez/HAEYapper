import { dropTable } from "./models.js";

function Drop() {
    const res = dropTable.run();

    console.log("[sqlite] Table deleted");
} 

export default Drop;