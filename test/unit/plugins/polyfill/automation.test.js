/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";
import polyfillAutomationPlugin from "../../../../src/plugins/polyfill/automation.js";

describe("plugins/polyfill/automation.js", () => {
    describe("polyfillAutomationPlugin()", () => {
        describe("BrowserType.launch:before", () => {
            it("should support no option", () => {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = polyfillAutomationPlugin();
                const listener = plugin["BrowserType.launch:before"];
                const args = listener([], { obj: browserType });

                assert.deepEqual(args, [
                    { ignoreDefaultArgs: ["--enable-automation"] },
                ]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should support option", () => {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = polyfillAutomationPlugin();
                const listener = plugin["BrowserType.launch:before"];
                const args = listener([{ slowMo: 200 }], {
                    obj: browserType,
                });

                assert.deepEqual(args, [
                    { slowMo: 200, ignoreDefaultArgs: ["--enable-automation"] },
                ]);

                assert.equal(name.mock.callCount(), 1);
            });

            it("should support 'ignoreDefaultArgs' option", () => {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = polyfillAutomationPlugin();
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

            it("should ignore Firefox", () => {
                const name = mock.fn(() => "firefox");
                const browserType = { name };

                const plugin = polyfillAutomationPlugin();
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

                const plugin = polyfillAutomationPlugin();
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

            it("should support option", () => {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = polyfillAutomationPlugin();
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

            it("should support 'ignoreDefaultArgs' option", () => {
                const name = mock.fn(() => "chromium");
                const browserType = { name };

                const plugin = polyfillAutomationPlugin();
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

            it("should ignore Firefox", () => {
                const name = mock.fn(() => "firefox");
                const browserType = { name };

                const plugin = polyfillAutomationPlugin();
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
