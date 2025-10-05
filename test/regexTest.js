import { describe, it } from "mocha";
import assert from "assert";
import { TestPurgeRegex } from "../server/lib/testRegex.js";

describe('Timespan Regex Fail Test', function () {
    it('Should throw error as interval has to many digits', function(done) {
        try {
            TestPurgeRegex("day", "123");
        } catch {
            done();
        }
    });
});

describe('Timespan Regex Fail Test', function () {
    it('Should throw error as timespan is invalid', function(done) {
        try {
            TestPurgeRegex("days", "12");
        } catch {
            done();
        }
    });
});

describe("Timepspan Regex Success Test", function () {
    it("Should succeed with valid day 1 digit", function () {
        assert.equal(TestPurgeRegex("day", "2"), true);
    })
});

describe("Timepspan Regex Success Test", function () {
    it("Should succeed with valid day 2 digit", function () {
        assert.equal(TestPurgeRegex("day", "31"), true);
    })
});


describe("Timepspan Regex Success Test", function () {
    it("Should succeed with valid single hour", function () {
        assert.equal(TestPurgeRegex("hour", "1"), true);
    })
});

describe("Timepspan Regex Success Test", function () {
    it("Should succeed with valid multiple hour", function () {
        assert.equal(TestPurgeRegex("hour", "12"), true);
    })
});