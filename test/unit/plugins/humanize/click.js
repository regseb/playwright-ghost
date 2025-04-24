/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import crypto from "node:crypto";
import { afterEach, describe, it, mock } from "node:test";
import clickPlugin from "../../../../src/plugins/humanize/click.js";

describe("plugins/humanize/click.js", () => {
    describe("clickPlugin()", () => {
        describe("Locator.click:before", () => {
            afterEach(() => {
                mock.reset();
            });

            it("should support no option", () => {
                const randomInt = mock.method(crypto, "randomInt", () => 200);

                const plugin = clickPlugin();
                const listener = plugin["Locator.click:before"];
                const args = listener([]);

                assert.deepEqual(args, [{ delay: 200 }]);

                assert.equal(randomInt.mock.callCount(), 1);
                assert.deepEqual(randomInt.mock.calls[0].arguments, [100, 501]);
            });

            it("should support empty option", () => {
                const randomInt = mock.method(crypto, "randomInt", () => 250);

                const plugin = clickPlugin({});
                const listener = plugin["Locator.click:before"];
                const args = listener([]);

                assert.deepEqual(args, [{ delay: 250 }]);

                assert.equal(randomInt.mock.callCount(), 1);
                assert.deepEqual(randomInt.mock.calls[0].arguments, [100, 501]);
            });

            it("should support option", () => {
                const randomInt = mock.method(crypto, "randomInt", () => 300);

                const plugin = clickPlugin();
                const listener = plugin["Locator.click:before"];
                const args = listener([{ button: "right" }]);

                assert.deepEqual(args, [{ button: "right", delay: 300 }]);

                assert.equal(randomInt.mock.callCount(), 1);
                assert.deepEqual(randomInt.mock.calls[0].arguments, [100, 501]);
            });

            it("should support 'delay' option", () => {
                const randomInt = mock.method(crypto, "randomInt", () => 350);

                const plugin = clickPlugin();
                const listener = plugin["Locator.click:before"];
                const args = listener([{ button: "middle", delay: 1000 }]);

                assert.deepEqual(args, [{ button: "middle", delay: 1000 }]);

                assert.equal(randomInt.mock.callCount(), 0);
            });
        });

        describe("Locator.dblclick:before", () => {
            afterEach(() => {
                mock.reset();
            });

            it("should support no option", () => {
                const randomInt = mock.method(crypto, "randomInt", () => 200);

                const plugin = clickPlugin();
                const listener = plugin["Locator.dblclick:before"];
                const args = listener([]);

                assert.deepEqual(args, [{ delay: 200 }]);

                assert.equal(randomInt.mock.callCount(), 1);
                assert.deepEqual(randomInt.mock.calls[0].arguments, [100, 501]);
            });

            it("should support empty option", () => {
                const randomInt = mock.method(crypto, "randomInt", () => 250);

                const plugin = clickPlugin({});
                const listener = plugin["Locator.dblclick:before"];
                const args = listener([]);

                assert.deepEqual(args, [{ delay: 250 }]);

                assert.equal(randomInt.mock.callCount(), 1);
                assert.deepEqual(randomInt.mock.calls[0].arguments, [100, 501]);
            });

            it("should support option", () => {
                const randomInt = mock.method(crypto, "randomInt", () => 300);

                const plugin = clickPlugin();
                const listener = plugin["Locator.dblclick:before"];
                const args = listener([{ button: "right" }]);

                assert.deepEqual(args, [{ button: "right", delay: 300 }]);

                assert.equal(randomInt.mock.callCount(), 1);
                assert.deepEqual(randomInt.mock.calls[0].arguments, [100, 501]);
            });

            it("should support 'delay' option", () => {
                const randomInt = mock.method(crypto, "randomInt", () => 350);

                const plugin = clickPlugin();
                const listener = plugin["Locator.dblclick:before"];
                const args = listener([{ button: "middle", delay: 1000 }]);

                assert.deepEqual(args, [{ button: "middle", delay: 1000 }]);

                assert.equal(randomInt.mock.callCount(), 0);
            });
        });

        describe("Mouse.click:before", () => {
            afterEach(() => {
                mock.reset();
            });

            it("should support no option", () => {
                const randomInt = mock.method(crypto, "randomInt", () => 200);

                const plugin = clickPlugin();
                const listener = plugin["Mouse.click:before"];
                const args = listener([42, 43]);

                assert.deepEqual(args, [42, 43, { delay: 200 }]);

                assert.equal(randomInt.mock.callCount(), 1);
                assert.deepEqual(randomInt.mock.calls[0].arguments, [100, 501]);
            });

            it("should support empty option", () => {
                const randomInt = mock.method(crypto, "randomInt", () => 250);

                const plugin = clickPlugin({});
                const listener = plugin["Mouse.click:before"];
                const args = listener([42, 43]);

                assert.deepEqual(args, [42, 43, { delay: 250 }]);

                assert.equal(randomInt.mock.callCount(), 1);
                assert.deepEqual(randomInt.mock.calls[0].arguments, [100, 501]);
            });

            it("should support option", () => {
                const randomInt = mock.method(crypto, "randomInt", () => 300);

                const plugin = clickPlugin();
                const listener = plugin["Mouse.click:before"];
                const args = listener([42, 43, { button: "right" }]);

                assert.deepEqual(args, [
                    42,
                    43,
                    { button: "right", delay: 300 },
                ]);

                assert.equal(randomInt.mock.callCount(), 1);
                assert.deepEqual(randomInt.mock.calls[0].arguments, [100, 501]);
            });

            it("should support 'delay' option", () => {
                const randomInt = mock.method(crypto, "randomInt", () => 350);

                const plugin = clickPlugin();
                const listener = plugin["Mouse.click:before"];
                const args = listener([
                    42,
                    43,
                    { button: "middle", delay: 1000 },
                ]);

                assert.deepEqual(args, [
                    42,
                    43,
                    { button: "middle", delay: 1000 },
                ]);

                assert.equal(randomInt.mock.callCount(), 0);
            });
        });

        describe("Mouse.dblclick:before", () => {
            afterEach(() => {
                mock.reset();
            });

            it("should support no option", () => {
                const randomInt = mock.method(crypto, "randomInt", () => 200);

                const plugin = clickPlugin();
                const listener = plugin["Mouse.dblclick:before"];
                const args = listener([42, 43]);

                assert.deepEqual(args, [42, 43, { delay: 200 }]);

                assert.equal(randomInt.mock.callCount(), 1);
                assert.deepEqual(randomInt.mock.calls[0].arguments, [100, 501]);
            });

            it("should support empty option", () => {
                const randomInt = mock.method(crypto, "randomInt", () => 250);

                const plugin = clickPlugin({});
                const listener = plugin["Mouse.dblclick:before"];
                const args = listener([42, 43]);

                assert.deepEqual(args, [42, 43, { delay: 250 }]);

                assert.equal(randomInt.mock.callCount(), 1);
                assert.deepEqual(randomInt.mock.calls[0].arguments, [100, 501]);
            });

            it("should support option", () => {
                const randomInt = mock.method(crypto, "randomInt", () => 300);

                const plugin = clickPlugin();
                const listener = plugin["Mouse.dblclick:before"];
                const args = listener([42, 43, { button: "right" }]);

                assert.deepEqual(args, [
                    42,
                    43,
                    { button: "right", delay: 300 },
                ]);

                assert.equal(randomInt.mock.callCount(), 1);
                assert.deepEqual(randomInt.mock.calls[0].arguments, [100, 501]);
            });

            it("should support 'delay' option", () => {
                const randomInt = mock.method(crypto, "randomInt", () => 350);

                const plugin = clickPlugin();
                const listener = plugin["Mouse.dblclick:before"];
                const args = listener([
                    42,
                    43,
                    { button: "middle", delay: 1000 },
                ]);

                assert.deepEqual(args, [
                    42,
                    43,
                    { button: "middle", delay: 1000 },
                ]);

                assert.equal(randomInt.mock.callCount(), 0);
            });
        });
    });
});
