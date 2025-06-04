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
                const browserContext = new BrowserContextHooker(new Map());
                const first = browserContext.first();

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
                const browserContext = new BrowserContextHooker(new Map());
                const last = browserContext.last();

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
        });
    });
});
