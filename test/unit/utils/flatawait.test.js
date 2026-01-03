/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import flatAwait from "../../../src/utils/flatawait.js";

describe("utils/flatawait.js", () => {
    describe("flatAwait()", () => {
        it("should support scalar", async () => {
            const flatten = await flatAwait("foo");

            assert.deepEqual(flatten, ["foo"]);
        });

        it("should support Promise of scalar", async () => {
            const flatten = await flatAwait(Promise.resolve("foo"));

            assert.deepEqual(flatten, ["foo"]);
        });

        it("should support array", async () => {
            const flatten = await flatAwait(["foo", "bar"]);

            assert.deepEqual(flatten, ["foo", "bar"]);
        });

        it("should support Promise of array", async () => {
            const flatten = await flatAwait(Promise.resolve(["foo", "bar"]));

            assert.deepEqual(flatten, ["foo", "bar"]);
        });

        it("should support array of Promise", async () => {
            const flatten = await flatAwait(["foo", Promise.resolve("bar")]);

            assert.deepEqual(flatten, ["foo", "bar"]);
        });

        it("should support Promise of array of Promise", async () => {
            const flatten = await flatAwait(
                Promise.resolve(["foo", Promise.resolve("bar")]),
            );

            assert.deepEqual(flatten, ["foo", "bar"]);
        });
    });
});
