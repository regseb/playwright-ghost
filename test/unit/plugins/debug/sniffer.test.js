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
                const addInitScript = mock.fn(() => Promise.resolve());
                const on = mock.fn();
                const page = { addInitScript, on };

                const plugin = debugSnifferPlugin();
                const listener = plugin["Page:new"];
                const pageAltered = await listener(page);

                assert.equal(addInitScript.mock.callCount(), 1);
                assert.equal(
                    typeof addInitScript.mock.calls[0].arguments[0],
                    "function",
                );
                assert.equal(on.mock.callCount(), 1);
                const args = on.mock.calls[0].arguments;
                assert.equal(args[0], "close");
                assert.equal(typeof args[1], "function");
                // Vérifier que la page retournée est la même instance que celle
                // en paramètre.
                assert.equal(pageAltered, page);

                // Simuler la fermeture de la page pour fermer la WebSocket.
                args[1]();
            });
        });
    });
});
