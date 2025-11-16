/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";
import polyfillHeadlessPlugin from "../../../../src/plugins/polyfill/headless.js";

describe("plugins/polyfill/headless.js", () => {
    describe("polyfillHeadlessPlugin()", () => {
        describe("BrowserType.launch:before", () => {
            it("should support no option", () => {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = polyfillHeadlessPlugin();
                const listener = plugin["BrowserType.launch:before"];
                const args = listener([], { obj: browserType });

                assert.deepEqual(args, [{ channel: "chromium" }]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should support option", () => {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = polyfillHeadlessPlugin();
                const listener = plugin["BrowserType.launch:before"];
                const args = listener([{ slowMo: 200 }], {
                    obj: browserType,
                });

                assert.deepEqual(args, [{ channel: "chromium", slowMo: 200 }]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should support channel option", () => {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = polyfillHeadlessPlugin();
                const listener = plugin["BrowserType.launch:before"];
                const args = listener([{ channel: "chrome" }], {
                    obj: browserType,
                });

                assert.deepEqual(args, [{ channel: "chrome" }]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should ignore Firefox", () => {
                const name = mock.fn(() => "firefox");
                const browserType = { name };

                const plugin = polyfillHeadlessPlugin();
                const listener = plugin["BrowserType.launch:before"];
                const args = listener([{ timeout: 1000 }], {
                    obj: browserType,
                });

                assert.deepEqual(args, [{ timeout: 1000 }]);

                assert.equal(name.mock.callCount(), 1);
            });
        });

        describe("BrowserType.launchPersistentContext:before", () => {
            it("should support no option", () => {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = polyfillHeadlessPlugin();
                const listener =
                    plugin["BrowserType.launchPersistentContext:before"];
                const args = listener(["./foo/"], { obj: browserType });

                assert.deepEqual(args, ["./foo/", { channel: "chromium" }]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should support option", () => {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = polyfillHeadlessPlugin();
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

            it("should support channel option", () => {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = polyfillHeadlessPlugin();
                const listener =
                    plugin["BrowserType.launchPersistentContext:before"];
                const args = listener(["./foo/", { channel: "chrome" }], {
                    obj: browserType,
                });

                assert.deepEqual(args, ["./foo/", { channel: "chrome" }]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should ignore Firefox", () => {
                const name = mock.fn(() => "firefox");
                const browserType = { name };

                const plugin = polyfillHeadlessPlugin();
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
