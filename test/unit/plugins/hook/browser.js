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

                const plugin = browserPlugin(listeners);
                const listener = plugin["Browser:new"];
                const browserAltered = listener(browser);

                assert.notEqual(browserAltered, browser);
                assert.equal(browserAltered.foo, "bar");
            });

            it("should do nothing when no listener", function () {
                const browser = {};
                const listeners = new Map([
                    [
                        "BrowserType",
                        new Map([
                            ["foo", { before: [], after: [() => "bar"] }],
                        ]),
                    ],
                ]);

                const plugin = browserPlugin(listeners);
                const listener = plugin["Browser:new"];
                const browserAltered = listener(browser);

                // Vérifier que le browser retourné est la même instance que
                // celle en paramètre.
                assert.equal(browserAltered, browser);
            });
        });
    });
});
