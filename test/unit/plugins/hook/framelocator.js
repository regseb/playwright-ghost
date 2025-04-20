/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import frameLocatorPlugin from "../../../../src/plugins/hook/framelocator.js";

describe("plugins/hook/framelocator.js", () => {
    describe("frameLocatorPlugin()", () => {
        describe("FrameLocator:new", () => {
            it("should add plugin", () => {
                const frameLocator = {};
                const listeners = new Map([
                    [
                        "FrameLocator",
                        new Map([
                            ["foo", { before: [], after: [() => "bar"] }],
                        ]),
                    ],
                ]);

                const plugin = frameLocatorPlugin(listeners);
                const listener = plugin["FrameLocator:new"];
                const frameLocatorAltered = listener(frameLocator);

                assert.notEqual(frameLocatorAltered, frameLocator);
                assert.equal(frameLocatorAltered.foo, "bar");
            });

            it("should do nothing when no listener", () => {
                const frameLocator = {};
                const listeners = new Map([
                    [
                        "Page",
                        new Map([
                            ["foo", { before: [], after: [() => "bar"] }],
                        ]),
                    ],
                ]);

                const plugin = frameLocatorPlugin(listeners);
                const listener = plugin["FrameLocator:new"];
                const frameLocatorAltered = listener(frameLocator);

                // Vérifier que le frameLocator retourné est la même instance
                // que celle en paramètre.
                assert.equal(frameLocatorAltered, frameLocator);
            });
        });
    });
});
