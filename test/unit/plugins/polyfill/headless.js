/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import headlessPlugin from "../../../../src/plugins/polyfill/headless.js";

describe("plugins/polyfill/headless.js", function () {
    describe("headlessPlugin()", function () {
        describe("BrowserType.launch:before", function () {
            it("should support no option", function () {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = headlessPlugin();
                const listener = plugin["BrowserType.launch:before"];
                const args = listener([], { obj: browserType });

                assert.deepEqual(args, [{ channel: "chromium" }]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should support option", function () {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = headlessPlugin();
                const listener = plugin["BrowserType.launch:before"];
                const args = listener([{ slowMo: 200 }], {
                    obj: browserType,
                });

                assert.deepEqual(args, [{ channel: "chromium", slowMo: 200 }]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should support channel option", function () {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = headlessPlugin();
                const listener = plugin["BrowserType.launch:before"];
                const args = listener([{ channel: "chrome" }], {
                    obj: browserType,
                });

                assert.deepEqual(args, [{ channel: "chrome" }]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should ignore headful", function () {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = headlessPlugin();
                const listener = plugin["BrowserType.launch:before"];
                const args = listener([{ headless: false }], {
                    obj: browserType,
                });

                assert.deepEqual(args, [{ headless: false }]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should ignore Firefox", function () {
                const name = mock.fn(() => "firefox");
                const browserType = { name };

                const plugin = headlessPlugin();
                const listener = plugin["BrowserType.launch:before"];
                const args = listener([{ timeout: 1000 }], {
                    obj: browserType,
                });

                assert.deepEqual(args, [{ timeout: 1000 }]);

                assert.equal(name.mock.callCount(), 1);
            });
        });

        describe("BrowserType.launchPersistentContext:before", function () {
            it("should support no option", function () {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = headlessPlugin();
                const listener =
                    plugin["BrowserType.launchPersistentContext:before"];
                const args = listener(["./foo/"], { obj: browserType });

                assert.deepEqual(args, ["./foo/", { channel: "chromium" }]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should support option", function () {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = headlessPlugin();
                const listener =
                    plugin["BrowserType.launchPersistentContext:before"];
                const args = listener(["./foo/", { slowMo: 200 }], {
                    obj: browserType,
                });

                assert.deepEqual(args, [
                    "./foo/",
                    { channel: "chromium", slowMo: 200 },
                ]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should support channel option", function () {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = headlessPlugin();
                const listener =
                    plugin["BrowserType.launchPersistentContext:before"];
                const args = listener(["./foo/", { channel: "chrome" }], {
                    obj: browserType,
                });

                assert.deepEqual(args, ["./foo/", { channel: "chrome" }]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should ignore headful", function () {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = headlessPlugin();
                const listener =
                    plugin["BrowserType.launchPersistentContext:before"];
                const args = listener(["./foo/", { headless: false }], {
                    obj: browserType,
                });

                assert.deepEqual(args, ["./foo/", { headless: false }]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should ignore Firefox", function () {
                const name = mock.fn(() => "firefox");
                const browserType = { name };

                const plugin = headlessPlugin();
                const listener =
                    plugin["BrowserType.launchPersistentContext:before"];
                const args = listener(["./foo/", { timeout: 1000 }], {
                    obj: browserType,
                });

                assert.deepEqual(args, ["./foo/", { timeout: 1000 }]);

                assert.equal(name.mock.callCount(), 1);
            });
        });
    });
});
