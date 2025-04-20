/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import mousePlugin from "../../../../src/plugins/hook/mouse.js";

describe("plugins/hook/mouse.js", () => {
    describe("mousePlugin()", () => {
        describe("Mouse:new", () => {
            it("should add plugin", () => {
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

            it("should do nothing when no listener", () => {
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
