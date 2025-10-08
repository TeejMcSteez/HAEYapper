import cron from "node-cron";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";
import ScrapeAdapter from "../database/ScrapeAdapter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const crontabPath = path.join(__dirname, "schedule.json");
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
    throw new Error("[cron] No schedule to read; it was deleted or never created.");
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

  console.log("[cron] Crontab file written.\n");

  // node-cron expects SPACE-separated fields
  const expr = `${second} ${minute} ${hour} ${dom} ${mon} ${dow}`;

  if (!cron.validate(expr)) {
    throw new Error(`[cron] Invalid expression: ${expr}`);
  }

  console.log("[cron] Scrape schedule set up successfully");
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
    throw new Error("[cron] No scrape schedule set up!");
  }
  let tasks = cron.getTasks();
  // Cleans up past cron jobs their should only be one and this ensures that
  tasks.forEach(async task => {
    console.log(`[cron] Stopping task\nID: ${task.id}\nName: ${task.name}\n`);
    await task.stop();
  });

  const { second = "*", minute = "*", hour = "*", dom = "*", mon = "*", dow = "*" } = ReadSchedule();
  const expr = `${second} ${minute} ${hour} ${dom} ${mon} ${dow}`;

  console.log(`[cron] Scheduling for ${second}.${minute}:${hour} ${dom}-${mon} ${dow}`)

  const task = cron.schedule(expr, async () => {
    try {
      await ScrapeAdapter();
      console.log("[cron] ScrapeAdapter finished at " + new Date().toLocaleString());
      console.log("[cron] Next Run Date: " + task.getNextRun().toLocaleString());
    } catch (e) {
      console.log("[cron] ScrapeAdapter error: " + err);
    }
  });

  console.log("[cron] Cron schedule loaded from memory");
  console.log("[cron] Current tasks: ", task.name, "Status:", JSON.stringify(task.getStatus()), "Next Run Date:", task.getNextRun().toLocaleString());
}
/**
 * Destroys scheduled cron jobs from local setup
 */
async function DestroyCron() {
  let tasks = cron.getTasks();
  // Cleans up past cron jobs their should only be one and this ensures that
  tasks.forEach(async task => {
    console.log(`[cron] Destroying task\nID: ${task.id}\nName: ${task.name}\n`);
    await task.destroy();
  });
  console.log(`[cron] Removing schedule.json file at ${crontabPath}`);
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
