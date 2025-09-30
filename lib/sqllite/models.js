import db from "./sqlliteClient.js"

const getPastLogs = db.prepare(`
    SELECT * FROM logs;    
`);

const insertNewLog = db.prepare(`
    INSERT INTO logs(log, datetime) VALUES (?, DATETIME('now'))
    RETURNING log, datetime;
`);

export { getPastLogs, insertNewLog };