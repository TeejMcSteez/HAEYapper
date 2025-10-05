import { describe, it } from "mocha";
import assert from "assert";
import { TestPurgeRegex } from "../server/lib/testRegex.js";

describe('Timespan Regex Fail Test', function () {
    it('Should throw error as interval has to many digits', function() {
        assert.throws(TestPurgeRegex("day", "1234"));
    });
});

describe('Timespan Regex Fail Test', function () {
    it('Should throw error as timespan is invalid', function() {
        assert.throws(TestPurgeRegex("days", "12"));
    });
});

describe("Timepspan Regex Success Test", function () {
    it("Should succeed with valid day", function () {
        assert.equal(TestPurgeRegex("day", "2"), true);
    })
});

describe("Timepspan Regex Success Test", function () {
    it("Should succeed with valid hour", function () {
        assert.equal(TestPurgeRegex("hour", "12"), true);
    })
});