/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import locatorPlugin from "../../../../src/plugins/hook/locator.js";

describe("plugins/hook/locator.js", function () {
    describe("locatorPlugin()", function () {
        describe("Locator:new", function () {
            it("should add plugin", function () {
                const locator = {};
                const listeners = new Map([
                    [
                        "Locator",
                        new Map([
                            ["foo", { before: [], after: [() => "bar"] }],
                        ]),
                    ],
                ]);

                const plugin = locatorPlugin();
                const listener = plugin["Locator:new"];
                const locatorAltered = listener(locator, {
                    metadata: { listeners },
                });

                assert.notEqual(locatorAltered, locator);
                assert.equal(locatorAltered.foo, "bar");
            });

            it("should do nothing when no listener", function () {
                const locator = {};
                const listeners = new Map([["Page", "foo"]]);

                const plugin = locatorPlugin();
                const listener = plugin["Locator:new"];
                const locatorAltered = listener(locator, {
                    metadata: { listeners },
                });

                // Vérifier que le locator retourné est la même instance que
                // celle en paramètre.
                assert.equal(locatorAltered, locator);
            });
        });
    });
});
