const LOGGER_TYPES = {
    "runner" :"RUNNER",
    "sqlite" :"SQLITE",
    "postgres" :"POSTGRES",
    "server" :"SERVER",
    "cron" :"CRON",
    "displayAdapter": "DISPLAY ADAPTER",
    "dropAdapter": "DROP ADAPTER",
    "prune": "PRUNE",
    "purgeAdapter": "PURGE ADAPTER",
    "scrapeAdapter": "SCRAPE ADAPTER",
    "selectAdapter": "SELECT ADAPTER"
}
/**
 * 
 * @param {string} logger_type 
 * @param {string} message 
 */
function outputLog(logger_type, message) {
    console.log(`[${logger_type}]`, message);

}

/**
 * 
 * @param {string} logger_type 
 * @param {string} message 
 */
function outputError(logger_type, message) {
    throw new Error(`[${logger_type}]`, message);
}

export { LOGGER_TYPES, outputLog, outputError };