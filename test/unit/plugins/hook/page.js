/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import pagePlugin from "../../../../src/plugins/hook/page.js";

describe("plugins/hook/page.js", function () {
    describe("pagePlugin()", function () {
        describe("Page:new", function () {
            it("should add plugin", function () {
                const page = {};
                const listeners = new Map([
                    [
                        "Page",
                        new Map([
                            ["foo", { before: [], after: [() => "bar"] }],
                        ]),
                    ],
                ]);

                const plugin = pagePlugin(listeners);
                const listener = plugin["Page:new"];
                const pageAltered = listener(page);

                assert.notEqual(pageAltered, page);
                assert.equal(pageAltered.foo, "bar");
            });

            it("should do nothing when no listener", function () {
                const page = {};
                const listeners = new Map([
                    [
                        "BrowserContext",
                        new Map([
                            ["foo", { before: [], after: [() => "bar"] }],
                        ]),
                    ],
                ]);

                const plugin = pagePlugin(listeners);
                const listener = plugin["Page:new"];
                const pageAltered = listener(page);

                // Vérifier que la page retournée est la même instance que
                // celle en paramètre.
                assert.equal(pageAltered, page);
            });
        });
    });
});
