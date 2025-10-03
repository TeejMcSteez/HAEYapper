import cron from "node-cron";
import fs from "fs";
import path from "path";
import Scrape from "../database/Scrape.js";

const crontabPath = path.resolve("./lib/cron/schedule.json");

function isSetup() {
  return fs.existsSync(crontabPath);
}

function SaveScrapeSchedule({ second = "*", minute = "*", hour = "*", dom = "*", mon = "*", dow = "*" }) {
  const payload = { second, minute, hour, dom, mon, dow };
  fs.mkdirSync(path.dirname(crontabPath), { recursive: true });
  fs.writeFileSync(crontabPath, JSON.stringify(payload, null, 2), "utf8");
  console.log("Crontab file written.\n");
}

function ReadSchedule() {
  if (!isSetup()) {
    throw new Error("No schedule to read; it was deleted or never created.");
  }
  const txt = fs.readFileSync(crontabPath, "utf8");
  return JSON.parse(txt); // { second, minute, hour, dom, mon, dow }
}

async function SetupScrapeSchedule({ second = "*", minute = "*", hour = "*", dom = "*", mon = "*", dow = "*" }) {
  SaveScrapeSchedule({ second, minute, hour, dom, mon, dow });

  // node-cron expects SPACE-separated fields
  const expr = `${second} ${minute} ${hour} ${dom} ${mon} ${dow}`;
  cron.schedule(expr, async () => {
    try {
      await Scrape();
    } catch (e) {
        console.log(e);
    }
  });

  console.log("Scrape schedule set up successfully");
  return true;
}

async function Cron() {
  if (!isSetup()) {
    throw new Error("No scrape schedule set up!");
  }
  let tasks = cron.getTasks();
  // Cleans up past cron jobs their should only be one and this ensures that
  tasks.forEach(async task => {
    console.log(`Destorying task\nID: ${task.id}\nName: ${task.name}\n`);
    await task.destroy();
  });

  const { second = "*", minute = "*", hour = "*", dom = "*", mon = "*", dow = "*" } = ReadSchedule();
  const expr = `${second} ${minute} ${hour} ${dom} ${mon} ${dow}`;
  cron.schedule(expr, async () => {
    await Scrape();
  });
  console.log("Cron schedule loaded from memory");
}

async function DestroyCron() {
  let tasks = cron.getTasks();
  // Cleans up past cron jobs their should only be one and this ensures that
  tasks.forEach(async task => {
    console.log(`Destroying task\nID: ${task.id}\nName: ${task.name}\n`);
    await task.destroy();
  });
  console.log(`Removing schedule.json file at ${crontabPath}`);
  fs.rmSync(crontabPath);
}

export { isSetup, SetupScrapeSchedule, Cron, DestroyCron };
