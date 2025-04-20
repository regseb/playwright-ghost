/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import locatorPlugin from "../../../../src/plugins/hook/locator.js";

describe("plugins/hook/locator.js", () => {
    describe("locatorPlugin()", () => {
        describe("Locator:new", () => {
            it("should add plugin", () => {
                const locator = {};
                const listeners = new Map([
                    [
                        "Locator",
                        new Map([
                            ["foo", { before: [], after: [() => "bar"] }],
                        ]),
                    ],
                ]);

                const plugin = locatorPlugin(listeners);
                const listener = plugin["Locator:new"];
                const locatorAltered = listener(locator);

                assert.notEqual(locatorAltered, locator);
                assert.equal(locatorAltered.foo, "bar");
            });

            it("should do nothing when no listener", () => {
                const locator = {};
                const listeners = new Map([
                    [
                        "Page",
                        new Map([
                            ["foo", { before: [], after: [() => "bar"] }],
                        ]),
                    ],
                ]);

                const plugin = locatorPlugin(listeners);
                const listener = plugin["Locator:new"];
                const locatorAltered = listener(locator);

                // Vérifier que le locator retourné est la même instance que
                // celle en paramètre.
                assert.equal(locatorAltered, locator);
            });
        });
    });
});
