/**
 * Splits logs into a log array with regex
 * @param {string} logs 
 * @returns Array<string>
 */
function splitLogs(logs) {
    // Captures YYYY-DD-DD HH:MM:SS.MIL then the rest and then does negative look ahead to make sure future capture group isn't a new log.   
    const regex = /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}.*?)$(?:\n(?!\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}).*)*/gm;

    const logArr = logs.split(regex);

    return logArr;
}

export default splitLogs;