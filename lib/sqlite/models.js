/**
 * SQL statement to prepare to run for sqllite.
 * This stops a session from being opened and allows everything to happen in sync.
 * While for large files this may suck for simplicity sake its enough for now.
 */
import client from "./sqliteClient.js"

const getPastLogs = client.prepare(`
    SELECT * FROM logs;    
`);

const insertNewLog = client.prepare(`
    INSERT INTO logs(log, datetime) VALUES (?, DATETIME('now'))
    RETURNING log, datetime;
`);
/**
 * Takes `-${interval} ${timespan}`
 * timespan = number of days/hours
 * interval = string selecting days/hours
 */
const deleteFromTimespan = client.prepare(`
    DELETE FROM logs
    WHERE datetime(datetime) < datetime('now', ?);
`);

const dropTable = client.prepare(`
    DROP TABLE logs;    
`);

export { getPastLogs, insertNewLog, deleteFromTimespan, dropTable };