/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";
import debugSnifferPlugin from "../../../../src/plugins/debug/sniffer.js";

describe("plugins/debug/sniffer.js", () => {
    describe("debugSnifferPlugin()", () => {
        describe("BrowserType.launchPersistentContext:before", () => {
            it("should support no option", () => {
                const plugin = debugSnifferPlugin();
                const listener =
                    plugin["BrowserType.launchPersistentContext:before"];
                const args = listener(["./foo/"]);

                assert.deepEqual(args, ["./foo/", { bypassCSP: true }]);
            });

            it("should support option", () => {
                const plugin = debugSnifferPlugin();
                const listener =
                    plugin["BrowserType.launchPersistentContext:before"];
                const args = listener(["./foo/", { forcedColors: "active" }]);

                assert.deepEqual(args, [
                    "./foo/",
                    { bypassCSP: true, forcedColors: "active" },
                ]);
            });
        });

        describe("Browser.newContext:before", () => {
            it("should support no option", () => {
                const plugin = debugSnifferPlugin();
                const listener = plugin["Browser.newContext:before"];
                const args = listener([]);

                assert.deepEqual(args, [{ bypassCSP: true }]);
            });

            it("should support option", () => {
                const plugin = debugSnifferPlugin();
                const listener = plugin["Browser.newContext:before"];
                const args = listener([{ contrast: "more" }]);

                assert.deepEqual(args, [{ bypassCSP: true, contrast: "more" }]);
            });
        });

        describe("Browser.newPage", () => {
            it("should support no option", () => {
                const plugin = debugSnifferPlugin();
                const listener = plugin["Browser.newPage:before"];
                const args = listener([]);

                assert.deepEqual(args, [{ bypassCSP: true }]);
            });

            it("should support option", () => {
                const plugin = debugSnifferPlugin();
                const listener = plugin["Browser.newPage:before"];
                const args = listener([{ acceptDownloads: true }]);

                assert.deepEqual(args, [
                    { bypassCSP: true, acceptDownloads: true },
                ]);
            });
        });

        describe("Page:new", () => {
            it("should add init script", async () => {
                const randomUUID = mock.method(
                    crypto,
                    "randomUUID",
                    () => "123e4567-e89b-12d3-a456-426614174000",
                );
                const routeWebSocket = mock.fn();
                const addInitScript = mock.fn(() => Promise.resolve());
                const page = { addInitScript, routeWebSocket };

                const plugin = debugSnifferPlugin();
                const listener = plugin["Page:new"];
                const pageAltered = await listener(page);

                assert.equal(randomUUID.mock.callCount(), 1);
                assert.equal(routeWebSocket.mock.callCount(), 1);
                assert.equal(
                    routeWebSocket.mock.calls[0].arguments[0],
                    "wss://123e4567-e89b-12d3-a456-426614174000/",
                );
                assert.equal(
                    typeof routeWebSocket.mock.calls[0].arguments[1],
                    "function",
                );
                assert.equal(addInitScript.mock.callCount(), 1);
                assert.equal(
                    typeof addInitScript.mock.calls[0].arguments[0],
                    "function",
                );
                assert.equal(
                    addInitScript.mock.calls[0].arguments[1],
                    "123e4567-e89b-12d3-a456-426614174000",
                );
                // Vérifier que la page retournée est la même instance que celle
                // en paramètre.
                assert.equal(pageAltered, page);
            });
        });
    });
});
