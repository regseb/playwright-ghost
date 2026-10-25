/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import BrowserContextHooker from "../../../src/hookers/browsercontext.js";

describe("hookers/browsercontext.js", () => {
    describe("BrowserContextHooker", () => {
        describe("PRESETS", () => {
            it("should have presets", () => {
                const pointers = Object.keys(BrowserContextHooker.PRESETS);
                assert.deepEqual(pointers, [
                    "BrowserType.launchPersistentContext:after",
                    "Browser.newContext:after",
                ]);

                const listeners = Object.values(BrowserContextHooker.PRESETS);
                for (const listener of listeners) {
                    assert.equal(typeof listener, "function");
                }
            });
        });

        describe("constructor", () => {
            it("should add hooks in first", () => {
                const browserContextHooker = new BrowserContextHooker(
                    new Map(),
                );
                const first = browserContextHooker.first();

                const pointers = Object.keys(first);
                assert.deepEqual(pointers, [
                    "BrowserType.launchPersistentContext:after",
                    "Browser.newContext:after",
                    "Browser.contexts:after",
                    "Page.context:after",
                ]);

                const listeners = Object.values(first);
                for (const listener of listeners) {
                    assert.equal(typeof listener, "function");
                }
            });

            it("should add hook in last", () => {
                const browserContextHooker = new BrowserContextHooker(
                    new Map(),
                );
                const last = browserContextHooker.last();

                const pointers = Object.keys(last);
                assert.deepEqual(pointers, [
                    "BrowserType.launchPersistentContext:after",
                    "Browser.newContext:after",
                ]);

                const listeners = Object.values(last);
                for (const listener of listeners) {
                    assert.equal(typeof listener, "function");
                }
            });

            it("should add listener in prepare", () => {
                const listeners = new Map([
                    [
                        "BrowserContext",
                        new Map([
                            ["foo", { before: [], after: [() => "bar"] }],
                        ]),
                    ],
                ]);
                const vanilla = { foo: () => "baz" };

                const browserContextHooker = new BrowserContextHooker(
                    listeners,
                );
                const hooked = browserContextHooker.prepare(vanilla);

                assert.notEqual(hooked, vanilla);
                assert.equal(hooked.foo(), "bar");
            });
        });
    });
});
