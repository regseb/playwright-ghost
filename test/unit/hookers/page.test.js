/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import Hooker from "../../../src/hookers/hooker.js";
import PageHooker from "../../../src/hookers/page.js";

describe("hookers/page.js", () => {
    describe("PageHooker", () => {
        describe("PRESETS", () => {
            afterEach(() => {
                mock.reset();
            });

            it("should have presets", () => {
                const pointers = Object.keys(PageHooker.PRESETS);
                assert.deepEqual(pointers, [
                    "Browser.newPage:after",
                    "BrowserContext.newPage:after",
                    "BrowserType.launchPersistentContext:after",
                ]);

                const listeners = Object.values(PageHooker.PRESETS);
                for (const listener of listeners) {
                    assert.equal(typeof listener, "function");
                }
            });

            it("should modify when 'BrowserType.launchPersistentContext:after'", () => {
                const modifier = mock.fn(() => "foo");
                const modify = mock.method(Hooker, "modify", () => modifier);

                const listener = () => undefined;
                const browserContext = {};
                const context = {};

                const hook =
                    PageHooker.PRESETS[
                        // eslint-disable-next-line new-cap
                        "BrowserType.launchPersistentContext:after"
                    ](listener);
                const browserContextAltered = hook(browserContext, context);

                assert.equal(browserContextAltered, browserContext);
                const symbols = Object.getOwnPropertySymbols(
                    browserContextAltered,
                );
                assert.equal(browserContextAltered[symbols[0]], "foo");

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
                const page = new PageHooker(new Map());
                const first = page.first();

                const pointers = Object.keys(first);
                assert.deepEqual(pointers, [
                    "Browser.newPage:after",
                    "BrowserContext.newPage:after",
                    "BrowserContext.pages:after",
                    "Locator.page:after",
                    "Frame.page:after",
                    "BrowserType.launchPersistentContext:after",
                ]);

                const listeners = Object.values(first);
                for (const listener of listeners) {
                    assert.equal(typeof listener, "function");
                }
            });

            it("should add hook in last", () => {
                const page = new PageHooker(new Map());
                const last = page.last();

                const pointers = Object.keys(last);
                assert.deepEqual(pointers, [
                    "Browser.newPage:after",
                    "BrowserContext.newPage:after",
                    "BrowserType.launchPersistentContext:after",
                ]);

                const listeners = Object.values(last);
                for (const listener of listeners) {
                    assert.equal(typeof listener, "function");
                }
            });

            it("should hook 'BrowserType.launchPersistentContext:after' in first", () => {
                const pageHooker = new PageHooker(new Map());
                const listener =
                    pageHooker.first()[
                        "BrowserType.launchPersistentContext:after"
                    ];
                const browserContext = { pages: () => [] };
                const browserContextAltered = listener(browserContext);
                assert.equal(browserContextAltered, browserContext);

                const symbols = Object.getOwnPropertySymbols(
                    browserContextAltered,
                );
                assert.equal(symbols.length, 1);
                assert.equal(symbols[0].toString(), "Symbol(HOOKED)");
                const pagesHooked = browserContextAltered[symbols[0]];
                assert.notEqual(pagesHooked, browserContext.pages());
            });

            it("should hook 'BrowserType.launchPersistentContext:after' in last", () => {
                const pageHooker = new PageHooker(new Map());
                const firstListener =
                    pageHooker.first()[
                        "BrowserType.launchPersistentContext:after"
                    ];
                const browserContext = { pages: () => [] };
                const browserContextAltered = firstListener(browserContext);

                const lastListener =
                    pageHooker.last()[
                        "BrowserType.launchPersistentContext:after"
                    ];
                const browserContextRealtered = lastListener(
                    browserContextAltered,
                );
                assert.equal(browserContextRealtered, browserContext);

                const symbols = Object.getOwnPropertySymbols(
                    browserContextAltered,
                );
                assert.equal(symbols.length, 0);
            });
        });
    });
});
