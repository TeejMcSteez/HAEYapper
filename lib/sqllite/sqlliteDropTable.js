import { dropTable } from "./models.js";

function sqlliteDropTable() {
    dropTable.exec();
}

export default sqlliteDropTable;