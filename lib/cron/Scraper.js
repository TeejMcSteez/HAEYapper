import cron from "node-cron";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";
import ScrapeAdapter from "../database/ScrapeAdapter.js";
import { outputLog, outputError, LOGGER_TYPES } from "../logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const crontabPath = path.join(__dirname, "schedule.json");

const LOG_TYPE = LOGGER_TYPES.cron;
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
    outputError(LOG_TYPE, "No schedule to read; it was deleted or never created.");
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

  outputLog(LOG_TYPE, "Crontab file written.\n");

  // node-cron expects SPACE-separated fields
  const expr = `${second} ${minute} ${hour} ${dom} ${mon} ${dow}`;

  if (!cron.validate(expr)) {
    outputError(LOG_TYPE, `Invalid expression: ${expr}`);
  }

  outputLog(LOG_TYPE, "Scrape schedule set up successfully")
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
    outputError(LOG_TYPE, "No scrape schedule set up!");
  }
  let tasks = cron.getTasks();
  // Cleans up past cron jobs their should only be one and this ensures that
  tasks.forEach(async task => {
    outputLog(LOG_TYPE, `Stopping task\nID: ${task.id}\nName: ${task.name}\n`);
    await task.stop();
  });

  const { second = "*", minute = "*", hour = "*", dom = "*", mon = "*", dow = "*" } = ReadSchedule();
  const expr = `${second} ${minute} ${hour} ${dom} ${mon} ${dow}`;

  outputLog(LOG_TYPE, `Scheduling for ${second}.${minute}:${hour} ${dom}-${mon} ${dow}`);

  const task = cron.schedule(expr, async () => {
    try {
      await ScrapeAdapter();
      outputLog(LOG_TYPE, `ScrapeAdapter finished at ${new Date().toLocaleString()}`);
      outputLog(LOG_TYPE, `Next Run Date: ${task.getNextRun().toLocaleString()}`);
    } catch (e) {
      outputLog(LOG_TYPE, `ScrapeAdapter error: ${err}`);
    }
  });

  outputLog(LOG_TYPE, "Cron schedule loaded from memory");
  outputLog(LOG_TYPE, `Current tasks: ${task.name} Status: ${JSON.stringify(task.getStatus())} Next Run Date: ${task.getNextRun().toLocaleString()}`);
}
/**
 * Destroys scheduled cron jobs from local setup
 */
async function DestroyCron() {
  let tasks = cron.getTasks();
  // Cleans up past cron jobs their should only be one and this ensures that
  tasks.forEach(async task => {
    outputLog(LOG_TYPE, `Destroying task\nID: ${task.id}\nName: ${task.name}\n`);
    await task.destroy();
  });
  outputLog(LOG_TYPE, `Removing schedule.json file at ${crontabPath}`);
  fs.rmSync(crontabPath);
}

/**
 * Get's currently active tasks.
 * @returns Map<string, ScheduledTask>
 */
async function GetActive() {
  return cron.getTasks();
}

export { isSetup, SetupScrapeSchedule, Cron, DestroyCron, GetActive };
