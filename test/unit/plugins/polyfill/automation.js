/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import automationPlugin from "../../../../src/plugins/polyfill/automation.js";

describe("plugins/polyfill/automation.js", function () {
    describe("automationPlugin()", function () {
        describe("BrowserType.launch:before", function () {
            it("should support no option", function () {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = automationPlugin();
                const listener = plugin["BrowserType.launch:before"];
                const args = listener([], { obj: browserType });

                assert.deepEqual(args, [
                    { ignoreDefaultArgs: ["--enable-automation"] },
                ]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should support option", function () {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = automationPlugin();
                const listener = plugin["BrowserType.launch:before"];
                const args = listener([{ slowMo: 200 }], {
                    obj: browserType,
                });

                assert.deepEqual(args, [
                    { slowMo: 200, ignoreDefaultArgs: ["--enable-automation"] },
                ]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should support 'ignoreDefaultArgs' option", function () {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = automationPlugin();
                const listener = plugin["BrowserType.launch:before"];
                const args = listener(
                    [{ ignoreDefaultArgs: ["--mute-audio"] }],
                    { obj: browserType },
                );

                assert.deepEqual(args, [
                    {
                        ignoreDefaultArgs: [
                            "--enable-automation",
                            "--mute-audio",
                        ],
                    },
                ]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should ignore Firefox", function () {
                const name = mock.fn(() => "firefox");
                const browserType = { name };

                const plugin = automationPlugin();
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

                const plugin = automationPlugin();
                const listener =
                    plugin["BrowserType.launchPersistentContext:before"];
                const args = listener(["./foo/"], {
                    obj: browserType,
                });

                assert.deepEqual(args, [
                    "./foo/",
                    { ignoreDefaultArgs: ["--enable-automation"] },
                ]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should support option", function () {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = automationPlugin();
                const listener =
                    plugin["BrowserType.launchPersistentContext:before"];
                const args = listener(["./foo/", { slowMo: 200 }], {
                    obj: browserType,
                });

                assert.deepEqual(args, [
                    "./foo/",
                    { slowMo: 200, ignoreDefaultArgs: ["--enable-automation"] },
                ]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should support 'ignoreDefaultArgs' option", function () {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = automationPlugin();
                const listener =
                    plugin["BrowserType.launchPersistentContext:before"];
                const args = listener(
                    ["./foo/", { ignoreDefaultArgs: ["--mute-audio"] }],
                    {
                        obj: browserType,
                    },
                );

                assert.deepEqual(args, [
                    "./foo/",
                    {
                        ignoreDefaultArgs: [
                            "--enable-automation",
                            "--mute-audio",
                        ],
                    },
                ]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should ignore Firefox", function () {
                const name = mock.fn(() => "firefox");
                const browserType = { name };

                const plugin = automationPlugin();
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
