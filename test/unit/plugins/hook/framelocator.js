/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import frameLocatorPlugin from "../../../../src/plugins/hook/framelocator.js";

describe("plugins/hook/framelocator.js", function () {
    describe("frameLocatorPlugin()", function () {
        describe("FrameLocator:new", function () {
            it("should add plugin", function () {
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

            it("should do nothing when no listener", function () {
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
