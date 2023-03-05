/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { dispatchAfter, dispatchBefore } from "../../src/hook.js";

/**
 * @typedef {import("../../src/plugin/meta/plugin.js")} Plugin
 */

describe("hook.js", function () {
    describe("dispatchBefore()", function () {
        it("should do nothing with no plugins", function () {
            const args = ["foo"];
            const obj = "bar";
            const method = "baz";
            const plugins = /** @type {Plugin[]} */ ([]);

            const result = dispatchBefore(args, { obj, method, plugins });
            assert.deepEqual(result, ["foo"]);
        });

        it("should call one hook", function () {
            const args = ["foo"];
            const obj = "bar";
            const method = "baz";
            const listener = sinon.fake.returns(["qux"]);
            const plugin = { getHooks: sinon.fake.returns([listener]) };
            const plugins = [plugin];

            const result = dispatchBefore(args, { obj, method, plugins });
            assert.deepEqual(result, ["qux"]);

            assert.equal(plugin.getHooks.callCount, 1);
            assert.deepEqual(plugin.getHooks.firstCall.args, ["baz:before"]);
            assert.equal(listener.callCount, 1);
            assert.deepEqual(listener.firstCall.args, [
                ["foo"],
                { obj, method },
            ]);
        });
    });

    describe("dispatchAfter()", function () {
        it("should do nothing with no plugins", function () {
            const returnValue = "foo";
            const obj = "bar";
            const method = "baz";
            const args = ["qux"];
            const plugins = /** @type {Plugin[]} */ ([]);

            const result = dispatchAfter(returnValue, {
                obj,
                method,
                args,
                plugins,
            });
            assert.equal(result, "foo");
        });

        it("should call one hook", function () {
            const returnValue = "foo";
            const obj = "bar";
            const method = "baz";
            const args = ["qux"];
            const listener = sinon.fake.returns("quux");
            const plugin = { getHooks: sinon.fake.returns([listener]) };
            const plugins = [plugin];

            const result = dispatchAfter(returnValue, {
                obj,
                method,
                args,
                plugins,
            });
            assert.equal(result, "quux");

            assert.equal(plugin.getHooks.callCount, 1);
            assert.deepEqual(plugin.getHooks.firstCall.args, ["baz:after"]);
            assert.equal(listener.callCount, 1);
            assert.deepEqual(listener.firstCall.args, [
                "foo",
                { obj, method, args },
            ]);
        });

        it("should support promise", async function () {
            const returnValue = Promise.resolve("foo");
            const obj = "bar";
            const method = "baz";
            const args = ["qux"];
            const listener = sinon.fake.resolves("quux");
            const plugin = { getHooks: sinon.fake.returns([listener]) };
            const plugins = [plugin];

            const result = await dispatchAfter(returnValue, {
                obj,
                method,
                args,
                plugins,
            });
            assert.equal(result, "quux");

            assert.equal(plugin.getHooks.callCount, 1);
            assert.deepEqual(plugin.getHooks.firstCall.args, ["baz:after"]);
            assert.equal(listener.callCount, 1);
            assert.deepEqual(listener.firstCall.args, [
                "foo",
                { obj, method, args },
            ]);
        });
    });
});
