/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import mousePlugin from "../../../../src/plugins/hook/mouse.js";

describe("plugins/hook/mouse.js", function () {
    describe("mousePlugin()", function () {
        describe("Mouse:new", function () {
            it("should add plugin", function () {
                const mouse = {};
                const listeners = new Map([
                    [
                        "Mouse",
                        new Map([
                            ["foo", { before: [], after: [() => "bar"] }],
                        ]),
                    ],
                ]);

                const plugin = mousePlugin(listeners);
                const listener = plugin["Mouse:new"];
                const mouseAltered = listener(mouse);

                assert.notEqual(mouseAltered, mouse);
                assert.equal(mouseAltered.foo, "bar");
            });

            it("should do nothing when no listener", function () {
                const mouse = {};
                const listeners = new Map([
                    [
                        "Page",
                        new Map([
                            ["foo", { before: [], after: [() => "bar"] }],
                        ]),
                    ],
                ]);

                const plugin = mousePlugin(listeners);
                const listener = plugin["Mouse:new"];
                const mouseAltered = listener(mouse);

                // Vérifier que la souris retournée est la même instance que
                // celle en paramètre.
                assert.equal(mouseAltered, mouse);
            });
        });
    });
});
