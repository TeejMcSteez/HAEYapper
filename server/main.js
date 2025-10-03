import { Hono } from "hono";
import { serve } from "@hono/node-server";

import Select from "../lib/database/Select.js";
import Purge from "../lib/database/Purge.js";

import { Cron, isSetup, SetupScrapeSchedule, DestroyCron } from "../lib/cron/Scraper.js";


const server = new Hono({
    port: 3000,
});


server.get("/logs/get", async (ctx) => {
    const logs = await Select();

    return ctx.json(logs);
});
// TODO: Add request parsing for security, ensuring that it matches a regex
server.get("/logs/purge/:timespan/:interval", async (ctx) => {
    const { timespan, interval } = ctx.req.param();

    await Purge(timespan, interval);

    return ctx.json({ "Timespan Removed": `${interval} ${timespan + "s"}` });
});
// TODO: Add request parsing for security, ensuring that it matches a regex
server.get("/schedule/:second/:minute/:hour/:dom/:mon/:dow", async (ctx) =>  {
    const { second, minute, hour, dom, mon, dow } = ctx.req.param();

    const res = await SetupScrapeSchedule({ second, minute, hour, dom, mon, dow });

    return ctx.json({ "Success": res });

});

server.get("/schedule", async (ctx) => {
    const is = isSetup();
    if (is) {
        await Cron();
        return ctx.json({ "Schedule": "Loaded" }); 
    } else {
        return ctx.json({ "Schedule": "Not Setup" });
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

console.log("Server starting at http://localhost:3000/");
serve(server);