/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import MouseHooker from "../../../src/hookers/mouse.js";

describe("hookers/mouse.js", () => {
    describe("MouseHooker", () => {
        describe("PRESETS", () => {
            it("should have presets", () => {
                const pointers = Object.keys(MouseHooker.PRESETS);
                assert.deepEqual(pointers, [
                    "Browser.newPage:after",
                    "BrowserContext.newPage:after",
                ]);

                const listeners = Object.values(MouseHooker.PRESETS);
                for (const listener of listeners) {
                    assert.equal(typeof listener, "function");
                }
            });
        });

        describe("constructor", () => {
            it("should add hooks in first", () => {
                const mouse = new MouseHooker(new Map());
                const first = mouse.first();

                const pointers = Object.keys(first);
                assert.deepEqual(pointers, [
                    "Page.mouse:after",
                    "Browser.newPage:after",
                    "BrowserContext.newPage:after",
                ]);

                const listeners = Object.values(first);
                for (const listener of listeners) {
                    assert.equal(typeof listener, "function");
                }
            });

            it("should add hook in last", () => {
                const mouse = new MouseHooker(new Map());
                const last = mouse.last();

                const pointers = Object.keys(last);
                assert.deepEqual(pointers, [
                    "Browser.newPage:after",
                    "BrowserContext.newPage:after",
                ]);

                const listeners = Object.values(last);
                for (const listener of listeners) {
                    assert.equal(typeof listener, "function");
                }
            });

            it("should hook 'Browser.newPage:after' in first", () => {
                const mouse = new MouseHooker(new Map());
                const listener = mouse.first()["Browser.newPage:after"];
                const page = { mouse: {} };
                const pageAltered = listener(page);
                assert.equal(pageAltered, page);

                const symbols = Object.getOwnPropertySymbols(pageAltered);
                assert.equal(symbols.length, 1);
                assert.equal(symbols[0].toString(), "Symbol(HOOKED)");
                const mouseHooked = pageAltered[symbols[0]];
                assert.notEqual(mouseHooked, page.mouse);
            });

            it("should hook 'BrowserContext.newPage:after' in first", () => {
                const mouse = new MouseHooker(new Map());
                const listener = mouse.first()["BrowserContext.newPage:after"];
                const page = { mouse: {} };
                const pageAltered = listener(page);
                assert.equal(pageAltered, page);

                const symbols = Object.getOwnPropertySymbols(pageAltered);
                assert.equal(symbols.length, 1);
                assert.equal(symbols[0].toString(), "Symbol(HOOKED)");
                const mouseHooked = pageAltered[symbols[0]];
                assert.notEqual(mouseHooked, page.mouse);
            });

            it("should hook 'Browser.newPage:after' in last", () => {
                const mouse = new MouseHooker(new Map());
                const firstListener = mouse.first()["Browser.newPage:after"];
                const page = { mouse: {} };
                const pageAltered = firstListener(page);

                const lastListener = mouse.last()["Browser.newPage:after"];
                const pageRealtered = lastListener(page);
                assert.equal(pageRealtered, page);

                const symbols = Object.getOwnPropertySymbols(pageAltered);
                assert.equal(symbols.length, 0);
            });

            it("should hook 'BrowserContext.newPage:after' in last", () => {
                const mouse = new MouseHooker(new Map());
                const firstListener =
                    mouse.first()["BrowserContext.newPage:after"];
                const page = { mouse: {} };
                const pageAltered = firstListener(page);

                const lastListener =
                    mouse.last()["BrowserContext.newPage:after"];
                const pageRealtered = lastListener(pageAltered);
                assert.equal(pageRealtered, page);

                const symbols = Object.getOwnPropertySymbols(pageAltered);
                assert.equal(symbols.length, 0);
            });
        });
    });
});
