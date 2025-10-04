import { dropTable } from "./models.js";

function Drop() {
    dropTable.exec();
}

export default Drop;