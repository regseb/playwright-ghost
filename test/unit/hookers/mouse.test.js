/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import Hooker from "../../../src/hookers/hooker.js";
import MouseHooker from "../../../src/hookers/mouse.js";

/**
 * @import { Page } from "playwright"
 */

describe("hookers/mouse.js", () => {
    describe("MouseHooker", () => {
        describe("PRESETS", () => {
            afterEach(() => {
                mock.reset();
            });

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

            it("should modify when 'Browser.newPage:after", () => {
                const modifier = mock.fn(() => "foo");
                const modify = mock.method(Hooker, "modify", () => modifier);

                const listener = () => undefined;
                const page = {};
                const context = {};

                const hook =
                    // eslint-disable-next-line new-cap
                    MouseHooker.PRESETS["Browser.newPage:after"](listener);
                const pageAltered = hook(page, context);

                assert.equal(pageAltered, page);
                const symbols = Object.getOwnPropertySymbols(page);
                assert.equal(pageAltered[symbols[0]], "foo");

                assert.equal(modify.mock.calls.length, 1);
                assert.deepEqual(modify.mock.calls[0].arguments, [listener]);
                assert.equal(modifier.mock.calls.length, 1);
                assert.deepEqual(modifier.mock.calls[0].arguments, [
                    undefined,
                    context,
                ]);
            });

            it("should modify when 'BrowserContext.newPage:after", () => {
                const modifier = mock.fn(() => "foo");
                const modify = mock.method(Hooker, "modify", () => modifier);

                const listener = () => undefined;
                const page = {};
                const context = {};

                const hook =
                    // eslint-disable-next-line new-cap
                    MouseHooker.PRESETS["BrowserContext.newPage:after"](
                        listener,
                    );
                const pageAltered = hook(page, context);

                assert.equal(pageAltered, page);
                const symbols = Object.getOwnPropertySymbols(page);
                assert.equal(pageAltered[symbols[0]], "foo");

                assert.equal(modify.mock.calls.length, 1);
                assert.deepEqual(modify.mock.calls[0].arguments, [listener]);
                assert.equal(modifier.mock.calls.length, 1);
                assert.deepEqual(modifier.mock.calls[0].arguments, [
                    undefined,
                    context,
                ]);
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
                const page = /** @type {Page} */ ({ mouse: {} });
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
                const page = /** @type {Page} */ ({ mouse: {} });
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
                const page = /** @type {Page} */ ({ mouse: {} });
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
                const page = /** @type {Page} */ ({ mouse: {} });
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
