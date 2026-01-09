/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";
import polyfillUserAgentPlugin from "../../../../src/plugins/polyfill/useragent.js";

describe("plugins/polyfill/useragent.js", () => {
    describe("polyfillUserAgentPlugin()", () => {
        describe("BrowserType.launch:before", () => {
            it("should support no option", () => {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = polyfillUserAgentPlugin({ userAgent: "foo" });
                const listener = plugin["BrowserType.launch:before"];
                const args = listener([], { obj: browserType, prop: "launch" });

                assert.deepEqual(args, [{ args: ["--user-agent=foo"] }]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should support option", () => {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = polyfillUserAgentPlugin({ userAgent: "foo" });
                const listener = plugin["BrowserType.launch:before"];
                const args = listener([{ slowMo: 200 }], {
                    obj: browserType,
                    prop: "launch",
                });

                assert.deepEqual(args, [
                    { slowMo: 200, args: ["--user-agent=foo"] },
                ]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should support 'args' option", () => {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = polyfillUserAgentPlugin({ userAgent: "foo" });
                const listener = plugin["BrowserType.launch:before"];
                const args = listener([{ args: ["--disable-gpu"] }], {
                    obj: browserType,
                    prop: "launch",
                });

                assert.deepEqual(args, [
                    { args: ["--user-agent=foo", "--disable-gpu"] },
                ]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should ignore Firefox", () => {
                const name = mock.fn(() => "firefox");
                const browserType = { name };

                const plugin = polyfillUserAgentPlugin({ userAgent: "foo" });
                const listener = plugin["BrowserType.launch:before"];
                const args = listener([{ timeout: 1000 }], {
                    obj: browserType,
                    prop: "launch",
                });

                assert.deepEqual(args, [{ timeout: 1000 }]);

                assert.equal(name.mock.callCount(), 1);
            });
        });

        describe("BrowserType.launchPersistentContext:before", () => {
            it("should support no option", () => {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = polyfillUserAgentPlugin({ userAgent: "foo" });
                const listener =
                    plugin["BrowserType.launchPersistentContext:before"];
                const args = listener(["./bar/"], {
                    obj: browserType,
                    prop: "launchPersistentContext",
                });

                assert.deepEqual(args, [
                    "./bar/",
                    { args: ["--user-agent=foo"] },
                ]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should support option", () => {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = polyfillUserAgentPlugin({ userAgent: "foo" });
                const listener =
                    plugin["BrowserType.launchPersistentContext:before"];
                const args = listener(["./bar/", { slowMo: 200 }], {
                    obj: browserType,
                    prop: "launchPersistentContext",
                });

                assert.deepEqual(args, [
                    "./bar/",
                    { slowMo: 200, args: ["--user-agent=foo"] },
                ]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should support 'args' option", () => {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = polyfillUserAgentPlugin({ userAgent: "foo" });
                const listener =
                    plugin["BrowserType.launchPersistentContext:before"];
                const args = listener(["./bar/", { args: ["--disable-gpu"] }], {
                    obj: browserType,
                    prop: "launchPersistentContext",
                });

                assert.deepEqual(args, [
                    "./bar/",
                    { args: ["--user-agent=foo", "--disable-gpu"] },
                ]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should support Firefox", () => {
                const name = mock.fn(() => "firefox");
                const browserType = { name };

                const plugin = polyfillUserAgentPlugin({ userAgent: "foo" });
                const listener =
                    plugin["BrowserType.launchPersistentContext:before"];
                const args = listener(["./bar/", { timeout: 1000 }], {
                    obj: browserType,
                    prop: "launchPersistentContext",
                });

                assert.deepEqual(args, [
                    "./bar/",
                    { timeout: 1000, userAgent: "foo" },
                ]);

                assert.equal(name.mock.callCount(), 1);
            });
        });

        describe("BrowserType.launchServer:before", () => {
            it("should support no option", () => {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = polyfillUserAgentPlugin({ userAgent: "foo" });
                const listener = plugin["BrowserType.launchServer:before"];
                const args = listener([], { obj: browserType, prop: "launch" });

                assert.deepEqual(args, [{ args: ["--user-agent=foo"] }]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should support option", () => {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = polyfillUserAgentPlugin({ userAgent: "foo" });
                const listener = plugin["BrowserType.launchServer:before"];
                const args = listener([{ slowMo: 200 }], {
                    obj: browserType,
                    prop: "launch",
                });

                assert.deepEqual(args, [
                    { slowMo: 200, args: ["--user-agent=foo"] },
                ]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should support 'args' option", () => {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = polyfillUserAgentPlugin({ userAgent: "foo" });
                const listener = plugin["BrowserType.launchServer:before"];
                const args = listener([{ args: ["--disable-gpu"] }], {
                    obj: browserType,
                    prop: "launch",
                });

                assert.deepEqual(args, [
                    { args: ["--user-agent=foo", "--disable-gpu"] },
                ]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should ignore Firefox", () => {
                const name = mock.fn(() => "firefox");
                const browserType = { name };

                const plugin = polyfillUserAgentPlugin({ userAgent: "foo" });
                const listener = plugin["BrowserType.launchServer:before"];
                const args = listener([{ timeout: 1000 }], {
                    obj: browserType,
                    prop: "launch",
                });

                assert.deepEqual(args, [{ timeout: 1000 }]);

                assert.equal(name.mock.callCount(), 1);
            });
        });

        describe("Browser.newContext:before", () => {
            it("should support no option", () => {
                const name = mock.fn(() => "firefox");
                const browser = { browserType: () => ({ name }) };

                const plugin = polyfillUserAgentPlugin({ userAgent: "foo" });
                const listener = plugin["Browser.newContext:before"];
                const args = listener([], { obj: browser });

                assert.deepEqual(args, [{ userAgent: "foo" }]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should support option", () => {
                const name = mock.fn(() => "firefox");
                const browser = { browserType: () => ({ name }) };

                const plugin = polyfillUserAgentPlugin({ userAgent: "foo" });
                const listener = plugin["Browser.newContext:before"];
                const args = listener([{ acceptDownloads: true }], {
                    obj: browser,
                });

                assert.deepEqual(args, [
                    { acceptDownloads: true, userAgent: "foo" },
                ]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should support 'userAgent' option", () => {
                const name = mock.fn(() => "firefox");
                const browser = { browserType: () => ({ name }) };

                const plugin = polyfillUserAgentPlugin({ userAgent: "foo" });
                const listener = plugin["Browser.newContext:before"];
                const args = listener([{ userAgent: "bar" }], { obj: browser });

                assert.deepEqual(args, [{ userAgent: "bar" }]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should ignore Chromium", () => {
                const name = mock.fn(() => "chromium");
                const browser = { browserType: () => ({ name }) };

                const plugin = polyfillUserAgentPlugin({ userAgent: "foo" });
                const listener = plugin["Browser.newContext:before"];
                const args = listener([{ colorScheme: "dark" }], {
                    obj: browser,
                });

                assert.deepEqual(args, [{ colorScheme: "dark" }]);

                assert.equal(name.mock.callCount(), 1);
            });
        });

        describe("Browser.newPage:before", () => {
            it("should support no option", () => {
                const name = mock.fn(() => "firefox");
                const browser = { browserType: () => ({ name }) };

                const plugin = polyfillUserAgentPlugin({ userAgent: "foo" });
                const listener = plugin["Browser.newPage:before"];
                const args = listener([], { obj: browser });

                assert.deepEqual(args, [{ userAgent: "foo" }]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should support option", () => {
                const name = mock.fn(() => "firefox");
                const browser = { browserType: () => ({ name }) };

                const plugin = polyfillUserAgentPlugin({ userAgent: "foo" });
                const listener = plugin["Browser.newPage:before"];
                const args = listener([{ forcedColors: "active" }], {
                    obj: browser,
                });

                assert.deepEqual(args, [
                    { forcedColors: "active", userAgent: "foo" },
                ]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should support 'userAgent' option", () => {
                const name = mock.fn(() => "firefox");
                const browser = { browserType: () => ({ name }) };

                const plugin = polyfillUserAgentPlugin({ userAgent: "foo" });
                const listener = plugin["Browser.newPage:before"];
                const args = listener([{ userAgent: "bar" }], { obj: browser });

                assert.deepEqual(args, [{ userAgent: "bar" }]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should ignore Chromium", () => {
                const name = mock.fn(() => "chromium");
                const browser = { browserType: () => ({ name }) };

                const plugin = polyfillUserAgentPlugin({ userAgent: "foo" });
                const listener = plugin["Browser.newPage:before"];
                const args = listener([{ hasTouch: true }], { obj: browser });

                assert.deepEqual(args, [{ hasTouch: true }]);

                assert.equal(name.mock.callCount(), 1);
            });
        });
    });
});
