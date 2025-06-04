/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import mapArrayOrScalar from "../../../src/utils/maparrayorscalar.js";

describe("utils/maparrayorscalar.js", () => {
    describe("mapArrayOrScalar()", () => {
        it("should support array", () => {
            const values = mapArrayOrScalar(["foo", "bar"], (e) =>
                e.toUpperCase(),
            );

            assert.deepEqual(values, ["FOO", "BAR"]);
        });

        it("should support scalar", () => {
            const value = mapArrayOrScalar("foo", (e) => e.toUpperCase());

            assert.equal(value, "FOO");
        });
    });
});
