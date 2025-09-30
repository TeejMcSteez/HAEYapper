/**
 * SQL statement to prepare to run for sqllite.
 * This stops a session from being opened and allows everything to happen in sync.
 * While for large files this may suck for simplicity sake its enough for now.
 */
import db from "./sqlliteClient.js"

const getPastLogs = db.prepare(`
    SELECT * FROM logs;    
`);

const insertNewLog = db.prepare(`
    INSERT INTO logs(log, datetime) VALUES (?, DATETIME('now'))
    RETURNING log, datetime;
`);
/**
 * Takes `-${interval} ${timespan}`
 * timespan = number of days/hours
 * interval = string selecting days/hours
 */
const deleteFromTimespan = db.prepare(`
    DELETE FROM logs
    WHERE datetime(datetime) < datetime('now', ?);
`);

const dropTable = db.prepare("DROP TABLE logs;");

export { getPastLogs, insertNewLog, deleteFromTimespan, dropTable };