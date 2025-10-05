/**
 * Test purge paramters validity
 * @param {string} timespan 
 * @param {string} interval 
 * @returns boolean
 * @throws Error
 */
function TestPurgeRegex(timespan, interval) {
    const tsValid = /^(?:day|hour)$/.test(timespan) && timespan.length <= 4;
    const ivValid = /^[0-9]{1,2}$/.test(interval) &&  interval.length < 3;

    if (!tsValid) throw new Error("[Regex] Timespan is invalid");
    if (!ivValid) throw new Error("[Regex] Interval is invalid");

    return tsValid && ivValid;
}

export { TestPurgeRegex };