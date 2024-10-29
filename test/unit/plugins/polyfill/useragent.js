/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import userAgentPlugin from "../../../../src/plugins/polyfill/useragent.js";

describe("plugins/polyfill/useragent.js", function () {
    describe("userAgentPlugin()", function () {
        describe("BrowserType.launch:before", function () {
            it("should support no option", function () {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = userAgentPlugin({ userAgent: "foo" });
                const listener = plugin["BrowserType.launch:before"];
                const args = listener([], { obj: browserType });

                assert.deepEqual(args, [{ args: ["--user-agent=foo"] }]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should support option", function () {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = userAgentPlugin({ userAgent: "foo" });
                const listener = plugin["BrowserType.launch:before"];
                const args = listener([{ slowMo: 200 }], { obj: browserType });

                assert.deepEqual(args, [
                    { slowMo: 200, args: ["--user-agent=foo"] },
                ]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should support 'args' option", function () {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = userAgentPlugin({ userAgent: "foo" });
                const listener = plugin["BrowserType.launch:before"];
                const args = listener([{ args: ["--disable-gpu"] }], {
                    obj: browserType,
                });

                assert.deepEqual(args, [
                    { args: ["--user-agent=foo", "--disable-gpu"] },
                ]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should ignore Firefox", function () {
                const name = mock.fn(() => "firefox");
                const browserType = { name };

                const plugin = userAgentPlugin({ userAgent: "foo" });
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

                const plugin = userAgentPlugin({ userAgent: "foo" });
                const listener =
                    plugin["BrowserType.launchPersistentContext:before"];
                const args = listener(["./bar/"], { obj: browserType });

                assert.deepEqual(args, [
                    "./bar/",
                    { args: ["--user-agent=foo"] },
                ]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should support option", function () {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = userAgentPlugin({ userAgent: "foo" });
                const listener =
                    plugin["BrowserType.launchPersistentContext:before"];
                const args = listener(["./bar/", { slowMo: 200 }], {
                    obj: browserType,
                });

                assert.deepEqual(args, [
                    "./bar/",
                    { slowMo: 200, args: ["--user-agent=foo"] },
                ]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should support 'args' option", function () {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = userAgentPlugin({ userAgent: "foo" });
                const listener =
                    plugin["BrowserType.launchPersistentContext:before"];
                const args = listener(["./bar/", { args: ["--disable-gpu"] }], {
                    obj: browserType,
                });

                assert.deepEqual(args, [
                    "./bar/",
                    { args: ["--user-agent=foo", "--disable-gpu"] },
                ]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should ignore Firefox", function () {
                const name = mock.fn(() => "firefox");
                const browserType = { name };

                const plugin = userAgentPlugin({ userAgent: "foo" });
                const listener =
                    plugin["BrowserType.launchPersistentContext:before"];
                const args = listener(["./bar/", { timeout: 1000 }], {
                    obj: browserType,
                });

                assert.deepEqual(args, ["./bar/", { timeout: 1000 }]);

                assert.equal(name.mock.callCount(), 1);
            });
        });
    });
});
