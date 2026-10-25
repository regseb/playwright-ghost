/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import FrameHooker from "../../../src/hookers/frame.js";

describe("hookers/frame.js", () => {
    describe("FrameHooker", () => {
        describe("PRESETS", () => {
            it("should have presets", () => {
                const pointers = Object.keys(FrameHooker.PRESETS);
                assert.deepEqual(pointers, [
                    "Page.mainFrame:after",
                    "Page.childFrames:after",
                ]);

                const listeners = Object.values(FrameHooker.PRESETS);
                for (const listener of listeners) {
                    assert.equal(typeof listener, "function");
                }
            });
        });

        describe("constructor", () => {
            it("should add hooks in first", () => {
                const frameHooker = new FrameHooker(new Map());
                const first = frameHooker.first();

                const pointers = Object.keys(first);
                assert.deepEqual(pointers, [
                    "Page.mainFrame:after",
                    "Page.childFrames:after",
                ]);

                const listeners = Object.values(first);
                for (const listener of listeners) {
                    assert.equal(typeof listener, "function");
                }
            });

            it("should add hook in last", () => {
                const frameHooker = new FrameHooker(new Map());
                const last = frameHooker.last();

                const pointers = Object.keys(last);
                assert.deepEqual(pointers, [
                    "Page.mainFrame:after",
                    "Page.childFrames:after",
                ]);

                const listeners = Object.values(last);
                for (const listener of listeners) {
                    assert.equal(typeof listener, "function");
                }
            });

            it("should add listener in prepare", () => {
                const listeners = new Map([
                    [
                        "Frame",
                        new Map([
                            ["foo", { before: [], after: [() => "bar"] }],
                        ]),
                    ],
                ]);
                const vanilla = { foo: () => "baz" };

                const frameHooker = new FrameHooker(listeners);
                const hooked = frameHooker.prepare(vanilla);

                assert.notEqual(hooked, vanilla);
                assert.equal(hooked.foo(), "bar");
            });
        });
    });
});
