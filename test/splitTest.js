import { describe, it } from "mocha";
import assert from "assert";
import splitLogs from "../lib/splitLogs.js";


let logs = "2025-10-08 23:32:15.501 WARNING (MainThread) [smartrent.utils] InvalidAuth detected. Trying again with updated token...\n" 
    + "2025-10-08 23:32:15.501 WARNING (MainThread) [smartrent.utils] InvalidAuth detected. Trying again with updated token...\n";

describe("Log Regex Test", () => {
    it("Return array should have length of 1", () => {
        assert.equal(splitLogs(logs).length, 1);
    });
});