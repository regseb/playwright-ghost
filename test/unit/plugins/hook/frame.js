/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import framePlugin from "../../../../src/plugins/hook/frame.js";

describe("plugins/hook/frame.js", () => {
    describe("framePlugin()", () => {
        describe("Frame:new", () => {
            it("should add plugin", () => {
                const frame = {};
                const listeners = new Map([
                    [
                        "Frame",
                        new Map([
                            ["foo", { before: [], after: [() => "bar"] }],
                        ]),
                    ],
                ]);

                const plugin = framePlugin(listeners);
                const listener = plugin["Frame:new"];
                const frameAltered = listener(frame);

                assert.notEqual(frameAltered, frame);
                assert.equal(frameAltered.foo, "bar");
            });

            it("should do nothing when no listener", () => {
                const frame = {};
                const listeners = new Map([
                    [
                        "Page",
                        new Map([
                            ["foo", { before: [], after: [() => "bar"] }],
                        ]),
                    ],
                ]);

                const plugin = framePlugin(listeners);
                const listener = plugin["Frame:new"];
                const frameAltered = listener(frame);

                // Vérifier que la frame retournée est la même instance que
                // celle en paramètre.
                assert.equal(frameAltered, frame);
            });
        });
    });
});
