/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import webdriverPlugin from "../../../../src/plugins/polyfill/webdriver.js";

describe("plugins/polyfill/webdriver.js", function () {
    describe("webdriver()", function () {
        describe("BrowserType.launch:before", function () {
            it("should support no option", function () {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = webdriverPlugin();
                const listener = plugin["BrowserType.launch:before"];
                const args = listener([], { obj: browserType });

                assert.deepEqual(args, [
                    { args: ["--disable-blink-features=AutomationControlled"] },
                ]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should support option", function () {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = webdriverPlugin();
                const listener = plugin["BrowserType.launch:before"];
                const args = listener([{ slowMo: 200 }], { obj: browserType });

                assert.deepEqual(args, [
                    {
                        slowMo: 200,
                        args: ["--disable-blink-features=AutomationControlled"],
                    },
                ]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should support 'args' option", function () {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = webdriverPlugin();
                const listener = plugin["BrowserType.launch:before"];
                const args = listener([{ args: ["--disable-gpu"] }], {
                    obj: browserType,
                });

                assert.deepEqual(args, [
                    {
                        args: [
                            "--disable-blink-features=AutomationControlled",
                            "--disable-gpu",
                        ],
                    },
                ]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should ignore Firefox", function () {
                const name = mock.fn(() => "firefox");
                const browserType = { name };

                const plugin = webdriverPlugin();
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

                const plugin = webdriverPlugin();
                const listener =
                    plugin["BrowserType.launchPersistentContext:before"];
                const args = listener(["./foo/"], { obj: browserType });

                assert.deepEqual(args, [
                    "./foo/",
                    { args: ["--disable-blink-features=AutomationControlled"] },
                ]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should support option", function () {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = webdriverPlugin();
                const listener =
                    plugin["BrowserType.launchPersistentContext:before"];
                const args = listener(["./foo/", { slowMo: 200 }], {
                    obj: browserType,
                });

                assert.deepEqual(args, [
                    "./foo/",
                    {
                        slowMo: 200,
                        args: ["--disable-blink-features=AutomationControlled"],
                    },
                ]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should support 'args' option", function () {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = webdriverPlugin();
                const listener =
                    plugin["BrowserType.launchPersistentContext:before"];
                const args = listener(["./foo/", { args: ["--disable-gpu"] }], {
                    obj: browserType,
                });

                assert.deepEqual(args, [
                    "./foo/",
                    {
                        args: [
                            "--disable-blink-features=AutomationControlled",
                            "--disable-gpu",
                        ],
                    },
                ]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should ignore Firefox", function () {
                const name = mock.fn(() => "firefox");
                const browserType = { name };

                const plugin = webdriverPlugin();
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
