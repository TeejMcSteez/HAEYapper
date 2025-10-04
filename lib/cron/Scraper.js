import cron from "node-cron";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";
import ScrapeAdapter from "../database/ScrapeAdapter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const crontabPath = path.join(__dirname, "schedule.json");

function isSetup() {
  return fs.existsSync(crontabPath);
}

function SaveScrapeSchedule({ second = "*", minute = "*", hour = "*", dom = "*", mon = "*", dow = "*" }) {
  const payload = { second, minute, hour, dom, mon, dow };
  fs.mkdirSync(path.dirname(crontabPath), { recursive: true });
  fs.writeFileSync(crontabPath, JSON.stringify(payload, null, 2), "utf8");
  console.log("[cron] Crontab file written.\n");
}

function ReadSchedule() {
  if (!isSetup()) {
    throw new Error("[cron] No schedule to read; it was deleted or never created.");
  }
  const txt = fs.readFileSync(crontabPath, "utf8");
  return JSON.parse(txt); // { second, minute, hour, dom, mon, dow }
}

async function SetupScrapeSchedule({ second = "*", minute = "*", hour = "*", dom = "*", mon = "*", dow = "*" }) {
  SaveScrapeSchedule({ second, minute, hour, dom, mon, dow });

  // node-cron expects SPACE-separated fields
  const expr = `${second} ${minute} ${hour} ${dom} ${mon} ${dow}`;
  if (!cron.validate(expr)) {
    throw new Error(`[cron] Invalid expression: ${expr}`);
  }
  cron.schedule(expr, async () => {
    try {
      await ScrapeAdapter();
    } catch (e) {
        console.log(`[cron] ${e}`);
    }
  });

  console.log("[cron] Scrape schedule set up successfully");
  return true;
}

async function Cron() {
  if (!isSetup()) {
    throw new Error("[cron] No scrape schedule set up!");
  }
  let tasks = cron.getTasks();
  // Cleans up past cron jobs their should only be one and this ensures that
  tasks.forEach(async task => {
    console.log(`[cron] Destroying task\nID: ${task.id}\nName: ${task.name}\n`);
    await task.stop();
    await task.destroy();
  });

  const { second = "*", minute = "*", hour = "*", dom = "*", mon = "*", dow = "*" } = ReadSchedule();
  const expr = `${second} ${minute} ${hour} ${dom} ${mon} ${dow}`;
  cron.schedule(expr, async () => {
    await ScrapeAdapter();
  });
  console.log("[cron] Cron schedule loaded from memory");
}

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

export { isSetup, SetupScrapeSchedule, Cron, DestroyCron };
