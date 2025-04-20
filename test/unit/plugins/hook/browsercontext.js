/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import browserContextPlugin from "../../../../src/plugins/hook/browsercontext.js";

describe("plugins/hook/browsercontext.js", () => {
    describe("browserContextPlugin()", () => {
        describe("BrowserContext:new", () => {
            it("should add plugin", () => {
                const browserContext = {};
                const listeners = new Map([
                    [
                        "BrowserContext",
                        new Map([
                            ["foo", { before: [], after: [() => "bar"] }],
                        ]),
                    ],
                ]);

                const plugin = browserContextPlugin(listeners);
                const listener = plugin["BrowserContext:new"];
                const browserContextAltered = listener(browserContext);

                assert.notEqual(browserContextAltered, browserContext);
                assert.equal(browserContextAltered.foo, "bar");
            });

            it("should do nothing when no listener", () => {
                const browserContext = {};
                const listeners = new Map([
                    [
                        "Browser",
                        new Map([
                            ["foo", { before: [], after: [() => "bar"] }],
                        ]),
                    ],
                ]);

                const plugin = browserContextPlugin(listeners);
                const listener = plugin["BrowserContext:new"];
                const browserContextAltered = listener(browserContext);

                // Vérifier que le contexte retourné est la même instance que
                // celle en paramètre.
                assert.equal(browserContextAltered, browserContext);
            });
        });
    });
});
