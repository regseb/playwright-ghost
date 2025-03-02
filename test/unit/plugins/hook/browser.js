/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import browserPlugin from "../../../../src/plugins/hook/browser.js";

describe("plugins/hook/browser.js", function () {
    describe("browserPlugin()", function () {
        describe("Browser:new", function () {
            it("should add plugin", function () {
                const browser = {};
                const listeners = new Map([
                    [
                        "Browser",
                        new Map([
                            ["foo", { before: [], after: [() => "bar"] }],
                        ]),
                    ],
                ]);

                const plugin = browserPlugin();
                const listener = plugin["Browser:new"];
                const browserAltered = listener(browser, {
                    metadata: { listeners },
                });

                assert.notEqual(browserAltered, browser);
                assert.equal(browserAltered.foo, "bar");
            });

            it("should do nothing when no listener", function () {
                const browser = {};
                const listeners = new Map([["BrowserType", "foo"]]);

                const plugin = browserPlugin();
                const listener = plugin["Browser:new"];
                const browserAltered = listener(browser, {
                    metadata: { listeners },
                });

                // Vérifier que le browser retourné est la même instance que
                // celle en paramètre.
                assert.equal(browserAltered, browser);
            });
        });
    });
});
