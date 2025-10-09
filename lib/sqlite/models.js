/**
 * SQL statement to prepare to run for sqllite.
 * This stops a session from being opened and allows everything to happen in sync.
 * While for large files this may suck for simplicity sake its enough for now.
 */
import client from "./sqliteClient.js"
/**
 * SELECT * FROM logs;
 */
const getPastLogs = client.prepare(`
    SELECT * FROM logs;    
`);
/**
 * INSERT INTO logs(logDate, logLevel, logCaller, logComponent, logInfo, datetime) VALUES (?, ?, ?, ?, ?, DATETIME('now'))
 * RETURNING logInfo, datetime;
 */
const insertNewLog = client.prepare(`
    INSERT INTO logs(logDate, logLevel, logCaller, logComponent, logInfo, datetime) VALUES (?, ?, ?, ?, ?, DATETIME('now'))
    RETURNING logInfo, datetime;
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
/**     
 * DROP TABLE logs;
 */
const dropTable = client.prepare(`
    DROP TABLE logs;    
`);

export { getPastLogs, insertNewLog, deleteFromTimespan, dropTable };