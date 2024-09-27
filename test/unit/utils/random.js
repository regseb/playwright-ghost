/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import Random from "../../../src/utils/random.js";

describe("utils/random.js", function () {
    describe("getInt()", function () {
        it("should return a number between min and max", function () {
            const result = Random.getInt(1998, 2018);
            assert.ok(1998 <= result && 2018 >= result, result.toString());
        });

        it("should return the number when min equals max", function () {
            const result = Random.getInt(1234, 1234);
            assert.equal(result, 1234);
        });
    });
});
