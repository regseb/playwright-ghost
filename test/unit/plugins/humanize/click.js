/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import humanizeClickPlugin from "../../../../src/plugins/humanize/click.js";
import Random from "../../../../src/utils/random.js";

describe("plugins/humanize/click.js", () => {
    describe("humanizeClickPlugin()", () => {
        describe("Locator.click:before", () => {
            afterEach(() => {
                mock.reset();
            });

            it("should support no option", () => {
                const randomInt = mock.method(Random, "int", () => 200);

                const plugin = humanizeClickPlugin();
                const listener = plugin["Locator.click:before"];
                const args = listener([]);

                assert.deepEqual(args, [{ delay: 200 }]);

                assert.equal(randomInt.mock.callCount(), 1);
                assert.deepEqual(randomInt.mock.calls[0].arguments, [100, 500]);
            });

            it("should support empty option", () => {
                const randomInt = mock.method(Random, "int", () => 250);

                const plugin = humanizeClickPlugin({});
                const listener = plugin["Locator.click:before"];
                const args = listener([]);

                assert.deepEqual(args, [{ delay: 250 }]);

                assert.equal(randomInt.mock.callCount(), 1);
                assert.deepEqual(randomInt.mock.calls[0].arguments, [100, 500]);
            });

            it("should support option", () => {
                const randomInt = mock.method(Random, "int", () => 300);

                const plugin = humanizeClickPlugin();
                const listener = plugin["Locator.click:before"];
                const args = listener([{ button: "right" }]);

                assert.deepEqual(args, [{ button: "right", delay: 300 }]);

                assert.equal(randomInt.mock.callCount(), 1);
                assert.deepEqual(randomInt.mock.calls[0].arguments, [100, 500]);
            });

            it("should support 'delay' option", () => {
                const randomInt = mock.method(Random, "int", () => 350);

                const plugin = humanizeClickPlugin();
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
                const randomInt = mock.method(Random, "int", () => 200);

                const plugin = humanizeClickPlugin();
                const listener = plugin["Locator.dblclick:before"];
                const args = listener([]);

                assert.deepEqual(args, [{ delay: 200 }]);

                assert.equal(randomInt.mock.callCount(), 1);
                assert.deepEqual(randomInt.mock.calls[0].arguments, [100, 500]);
            });

            it("should support empty option", () => {
                const randomInt = mock.method(Random, "int", () => 250);

                const plugin = humanizeClickPlugin({});
                const listener = plugin["Locator.dblclick:before"];
                const args = listener([]);

                assert.deepEqual(args, [{ delay: 250 }]);

                assert.equal(randomInt.mock.callCount(), 1);
                assert.deepEqual(randomInt.mock.calls[0].arguments, [100, 500]);
            });

            it("should support option", () => {
                const randomInt = mock.method(Random, "int", () => 300);

                const plugin = humanizeClickPlugin();
                const listener = plugin["Locator.dblclick:before"];
                const args = listener([{ button: "right" }]);

                assert.deepEqual(args, [{ button: "right", delay: 300 }]);

                assert.equal(randomInt.mock.callCount(), 1);
                assert.deepEqual(randomInt.mock.calls[0].arguments, [100, 500]);
            });

            it("should support 'delay' option", () => {
                const randomInt = mock.method(Random, "int", () => 350);

                const plugin = humanizeClickPlugin();
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
                const randomInt = mock.method(Random, "int", () => 200);

                const plugin = humanizeClickPlugin();
                const listener = plugin["Mouse.click:before"];
                const args = listener([42, 43]);

                assert.deepEqual(args, [42, 43, { delay: 200 }]);

                assert.equal(randomInt.mock.callCount(), 1);
                assert.deepEqual(randomInt.mock.calls[0].arguments, [100, 500]);
            });

            it("should support empty option", () => {
                const randomInt = mock.method(Random, "int", () => 250);

                const plugin = humanizeClickPlugin({});
                const listener = plugin["Mouse.click:before"];
                const args = listener([42, 43]);

                assert.deepEqual(args, [42, 43, { delay: 250 }]);

                assert.equal(randomInt.mock.callCount(), 1);
                assert.deepEqual(randomInt.mock.calls[0].arguments, [100, 500]);
            });

            it("should support option", () => {
                const randomInt = mock.method(Random, "int", () => 300);

                const plugin = humanizeClickPlugin();
                const listener = plugin["Mouse.click:before"];
                const args = listener([42, 43, { button: "right" }]);

                assert.deepEqual(args, [
                    42,
                    43,
                    { button: "right", delay: 300 },
                ]);

                assert.equal(randomInt.mock.callCount(), 1);
                assert.deepEqual(randomInt.mock.calls[0].arguments, [100, 500]);
            });

            it("should support 'delay' option", () => {
                const randomInt = mock.method(Random, "int", () => 350);

                const plugin = humanizeClickPlugin();
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
                const randomInt = mock.method(Random, "int", () => 200);

                const plugin = humanizeClickPlugin();
                const listener = plugin["Mouse.dblclick:before"];
                const args = listener([42, 43]);

                assert.deepEqual(args, [42, 43, { delay: 200 }]);

                assert.equal(randomInt.mock.callCount(), 1);
                assert.deepEqual(randomInt.mock.calls[0].arguments, [100, 500]);
            });

            it("should support empty option", () => {
                const randomInt = mock.method(Random, "int", () => 250);

                const plugin = humanizeClickPlugin({});
                const listener = plugin["Mouse.dblclick:before"];
                const args = listener([42, 43]);

                assert.deepEqual(args, [42, 43, { delay: 250 }]);

                assert.equal(randomInt.mock.callCount(), 1);
                assert.deepEqual(randomInt.mock.calls[0].arguments, [100, 500]);
            });

            it("should support option", () => {
                const randomInt = mock.method(Random, "int", () => 300);

                const plugin = humanizeClickPlugin();
                const listener = plugin["Mouse.dblclick:before"];
                const args = listener([42, 43, { button: "right" }]);

                assert.deepEqual(args, [
                    42,
                    43,
                    { button: "right", delay: 300 },
                ]);

                assert.equal(randomInt.mock.callCount(), 1);
                assert.deepEqual(randomInt.mock.calls[0].arguments, [100, 500]);
            });

            it("should support 'delay' option", () => {
                const randomInt = mock.method(Random, "int", () => 350);

                const plugin = humanizeClickPlugin();
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
