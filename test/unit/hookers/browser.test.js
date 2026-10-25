/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import BrowserHooker from "../../../src/hookers/browser.js";

describe("hookers/browser.js", () => {
    describe("BrowserHooker", () => {
        describe("PRESETS", () => {
            it("should have presets", () => {
                const pointers = Object.keys(BrowserHooker.PRESETS);
                assert.deepEqual(pointers, [
                    "BrowserType.connect:after",
                    "BrowserType.connectOverCDP:after",
                    "BrowserType.launch:after",
                ]);

                const listeners = Object.values(BrowserHooker.PRESETS);
                for (const listener of listeners) {
                    assert.equal(typeof listener, "function");
                }
            });
        });

        describe("constructor", () => {
            it("should add hooks in first", () => {
                const browserHooker = new BrowserHooker(new Map());
                const first = browserHooker.first();

                const pointers = Object.keys(first);
                assert.deepEqual(pointers, [
                    "BrowserType.connect:after",
                    "BrowserType.connectOverCDP:after",
                    "BrowserType.launch:after",
                    "BrowserContext.browser:after",
                ]);

                const listeners = Object.values(first);
                for (const listener of listeners) {
                    assert.equal(typeof listener, "function");
                }
            });

            it("should add hook in last", () => {
                const browserHooker = new BrowserHooker(new Map());
                const last = browserHooker.last();

                const pointers = Object.keys(last);
                assert.deepEqual(pointers, [
                    "BrowserType.connect:after",
                    "BrowserType.connectOverCDP:after",
                    "BrowserType.launch:after",
                ]);

                const listeners = Object.values(last);
                for (const listener of listeners) {
                    assert.equal(typeof listener, "function");
                }
            });

            it("should add listener in prepare", () => {
                const listeners = new Map([
                    [
                        "Browser",
                        new Map([
                            ["foo", { before: [], after: [() => "bar"] }],
                        ]),
                    ],
                ]);
                const vanilla = { foo: () => "baz" };

                const browserHooker = new BrowserHooker(listeners);
                const hooked = browserHooker.prepare(vanilla);

                assert.notEqual(hooked, vanilla);
                assert.equal(hooked.foo(), "bar");
            });
        });
    });
});
