function TestPurgeRegex(timespan, interval) {
    const tsRegex = /^(?:day|hour)/;
    const ivRegex = /^([0-9]?[0-9])/;

    const tsValid = tsRegex.test(timespan);
    const ivValid = ivRegex.test(interval);

    if (!tsValid) {
        throw new Error("[Regex] Timespan invalid");
    } else if (!ivValid) {
        throw new Error("[Regex] Interval invalid");
    }

    return tsValid && ivValid;
}

export { TestPurgeRegex };