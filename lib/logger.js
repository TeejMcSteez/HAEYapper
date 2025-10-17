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
    "selectAdapter": "SELECT ADAPTER",
    "runner": "RUNNER",
}
class Logger {
    logger_type;
    /**
     * Creates a logger to output a log specific to the component
     * @param {LOGGER_TYPES} logger_type 
     */
    constructor(logger_type) {
        this.logger_type = logger_type;
    }

    /**
     * 
     * @param {string} message 
     */
    outputLog(message) {
        console.log(`[${this.logger_type}]`, message);

    }

    /**
     * 
     * @param {string} message 
     */
    outputError(message) {
        throw new Error(`[${this.logger_type}]`, message);
    }

}

export { Logger, LOGGER_TYPES };