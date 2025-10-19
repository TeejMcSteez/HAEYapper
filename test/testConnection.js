import getLogs from "../lib/getLogs.js";

import { describe, it } from "mocha";
import assert from "assert";

describe("Home Assistant REST Endpoint Check", async function () {
    it ("Should have ok response", async function () {
        assert.ok(await getLogs());
    });
});