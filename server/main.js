import { Hono } from "hono";
import { serve } from "@hono/node-server";

import Select from "../lib/database/Select.js";
import { Cron, isSetup, SetupScrapeSchedule } from "../lib/cron/Scraper.js";


const server = new Hono({
    port: 3000,
});


server.get("/logs/get", async (ctx) => {
    const logs = await Select();

    return ctx.json(logs);
});




serve(server);
console.log(`Server running on http://localhost:3000/`);