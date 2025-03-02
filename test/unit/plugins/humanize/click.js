/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import crypto from "node:crypto";
import { mock } from "node:test";
import clickPlugin from "../../../../src/plugins/humanize/click.js";

describe("plugins/humanize/click.js", function () {
    describe("clickPlugin()", function () {
        describe("Locator.click:before", function () {
            afterEach(function () {
                mock.reset();
            });

            it("should support no option", function () {
                const randomInt = mock.method(crypto, "randomInt", () => 200);

                const plugin = clickPlugin();
                const listener = plugin["Locator.click:before"];
                const args = listener([]);

                assert.deepEqual(args, [{ delay: 200 }]);

                assert.equal(randomInt.mock.callCount(), 1);
                assert.deepEqual(randomInt.mock.calls[0].arguments, [100, 501]);
            });

            it("should support empty option", function () {
                const randomInt = mock.method(crypto, "randomInt", () => 250);

                const plugin = clickPlugin({});
                const listener = plugin["Locator.click:before"];
                const args = listener([]);

                assert.deepEqual(args, [{ delay: 250 }]);

                assert.equal(randomInt.mock.callCount(), 1);
                assert.deepEqual(randomInt.mock.calls[0].arguments, [100, 501]);
            });

            it("should support option", function () {
                const randomInt = mock.method(crypto, "randomInt", () => 300);

                const plugin = clickPlugin();
                const listener = plugin["Locator.click:before"];
                const args = listener([{ button: "right" }]);

                assert.deepEqual(args, [{ button: "right", delay: 300 }]);

                assert.equal(randomInt.mock.callCount(), 1);
                assert.deepEqual(randomInt.mock.calls[0].arguments, [100, 501]);
            });

            it("should support 'delay' option", function () {
                const randomInt = mock.method(crypto, "randomInt", () => 350);

                const plugin = clickPlugin();
                const listener = plugin["Locator.click:before"];
                const args = listener([{ button: "middle", delay: 1000 }]);

                assert.deepEqual(args, [{ button: "middle", delay: 1000 }]);

                assert.equal(randomInt.mock.callCount(), 0);
            });
        });

        describe("Locator.dblclick:before", function () {
            afterEach(function () {
                mock.reset();
            });

            it("should support no option", function () {
                const randomInt = mock.method(crypto, "randomInt", () => 200);

                const plugin = clickPlugin();
                const listener = plugin["Locator.dblclick:before"];
                const args = listener([]);

                assert.deepEqual(args, [{ delay: 200 }]);

                assert.equal(randomInt.mock.callCount(), 1);
                assert.deepEqual(randomInt.mock.calls[0].arguments, [100, 501]);
            });

            it("should support empty option", function () {
                const randomInt = mock.method(crypto, "randomInt", () => 250);

                const plugin = clickPlugin({});
                const listener = plugin["Locator.dblclick:before"];
                const args = listener([]);

                assert.deepEqual(args, [{ delay: 250 }]);

                assert.equal(randomInt.mock.callCount(), 1);
                assert.deepEqual(randomInt.mock.calls[0].arguments, [100, 501]);
            });

            it("should support option", function () {
                const randomInt = mock.method(crypto, "randomInt", () => 300);

                const plugin = clickPlugin();
                const listener = plugin["Locator.dblclick:before"];
                const args = listener([{ button: "right" }]);

                assert.deepEqual(args, [{ button: "right", delay: 300 }]);

                assert.equal(randomInt.mock.callCount(), 1);
                assert.deepEqual(randomInt.mock.calls[0].arguments, [100, 501]);
            });

            it("should support 'delay' option", function () {
                const randomInt = mock.method(crypto, "randomInt", () => 350);

                const plugin = clickPlugin();
                const listener = plugin["Locator.dblclick:before"];
                const args = listener([{ button: "middle", delay: 1000 }]);

                assert.deepEqual(args, [{ button: "middle", delay: 1000 }]);

                assert.equal(randomInt.mock.callCount(), 0);
            });
        });
    });
});
