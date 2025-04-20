/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import screenPlugin from "../../../../src/plugins/polyfill/screen.js";

describe("plugins/polyfill/screen.js", () => {
    describe("screenPlugin()", () => {
        describe("BrowserType.launchPersistentContext:before", () => {
            it("should support no option", () => {
                const plugin = screenPlugin();
                const listener =
                    plugin["BrowserType.launchPersistentContext:before"];
                const args = listener(["./foo/"]);

                assert.deepEqual(args, [
                    "./foo/",
                    { screen: { width: 1920, height: 1080 } },
                ]);
            });

            it("should support option", () => {
                const plugin = screenPlugin();
                const listener =
                    plugin["BrowserType.launchPersistentContext:before"];
                const args = listener(["./foo/", { slowMo: 200 }]);

                assert.deepEqual(args, [
                    "./foo/",
                    { slowMo: 200, screen: { width: 1920, height: 1080 } },
                ]);
            });

            it("should support 'screen' option", () => {
                const plugin = screenPlugin();
                const listener =
                    plugin["BrowserType.launchPersistentContext:before"];
                const args = listener([
                    "./foo/",
                    { screen: { width: 42, height: 43 } },
                ]);

                assert.deepEqual(args, [
                    "./foo/",
                    { screen: { width: 42, height: 43 } },
                ]);
            });
        });

        describe("Browser.newContext:before", () => {
            it("should support no option", () => {
                const plugin = screenPlugin();
                const listener = plugin["Browser.newContext:before"];
                const args = listener([]);

                assert.deepEqual(args, [
                    { screen: { width: 1920, height: 1080 } },
                ]);
            });

            it("should support option", () => {
                const plugin = screenPlugin();
                const listener = plugin["Browser.newContext:before"];
                const args = listener([{ slowMo: 200 }]);

                assert.deepEqual(args, [
                    { slowMo: 200, screen: { width: 1920, height: 1080 } },
                ]);
            });

            it("should support 'screen' option", () => {
                const plugin = screenPlugin();
                const listener = plugin["Browser.newContext:before"];
                const args = listener([{ screen: { width: 42, height: 43 } }]);

                assert.deepEqual(args, [{ screen: { width: 42, height: 43 } }]);
            });
        });

        describe("Browser.newPage", () => {
            it("should support no option", () => {
                const plugin = screenPlugin();
                const listener = plugin["Browser.newPage:before"];
                const args = listener([]);

                assert.deepEqual(args, [
                    { screen: { width: 1920, height: 1080 } },
                ]);
            });

            it("should support option", () => {
                const plugin = screenPlugin();
                const listener = plugin["Browser.newPage:before"];
                const args = listener([{ slowMo: 200 }]);

                assert.deepEqual(args, [
                    { slowMo: 200, screen: { width: 1920, height: 1080 } },
                ]);
            });

            it("should support 'screen' option", () => {
                const plugin = screenPlugin();
                const listener = plugin["Browser.newPage:before"];
                const args = listener([{ screen: { width: 42, height: 43 } }]);

                assert.deepEqual(args, [{ screen: { width: 42, height: 43 } }]);
            });
        });
    });
});
