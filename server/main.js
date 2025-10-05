import { Hono } from "hono";
import { serve } from "@hono/node-server";

import SelectAdapter from "../lib/database/SelectAdapter.js";
import PurgeAdapter from "../lib/database/PurgeAdapter.js";
import ScrapeAdapter from "../lib/database/ScrapeAdapter.js";
import Prune from "../lib/database/Prune.js";

import { Cron, isSetup, SetupScrapeSchedule, DestroyCron } from "../lib/cron/Scraper.js";


const server = new Hono({
    port: 3000,
});


server.get("/logs/get", async (ctx) => {
    try {
        const logs = await SelectAdapter();
        return ctx.json(logs);
    } catch (e) {
        console.log("[Server] error getting logs: " + e);
        return ctx.json({ "error": e });
    }
});
// TODO: Add request parsing for security, ensuring that it matches a regex
server.get("/logs/Purge/:timespan/:interval", async (ctx) => {
    try {
        const { timespan, interval } = ctx.req.param();

        await PurgeAdapter(timespan, interval);

        return ctx.json({ "Timespan Removed": `${interval} ${timespan + "s"}` });
    } catch (e) {
        console.log("[Server] error purging logs " + e);
        return ctx.json({ "error": e });
    }
});

server.get("/logs/scrape", async (ctx) => {
    console.log("[Server] Scrape job started\n");
    try {
        await ScrapeAdapter();
        console.log("[Server] Scrape job complete\n")
        return ctx.json({ "Scrape Job": "Completed" });
    } catch (e) {
        console.log("[Server] Scrape job failed with error " + e);
        return ctx.json({ "error": e });
    }
});
// TODO: Add request parsing for security, ensuring that it matches a regex
server.get("/schedule/:second/:minute/:hour/:dom/:mon/:dow", async (ctx) =>  {
    try {
        const { second, minute, hour, dom, mon, dow } = ctx.req.param();

        const res = await SetupScrapeSchedule({ second, minute, hour, dom, mon, dow });

        return ctx.json({ "Success": res });
    } catch (e) {
        console.log("[Server] error scheduling scrape job: " + e);
        return ctx.json({ "error": e }); 
    }

});

server.get("/schedule", async (ctx) => {
    try {
        const is = isSetup();
        if (is) {
            await Cron();
            return ctx.json({ "Schedule": "Loaded" }); 
        } else {
            return ctx.json({ "Schedule": "Not Setup", "Message": "/schedule/:second/:minute/:hour/:dom/:mon/:dow to setup" });
        }
    } catch (e) {
        console.log("[Server] error checking schedule");
        return ctx.json({ "error": e });
    }

});

server.get("/schedule/destroy", async (ctx) => {
    try {
        await DestroyCron();
        return ctx.json({ "destroy": "successful" });
    } catch (e) {
        return ctx.json({ "error": e });
    }
});

console.log("[Server] Pruning logs before startup\n");
await Prune();

console.log("[Server] Server starting at http://localhost:3000/");
serve(server);