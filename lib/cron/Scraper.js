import cron from "node-cron";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";
import ScrapeAdapter from "../database/ScrapeAdapter.js";
import { Logger, LOGGER_TYPES } from "../logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const crontabPath = path.join(__dirname, "schedule.json");

const logger = new Logger(LOGGER_TYPES.cron);
/**
 * Check's if schedule file exist's
 * @returns boolean
 */
function isSetup() {
  return fs.existsSync(crontabPath);
}
/**
 * Read's schedule from local file
 * @returns {{ second, minute, hour, dom, mon, dow }}
 * @throws Error
 */
function ReadSchedule() {
  if (!isSetup()) {
    logger.outputError( "No schedule to read; it was deleted or never created.");
  }
  const txt = fs.readFileSync(crontabPath, "utf8");
  return JSON.parse(txt); // { second, minute, hour, dom, mon, dow }
}
/**
 * Write's file to local schedule.json with given parameters.
 * @param {{second = "*", minute = "*", hour = "*", dom = "*", mon = "*", dow = "*"}} timeObject 
 * @returns true
 * @throws Error
 */
async function SetupScrapeSchedule({ second = "*", minute = "*", hour = "*", dom = "*", mon = "*", dow = "*" }) {
  const payload = { second, minute, hour, dom, mon, dow };

  fs.mkdirSync(path.dirname(crontabPath), { recursive: true });
  fs.writeFileSync(crontabPath, JSON.stringify(payload, null, 2), "utf8");

  logger.outputLog( "Crontab file written.\n");

  // node-cron expects SPACE-separated fields
  const expr = `${second} ${minute} ${hour} ${dom} ${mon} ${dow}`;

  if (!cron.validate(expr)) {
    logger.outputError( `Invalid expression: ${expr}`);
  }

  logger.outputLog( "Scrape schedule set up successfully")
  return true;
}
/**
 * Main cron loader.
 * If setup will stop all tasks if their are any,
 * Read the schedule.json,
 * Schedule a cron job for the given schedule,
 * @throws Error
 */
async function Cron() {
  if (!isSetup()) {
    logger.outputError( "No scrape schedule set up!");
  }
  let tasks = cron.getTasks();
  // Cleans up past cron jobs their should only be one and this ensures that
  tasks.forEach(async task => {
    logger.outputLog( `Stopping task\nID: ${task.id}\nName: ${task.name}\n`);
    await task.stop();
  });

  const { second = "*", minute = "*", hour = "*", dom = "*", mon = "*", dow = "*" } = ReadSchedule();
  const expr = `${second} ${minute} ${hour} ${dom} ${mon} ${dow}`;

  logger.outputLog( `Scheduling for ${second}.${minute}:${hour} ${dom}-${mon} ${dow}`);

  const task = cron.schedule(expr, async () => {
    try {
      await ScrapeAdapter();
      logger.outputLog( `ScrapeAdapter finished at ${new Date().toLocaleString()}`);
      logger.outputLog( `Next Run Date: ${task.getNextRun().toLocaleString()}`);
    } catch (e) {
      logger.outputLog( `ScrapeAdapter error: ${err}`);
    }
  });

  logger.outputLog( "Cron schedule loaded from memory");
  logger.outputLog( `Current tasks: ${task.name} Status: ${JSON.stringify(task.getStatus())} Next Run Date: ${task.getNextRun().toLocaleString()}`);
}

/**
 * Get's currently active tasks.
 * @returns Map<string, ScheduledTask>
 */
async function GetActive() {
  return cron.getTasks();
}

export { isSetup, SetupScrapeSchedule, Cron, GetActive };
