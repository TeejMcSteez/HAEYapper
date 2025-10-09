/**
 * Splits logs into a log array with regex
 * @param {string} logs 
 * @returns {Array<{
 * ts: string,
 * level: "WARNING"|"ERROR",
 * worker: string,
 * component: string,
 * message: string
 * }>}
 */
function splitLogs(logs) {
    // Matcher help by AI, please any improvement's please let me know!
    // Timestamp at line start, then level, then "(Worker)", then "[component]", then the rest until the next timestamp.
    const matcher = /^(?<ts>\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3})\s+(?<level>WARNING|ERROR)\s+\((?<worker>[^)]+)\)\s+\[(?<component>[^\]]+)\]\s+(?<message>[\s\S]*?)(?=^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}\s+(?:WARNING|ERROR)\s+\(|\Z)/gmi;

    const results = [];
    for (const l of logs.matchAll(matcher)) {
        const { ts, level, worker, component, message } = l.groups;
        
        results.push({
            ts,
            level,
            worker,
            component,
            message
        })
    }

    return results;
}

export default splitLogs;