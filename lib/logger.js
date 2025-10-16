const LOGGER_TYPES = {
    "runner" :"RUNNER",
    "sqlite" :"SQLITE",
    "postgres" :"POSTGRES",
    "server" :"SERVER",
    "cron" :"CRON"
}
/**
 * 
 * @param {string} logger_type 
 * @param {string} message 
 */
function outputLog(logger_type, message) {
    switch (logger_type.toUpperCase()) {
        case LOGGER_TYPES.runner:
            console.log(`[${logger_type}]`, message);
            break;
        case LOGGER_TYPES.sqlite:
            console.log(`[${logger_type}]`, message);
            break;
        case LOGGER_TYPES.postgres:
            console.log(`[${logger_type}]`, message);
            break;
        case LOGGER_TYPES.server:
            console.log(`[${logger_type}]`, message);
            break;
        case LOGGER_TYPES.cron:
            console.log(`[${logger_type}]`, message);
            break;
        default:
            console.log(`[${logger_type}]`, message);
            break;
    }
}

/**
 * 
 * @param {string} logger_type 
 * @param {string} message 
 */
function outputError(logger_type, message) {
    switch (logger_type.toUpperCase()) {
        case LOGGER_TYPES.runner:
            throw new Error(`[${logger_type}]`, message);
        case LOGGER_TYPES.sqlite:
            throw new Error(`[${logger_type}]`, message);
        case LOGGER_TYPES.postgres:
            throw new Error(`[${logger_type}]`, message);
        case LOGGER_TYPES.server:
            throw new Error(`[${logger_type}]`, message);
        case LOGGER_TYPES.cron:
            throw new Error(`[${logger_type}]`, message);
        default:
            throw new Error(`[${logger_type}]`, message);
    }
}

export { LOGGER_TYPES, outputLog, outputError };