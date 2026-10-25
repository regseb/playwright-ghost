/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import FrameLocatorHooker from "../../../src/hookers/framelocator.js";

describe("hookers/framelocator.js", () => {
    describe("FrameLocatorHooker", () => {
        describe("PRESETS", () => {
            it("should have presets", () => {
                const pointers = Object.keys(FrameLocatorHooker.PRESETS);
                assert.deepEqual(pointers, [
                    "Page.frameLocator:after",
                    "Locator.contentFrame:after",
                    "Locator.frameLocator:after",
                    "FrameLocator.frameLocator:after",
                ]);

                const listeners = Object.values(FrameLocatorHooker.PRESETS);
                for (const listener of listeners) {
                    assert.equal(typeof listener, "function");
                }
            });
        });

        describe("constructor", () => {
            it("should add hooks in first", () => {
                const frameLocatorHooker = new FrameLocatorHooker(new Map());
                const first = frameLocatorHooker.first();

                const pointers = Object.keys(first);
                assert.deepEqual(pointers, [
                    "Page.frameLocator:after",
                    "Locator.contentFrame:after",
                    "Locator.frameLocator:after",
                    "FrameLocator.frameLocator:after",
                ]);

                const listeners = Object.values(first);
                for (const listener of listeners) {
                    assert.equal(typeof listener, "function");
                }
            });

            it("should add hook in last", () => {
                const frameLocatorHooker = new FrameLocatorHooker(new Map());
                const last = frameLocatorHooker.last();

                const pointers = Object.keys(last);
                assert.deepEqual(pointers, [
                    "Page.frameLocator:after",
                    "Locator.contentFrame:after",
                    "Locator.frameLocator:after",
                    "FrameLocator.frameLocator:after",
                ]);

                const listeners = Object.values(last);
                for (const listener of listeners) {
                    assert.equal(typeof listener, "function");
                }
            });

            it("should add listener in prepare", () => {
                const listeners = new Map([
                    [
                        "FrameLocator",
                        new Map([
                            ["foo", { before: [], after: [() => "bar"] }],
                        ]),
                    ],
                ]);
                const vanilla = { foo: () => "baz" };

                const frameLocatorHooker = new FrameLocatorHooker(listeners);
                const hooked = frameLocatorHooker.prepare(vanilla);

                assert.notEqual(hooked, vanilla);
                assert.equal(hooked.foo(), "bar");
            });
        });
    });
});
