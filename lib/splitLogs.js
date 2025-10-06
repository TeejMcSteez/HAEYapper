/**
 * Splits logs into a log array with regex
 * @param {string} logs 
 * @returns Array<string>
 */
function splitLogs(logs) {
    // Captures YYYY-DD-DD HH:MM:SS.MIL then the rest and then does negative look ahead to make sure future capture group isn't a new log.   
    const regex = /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}.*?)$(?:\n(?!\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}).*)*/gm;

    const logArr = logs.split(regex);

    const normalizedLogs = [];
    // Pushes all non-empty logs to a normalized array
    // This is done to reduce the amount of logs sent to database
    // While their is still a constraint for each log to be unique
    // This reduces the overhead of sending a empty or blank log for 
    // every valid one. 
    for (let log in logArr) {
        if (log !== '\n' || log !== '') {
            normalizedLogs.push(log);
        }
    }

    return normalizedLogs;
}

export default splitLogs;