import { Hono } from "hono";
import { serve } from "@hono/node-server";

import Select from "../lib/database/Select.js";

const server = new Hono({
    port: 3000,
});


server.get("/logs/get", async (ctx) => {
    const logs = await Select();

    return ctx.json(logs);
});




serve(server);